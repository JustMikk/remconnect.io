'use client'

import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../OnboardingContext'
import { PROFICIENCIES } from '../constants'
import { CheckIcon, CloseIcon, PlusIcon, SearchIcon } from '../icons'

function Subhead({ children, opt }: { children: React.ReactNode; opt?: boolean }) {
  return (
    <div className="ob-subhead">
      <h3>{children}</h3>
      <span className="ln" />
      {opt && <span className="ob-opt">Optional</span>}
    </div>
  )
}

export default function LanguagesRoleStep() {
  const { langs, addLang, updateLang, removeLang, roles, toggleRole, roleGroups, hasError } =
    useOnboarding()

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return () => document.removeEventListener('click', onDoc)
  }, [])

  const q = query.toLowerCase().trim()
  const selected = new Set(roles.map((r) => r.r))
  const groups = roleGroups
    .map((grp) => ({
      g: grp.g,
      matches: grp.r.filter((r) => r.toLowerCase().includes(q) || grp.g.toLowerCase().includes(q)),
    }))
    .filter((grp) => grp.matches.length > 0)

  const rolesBad = hasError('roles')

  return (
    <div className="ob-steppane">
      <div className="ob-step-head">
        <span className="ob-eyebrow">
          <span className="ln" />
          Languages &amp; Role
        </span>
        <h2>
          What you <em>speak</em> &amp; do.
        </h2>
        <p>
          Tell us your languages and the roles you&apos;re after — search and pick as many as fit.
        </p>
      </div>
      <div className="ob-step-inner">
        <Subhead>Languages</Subhead>
        <div>
          {langs.map((row, i) => (
            <div className="ob-langrow" key={i}>
              <input
                className="ob-input"
                placeholder="Language"
                value={row.l}
                onChange={(e) => updateLang(i, { l: e.target.value })}
              />
              <select
                className="ob-select"
                value={row.p}
                onChange={(e) => updateLang(i, { p: e.target.value })}
              >
                {PROFICIENCIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <button
                type="button"
                className="ob-rm"
                aria-label="Remove"
                onClick={() => removeLang(i)}
              >
                <CloseIcon />
              </button>
            </div>
          ))}
        </div>
        <button type="button" className="ob-add" onClick={addLang}>
          <PlusIcon />
          Add language
        </button>

        <Subhead>Roles</Subhead>
        <div className="ob-field">
          <label className="ob-label">
            Roles you&apos;re applying for <span className="ob-req">Required · min 1</span>
          </label>
          <div className="ob-rolesearch" ref={wrapRef}>
            <div className="ob-search-wrap">
              <span className="si">
                <SearchIcon />
              </span>
              <input
                id="ob-roles"
                className="ob-input"
                placeholder="Search roles — e.g. support, virtual assistant, sales…"
                autoComplete="off"
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setOpen(true)
                }}
              />
            </div>
            {open && (
              <div className="ob-dropdown">
                {groups.length === 0 ? (
                  <div className="ob-dd-empty">No roles match &quot;{query}&quot;</div>
                ) : (
                  groups.map((grp) => (
                    <div key={grp.g}>
                      <div className="ob-dd-group">{grp.g}</div>
                      {grp.matches.map((r) => {
                        const sel = selected.has(r)
                        return (
                          <div
                            key={r}
                            className={`ob-dd-opt${sel ? ' sel' : ''}`}
                            onClick={() => toggleRole(r)}
                          >
                            <span className="nm">{r}</span>
                            <span className="ck">
                              <CheckIcon size={12} strokeWidth={3} />
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {roles.length > 0 && (
            <div className="ob-rolepicks">
              {roles.map((it) => (
                <div className="ob-rolepick" key={it.r}>
                  <span className="nm">{it.r}</span>
                  <button
                    type="button"
                    className="ob-rm"
                    aria-label="Remove"
                    onClick={() => toggleRole(it.r)}
                  >
                    <CloseIcon size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {roles.length === 0 && (
            <p className={`ob-chips-empty${rolesBad ? ' bad' : ''}`}>
              No roles selected yet — search above to add at least one.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
