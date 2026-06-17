'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { usePortal } from '@/context/PortalContext'
import type { AgentStatus } from '@/types'

const STATUS_CONFIG: Record<AgentStatus, { label: string; cls: string; dotColor: string }> = {
  recruit: { label: 'Recruit · onboarding', cls: 'warn', dotColor: '#c08a2a' },
  assess: { label: 'Under assessment', cls: 'assess', dotColor: '#1d6fd6' },
  bench: { label: 'Bench-ready', cls: 'assess', dotColor: '#1d6fd6' },
  deployed: { label: 'Deployed · Northwind', cls: 'deployed', dotColor: '#2f8d5c' },
}

const STATUS_PILL_STYLE: Record<string, React.CSSProperties> = {
  warn: {
    background: 'rgba(192,138,42,0.14)',
    color: '#7a5010',
    border: '1px solid rgba(192,138,42,0.3)',
  },
  assess: {
    background: 'rgba(29,111,214,0.10)',
    color: '#0c3a7a',
    border: '1px solid rgba(29,111,214,0.22)',
  },
  deployed: {
    background: 'rgba(47,141,92,0.12)',
    color: '#1f5a3d',
    border: '1px solid rgba(47,141,92,0.28)',
  },
}

interface AppTopbarProps {
  title?: string
  userName?: string
  signOut?: () => Promise<void>
}

export function AppTopbar({ title, userName, signOut }: AppTopbarProps) {
  const { status, setStatus } = usePortal()
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const s = STATUS_CONFIG[status]

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        background: '#fff',
        borderBottom: '1px solid #e3e0d2',
        position: 'sticky',
        top: 0,
        zIndex: 5,
      }}
    >
      <div>
        {title && <div style={{ fontSize: 11, color: '#5a6072', fontWeight: 600 }}>{title}</div>}
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span>Addis Ababa · {today}</span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowStatusMenu((v) => !v)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: 'none',
                cursor: 'pointer',
                ...STATUS_PILL_STYLE[s.cls],
              }}
            >
              <span
                className="rc-pulse"
                style={{ width: 6, height: 6, borderRadius: '50%', background: s.dotColor }}
              />
              {s.label}
            </button>
            {showStatusMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 6,
                  background: '#fff',
                  border: '1px solid #e3e0d2',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(11,18,32,0.1)',
                  padding: 8,
                  zIndex: 50,
                  minWidth: 200,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: '#5a6072',
                    fontWeight: 600,
                    padding: '4px 8px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  Switch status (demo)
                </div>
                {(['recruit', 'assess', 'bench', 'deployed'] as AgentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatus(st)
                      setShowStatusMenu(false)
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: status === st ? '#f3f1ea' : 'transparent',
                      fontSize: 13,
                      cursor: 'pointer',
                      fontWeight: status === st ? 600 : 400,
                    }}
                  >
                    {STATUS_CONFIG[st].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div
        style={{
          flex: 1,
          maxWidth: 420,
          margin: '0 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: '#f3f1ea',
          borderRadius: 8,
          fontSize: 13,
          color: '#5a6072',
        }}
      >
        <Icon name="search" size={14} color="#5a6072" />
        Search training, people, assignments…
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'monospace',
            fontSize: 11,
            padding: '2px 6px',
            background: '#fff',
            borderRadius: 4,
            border: '1px solid #e3e0d2',
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #e3e0d2',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Icon name="bell" size={14} />
        </button>

        {userName && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
              aria-label="User menu"
            >
              <Avatar name={userName} tone={0} size={32} />
            </button>
            {showUserMenu && signOut && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  background: '#fff',
                  border: '1px solid #e3e0d2',
                  borderRadius: 10,
                  boxShadow: '0 4px 12px rgba(11,18,32,0.1)',
                  padding: 8,
                  zIndex: 50,
                  minWidth: 160,
                }}
              >
                <div
                  style={{
                    padding: '4px 10px 8px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#0b1220',
                    borderBottom: '1px solid #e3e0d2',
                    marginBottom: 6,
                  }}
                >
                  {userName}
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: 'transparent',
                      fontSize: 13,
                      color: '#5a6072',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Icon name="x" size={13} color="#5a6072" />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
