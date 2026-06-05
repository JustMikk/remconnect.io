'use client'

import { useOnboarding } from '../OnboardingContext'
import { INTERNET_SPEEDS, REMOTE_SETUP_GROUPS } from '../constants'
import { SelectField } from '../fields'
import { CheckIcon, PlusIcon, TrashIcon } from '../icons'

function Subhead({ children, opt }: { children: React.ReactNode; opt?: boolean }) {
  return (
    <div className="ob-subhead">
      <h3>{children}</h3>
      <span className="ln" />
      {opt && <span className="ob-opt">Optional</span>}
    </div>
  )
}

export default function SetupStep() {
  const { certs, addCert, updateCert, removeCert, checks, toggleCheck } = useOnboarding()

  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Setup
        </span>
        <h2>
          Certifications &amp; <em>remote setup</em>.
        </h2>
        <p>Add any certifications you&apos;ve earned, then tell us about your work-from-home setup.</p>
      </div>
      <div className="ob-step-inner">
        <Subhead opt>Certifications</Subhead>
        <div>
          {certs.length === 0 ? (
            <div className="ob-empty">
              <p>No certifications added.</p>
              <span className="sm">Optional — add Google, Coursera, HubSpot certs and more.</span>
            </div>
          ) : (
            certs.map((c, i) => (
              <div className="ob-cert" key={c.id}>
                <div className="ob-cert-top">
                  <span className="n">Certification {i + 1}</span>
                  <button type="button" className="ob-cert-rm" aria-label="Remove" onClick={() => removeCert(c.id)}>
                    <TrashIcon size={16} />
                  </button>
                </div>
                <div className="ob-grid-2">
                  <div className="ob-field">
                    <label className="ob-label">
                      Course / certification name <span className="ob-req">Required</span>
                    </label>
                    <input
                      className="ob-input"
                      placeholder="e.g. Google IT Support"
                      value={c.name}
                      onChange={(e) => updateCert(c.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="ob-field">
                    <label className="ob-label">
                      Issuing organization <span className="ob-req">Required</span>
                    </label>
                    <input
                      className="ob-input"
                      placeholder="e.g. Coursera"
                      value={c.org}
                      onChange={(e) => updateCert(c.id, { org: e.target.value })}
                    />
                  </div>
                </div>
                <div className="ob-grid-3">
                  <div className="ob-field">
                    <label className="ob-label">
                      Date earned <span className="ob-opt">Optional</span>
                    </label>
                    <input
                      className="ob-input"
                      type="month"
                      value={c.earned}
                      onChange={(e) => updateCert(c.id, { earned: e.target.value })}
                    />
                  </div>
                  <div className="ob-field">
                    <label className="ob-label">
                      Expiry <span className="ob-opt">Optional</span>
                    </label>
                    <input
                      className="ob-input"
                      type="month"
                      value={c.expiry}
                      onChange={(e) => updateCert(c.id, { expiry: e.target.value })}
                    />
                  </div>
                  <div className="ob-field">
                    <label className="ob-label">
                      Certificate URL <span className="ob-opt">Optional</span>
                    </label>
                    <input
                      className="ob-input"
                      type="url"
                      placeholder="https://…"
                      value={c.url}
                      onChange={(e) => updateCert(c.id, { url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button type="button" className="ob-add" onClick={addCert}>
          <PlusIcon />
          Add certification
        </button>

        <Subhead>Remote work setup</Subhead>
        {REMOTE_SETUP_GROUPS.map((grp) => (
          <div className="ob-check-group" key={grp.gh}>
            <div className="gh">{grp.gh}</div>
            <div className="ob-checks">
              {grp.items.map((item) => {
                const on = checks.has(item)
                return (
                  <button
                    type="button"
                    className={`ob-check${on ? ' on' : ''}`}
                    key={item}
                    onClick={() => toggleCheck(item)}
                    aria-pressed={on}
                  >
                    <span className="box">
                      <CheckIcon size={12} strokeWidth={3} />
                    </span>
                    <span className="lbl">{item}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        <SelectField fieldKey="netSpeed" label="Internet speed (approx.)" required maxWidth={340}>
          {INTERNET_SPEEDS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>
      </div>
    </div>
  )
}
