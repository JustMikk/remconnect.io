import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { STAFF_ROLES, type UserRole } from '@/types/api'
import { ACCESS_COOKIE } from './constants'
import { decodeAccessToken, isExpired } from './jwt'

export interface Session {
  userId: string
  email?: string
  role: UserRole
  accessToken: string
}

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role)
}

/**
 * Reads the current session from the access-token cookie. Returns null when
 * absent or expired. Expired-but-refreshable sessions are renewed by
 * `src/proxy.ts` before the render ever runs, so no refresh happens here
 * (Server Components cannot set cookies).
 */
export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  const token = store.get(ACCESS_COOKIE)?.value
  if (!token) return null

  const payload = decodeAccessToken(token)
  if (!payload || isExpired(payload)) return null

  return { userId: payload.sub, email: payload.email, role: payload.role, accessToken: token }
}

/** Gate for /admin pages: redirects to the admin login when not a staff user. */
export async function requireStaff(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  if (!isStaffRole(session.role)) redirect('/admin/login?error=forbidden')
  return session
}

/** Gate for portal pages: redirects to /login when not signed in (any role). */
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect('/login')
  return session
}
