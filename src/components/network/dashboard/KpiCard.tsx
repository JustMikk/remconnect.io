'use client';
import type { NetworkStatus } from '@/types/network';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  tone?: NetworkStatus | 'brand' | 'default';
  sub?: string;
  dot?: boolean;
}

const TONES: Record<string, { color: string }> = {
  healthy:  { color: 'var(--net-healthy)'  },
  warning:  { color: 'var(--net-warning)'  },
  critical: { color: 'var(--net-critical)' },
  brand:    { color: 'var(--net-brand-600)' },
  default:  { color: 'var(--net-text)'     },
};

export function KpiCard({ label, value, unit, tone = 'default', sub, dot }: KpiCardProps) {
  const { color } = TONES[tone] ?? TONES.default;
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--net-text-dim)', marginBottom: 8 }}>
        {dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }}/>}
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--net-text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
