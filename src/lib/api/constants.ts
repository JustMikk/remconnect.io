/**
 * Cookie names and options shared between server modules and `src/proxy.ts`.
 * Keep this file free of `next/headers` (and any server-only imports) so the
 * proxy can use it.
 */

export const ACCESS_COOKIE = 'rc_at'
export const REFRESH_COOKIE = 'rc_rt'

/** Refresh JWTs are issued with a 30-day TTL (verified against the live API). */
export const REFRESH_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export interface SessionCookieOptions {
  httpOnly: true
  secure: boolean
  sameSite: 'lax'
  path: '/'
  maxAge: number
}

export function sessionCookieOptions(maxAge: number): SessionCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}
