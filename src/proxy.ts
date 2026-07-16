import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from '@/lib/api/constants'
import { decodeAccessToken, isExpired } from '@/lib/api/jwt'
import type { ApiEnvelope, TokenPair } from '@/types/api'

/**
 * Request interception (Next.js 16's rename of `middleware`):
 *
 * 1. /admin session guard — redirects to /admin/login; silently refreshes
 *    expired tokens before the render when a refresh cookie exists.
 *
 * 2. Portal guard — all non-public, non-admin routes redirect to /login with
 *    the same silent refresh behaviour.
 */

/** Paths that never require authentication. */
const PUBLIC_PATHS = new Set(['/', '/apply', '/login', '/coming-soon'])
const PUBLIC_PREFIXES = ['/apply/']

/** Refresh must fail fast — cold-starting backend degrades to a login redirect. */
const REFRESH_TIMEOUT_MS = 8_000

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
}

function redirectTo(request: NextRequest, pathname: string, error?: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = error ? `?error=${error}` : ''
  const response = NextResponse.redirect(url)
  response.cookies.delete(ACCESS_COOKIE)
  response.cookies.delete(REFRESH_COOKIE)
  return response
}

async function refreshSession(
  request: NextRequest,
  refreshToken: string,
  onFail: (error?: string) => NextResponse,
): Promise<NextResponse> {
  const base = process.env.API_BASE_URL?.replace(/\/$/, '')
  if (!base) return onFail()

  let tokens: TokenPair
  try {
    const res = await fetch(`${base}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    })
    const envelope = (await res.json()) as ApiEnvelope<TokenPair>
    if (!res.ok || !envelope.success || !envelope.data) return onFail('expired')
    tokens = envelope.data
  } catch {
    return onFail('expired')
  }

  const payload = decodeAccessToken(tokens.accessToken)
  const accessMaxAge = payload
    ? Math.max(60, payload.exp - Math.floor(Date.now() / 1000) - 30)
    : 60 * 60

  request.cookies.set(ACCESS_COOKIE, tokens.accessToken)
  const response = NextResponse.next({ request })
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, sessionCookieOptions(accessMaxAge))
  response.cookies.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    sessionCookieOptions(REFRESH_MAX_AGE_SECONDS),
  )
  return response
}

function handleAuth(request: NextRequest, loginPath: string): Promise<NextResponse> | NextResponse {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value
  if (accessToken) {
    const payload = decodeAccessToken(accessToken)
    if (payload && !isExpired(payload)) return NextResponse.next()
  }

  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
  if (!refreshToken) return redirectTo(request, loginPath)

  return refreshSession(request, refreshToken, (err) => redirectTo(request, loginPath, err))
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    return handleAuth(request, '/admin/login')
  }

  if (!isPublicPath(pathname)) {
    return handleAuth(request, '/login')
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
