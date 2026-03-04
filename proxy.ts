import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'houstontexaspro.com'

const API_ALLOW_LIST = ['/api/stripe/webhook']

const BOT_UA_PATTERNS = [
  /bot/i, /crawler/i, /spider/i, /scrapy/i,
  /python-requests/i, /curl\//i, /wget\//i,
  /go-http-client/i, /java\//i, /ruby/i,
  /perl\//i, /php\//i, /libwww/i,
]

function getContractorSlug(request: NextRequest): string | null {
  const host = (request.headers.get('host') || '').split(':')[0]

  if (host.endsWith('.vercel.app')) return null
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) return null

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.slice(0, host.length - ROOT_DOMAIN.length - 1)
    if (subdomain && subdomain !== 'www') return subdomain
  }

  if (host.endsWith('.localhost')) {
    const subdomain = host.slice(0, host.length - '.localhost'.length)
    if (subdomain) return subdomain
  }

  return null
}

function isSuspiciousApiRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl
  if (!pathname.startsWith('/api/')) return false
  if (API_ALLOW_LIST.some((p) => pathname.startsWith(p))) return false

  const ua = request.headers.get('user-agent') || ''
  if (!ua.trim()) return true
  if (BOT_UA_PATTERNS.some((re) => re.test(ua))) return true

  return false
}

export async function proxy(request: NextRequest) {
  const slug = getContractorSlug(request)
  if (slug) {
    const url = request.nextUrl.clone()
    url.pathname = `/contractors/${slug}`
    return NextResponse.rewrite(url)
  }

  if (isSuspiciousApiRequest(request)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
