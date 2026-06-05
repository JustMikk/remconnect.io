'use client'

// Small labeled form-control building blocks shared by the auth screens and
// wizard steps. Each binds to a key in the onboarding store.
import { useState, type ReactNode } from 'react'
import { useOnboarding } from './OnboardingContext'
import { AlertCircle, CheckIcon, EyeIcon } from './icons'

type FieldKey = Parameters<ReturnType<typeof useOnboarding>['setField']>[0]

function Req() {
  return <span className="ob-req">Required</span>
}
function Opt() {
  return <span className="ob-opt">Optional</span>
}

export function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
}: {
  htmlFor?: string
  children: ReactNode
  required?: boolean
  optional?: boolean
}) {
  return (
    <label className="ob-label" htmlFor={htmlFor}>
      {children} {required && <Req />} {optional && <Opt />}
    </label>
  )
}

export function ErrorRow({ children }: { children: ReactNode }) {
  return (
    <div className="ob-error">
      <AlertCircle />
      <span>{children}</span>
    </div>
  )
}

interface TextFieldProps {
  fieldKey: FieldKey
  label: ReactNode
  type?: string
  placeholder?: string
  required?: boolean
  optional?: boolean
  autoComplete?: string
  inputMode?: 'numeric' | 'text' | 'email' | 'tel' | 'url'
  hint?: ReactNode
  error?: string
  /** When provided, drives the green "ok" tick once the value validates. */
  validate?: (v: string) => boolean
}

export function TextField({
  fieldKey,
  label,
  type = 'text',
  placeholder,
  required,
  optional,
  autoComplete,
  inputMode,
  hint,
  error,
  validate,
}: TextFieldProps) {
  const { fields, setField, hasError } = useOnboarding()
  const value = fields[fieldKey]
  const bad = hasError(fieldKey)
  const ok = !!validate && value.trim().length > 0 && validate(value)
  const id = `ob-${fieldKey}`

  const input = (
    <input
      id={id}
      className={`ob-input${ok ? ' ok' : ''}${bad ? ' bad' : ''}`}
      type={type}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      onChange={(e) => setField(fieldKey, e.target.value)}
    />
  )

  return (
    <div className={`ob-field${bad ? ' has-error' : ''}`}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      {validate ? (
        <div className="ob-input-wrap">
          {input}
          <span className="ob-iadorn">
            <CheckIcon className="ob-vtick" />
          </span>
        </div>
      ) : (
        input
      )}
      {hint && <p className="ob-hint">{hint}</p>}
      {error && <ErrorRow>{error}</ErrorRow>}
    </div>
  )
}

export function PasswordField({
  fieldKey,
  label,
  placeholder,
  autoComplete,
  error,
}: {
  fieldKey: FieldKey
  label: ReactNode
  placeholder?: string
  autoComplete?: string
  error?: string
}) {
  const { fields, setField, hasError } = useOnboarding()
  const [show, setShow] = useState(false)
  const bad = hasError(fieldKey)
  const id = `ob-${fieldKey}`
  return (
    <div className={`ob-field${bad ? ' has-error' : ''}`}>
      <FieldLabel htmlFor={id} required>
        {label}
      </FieldLabel>
      <div className="ob-input-wrap">
        <input
          id={id}
          className={`ob-input${bad ? ' bad' : ''}`}
          type={show ? 'text' : 'password'}
          value={fields[fieldKey]}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => setField(fieldKey, e.target.value)}
        />
        <span className="ob-iadorn">
          <button
            type="button"
            className="ob-eye"
            style={show ? { color: 'var(--acc-ink)' } : undefined}
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow((s) => !s)}
          >
            <EyeIcon />
          </button>
        </span>
      </div>
      {error && <ErrorRow>{error}</ErrorRow>}
    </div>
  )
}

export function SelectField({
  fieldKey,
  label,
  required,
  optional,
  placeholder = 'Select…',
  hint,
  children,
  maxWidth,
}: {
  fieldKey: FieldKey
  label: ReactNode
  required?: boolean
  optional?: boolean
  placeholder?: string
  hint?: ReactNode
  children: ReactNode
  maxWidth?: number
}) {
  const { fields, setField, hasError } = useOnboarding()
  const bad = hasError(fieldKey)
  const id = `ob-${fieldKey}`
  return (
    <div className="ob-field" style={maxWidth ? { maxWidth } : undefined}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      <select
        id={id}
        className={`ob-select${bad ? ' bad' : ''}`}
        value={fields[fieldKey]}
        onChange={(e) => setField(fieldKey, e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
      {hint && <p className="ob-hint">{hint}</p>}
    </div>
  )
}
