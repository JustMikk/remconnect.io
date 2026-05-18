'use client';
import { useMemo } from 'react';
import { NET_AGENTS } from '@/lib/network-data';

function avg(arr: number[]) { return arr.reduce((a, b) => a + b, 0) / arr.length; }

function Row({ label, today, yest, unit, goodWhen }: { label: string; today: number; yest: number; unit: string; goodWhen: 'higher' | 'lower' }) {
  const diff   = today - yest;
  const pct    = Math.abs(diff / yest * 100).toFixed(1);
  const better = goodWhen === 'higher' ? diff > 0 : diff < 0;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--net-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--net-text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>{today.toFixed(1)} {unit}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: better ? 'var(--net-healthy)' : 'var(--net-warning)' }}>
          {diff > 0 ? '↑' : '↓'}{pct}%
        </span>
      </div>
    </div>
  );
}

export function TodayVsYesterday() {
  const todayDown  = useMemo(() => avg(NET_AGENTS.map(a => a.download)), []);
  const todayLat   = useMemo(() => avg(NET_AGENTS.map(a => a.latency)),  []);
  const yesterDown = todayDown * 0.95;
  const yesterLat  = todayLat  * 0.97;

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Today vs yesterday</div>
      <Row label="Avg download" today={todayDown} yest={yesterDown} unit="Mbps" goodWhen="higher"/>
      <Row label="Avg latency"  today={todayLat}  yest={yesterLat}  unit="ms"   goodWhen="lower"/>
      <div style={{ marginTop: 8, fontSize: 11, color: 'var(--net-text-dim)', textAlign: 'center' }}>Fleet-wide daily averages</div>
    </div>
  );
}
