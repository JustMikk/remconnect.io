'use client'

import { useOnboarding } from '../OnboardingContext'
import { EMAIL_RE, SIGNUP_ROLE_GROUPS } from '../constants'
import { TextField, PasswordField, SelectField } from '../fields'
import { ArrowRight, CheckIcon } from '../icons'

const STRENGTH_LABELS = ['—', 'Weak', 'Fair', 'Good', 'Strong']

export default function CreateAccount() {
  const { fields, validateCreate, goScreen } = useOnboarding()

  const pw = fields.crPass
  const hasLen = pw.length >= 8
  const hasNum = /\d/.test(pw)
  const hasUp = /[A-Z]/.test(pw)
  const hasSym = /[^A-Za-z0-9]/.test(pw)
  const score = pw.length === 0 ? 0 : (hasLen ? 1 : 0) + (hasNum ? 1 : 0) + (hasUp ? 1 : 0) + (hasSym ? 1 : 0)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateCreate()) goScreen('verify')
  }

  return (
    <div className="ob-cardbox ob-cardbox-auth">
      <span className="ob-kicker">
        <span className="ln" />
        Step 1 of 2 · Create account
      </span>
      <h1 className="ob-title">
        Create your <em>account</em>.
      </h1>
      <p className="ob-lede">
        This becomes your login and primary contact through the whole pipeline. It only takes a moment.
      </p>

      <form className="ob-form" onSubmit={onSubmit} noValidate>
        <TextField
          fieldKey="crEmail"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          validate={(v) => EMAIL_RE.test(v.trim())}
          error="Enter a valid email address."
        />

        <PasswordField
          fieldKey="crPass"
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <div className={`ob-strength${score ? ` s${score}` : ''}`} style={{ marginTop: -8, marginBottom: 'var(--fgap)' }}>
          <div className="ob-strength-bars">
            <i /><i /><i /><i />
          </div>
          <span className="lbl">{STRENGTH_LABELS[score]}</span>
        </div>
        <ul className="ob-reqlist" style={{ marginTop: -6, marginBottom: 'var(--fgap)' }}>
          <li className={hasLen ? 'met' : ''}>
            <span className="rc"><CheckIcon size={9} strokeWidth={3.2} /></span>8+ characters
          </li>
          <li className={hasNum ? 'met' : ''}>
            <span className="rc"><CheckIcon size={9} strokeWidth={3.2} /></span>At least one number
          </li>
        </ul>

        <PasswordField
          fieldKey="crPass2"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error="Passwords don't match."
        />

        <SelectField fieldKey="crRole" label="Role you're applying for" required placeholder="Select a role…" hint="You can refine or add more roles later in your profile.">
          {SIGNUP_ROLE_GROUPS.map((grp) => (
            <optgroup key={grp.g} label={grp.g}>
              {grp.r.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </optgroup>
          ))}
        </SelectField>

        <button className="ob-btn ob-btn-primary full" type="submit" style={{ marginTop: 8 }}>
          Create account
          <span className="pip"><ArrowRight /></span>
        </button>

        <p className="ob-fine">
          By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>. We never
          sell your data or charge you a fee.
        </p>
      </form>

      <div className="ob-altline">
        Already have an account?{' '}
        <button type="button" onClick={() => goScreen('login')}>
          Sign in
        </button>
      </div>
    </div>
  )
}
