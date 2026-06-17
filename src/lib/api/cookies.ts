import { cookies } from 'next/headers'
import type { TokenPair } from '@/types/api'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from './constants'
import { decodeAccessToken } from './jwt'

/**
 * Session cookie helpers. `cookies().set()` only works inside Server Actions
 * and Route Handlers (not during Server Component render) — call these from
 * there. `src/proxy.ts` sets the same cookies itself via response cookies.
 */

const FALLBACK_ACCESS_MAX_AGE = 60 * 60 // 1h, if the JWT exp can't be read

export async function setSessionCookies(tokens: TokenPair): Promise<void> {
  const store = await cookies()
  const payload = decodeAccessToken(tokens.accessToken)
  const accessMaxAge = payload
    ? Math.max(60, payload.exp - Math.floor(Date.now() / 1000) - 30)
    : FALLBACK_ACCESS_MAX_AGE

  store.set(ACCESS_COOKIE, tokens.accessToken, sessionCookieOptions(accessMaxAge))
  store.set(REFRESH_COOKIE, tokens.refreshToken, sessionCookieOptions(REFRESH_MAX_AGE_SECONDS))
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies()
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
}
