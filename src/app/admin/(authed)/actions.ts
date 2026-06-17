'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { logout } from '@/lib/api/auth'
import { ACCESS_COOKIE } from '@/lib/api/constants'
import { clearSessionCookies } from '@/lib/api/cookies'

export async function logoutAction(): Promise<void> {
  const store = await cookies()
  const token = store.get(ACCESS_COOKIE)?.value
  if (token) await logout(token)
  await clearSessionCookies()
  redirect('/admin/login')
}
