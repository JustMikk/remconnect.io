'use client'

import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { ArrowRight, ClockIcon, MailIcon } from '../icons'

export default function VerifyEmail() {
  const { signupEmail, goScreen } = useOnboarding()
  const [count, setCount] = useState(0)
  const [sent, setSent] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const resend = () => {
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
          We&apos;ve sent a verification link to confirm it&apos;s really you. Click it to activate your account and
          start your profile.
        </p>
        <div className="email-tag">
          <MailIcon size={13} strokeWidth={2} />
          <span>{signupEmail || 'you@example.com'}</span>
        </div>
        <div className="ob-callout" style={{ marginTop: 22, textAlign: 'left' }}>
          <ClockIcon />
          <p>The link expires in 48 hours. Can&apos;t find the email? Check your spam folder, or resend below.</p>
        </div>
        <div className="ob-resend">
          Didn&apos;t get it?{' '}
          <button type="button" onClick={resend} disabled={count > 0}>
            {count > 0 ? `Resend in ${count}s` : 'Resend email'}
          </button>{' '}
          {sent && count > 0 ? <span>· Sent ✓</span> : null}
        </div>

        <button className="ob-btn ob-btn-primary full" style={{ marginTop: 28 }} onClick={() => goScreen('wizard')}>
          I&apos;ve verified — continue
          <span className="pip"><ArrowRight /></span>
        </button>
        <div className="ob-altline" style={{ border: 'none', marginTop: 14, paddingTop: 0 }}>
          <button type="button" onClick={() => goScreen('create')}>
            Use a different email
          </button>
        </div>
      </div>
    </div>
  )
}
