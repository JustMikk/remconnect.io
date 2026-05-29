'use client'
import { useInView, useCounter } from './useLandingHooks'

const STATS = [
  { value: 100, suffix: '+', label: 'Professionals placed' },
  { value: 15, suffix: '+', label: 'Global client companies' },
  { value: 0, suffix: ' fees ever', label: 'For candidates' },
  { value: 6, suffix: ' weeks', prefix: '2–', label: 'Average placement time' },
]

function StatItem({
  value, suffix, prefix, label, active, index,
}: {
  value: number; suffix: string; prefix?: string; label: string; active: boolean; index: number
}) {
  const count = useCounter(value, active, 1800)
  return (
    <div style={{
      textAlign: 'center', padding: '8px 24px',
      borderRight: index < 3 ? '1px solid var(--rc-line)' : 'none',
      opacity: active ? 1 : 0,
      transform: active ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${index * 100}ms, transform 0.65s ease ${index * 100}ms`,
    }}>
      <div style={{
        fontFamily: 'var(--font-family-display)',
        fontWeight: 800,
        fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
        color: 'var(--rc-ink)',
        lineHeight: 1,
        letterSpacing: '-0.025em',
      }}>
        {prefix}{count}{suffix}
      </div>
      <div style={{
        marginTop: '8px', fontSize: '12px',
        color: 'var(--rc-muted)', fontWeight: 500,
        letterSpacing: '0.02em',
      }}>
        {label}
      </div>
    </div>
  )
}

export default function StatsBar() {
  const { ref, visible } = useInView(0.15)
  return (
    <section
      ref={ref}
      style={{
        background: 'var(--rc-paper-2)',
        borderTop: '1px solid var(--rc-line)',
        borderBottom: '1px solid var(--rc-line)',
        padding: '64px 48px',
      }}
    >
      <div
        className="l-stats-grid"
        style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          alignItems: 'center',
        }}
      >
        {STATS.map((s, i) => (
          <StatItem key={i} {...s} active={visible} index={i} />
        ))}
      </div>
    </section>
  )
}
