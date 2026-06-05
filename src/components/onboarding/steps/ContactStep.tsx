'use client'

import { useOnboarding } from '../OnboardingContext'
import { EMAIL_RE } from '../constants'
import { TextField, FieldLabel, ErrorRow } from '../fields'
import { EthFlag } from '../icons'

export default function ContactStep() {
  const { fields, setField, hasError } = useOnboarding()
  const phoneBad = hasError('cPhone')

  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Contact
        </span>
        <h2>
          How do we <em>reach you</em>?
        </h2>
        <p>
          We&apos;ll use these for everything from your verification email to placement offers. Keep them current.
        </p>
      </div>
      <div className="ob-step-inner">
        <TextField
          fieldKey="cEmail"
          label="Personal email"
          type="email"
          placeholder="you@example.com"
          required
          validate={(v) => EMAIL_RE.test(v.trim())}
          hint="This is your login credential."
          error="Enter a valid email address."
        />

        <div className={`ob-field${phoneBad ? ' has-error' : ''}`}>
          <FieldLabel htmlFor="ob-cPhone" required>
            Mobile number
          </FieldLabel>
          <div className="ob-prefixed">
            <span className="pfx">
              <EthFlag />
              +251
            </span>
            <input
              id="ob-cPhone"
              type="tel"
              inputMode="numeric"
              placeholder="9XX XXX XXX"
              value={fields.cPhone}
              onChange={(e) => setField('cPhone', e.target.value)}
            />
          </div>
          {phoneBad && <ErrorRow>Enter a 9-digit Ethiopian mobile number.</ErrorRow>}
        </div>
      </div>
    </div>
  )
}
