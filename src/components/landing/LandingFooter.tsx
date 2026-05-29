'use client'

const COLS: Record<string, { label: string; href: string }[]> = {
  Jobs: [
    { label: 'Browse all jobs', href: '/jobs' },
    { label: 'Apply now', href: '/apply' },
    { label: 'Job FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'For clients', href: '/for-clients' },
    { label: 'Our mission', href: '/about#mission' },
    { label: 'Contact', href: 'mailto:bezamariam@remconnect.io' },
  ],
  Resources: [
    { label: 'Portal login', href: '/home' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of service', href: '/terms' },
  ],
}

export default function LandingFooter() {
  return (
    <footer style={{
      background: 'var(--rc-ink)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      padding: '80px 48px 48px',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          className="l-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr repeat(3, 1fr)',
            gap: '56px',
            marginBottom: '64px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800, fontSize: '1.45rem',
              color: 'var(--rc-paper)', letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}>
              Rem<span style={{ color: 'var(--rc-blue)' }}>Connect</span>
            </div>
            <p style={{
              fontSize: '14px', lineHeight: 1.72,
              color: 'var(--rc-muted-d)', margin: '0 0 24px',
              maxWidth: '240px',
            }}>
              Connecting Ethiopia&apos;s top professionals to global remote opportunities.
            </p>
            <p style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.12em',
              color: 'var(--rc-muted-d)', textTransform: 'uppercase',
              margin: 0,
            }}>
              Addis Ababa · Ethiopia
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(COLS).map(([col, links]) => (
            <div key={col}>
              <p style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700, fontSize: '11px',
                color: 'var(--rc-paper)', letterSpacing: '0.06em',
                margin: '0 0 20px', textTransform: 'uppercase',
              }}>
                {col}
              </p>
              <ul style={{
                listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: '12px',
              }}>
                {links.map(l => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      style={{
                        fontSize: '14px', color: 'var(--rc-muted-d)',
                        textDecoration: 'none', transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--rc-paper)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--rc-muted-d)' }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          flexWrap: 'wrap', gap: '12px',
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--rc-muted-d)' }}>
            &copy; 2025 RemConnect. All rights reserved.
          </p>
          <p style={{
            margin: 0, fontSize: '11px',
            fontFamily: 'var(--font-family-mono)',
            letterSpacing: '0.08em',
            color: 'var(--rc-muted-d)',
          }}>
            Made in Ethiopia, built for the world.
          </p>
        </div>
      </div>
    </footer>
  )
}
