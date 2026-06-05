'use client'

import type { ReactNode } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { EMP_TYPES, HEAR_OPTIONS, URL_RE } from '../constants'
import { TextField, SelectField, FieldLabel } from '../fields'
import { BriefcaseIcon, CheckIcon, ClockIcon, ListIcon, PlusCircle } from '../icons'

const EMP_ICONS: Record<string, ReactNode> = {
  'Full-time': <BriefcaseIcon size={20} />,
  'Part-time': <ClockIcon size={20} />,
  'Project-based': <ListIcon size={20} />,
  'Open to any': <PlusCircle size={20} />,
}

export default function AvailabilityStep() {
  const { emp, setEmp, fields, setField } = useOnboarding()

  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Availability
        </span>
        <h2>
          Last thing — your <em>preferences</em>.
        </h2>
        <p>This helps us match you to the right openings. Then you&apos;re done.</p>
      </div>
      <div className="ob-step-inner">
        <div className="ob-field">
          <label className="ob-label">
            Employment type preference <span className="ob-req">Required</span>
          </label>
          <div className="ob-tiles" id="ob-emp">
            {EMP_TYPES.map((t) => (
              <button
                type="button"
                key={t.val}
                className={`ob-tile${emp === t.val ? ' on' : ''}`}
                onClick={() => setEmp(t.val)}
                aria-pressed={emp === t.val}
              >
                <span className="rb">
                  <CheckIcon size={12} strokeWidth={3} />
                </span>
                <div className="ic">{EMP_ICONS[t.val]}</div>
                <div className="t">{t.val}</div>
                <div className="s">{t.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="ob-grid-2">
          <div className="ob-field">
            <FieldLabel htmlFor="ob-aSalary" optional>
              Expected monthly salary
            </FieldLabel>
            <div className="ob-prefixed">
              <span className="pfx">ETB</span>
              <input
                id="ob-aSalary"
                type="number"
                placeholder="e.g. 18,000"
                value={fields.aSalary}
                onChange={(e) => setField('aSalary', e.target.value)}
              />
            </div>
            <p className="ob-hint">Helps with role matching. Ethiopian Birr.</p>
          </div>

          <SelectField fieldKey="aHear" label="How did you hear about us?" required>
            {HEAR_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </SelectField>
        </div>

        <TextField
          fieldKey="aLinkedin"
          label="LinkedIn profile URL"
          type="url"
          placeholder="https://linkedin.com/in/…"
          optional
          validate={(v) => URL_RE.test(v.trim())}
          error="Enter a valid URL (https://…)."
        />

        <div className="ob-callout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <p>
            <b>Almost there.</b> Emergency contact and government IDs are collected later — only once you&apos;ve passed
            assessment and are bench-ready.
          </p>
        </div>
      </div>
    </div>
  )
}
