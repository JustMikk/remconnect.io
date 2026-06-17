import type { ApiUser, AuthPayload, TokenPair } from '@/types/api'
import { apiFetch } from './client'

/** Thin typed wrappers over the backend auth endpoints. */

export async function login(email: string, password: string): Promise<AuthPayload> {
  return apiFetch<AuthPayload>('/auth/login', { method: 'POST', body: { email, password } })
}

export async function refreshTokens(refreshToken: string): Promise<TokenPair> {
  return apiFetch<TokenPair>('/auth/refresh', { method: 'POST', body: { refreshToken } })
}

/** Best-effort server-side logout; cookie clearing is what actually ends the session. */
export async function logout(token: string): Promise<void> {
  try {
    await apiFetch<unknown>('/auth/logout', { method: 'POST', token, timeoutMs: 5_000 })
  } catch {
    // Ignore — an unreachable backend must not block signing out.
  }
}

export async function me(token: string): Promise<ApiUser> {
  return apiFetch<ApiUser>('/auth/me', { token })
}

export async function sendOtp(email: string): Promise<void> {
  await apiFetch<unknown>('/auth/otp/send', { method: 'POST', body: { email } })
}

export async function verifyOtp(email: string, code: string): Promise<void> {
  await apiFetch<unknown>('/auth/otp/verify', { method: 'POST', body: { email, code } })
}
