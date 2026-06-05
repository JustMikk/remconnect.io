'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '../OnboardingContext'
import { EMAIL_RE } from '../constants'
import { TextField, PasswordField } from '../fields'
import { ArrowRight, CheckIcon } from '../icons'

export default function Login() {
  const { fields, validateLogin, goScreen, hasError } = useOnboarding()
  const router = useRouter()
  const [forgotSent, setForgotSent] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateLogin()) router.push('/home')
  }

  const onForgot = () => {
    if (EMAIL_RE.test(fields.lgEmail.trim())) setForgotSent(true)
  }

  return (
    <div className="ob-cardbox ob-cardbox-auth">
      <span className="ob-kicker">
        <span className="ln" />
        Returning agents
      </span>
      <h1 className="ob-title">
        Welcome <em>back</em>.
      </h1>
      <p className="ob-lede">Sign in to finish an application, check your status, or jump into your agent portal.</p>

      <form className="ob-form" onSubmit={onSubmit} noValidate>
        <TextField
          fieldKey="lgEmail"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          validate={(v) => EMAIL_RE.test(v.trim())}
          error="Enter a valid email address."
        />
        <div className={`ob-field${hasError('lgPass') ? ' has-error' : ''}`} style={{ marginBottom: 0 }}>
          <PasswordField
            fieldKey="lgPass"
            label="Password"
            placeholder="Your password"
            autoComplete="current-password"
          />
          <div style={{ textAlign: 'right', marginTop: 9 }}>
            <button type="button" className="ob-textlink" onClick={onForgot} style={{ color: 'var(--rc-muted)' }}>
              Forgot password?
            </button>
          </div>
        </div>

        <button className="ob-btn ob-btn-primary full" type="submit" style={{ marginTop: 8 }}>
          Sign in
          <span className="pip"><ArrowRight /></span>
        </button>
      </form>

      {forgotSent && (
        <div className="ob-note good" style={{ display: 'flex' }}>
          <CheckIcon size={15} strokeWidth={2.2} />
          <span>If that email is registered, a reset link is on its way. It expires in 1 hour.</span>
        </div>
      )}

      <div className="ob-altline">
        New to RemConnect?{' '}
        <button type="button" onClick={() => goScreen('create')}>
          Create an account
        </button>
      </div>
    </div>
  )
}
