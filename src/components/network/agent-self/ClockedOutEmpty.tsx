'use client';
import type { NetworkAgent } from '@/types/network';
import { NetIcons } from '@/components/network/ui/Icons';

const FEATURES = [
  { icon: <NetIcons.Activity width={16} height={16}/>, label: 'Real-time speed tests' },
  { icon: <NetIcons.Clock    width={16} height={16}/>, label: 'Shift time tracking'   },
  { icon: <NetIcons.Shield   width={16} height={16}/>, label: 'VPN & ISP monitoring'  },
  { icon: <NetIcons.Globe    width={16} height={16}/>, label: 'IP & ISP detection'    },
];

export function ClockedOutEmpty({ agent, onClockIn }: { agent: NetworkAgent; onClockIn: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 32, padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <svg viewBox="0 0 120 120" width="100" height="100">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--net-brand-100)" strokeWidth="8"/>
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--net-brand-accent)" strokeWidth="8"
            strokeDasharray="339" strokeDashoffset="339" strokeLinecap="round"
            style={{ animation: 'arc-draw 2s ease forwards' }}/>
          <line x1="60" y1="60" x2="60" y2="24" stroke="var(--net-brand-dark)" strokeWidth="3" strokeLinecap="round"
            style={{ transformOrigin: '60px 60px', animation: 'clock-spin 12s linear infinite' }}/>
          <line x1="60" y1="60" x2="84" y2="60" stroke="var(--net-brand-accent)" strokeWidth="2.5" strokeLinecap="round"
            style={{ transformOrigin: '60px 60px', animation: 'clock-spin 1s linear infinite' }}/>
          <circle cx="60" cy="60" r="4" fill="var(--net-brand-dark)"/>
        </svg>
      </div>

      <div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--net-text)', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Good day, {agent.name.split(' ')[0]}
        </h2>
        <p style={{ fontSize: 15, color: 'var(--net-text-muted)', maxWidth: 340, margin: '0 auto 4px' }}>
          You&apos;re not clocked in yet. Start your shift to begin network monitoring.
        </p>
        <p style={{ fontSize: 13, color: 'var(--net-text-dim)' }}>
          Scheduled shift: <strong style={{ color: 'var(--net-brand-accent)' }}>{agent.shift}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {FEATURES.map(f => (
          <div key={f.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 100, background: 'var(--net-brand-100)', color: 'var(--net-brand-mid)', border: '1px solid var(--net-brand-200)', fontSize: 12, fontWeight: 600 }}>
            {f.icon} {f.label}
          </div>
        ))}
      </div>

      <button
        onClick={onClockIn}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 32px', borderRadius: 8, background: 'var(--net-brand-accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 700, fontFamily: 'var(--net-font-sans)' }}
      >
        <NetIcons.ClockIn width={18} height={18}/> Clock In
      </button>

      <p style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>
        A speed test will run automatically when you clock in.
      </p>
    </div>
  );
}
