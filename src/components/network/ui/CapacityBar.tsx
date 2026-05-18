'use client';

interface CapacityBarProps {
  label: string;
  value: number;
  plan: number;
  color?: string;
}

export function CapacityBar({ label, value, plan, color }: CapacityBarProps) {
  const pct  = Math.min(100, (value / plan) * 100);
  const auto = pct >= 85 ? 'var(--net-critical)' : pct >= 60 ? 'var(--net-warning)' : 'var(--net-brand-accent)';
  const c    = color ?? auto;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: 'var(--net-text-muted)' }}>{label}</span>
        <span style={{ color: 'var(--net-text)', fontWeight: 600 }}>{value} / {plan} Mbps</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--net-surface-3)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 999, transition: 'width 0.4s ease' }}/>
      </div>
    </div>
  );
}
