'use client'
import { TESTIMONIALS } from '@/lib/landing-data'
import { useInView } from './useLandingHooks'

export default function Testimonials() {
  const { ref, visible } = useInView()
  return (
    <section
      ref={ref}
      className="l-section-pad"
      style={{
        background: 'var(--rc-ink-3)',
        padding: '112px 48px',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.03)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '280px', height: '280px', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '72px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
            color: 'var(--rc-paper)', letterSpacing: '-0.025em',
            lineHeight: 1.08, margin: '0 0 16px',
          }}>
            Voices from our{' '}
            <em style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'var(--rc-blue-soft)',
            }}>community</em>
          </h2>
          <p style={{
            fontSize: '15px', color: 'var(--rc-muted-d)',
            lineHeight: 1.65, margin: '0 auto', maxWidth: '420px',
          }}>
            From the professionals we place to the companies we serve.
          </p>
        </div>

        <div
          className="l-testi-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
          }}
        >
          {TESTIMONIALS.map((t, i) => {
            const isHighlight = i === 1
            return (
              <div
                key={t.id}
                style={{
                  padding: '40px',
                  borderRadius: '16px',
                  background: isHighlight ? 'var(--rc-blue)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isHighlight ? 'transparent' : 'rgba(255,255,255,0.07)'}`,
                  display: 'flex', flexDirection: 'column', gap: '24px',
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? `translateY(${isHighlight ? -8 : 0}px)`
                    : 'translateY(48px)',
                  transition: `opacity 0.72s ease ${i * 110}ms, transform 0.72s ease ${i * 110}ms`,
                }}
              >
                {/* Open quote */}
                <div style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontSize: '4.5rem', lineHeight: 0.9,
                  color: isHighlight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                  userSelect: 'none',
                }}>
                  &ldquo;
                </div>

                <p style={{
                  fontFamily: 'var(--font-family-serif)',
                  fontStyle: 'italic',
                  fontSize: '1rem', lineHeight: 1.76,
                  color: isHighlight ? 'rgba(255,255,255,0.92)' : 'var(--rc-muted-d)',
                  margin: 0, flex: 1,
                }}>
                  {t.quote}
                </p>

                <div style={{
                  paddingTop: '20px',
                  borderTop: `1px solid ${isHighlight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                  <p style={{
                    margin: 0,
                    fontFamily: 'var(--font-family-display)',
                    fontWeight: 700, fontSize: '14px',
                    color: isHighlight ? '#fff' : 'var(--rc-paper)',
                  }}>
                    {t.name}
                  </p>
                  <p style={{
                    margin: '4px 0 0', fontSize: '12px',
                    color: isHighlight ? 'rgba(255,255,255,0.62)' : 'var(--rc-muted-d)',
                  }}>
                    {t.role}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
