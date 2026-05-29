'use client'
import { STEPS } from '@/lib/landing-data'
import { useInView } from './useLandingHooks'

export default function HowItWorks() {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref}
      className="l-section-pad"
      style={{
        background: 'var(--rc-paper)',
        padding: '112px 48px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ marginBottom: '80px' }}>
          <p style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'var(--rc-blue)', textTransform: 'uppercase',
            margin: '0 0 14px',
          }}>
            How it works
          </p>
          <h2 style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
            color: 'var(--rc-ink)', letterSpacing: '-0.025em',
            lineHeight: 1.08, margin: 0,
          }}>
            Three steps to your<br />
            <em style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 400,
            }}>next opportunity</em>
          </h2>
        </div>

        <div
          className="l-how-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2px',
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              style={{
                position: 'relative',
                padding: '52px 44px',
                background: i === 1 ? 'var(--rc-ink)' : i === 0 ? 'var(--rc-paper-2)' : 'var(--rc-paper-3)',
                border: '1px solid var(--rc-line)',
                borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : '0',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `opacity 0.7s ease ${i * 130}ms, transform 0.7s ease ${i * 130}ms`,
              }}
            >
              {/* Large ghost number */}
              <div style={{
                fontFamily: 'var(--font-family-display)',
                fontSize: '5.5rem', fontWeight: 800,
                lineHeight: 1, marginBottom: '28px',
                letterSpacing: '-0.04em',
                color: i === 1 ? 'rgba(255,255,255,0.05)' : 'rgba(11,18,32,0.05)',
                userSelect: 'none',
              }}>
                0{step.n}
              </div>

              {/* Blue accent line */}
              <div style={{
                width: '28px', height: '2px',
                background: 'var(--rc-blue)',
                borderRadius: '2px',
                marginBottom: '20px',
                transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: `transform 0.5s ease ${200 + i * 130}ms`,
              }} />

              <h3 style={{
                fontFamily: 'var(--font-family-display)',
                fontWeight: 700, fontSize: '1.2rem',
                letterSpacing: '-0.01em',
                color: i === 1 ? 'var(--rc-paper)' : 'var(--rc-ink)',
                margin: '0 0 12px',
              }}>
                {step.title}
              </h3>
              <p style={{
                fontSize: '14px', lineHeight: 1.68,
                color: i === 1 ? 'var(--rc-muted-d)' : 'var(--rc-muted)',
                margin: 0,
              }}>
                {step.body}
              </p>

              {/* Connector dot */}
              {i < 2 && (
                <div style={{
                  position: 'absolute', right: '-12px', top: '50%',
                  transform: 'translateY(-50%)',
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: 'var(--rc-paper)',
                  border: '1px solid var(--rc-line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2, fontSize: '12px', color: 'var(--rc-muted)',
                }}>
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '56px', textAlign: 'center' }}>
          <a
            href="/apply"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'var(--rc-ink)', color: '#fff',
              padding: '14px 32px', borderRadius: '8px',
              fontWeight: 600, fontSize: '15px', textDecoration: 'none',
              transition: 'transform 0.18s, box-shadow 0.18s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(11,18,32,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Start your application →
          </a>
        </div>
      </div>
    </section>
  )
}
