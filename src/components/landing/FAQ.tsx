'use client'
import { useState } from 'react'
import { FAQS } from '@/lib/landing-data'
import { useInView } from './useLandingHooks'

function FAQItem({
  q, a, open, onToggle,
}: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex',
          justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '24px 0', background: 'none', border: 'none',
          cursor: 'pointer', gap: '24px', textAlign: 'left',
        }}
      >
        <span style={{
          fontWeight: 600, fontSize: '15px',
          color: open ? 'var(--rc-paper)' : 'var(--rc-muted-d)',
          lineHeight: 1.45, transition: 'color 0.2s',
          fontFamily: 'var(--font-family-sans)',
        }}>
          {q}
        </span>
        <span style={{
          width: '22px', height: '22px', flexShrink: 0, marginTop: '1px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '50%',
          border: `1px solid ${open ? 'var(--rc-blue)' : 'rgba(255,255,255,0.14)'}`,
          color: open ? 'var(--rc-blue)' : 'var(--rc-muted-d)',
          fontSize: '16px', lineHeight: 1,
          transition: 'border-color 0.2s, color 0.2s, transform 0.25s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>

      <div style={{
        maxHeight: open ? '600px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <p style={{
          fontSize: '14px', lineHeight: 1.75,
          color: 'var(--rc-muted-d)',
          padding: '0 48px 24px 0',
          margin: 0,
        }}>
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { ref, visible } = useInView()
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <section
      id="faq"
      ref={ref}
      className="l-section-pad"
      style={{
        background: 'var(--rc-ink-2)',
        padding: '112px 48px',
      }}
    >
      <div
        className="l-faq-grid"
        style={{
          maxWidth: '1280px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '300px 1fr',
          gap: '88px',
          alignItems: 'start',
        }}
      >
        {/* Left sticky heading */}
        <div style={{
          position: 'sticky', top: '96px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.65s ease, transform 0.65s ease',
        }}>
          <p style={{
            fontFamily: 'var(--font-family-mono)',
            fontSize: '10px', letterSpacing: '0.15em',
            color: 'var(--rc-blue)', textTransform: 'uppercase',
            margin: '0 0 14px',
          }}>
            FAQ
          </p>
          <h2 style={{
            fontFamily: 'var(--font-family-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.9rem, 2.8vw, 2.6rem)',
            color: 'var(--rc-paper)', letterSpacing: '-0.025em',
            lineHeight: 1.1, margin: '0 0 16px',
          }}>
            Common<br />
            <em style={{
              fontFamily: 'var(--font-family-serif)',
              fontStyle: 'italic', fontWeight: 400,
              color: 'var(--rc-blue-soft)',
            }}>questions</em>
          </h2>
          <p style={{
            fontSize: '14px', color: 'var(--rc-muted-d)',
            lineHeight: 1.68, margin: '0 0 28px',
          }}>
            Everything you need to know about applying, working, and getting paid.
          </p>
          <a
            href="mailto:bezamariam@remconnect.io"
            style={{
              fontSize: '13px', color: 'var(--rc-blue-soft)',
              textDecoration: 'none',
              paddingBottom: '1px',
              borderBottom: '1px solid rgba(124,179,245,0.3)',
              transition: 'color 0.15s',
            }}
          >
            Still have questions? Email us →
          </a>
        </div>

        {/* Right: accordion */}
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.65s ease 120ms, transform 0.65s ease 120ms',
        }}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              q={faq.q}
              a={faq.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
