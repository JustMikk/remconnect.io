'use client'
import { MISSION_QUOTE } from '@/lib/landing-data'
import { useInView } from './useLandingHooks'

export default function Mission() {
  const { ref, visible } = useInView(0.18)
  return (
    <section
      ref={ref}
      style={{
        background: 'var(--rc-ink)',
        padding: '140px 48px',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Large ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '900px', height: '600px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(29,111,214,0.09) 0%, transparent 62%)',
      }} />

      {/* Decorative corner lines */}
      <div style={{
        position: 'absolute', top: '40px', left: '60px',
        width: '60px', height: '60px', pointerEvents: 'none',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderLeft: '1px solid rgba(255,255,255,0.07)',
      }} />
      <div style={{
        position: 'absolute', bottom: '40px', right: '60px',
        width: '60px', height: '60px', pointerEvents: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }} />

      <div style={{
        maxWidth: '860px', margin: '0 auto',
        position: 'relative', zIndex: 1,
      }}>
        {/* Divider */}
        <div style={{
          width: '32px', height: '1px',
          background: 'var(--rc-blue)',
          margin: '0 auto 40px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }} />

        <blockquote style={{
          fontFamily: 'var(--font-family-serif)',
          fontSize: 'clamp(1.35rem, 2.5vw, 2.1rem)',
          fontStyle: 'italic', lineHeight: 1.56,
          color: 'var(--rc-paper)',
          margin: '0 0 48px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.8s ease 100ms, transform 0.8s ease 100ms',
        }}>
          &ldquo;{MISSION_QUOTE}&rdquo;
        </blockquote>

        <div style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease 280ms',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
          }}>
            <div style={{
              width: '24px', height: '1px',
              background: 'rgba(255,255,255,0.2)',
            }} />
            <p style={{
              margin: 0,
              fontFamily: 'var(--font-family-mono)',
              fontSize: '10px', letterSpacing: '0.14em',
              color: 'var(--rc-muted-d)', textTransform: 'uppercase',
            }}>
              The RemConnect mission
            </p>
            <div style={{
              width: '24px', height: '1px',
              background: 'rgba(255,255,255,0.2)',
            }} />
          </div>
        </div>
      </div>
    </section>
  )
}
