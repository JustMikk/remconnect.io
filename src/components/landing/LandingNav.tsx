'use client'
import { useState } from 'react'
import { useScrolled } from './useLandingHooks'

const LINKS = [
  { label: 'Jobs', href: '/jobs' },
  { label: 'For Clients', href: '/for-clients' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '#faq' },
]

export default function LandingNav() {
  const scrolled = useScrolled(56)
  const [open, setOpen] = useState(false)

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    transition: 'background 0.35s, backdrop-filter 0.35s, border-color 0.35s',
    background: scrolled ? 'rgba(11,18,32,0.90)' : 'transparent',
    backdropFilter: scrolled ? 'blur(18px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
  }

  return (
    <header style={navStyle}>
      <nav style={{
        maxWidth: '1280px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        height: '68px', padding: '0 48px', gap: '8px',
      }}>
        <a href="/" style={{
          fontFamily: 'var(--font-family-display)',
          fontWeight: 800, fontSize: '19px',
          color: 'var(--rc-paper)', letterSpacing: '-0.02em',
          textDecoration: 'none', flexShrink: 0, marginRight: '16px',
        }}>
          Rem<span style={{ color: 'var(--rc-blue)' }}>Connect</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto' }}>
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              style={{
                padding: '8px 14px', borderRadius: '6px',
                color: 'var(--rc-muted-d)', fontSize: '14px',
                fontWeight: 500, textDecoration: 'none',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.color = 'var(--rc-paper)'
                el.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.color = 'var(--rc-muted-d)'
                el.style.background = 'transparent'
              }}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
          <a
            href="/apply"
            style={{
              padding: '8px 18px', borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.13)',
              color: 'var(--rc-paper)', fontSize: '14px', fontWeight: 500,
              textDecoration: 'none', transition: 'border-color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
            }}
          >
            Apply
          </a>
          <a
            href="/for-clients"
            style={{
              padding: '8px 18px', borderRadius: '6px',
              background: 'var(--rc-blue)', color: '#fff',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Hire talent
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: 'none', marginLeft: 'auto',
            background: 'none', border: 'none',
            color: 'var(--rc-paper)', cursor: 'pointer',
            padding: '8px', borderRadius: '6px',
          }}
          className="l-mobile-menu-btn"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {open
              ? <><line x1="5" y1="5" x2="17" y2="17" /><line x1="17" y1="5" x2="5" y2="17" /></>
              : <><line x1="3" y1="7" x2="19" y2="7" /><line x1="3" y1="11" x2="19" y2="11" /><line x1="3" y1="15" x2="19" y2="15" /></>
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(11,18,32,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '16px 24px 28px',
        }}>
          {LINKS.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block', padding: '14px 0',
                color: 'var(--rc-muted-d)', fontSize: '15px',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {l.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <a href="/apply" style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: '7px', border: '1px solid rgba(255,255,255,0.13)', color: 'var(--rc-paper)', fontSize: '14px', textDecoration: 'none' }}>
              Apply
            </a>
            <a href="/for-clients" style={{ flex: 1, textAlign: 'center', padding: '11px', borderRadius: '7px', background: 'var(--rc-blue)', color: '#fff', fontWeight: 600, fontSize: '14px', textDecoration: 'none' }}>
              Hire talent
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
