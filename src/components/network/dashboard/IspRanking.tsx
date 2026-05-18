'use client';
import { getIspStats } from '@/lib/network-data';

export function IspRanking() {
  const isps = getIspStats();
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--net-border)', fontSize: 13, fontWeight: 700 }}>ISP ranking</div>
      {isps.map((isp, i) => (
        <div key={isp.name} style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: i < isps.length - 1 ? '1px solid var(--net-border)' : 'none' }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700,
            background: i === 0 ? 'var(--net-brand-100)' : 'var(--net-surface-2)',
            color:      i === 0 ? 'var(--net-brand-mid)' : 'var(--net-text-dim)',
          }}>#{isp.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isp.name}</div>
            <div style={{ marginTop: 3, height: 3, borderRadius: 999, background: 'var(--net-surface-3)' }}>
              <div style={{ height: '100%', borderRadius: 999, width: `${isp.healthyPct}%`, background: isp.healthyPct >= 80 ? 'var(--net-healthy)' : isp.healthyPct >= 60 ? 'var(--net-warning)' : 'var(--net-critical)' }}/>
            </div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, fontVariantNumeric: 'tabular-nums', color: isp.healthyPct >= 80 ? 'var(--net-healthy)' : isp.healthyPct >= 60 ? 'var(--net-warning)' : 'var(--net-critical)' }}>
            {isp.healthyPct}%
          </span>
        </div>
      ))}
    </div>
  );
}
