'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { NAV, ROUTE_MAP } from '@/lib/nav'
import { usePortal } from '@/context/PortalContext'

interface AppSidebarProps {
  userName: string
  signOut: () => Promise<void>
}

export function AppSidebar({ userName, signOut }: AppSidebarProps) {
  const { status } = usePortal()
  const pathname = usePathname()

  const isActive = (id: string) => {
    const route = ROUTE_MAP[id] ?? `/${id}`
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  }

  return (
    <aside
      style={{
        background: '#fff',
        borderRight: '1px solid #e3e0d2',
        display: 'flex',
        flexDirection: 'column',
        padding: '18px 14px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: 232,
        flexShrink: 0,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 8px 18px',
          borderBottom: '1px solid #e3e0d2',
          marginBottom: 14,
        }}
      >
        <Image
          src="/assets/remconnect-logo.png"
          alt="RemConnect"
          width={110}
          height={40}
          style={{ objectFit: 'contain', width: '100%', maxWidth: 110, height: 'auto' }}
          priority
        />
      </div>

      {/* Nav groups */}
      {NAV.map((group) => {
        const items = group.items.filter((it) => !it.showWhen || it.showWhen.includes(status))
        if (!items.length) return null
        return (
          <div key={group.group}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#5a6072',
                fontWeight: 700,
                padding: '14px 10px 6px',
              }}
            >
              {group.group}
            </div>
            {items.map((it) => {
              if (it.isHeader) {
                return (
                  <div
                    key={it.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 10px 2px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#2a2f3c',
                      marginTop: 2,
                    }}
                  >
                    <Icon name={it.icon} size={13} color="#5a6072" />
                    <span>{it.label}</span>
                  </div>
                )
              }

              const active = isActive(it.id)
              const href = ROUTE_MAP[it.id] ?? `/${it.id}`
              return (
                <Link
                  key={it.id}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: it.indent ? '5px 10px 5px 26px' : '7px 10px',
                    borderRadius: 6,
                    fontSize: it.indent ? 12 : 13,
                    color: active ? '#fff' : '#2a2f3c',
                    background: active ? '#0b1220' : 'transparent',
                    fontWeight: active ? 500 : 400,
                    border: '1px solid transparent',
                    textDecoration: 'none',
                    transition: 'background 0.15s',
                    marginBottom: 2,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = '#f3f1ea'
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <Icon
                    name={it.icon}
                    size={it.indent ? 13 : 15}
                    color={active ? '#fff' : '#5a6072'}
                  />
                  <span style={{ flex: 1 }}>{it.label}</span>
                  {it.badge && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 999,
                        background: active ? '#fff' : '#1d6fd6',
                        color: active ? '#0b1220' : '#fff',
                        fontWeight: 600,
                      }}
                    >
                      {it.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        )
      })}

      {/* User card */}
      <div
        style={{
          marginTop: 'auto',
          padding: 12,
          borderRadius: 10,
          background: '#f3f1ea',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Avatar name={userName} tone={0} size={36} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </div>
            <div style={{ fontSize: 11, color: '#5a6072', fontWeight: 600 }}>Agent</div>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '6px 0',
              borderRadius: 6,
              border: '1px solid #d4d0c8',
              background: 'transparent',
              fontSize: 12,
              color: '#5a6072',
              cursor: 'pointer',
            }}
          >
            <Icon name="x" size={12} color="#5a6072" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
