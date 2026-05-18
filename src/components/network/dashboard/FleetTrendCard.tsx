'use client';
import type { NetworkAgent } from '@/types/network';

export function FleetTrendCard({ agents }: { agents: NetworkAgent[] }) {
  const healthy  = agents.filter(a => a.status === 'healthy').length;
  const warning  = agents.filter(a => a.status === 'warning').length;
  const critical = agents.filter(a => a.status === 'critical').length;
  const total    = agents.length;

  const bars = Array.from({ length: 24 }, (_, i) => {
    const v = Math.sin(i / 3) * 0.1;
    return {
      h: Math.max(0, Math.round((healthy  / total + v) * total)),
      w: Math.max(0, Math.round((warning  / total - v * 0.5) * total)),
      c: Math.max(0, Math.round((critical / total) * total)),
    };
  });

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="label" style={{ marginBottom: 10 }}>Fleet trend (24h)</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 44 }}>
        {bars.map((b, i) => {
          const sum = b.h + b.w + b.c || 1;
          return (
            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: 2, overflow: 'hidden', gap: 1 }}>
              <div style={{ width: '100%', height: `${(b.c/sum)*100}%`, background: 'var(--net-critical)', minHeight: b.c > 0 ? 2 : 0 }}/>
              <div style={{ width: '100%', height: `${(b.w/sum)*100}%`, background: 'var(--net-warning)',  minHeight: b.w > 0 ? 2 : 0 }}/>
              <div style={{ width: '100%', height: `${(b.h/sum)*100}%`, background: 'var(--net-brand-400)', minHeight: 2 }}/>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, marginTop: 8 }}>
        <span style={{ color: 'var(--net-healthy)'  }}>● {healthy} healthy</span>
        <span style={{ color: 'var(--net-warning)'  }}>● {warning} warning</span>
        <span style={{ color: 'var(--net-critical)' }}>● {critical} critical</span>
      </div>
    </div>
  );
}
