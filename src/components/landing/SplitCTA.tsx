'use client'
import { useInView } from './useLandingHooks'

export default function SplitCTA() {
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
        <div
          className="l-cta-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}
        >
          {/* Talent CTA — dark */}
          <div style={{
            padding: '68px 60px',
            background: 'var(--rc-ink)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative', overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(44px)',
            transition: 'opacity 0.72s ease, transform 0.72s ease',
          }}>
            <div style={{
              position: 'absolute', top: '-80px', right: '-80px',
              width: '240px', height: '240px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(29,111,214,0.14) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <p style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'var(--rc-blue)', textTransform: 'uppercase',
              margin: '0 0 20px',
            }}>
              For candidates
            </p>
            <h3 style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 2.4vw, 2.3rem)',
              color: 'var(--rc-paper)', letterSpacing: '-0.02em',
              lineHeight: 1.1, margin: '0 0 16px',
            }}>
              Ready to land your<br />
              <em style={{
                fontFamily: 'var(--font-family-serif)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'var(--rc-blue-soft)',
              }}>dream remote role?</em>
            </h3>
            <p style={{
              fontSize: '14px', color: 'var(--rc-muted-d)',
              lineHeight: 1.68, margin: '0 0 40px',
            }}>
              Apply once. Get matched to multiple opportunities. Zero fees, forever.
            </p>
            <a
              href="/apply"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'var(--rc-blue)', color: '#fff',
                padding: '14px 28px', borderRadius: '8px',
                fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(29,111,214,0.38)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Apply for free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" />
              </svg>
            </a>
          </div>

          {/* Client CTA — blue */}
          <div style={{
            padding: '68px 60px',
            background: 'var(--rc-blue)',
            borderRadius: '20px',
            position: 'relative', overflow: 'hidden',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(44px)',
            transition: 'opacity 0.72s ease 130ms, transform 0.72s ease 130ms',
          }}>
            <div style={{
              position: 'absolute', bottom: '-80px', left: '-80px',
              width: '240px', height: '240px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '160px', height: '160px', borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              pointerEvents: 'none',
            }} />

            <p style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
              margin: '0 0 20px',
            }}>
              For businesses
            </p>
            <h3 style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 2.4vw, 2.3rem)',
              color: '#fff', letterSpacing: '-0.02em',
              lineHeight: 1.1, margin: '0 0 16px',
            }}>
              Need reliable talent<br />
              <em style={{
                fontFamily: 'var(--font-family-serif)',
                fontStyle: 'italic', fontWeight: 400,
                color: 'rgba(255,255,255,0.72)',
              }}>at global standards?</em>
            </h3>
            <p style={{
              fontSize: '14px', color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.68, margin: '0 0 40px',
            }}>
              Tell us what you need. We match you with pre-vetted professionals, handle onboarding, and remain your support layer.
            </p>
            <a
              href="/for-clients"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: '#fff', color: 'var(--rc-blue)',
                padding: '14px 28px', borderRadius: '8px',
                fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                transition: 'transform 0.18s, box-shadow 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.18)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Partner with us
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7h9M7 2.5l4.5 4.5L7 11.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
