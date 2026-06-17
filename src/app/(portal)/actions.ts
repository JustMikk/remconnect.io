'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/api/session'
import { logout } from '@/lib/api/auth'
import { clearSessionCookies } from '@/lib/api/cookies'

export async function portalLogoutAction(): Promise<void> {
  const session = await getSession()
  if (session) await logout(session.accessToken)
  await clearSessionCookies()
  redirect('/login')
}
