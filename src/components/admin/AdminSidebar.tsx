'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'

interface NavItem { id: string; label: string; icon: string; badge?: number }
interface NavGroup { group: string; items: NavItem[] }

const ADMIN_NAV: NavGroup[] = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Dashboard',           icon: 'home' },
    { id: 'audit',     label: 'Audit log',           icon: 'activity' },
  ]},
  { group: 'Access control', items: [
    { id: 'admins',  label: 'Admin accounts',      icon: 'shield', badge: 27 },
    { id: 'roles',   label: 'Roles & permissions', icon: 'lock' },
    { id: 'invite',  label: 'Invite admin',        icon: 'plus' },
  ]},
  { group: 'People', items: [
    { id: 'agents',  label: 'Agent directory', icon: 'users' },
    { id: 'clients', label: 'Clients',         icon: 'briefcase' },
  ]},
  { group: 'Network', items: [
    { id: 'net-dashboard', label: 'Overview',   icon: 'globe'     },
    { id: 'net-agents',    label: 'Agents',     icon: 'users'     },
    { id: 'net-incidents', label: 'Incidents',  icon: 'activity'  },
    { id: 'net-alerts',    label: 'Alerts',     icon: 'bell'      },
    { id: 'net-isp',       label: 'ISP',        icon: 'share'     },
    { id: 'net-shifts',    label: 'Shifts',     icon: 'clock'     },
    { id: 'net-reports',   label: 'Reports',    icon: 'bar-chart' },
  ]},
  { group: 'Platform', items: [
    { id: 'integrations', label: 'Integrations', icon: 'share' },
    { id: 'settings',     label: 'Settings',     icon: 'settings' },
  ]},
]

const ROUTE_MAP: Record<string, string> = {
  dashboard:     '/admin',
  audit:         '/admin/audit',
  admins:        '/admin/admins',
  roles:         '/admin/roles',
  invite:        '/admin/invite',
  agents:        '/admin/agents',
  clients:       '/admin/clients',
  'net-dashboard': '/admin/network/dashboard',
  'net-agents':    '/admin/network/agents',
  'net-incidents': '/admin/network/incidents',
  'net-alerts':    '/admin/network/alerts',
  'net-isp':       '/admin/network/isp',
  'net-shifts':    '/admin/network/shifts',
  'net-reports':   '/admin/network/reports',
  integrations:  '/admin/integrations',
  settings:      '/admin/settings',
}

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (id: string) => {
    const route = ROUTE_MAP[id]
    if (id === 'dashboard') return pathname === '/admin'
    if (id === 'net-dashboard') return pathname === '/admin/network/dashboard' || pathname === '/admin/network'
    return pathname.startsWith(route)
  }

  return (
    <aside style={{
      background: '#0b1220',
      borderRight: '1px solid #1a2338',
      display: 'flex',
      flexDirection: 'column',
      padding: '18px 14px',
      position: 'sticky',
      top: 0,
      height: '100vh',
      width: 244,
      flexShrink: 0,
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 6px 14px',
        borderBottom: '1px solid #1a2338',
        marginBottom: 10,
      }}>
        <Image
          src="/assets/remconnect-logo.png"
          alt="RemConnect"
          width={28}
          height={28}
          style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)', width: 28, height: 28 }}
          priority
        />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: '#e5e7eb' }}>RemConnect</div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7cb3f5', fontWeight: 600, marginTop: 1 }}>
            Admin Console
          </div>
        </div>
      </div>

      {/* Nav groups */}
      {ADMIN_NAV.map((group) => (
        <div key={group.group}>
          <div style={{
            fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#5a6072', fontWeight: 600, padding: '14px 10px 6px',
          }}>
            {group.group}
          </div>
          {group.items.map((it) => {
            const active = isActive(it.id)
            const href = ROUTE_MAP[it.id]
            return (
              <Link
                key={it.id}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 6, fontSize: 13,
                  color: active ? '#fff' : '#b8bdc9',
                  background: active ? '#1d6fd6' : 'transparent',
                  fontWeight: active ? 500 : 400,
                  textDecoration: 'none',
                  marginBottom: 1,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#1a2338' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <Icon name={it.icon} size={15} color={active ? '#fff' : '#7c8499'} />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge != null && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, padding: '1px 7px', borderRadius: 999,
                    background: active ? 'rgba(255,255,255,0.22)' : '#1a2338',
                    color: active ? '#fff' : '#b8bdc9',
                    fontWeight: 600,
                  }}>
                    {it.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      ))}

      {/* User card */}
      <div style={{
        marginTop: 'auto', padding: 12, borderRadius: 10,
        background: '#121a2b', border: '1px solid #1a2338',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Avatar name="Meron Tadesse" tone={3} size={36} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#e5e7eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Meron Tadesse
          </div>
          <div style={{ fontSize: 10, color: '#7cb3f5', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 1 }}>
            Super Admin
          </div>
        </div>
        <Icon name="settings" size={14} color="#7c8499" />
      </div>
    </aside>
  )
}
