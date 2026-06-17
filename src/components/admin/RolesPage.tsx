'use client'

import { useState, useTransition } from 'react'
import { Icon } from '@/components/ui/Icon'
import { TierTag } from './TierTag'
import { ROLES, PERMISSIONS, DOMAINS, ADMINS, tierColor } from '@/lib/admin-data'
import type { ApiRoleCategory, ApiRole } from '@/types/api'
import {
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  createCategoryAction,
} from '@/app/admin/(authed)/roles/actions'

type View = 'matrix' | 'cards' | 'job-roles'

// ─── Access control views (unchanged) ────────────────────────────────────────

function RolesMatrix() {
  const [hoverRow, setHoverRow] = useState<string | null>(null)
  const [hoverCol, setHoverCol] = useState<string | null>(null)

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#0b1220', position: 'sticky', top: 0, zIndex: 4 }}>
            <th
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                color: '#8b93a7',
                fontWeight: 600,
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderRight: '1px solid #1a2338',
                minWidth: 220,
                position: 'sticky',
                left: 0,
                background: '#0b1220',
                zIndex: 5,
              }}
            >
              Permission
            </th>
            {ROLES.map((r) => (
              <th
                key={r.id}
                onMouseEnter={() => setHoverCol(r.id)}
                onMouseLeave={() => setHoverCol(null)}
                style={{
                  padding: '10px 8px',
                  color: hoverCol === r.id ? r.color : '#c5cad8',
                  fontWeight: 600,
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  cursor: 'default',
                  borderRight: '1px solid #1a2338',
                  minWidth: 88,
                  transition: 'color 0.1s',
                }}
              >
                <div>{r.title}</div>
                <div style={{ fontSize: 10, color: '#5a6072', fontWeight: 400, marginTop: 2 }}>
                  {r.perms.length} perms
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DOMAINS.map((d) => {
            const group = PERMISSIONS.filter((p) => p.domain === d)
            if (!group.length) return null
            return (
              <>
                <tr key={`domain-${d}`} style={{ background: '#f3f1ea' }}>
                  <td
                    colSpan={ROLES.length + 1}
                    style={{
                      padding: '6px 14px',
                      fontSize: 10,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 600,
                      color: '#5a6072',
                      borderTop: '1px solid #e3e0d2',
                      position: 'sticky',
                      left: 0,
                    }}
                  >
                    {d}
                  </td>
                </tr>
                {group.map((p) => (
                  <tr
                    key={p.id}
                    onMouseEnter={() => setHoverRow(p.id)}
                    onMouseLeave={() => setHoverRow(null)}
                    style={{ background: hoverRow === p.id ? 'rgba(29,111,214,0.05)' : '#fff' }}
                  >
                    <td
                      style={{
                        padding: '9px 14px',
                        borderTop: '1px solid #e3e0d2',
                        borderRight: '1px solid #e3e0d2',
                        position: 'sticky',
                        left: 0,
                        background: hoverRow === p.id ? 'rgba(29,111,214,0.05)' : '#fff',
                        zIndex: 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TierTag tier={p.tier} />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.label}</div>
                          <div style={{ fontSize: 11, color: '#5a6072', marginTop: 1 }}>
                            {p.desc}
                          </div>
                        </div>
                      </div>
                    </td>
                    {ROLES.map((r) => {
                      const has = r.perms.includes(p.id)
                      const c = tierColor(p.tier)
                      return (
                        <td
                          key={r.id}
                          style={{
                            padding: '9px 8px',
                            borderTop: '1px solid #e3e0d2',
                            borderRight: '1px solid #e3e0d2',
                            textAlign: 'center',
                            background:
                              hoverCol === r.id
                                ? has
                                  ? `${r.color}18`
                                  : 'rgba(243,241,234,0.6)'
                                : 'transparent',
                          }}
                        >
                          {has ? (
                            <span style={{ color: r.color, fontSize: 14, fontWeight: 700 }}>✓</span>
                          ) : (
                            <span style={{ color: '#d4d0c8', fontSize: 14 }}>—</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function RolesCards() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}
    >
      {ROLES.map((r) => {
        const seats = ADMINS.filter((a) => a.role === r.id).length
        const isOpen = expanded === r.id
        const domainCoverage = DOMAINS.map((d) => {
          const total = PERMISSIONS.filter((p) => p.domain === d).length
          const granted = PERMISSIONS.filter((p) => p.domain === d && r.perms.includes(p.id)).length
          return { d, total, granted }
        }).filter((x) => x.total > 0)

        return (
          <div
            key={r.id}
            style={{
              background: '#fff',
              border: '1px solid #e3e0d2',
              borderRadius: 10,
              overflow: 'hidden',
              borderTop: `3px solid ${r.color}`,
            }}
          >
            <div style={{ padding: '18px 20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: '#5a6072', marginTop: 3, lineHeight: 1.4 }}>
                    {r.short}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div
                    style={{
                      fontFamily: 'monospace',
                      fontSize: 22,
                      fontWeight: 700,
                      color: r.color,
                    }}
                  >
                    {r.perms.length}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#5a6072',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    perms
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: '#5a6072', marginBottom: 12 }}>
                <strong style={{ color: '#0b1220' }}>{seats}</strong> admin{seats !== 1 ? 's' : ''}{' '}
                assigned to this role
              </div>
              <div style={{ display: 'grid', gap: 5 }}>
                {domainCoverage.map(({ d, total, granted }) => {
                  const pct = Math.round((granted / total) * 100)
                  if (pct === 0) return null
                  return (
                    <div
                      key={d}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '110px 1fr 28px',
                        gap: 8,
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10.5,
                          color: '#5a6072',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {d}
                      </div>
                      <div
                        style={{
                          height: 5,
                          background: '#f3f1ea',
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: pct + '%',
                            background: r.color + 'cc',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#5a6072',
                          fontFamily: 'monospace',
                          textAlign: 'right',
                        }}
                      >
                        {granted}/{total}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div
              onClick={() => setExpanded(isOpen ? null : r.id)}
              style={{
                padding: '10px 20px',
                borderTop: '1px solid #e3e0d2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f9f8f5',
                fontSize: 12,
                color: '#5a6072',
                userSelect: 'none',
              }}
            >
              <span>{isOpen ? 'Hide permissions' : 'Show all permissions'}</span>
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={12} />
            </div>
            {isOpen && (
              <div
                style={{
                  padding: '14px 20px',
                  borderTop: '1px solid #e3e0d2',
                  maxHeight: 300,
                  overflowY: 'auto',
                }}
              >
                {DOMAINS.map((d) => {
                  const group = PERMISSIONS.filter((p) => p.domain === d && r.perms.includes(p.id))
                  if (!group.length) return null
                  return (
                    <div key={d} style={{ marginBottom: 10 }}>
                      <div
                        style={{
                          fontSize: 10,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          fontWeight: 600,
                          color: '#5a6072',
                          marginBottom: 4,
                        }}
                      >
                        {d}
                      </div>
                      {group.map((p) => (
                        <div
                          key={p.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '3px 0',
                          }}
                        >
                          <TierTag tier={p.tier} />
                          <span style={{ fontSize: 12 }}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Job Roles view (API-backed) ─────────────────────────────────────────────

function JobRolesPanel({ categories }: { categories: ApiRoleCategory[] }) {
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [newRoleTitle, setNewRoleTitle] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<{ roleId: string; title: string } | null>(null)
  const [newCatName, setNewCatName] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)

  function handleCreateRole(categoryId: string) {
    const title = (newRoleTitle[categoryId] ?? '').trim()
    if (!title) return
    startTransition(async () => {
      const result = await createRoleAction(categoryId, { title })
      if (result.error) setActionError(result.error)
      else setNewRoleTitle((prev) => ({ ...prev, [categoryId]: '' }))
    })
  }

  function handleUpdateRole(roleId: string) {
    if (!editing || editing.roleId !== roleId) return
    const title = editing.title.trim()
    if (!title) return
    startTransition(async () => {
      const result = await updateRoleAction(roleId, { title })
      if (result.error) setActionError(result.error)
      else setEditing(null)
    })
  }

  function handleDeleteRole(roleId: string) {
    if (!confirm('Delete this role? This cannot be undone.')) return
    startTransition(async () => {
      const result = await deleteRoleAction(roleId)
      if (result.error) setActionError(result.error)
    })
  }

  function handleCreateCategory() {
    const name = newCatName.trim()
    if (!name) return
    startTransition(async () => {
      const result = await createCategoryAction({ name })
      if (result.error) setActionError(result.error)
      else {
        setNewCatName('')
        setShowNewCat(false)
      }
    })
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {actionError && (
        <div
          style={{
            marginBottom: 16,
            padding: '10px 14px',
            borderRadius: 6,
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            fontSize: 13,
          }}
        >
          {actionError}
          <button
            onClick={() => setActionError(null)}
            style={{
              marginLeft: 10,
              fontSize: 12,
              color: '#b91c1c',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <p style={{ fontSize: 13, color: '#5a6072', padding: '24px 0' }}>
          No job role categories yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {categories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#fff',
                border: '1px solid #e3e0d2',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid #e3e0d2',
                  background: '#f9f8f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0b1220' }}>
                    {cat.name}
                  </span>
                  <span style={{ marginLeft: 8, fontSize: 11, color: '#5a6072' }}>
                    {cat.roles.length} role{cat.roles.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Role list */}
              <div>
                {cat.roles.map((role: ApiRole) => (
                  <div
                    key={role.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 18px',
                      borderBottom: '1px solid #f3f1ea',
                    }}
                  >
                    {editing?.roleId === role.id ? (
                      <>
                        <input
                          value={editing.title}
                          onChange={(e) => setEditing({ roleId: role.id, title: e.target.value })}
                          style={{
                            flex: 1,
                            padding: '5px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: 6,
                            fontSize: 13,
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdateRole(role.id)}
                          autoFocus
                        />
                        <button
                          disabled={isPending}
                          onClick={() => handleUpdateRole(role.id)}
                          style={SAVE_BTN}
                        >
                          Save
                        </button>
                        <button onClick={() => setEditing(null)} style={CANCEL_BTN}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span style={{ flex: 1, fontSize: 13, color: '#0b1220' }}>
                          {role.title}
                        </span>
                        {role.description && (
                          <span
                            style={{
                              fontSize: 11,
                              color: '#5a6072',
                              maxWidth: 280,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {role.description}
                          </span>
                        )}
                        <button
                          onClick={() => setEditing({ roleId: role.id, title: role.title })}
                          style={ICON_BTN}
                          title="Edit"
                        >
                          <Icon name="edit" size={13} />
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => handleDeleteRole(role.id)}
                          style={{ ...ICON_BTN, color: '#b91c1c' }}
                          title="Delete"
                        >
                          <Icon name="x" size={13} />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add role row */}
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px' }}
                >
                  <input
                    placeholder="Add role title…"
                    value={newRoleTitle[cat.id] ?? ''}
                    onChange={(e) =>
                      setNewRoleTitle((prev) => ({ ...prev, [cat.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateRole(cat.id)}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      border: '1px solid #e3e0d2',
                      borderRadius: 6,
                      fontSize: 13,
                      background: '#fafaf8',
                    }}
                  />
                  <button
                    disabled={isPending || !(newRoleTitle[cat.id] ?? '').trim()}
                    onClick={() => handleCreateRole(cat.id)}
                    style={ADD_BTN}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New category */}
      <div style={{ marginTop: 20 }}>
        {showNewCat ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              placeholder="Category name…"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              style={{
                flex: 1,
                maxWidth: 300,
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 13,
              }}
              autoFocus
            />
            <button
              disabled={isPending || !newCatName.trim()}
              onClick={handleCreateCategory}
              style={SAVE_BTN}
            >
              Create
            </button>
            <button onClick={() => setShowNewCat(false)} style={CANCEL_BTN}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNewCat(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 6,
              border: 'none',
              background: '#0b1220',
              color: '#fff',
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <Icon name="plus" size={14} color="#fff" /> New category
          </button>
        )}
      </div>
    </div>
  )
}

const SAVE_BTN: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: 6,
  border: 'none',
  background: '#0b1220',
  color: '#fff',
  fontSize: 12,
  cursor: 'pointer',
  fontWeight: 500,
}
const CANCEL_BTN: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: 6,
  border: '1px solid #e3e0d2',
  background: 'transparent',
  fontSize: 12,
  cursor: 'pointer',
  color: '#5a6072',
}
const ADD_BTN: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: 'none',
  background: '#1d6fd6',
  color: '#fff',
  fontSize: 12,
  cursor: 'pointer',
  fontWeight: 500,
}
const ICON_BTN: React.CSSProperties = {
  padding: '4px 6px',
  borderRadius: 4,
  border: '1px solid #e3e0d2',
  background: 'transparent',
  cursor: 'pointer',
  color: '#5a6072',
  display: 'inline-flex',
  alignItems: 'center',
}

// ─── Main component ───────────────────────────────────────────────────────────

interface RolesPageProps {
  jobCategories?: ApiRoleCategory[]
}

export function RolesPage({ jobCategories = [] }: RolesPageProps) {
  const [view, setView] = useState<View>('matrix')

  const tierLegend: Array<{ tier: string; label: string }> = [
    { tier: 'low', label: 'Low risk' },
    { tier: 'med', label: 'Medium risk' },
    { tier: 'high', label: 'High risk' },
    { tier: 'critical', label: 'Critical' },
  ]

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1600, margin: '0 auto' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {view !== 'job-roles' &&
            tierLegend.map(({ tier, label }) => {
              const c = tierColor(tier)
              return (
                <span
                  key={tier}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 4,
                    background: c.bg,
                    color: c.fg,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  {label}
                </span>
              )
            })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{ display: 'flex', background: '#f3f1ea', borderRadius: 7, padding: 3, gap: 2 }}
          >
            {(['matrix', 'cards', 'job-roles'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 5,
                  border: 'none',
                  fontSize: 12,
                  cursor: 'pointer',
                  background: view === v ? '#fff' : 'transparent',
                  color: view === v ? '#0b1220' : '#5a6072',
                  fontWeight: 500,
                  boxShadow: view === v ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {v === 'matrix' ? 'Matrix' : v === 'cards' ? 'Cards' : 'Job roles'}
              </button>
            ))}
          </div>

          {view !== 'job-roles' && (
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 12px',
                borderRadius: 6,
                border: '1px solid #e3e0d2',
                background: 'transparent',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <Icon name="download" size={14} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {view === 'job-roles' ? (
        <JobRolesPanel categories={jobCategories} />
      ) : (
        <div
          style={{
            background: '#fff',
            border: '1px solid #e3e0d2',
            borderRadius: 10,
            overflow: 'hidden',
          }}
        >
          {view === 'matrix' ? <RolesMatrix /> : <RolesCards />}
        </div>
      )}
    </div>
  )
}
