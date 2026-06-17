'use client'

import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { requestOtpAction, verifyOtpAction } from '@/app/apply/actions'
import { ArrowRight, ClockIcon, MailIcon } from '../icons'

export default function VerifyEmail() {
  const { signupEmail, goScreen } = useOnboarding()
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState(0)
  const [sent, setSent] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    [],
  )

  const startCooldown = () => {
    setSent(true)
    setCount(30)
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      setCount((n) => {
        if (n <= 1) {
          if (timer.current) clearInterval(timer.current)
          setSent(false)
          return 0
        }
        return n - 1
      })
    }, 1000)
  }

  const resend = async () => {
    if (count > 0) return
    setError(null)
    const result = await requestOtpAction(signupEmail)
    if (result.ok) startCooldown()
    else setError(result.error ?? 'Could not resend the code.')
  }

  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (verifying) return
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    setVerifying(true)
    setError(null)
    const result = await verifyOtpAction(signupEmail, code)
    setVerifying(false)
    if (result.ok) goScreen('wizard')
    else setError(result.error ?? 'Verification failed.')
  }

  return (
    <div className="ob-cardbox ob-cardbox-auth">
      <div className="ob-verify">
        <div className="ob-verify-ic">
          <MailIcon size={34} />
        </div>
        <span className="ob-kicker">
          <span className="ln" />
          Step 2 of 2 · Verify email
        </span>
        <h1 className="ob-title">
          Check your <em>inbox</em>.
        </h1>
        <p className="ob-lede">
          We&apos;ve emailed you a 6-digit verification code to confirm it&apos;s really you. Enter
          it below to continue your application.
        </p>
        <div className="email-tag">
          <MailIcon size={13} strokeWidth={2} />
          <span>{signupEmail || 'you@example.com'}</span>
        </div>

        <form onSubmit={verify} noValidate>
          <div className="ob-field" style={{ marginTop: 22 }}>
            <input
              className="ob-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="••••••"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                setError(null)
              }}
              style={{ textAlign: 'center', fontSize: 22, letterSpacing: '0.4em', fontWeight: 600 }}
              aria-label="6-digit verification code"
            />
          </div>

          {error && (
            <div
              className="ob-callout"
              style={{ borderColor: 'var(--rc-bad)', color: 'var(--rc-bad)', textAlign: 'left' }}
            >
              <p>{error}</p>
            </div>
          )}

          <button
            className="ob-btn ob-btn-primary full"
            type="submit"
            disabled={verifying || code.length !== 6}
            style={{ marginTop: 14 }}
          >
            {verifying ? 'Verifying…' : 'Verify & continue'}
            <span className="pip">
              <ArrowRight />
            </span>
          </button>
        </form>

        <div className="ob-callout" style={{ marginTop: 22, textAlign: 'left' }}>
          <ClockIcon />
          <p>
            The code expires shortly. Can&apos;t find the email? Check your spam folder, or resend
            below.
          </p>
        </div>
        <div className="ob-resend">
          Didn&apos;t get it?{' '}
          <button type="button" onClick={resend} disabled={count > 0}>
            {count > 0 ? `Resend in ${count}s` : 'Resend code'}
          </button>{' '}
          {sent && count > 0 ? <span>· Sent ✓</span> : null}
        </div>

        <div className="ob-altline" style={{ border: 'none', marginTop: 14, paddingTop: 0 }}>
          <button type="button" onClick={() => goScreen('create')}>
            Use a different email
          </button>
        </div>
      </div>
    </div>
  )
}
