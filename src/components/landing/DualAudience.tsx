'use client'
import { useInView } from './useLandingHooks'

const TALENT = [
  'Zero fees — free for candidates, always',
  'Remote-first roles with global companies',
  'Fair, livable wages benchmarked to world standards',
  'End-to-end support from application to day one',
  'Virtual training provided by clients before you start',
]

const CLIENTS = [
  'Pre-vetted professionals — skill, fluency, reliability',
  'Cost-effective talent without sacrificing quality',
  'We handle intake, screening, and onboarding',
  'Roles filled in 2–6 weeks on average',
  'Ongoing support and replacement guarantees',
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="7" cy="7" r="6.5" stroke="var(--rc-blue)" strokeOpacity="0.3" />
      <path d="M4.5 7l2 2 3-3" stroke="var(--rc-blue)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckDark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
      <circle cx="7" cy="7" r="6.5" stroke="rgba(11,18,32,0.3)" />
      <path d="M4.5 7l2 2 3-3" stroke="var(--rc-ink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DualAudience() {
  const { ref, visible } = useInView()
  return (
    <section ref={ref} style={{ background: 'var(--rc-ink)', overflow: 'hidden' }}>
      <div
        className="l-dual-grid"
        style={{
          maxWidth: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
        }}
      >
        {/* For Talent — dark */}
        <div
          className="l-section-pad"
          style={{
            padding: '100px 72px 100px',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-36px)',
            transition: 'opacity 0.72s ease, transform 0.72s ease',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'var(--rc-blue)', textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            For talent
          </p>
          <h2 style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.9rem, 2.8vw, 2.6rem)',
            color: 'var(--rc-paper)', letterSpacing: '-0.02em',
            lineHeight: 1.12, margin: '0 0 16px',
          }}>
            Your skills deserve<br />
            <em style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'var(--rc-blue-soft)',
            }}>global recognition</em>
          </h2>
          <p style={{
            color: 'var(--rc-muted-d)', fontSize: '15px',
            lineHeight: 1.68, margin: '0 0 40px', maxWidth: '380px',
          }}>
            Ethiopian professionals are among the most driven in the world. We bridge your ambition and global opportunity.
          </p>
          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 48px',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {TALENT.map((item, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${200 + i * 65}ms`,
              }}>
                <Check />
                <span style={{ color: 'var(--rc-muted-d)', fontSize: '14px', lineHeight: 1.55 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="/apply"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--rc-blue)', color: '#fff',
              padding: '13px 26px', borderRadius: '8px',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Apply for free →
          </a>
        </div>

        {/* For Clients — paper */}
        <div
          className="l-section-pad"
          style={{
            padding: '100px 72px 100px',
            background: 'var(--rc-paper)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(36px)',
            transition: 'opacity 0.72s ease 100ms, transform 0.72s ease 100ms',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'var(--rc-blue)', textTransform: 'uppercase',
            margin: '0 0 16px',
          }}>
            For clients
          </p>
          <h2 style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.9rem, 2.8vw, 2.6rem)',
            color: 'var(--rc-ink)', letterSpacing: '-0.02em',
            lineHeight: 1.12, margin: '0 0 16px',
          }}>
            Hire top talent<br />
            <em style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'var(--rc-blue-deep)',
            }}>without the overhead</em>
          </h2>
          <p style={{
            color: 'var(--rc-muted)', fontSize: '15px',
            lineHeight: 1.68, margin: '0 0 40px', maxWidth: '380px',
          }}>
            Access a pool of pre-vetted Ethiopian professionals. We handle intake to onboarding — you just select who fits.
          </p>
          <ul style={{
            listStyle: 'none', padding: 0, margin: '0 0 48px',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            {CLIENTS.map((item, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                opacity: visible ? 1 : 0,
                transition: `opacity 0.5s ease ${300 + i * 65}ms`,
              }}>
                <CheckDark />
                <span style={{ color: 'var(--rc-muted)', fontSize: '14px', lineHeight: 1.55 }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="/for-clients"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'var(--rc-ink)', color: '#fff',
              padding: '13px 26px', borderRadius: '8px',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              transition: 'opacity 0.15s, transform 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            Partner with us →
          </a>
        </div>
      </div>
    </section>
  )
}
