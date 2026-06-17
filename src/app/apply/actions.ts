'use server'

import { sendOtp, verifyOtp } from '@/lib/api/auth'
import { ApiError } from '@/lib/api/client'
import { setSessionCookies } from '@/lib/api/cookies'
import type { TokenPair } from '@/types/api'

export interface ActionResult {
  ok: boolean
  error?: string
}

export async function requestOtpAction(email: string): Promise<ActionResult> {
  try {
    await sendOtp(email)
    return { ok: true }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 429) {
        return { ok: false, error: 'Too many codes requested — wait a moment and try again.' }
      }
      return { ok: false, error: error.message }
    }
    return { ok: false, error: 'Could not send the code. Please try again.' }
  }
}

export async function verifyOtpAction(email: string, code: string): Promise<ActionResult> {
  try {
    await verifyOtp(email, code)
    return { ok: true }
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 400) {
        return { ok: false, error: 'That code is invalid or has expired — request a new one.' }
      }
      return { ok: false, error: error.message }
    }
    return { ok: false, error: 'Could not verify the code. Please try again.' }
  }
}

/**
 * Persists the token pair returned by the (browser-direct) registration call
 * as httpOnly session cookies. Server actions are the only client-callable
 * place allowed to set cookies.
 */
export async function establishSessionAction(tokens: TokenPair): Promise<ActionResult> {
  if (!tokens?.accessToken || !tokens.refreshToken) {
    return { ok: false, error: 'Missing tokens.' }
  }
  await setSessionCookies(tokens)
  return { ok: true }
}
