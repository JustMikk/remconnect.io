'use server'

import { redirect } from 'next/navigation'
import { login } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { setSessionCookies } from '@/lib/api/cookies'
import { isStaffRole } from '@/lib/api/session'
import type { AuthPayload } from '@/types/api'

export interface LoginState {
  error: string | null
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) {
    return { error: 'Enter your email and password.' }
  }

  let payload: AuthPayload
  try {
    payload = await login(email, password)
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message }
    }
    return { error: 'Something went wrong. Please try again.' }
  }

  if (!payload.user.role || !isStaffRole(payload.user.role)) {
    return { error: 'This account does not have access to the admin console.' }
  }

  await setSessionCookies(payload)
  redirect('/admin/agents')
}
