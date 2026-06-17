import { PortalProvider } from '@/context/PortalContext'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppTopbar } from '@/components/layout/AppTopbar'
import { requireSession } from '@/lib/api/session'
import { portalLogoutAction } from './actions'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession()
  const displayName = session.email?.split('@')[0] ?? 'Agent'

  return (
    <PortalProvider>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4ee' }}>
        <AppSidebar userName={displayName} signOut={portalLogoutAction} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <AppTopbar userName={displayName} signOut={portalLogoutAction} />
          <main style={{ flex: 1 }}>{children}</main>
        </div>
      </div>
    </PortalProvider>
  )
}
