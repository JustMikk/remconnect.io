'use client';
import { NetSparkline } from '@/components/network/ui/Sparkline';
import { CapacityBar } from '@/components/network/ui/CapacityBar';

interface Props {
  label: string;
  value: string | number;
  unit: string;
  plan?: number;
  spark?: number[];
  color?: string;
  threshold?: number;
  goodWhen?: 'higher' | 'lower';
}

export function LiveMetric({ label, value, unit, plan, spark, color = 'var(--net-brand-accent)', threshold, goodWhen }: Props) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
        <span style={{ fontSize: 30, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--net-font-mono)' }}>{value}</span>
        <span style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{unit}</span>
      </div>
      {plan != null && <div style={{ fontSize: 11, color: 'var(--net-text-dim)', marginTop: 2 }}>Plan {plan} {unit}</div>}
      {plan == null && threshold != null && (
        <div style={{ fontSize: 11, color: 'var(--net-text-dim)', marginTop: 2 }}>
          Threshold {goodWhen === 'lower' ? '<' : '>'} {threshold} {unit}
        </div>
      )}
      {spark && spark.length > 1 && (
        <div style={{ marginTop: 8, height: 32 }}>
          <NetSparkline data={spark} color={color} height={32} threshold={threshold} showDots/>
        </div>
      )}
      {plan != null && (
        <div style={{ marginTop: 8 }}>
          <CapacityBar label="" value={Number(value)} plan={plan}/>
        </div>
      )}
    </div>
  );
}
