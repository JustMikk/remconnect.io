'use server'

import { redirect } from 'next/navigation'
import { login } from '@/lib/api/auth'
import { setSessionCookies } from '@/lib/api/cookies'
import { isStaffRole } from '@/lib/api/session'
import { decodeAccessToken } from '@/lib/api/jwt'
import { ApiError, COLD_START_MESSAGE } from '@/lib/api/client'

export interface LoginState {
  error: string | null
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  let dest: string
  try {
    const auth = await login(email, password)
    await setSessionCookies({ accessToken: auth.accessToken, refreshToken: auth.refreshToken })
    const decoded = decodeAccessToken(auth.accessToken)
    const role = decoded?.role ?? auth.user.role
    dest = role && isStaffRole(role) ? '/admin/agents' : '/home'
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.isUnreachable) return { error: COLD_START_MESSAGE }
      if (err.status === 401) return { error: 'Invalid email or password.' }
      return { error: err.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(dest)
}
