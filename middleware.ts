import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'houstontexaspro.com'

/** API paths that must never be blocked (e.g. Stripe webhooks, CAPTCHA callbacks) */
const API_ALLOW_LIST = [
  '/api/stripe/webhook',
]

/** UA substrings that indicate automated/bot traffic */
const BOT_UA_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /scrapy/i,
  /python-requests/i, /curl\//i, /wget\//i,
  /go-http-client/i, /java\//i, /ruby/i,
  /perl\//i, /php\//i, /libwww/i,
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the contractor slug if the request comes from a subdomain,
 * or null for the main domain / Vercel preview / localhost root.
 */
function getContractorSlug(request: NextRequest): string | null {
  const host = (request.headers.get('host') || '').split(':')[0]

  if (host.endsWith('.vercel.app')) return null
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) return null

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.slice(0, host.length - ROOT_DOMAIN.length - 1)
    if (subdomain && subdomain !== 'www') return subdomain
  }

  // Local dev: johnsplumbing.localhost
  if (host.endsWith('.localhost')) {
    const subdomain = host.slice(0, host.length - '.localhost'.length)
    if (subdomain) return subdomain
  }

  return null
}

/**
 * Returns true if the request looks like bot traffic targeting an API route.
 * Webhook / allow-listed paths are always passed through.
 */
function isSuspiciousApiRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/api/')) return false
  if (API_ALLOW_LIST.some((p) => pathname.startsWith(p))) return false

  const ua = request.headers.get('user-agent') || ''
  if (!ua.trim()) return true                          // empty UA → block
  if (BOT_UA_PATTERNS.some((re) => re.test(ua))) return true

  return false
}

// ─── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  // 1. Contractor subdomain → internal rewrite
  const slug = getContractorSlug(request)
  if (slug) {
    const url = request.nextUrl.clone()
    url.pathname = `/contractors/${slug}`
    return NextResponse.rewrite(url)
  }

  // 2. Block obvious bot traffic on API routes
  if (isSuspiciousApiRequest(request)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 3. Supabase session refresh + auth guards
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
