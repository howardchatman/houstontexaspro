import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// The root domain for your app — set NEXT_PUBLIC_ROOT_DOMAIN in your env
// e.g. "houstontexaspro.com"
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'houstontexaspro.com'

/**
 * Returns the contractor slug if the request is coming from a subdomain,
 * or null if it's the main domain / Vercel preview / localhost.
 */
function getContractorSlug(request: NextRequest): string | null {
  const host = (request.headers.get('host') || '').split(':')[0] // strip port

  // Vercel preview deployments — not subdomains
  if (host.endsWith('.vercel.app')) return null

  // Main domain and www
  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) return null

  // Subdomain of the root domain: e.g. johnsplumbing.houstontexaspro.com
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = host.slice(0, host.length - ROOT_DOMAIN.length - 1)
    if (subdomain && subdomain !== 'www') return subdomain
  }

  // Local development: johnsplumbing.localhost
  if (host.endsWith('.localhost')) {
    const subdomain = host.slice(0, host.length - '.localhost'.length)
    if (subdomain) return subdomain
  }

  return null
}

export async function middleware(request: NextRequest) {
  const slug = getContractorSlug(request)

  if (slug) {
    // Rewrite internally to /contractors/[slug] — URL stays clean for the visitor
    const url = request.nextUrl.clone()
    url.pathname = `/contractors/${slug}`
    return NextResponse.rewrite(url)
  }

  // Normal request — run Supabase session refresh + auth guards
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
