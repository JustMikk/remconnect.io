'use client';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetIcons } from '@/components/network/ui/Icons';
import { getIspStats } from '@/lib/network-data';

const STATS = getIspStats();

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, [string, string]> = {
    1: ['#FFD700', '#7D5800'],
    2: ['#C0C0C0', '#555'],
    3: ['#CD7F32', '#5C2D00'],
  };
  const [bg, text] = colors[rank] ?? ['var(--net-surface-2)', 'var(--net-text-dim)'];
  return (
    <div style={{ width: 28, height: 28, borderRadius: '50%', background: bg, color: text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
      {rank}
    </div>
  );
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 6, borderRadius: 3, background: 'var(--net-surface-2)', overflow: 'hidden', flex: 1 }}>
      <div style={{ height: '100%', borderRadius: 3, background: color, width: `${Math.min(100, pct)}%`, transition: 'width 0.6s ease' }}/>
    </div>
  );
}

export function IspView() {
  const avg = {
    down:    Math.round(STATS.reduce((s, i) => s + i.avgDown, 0)    / STATS.length * 10) / 10,
    latency: Math.round(STATS.reduce((s, i) => s + i.avgLatency, 0) / STATS.length),
    healthy: Math.round(STATS.reduce((s, i) => s + i.healthyPct, 0) / STATS.length),
    uptime:  Math.round(STATS.reduce((s, i) => s + i.uptime, 0)     / STATS.length * 10) / 10,
  };

  return (
    <>
      <NetTopbar title="ISP Performance" subtitle="Network quality ranked by healthy agent percentage"/>

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Avg Download',   value: `${avg.down} Mbps`,  icon: 'Download' as const, color: 'var(--net-brand-accent)' },
            { label: 'Avg Latency',    value: `${avg.latency} ms`, icon: 'Activity' as const, color: avg.latency > 150 ? 'var(--net-warning)' : 'var(--net-healthy)' },
            { label: 'Healthy Agents', value: `${avg.healthy}%`,   icon: 'Check'    as const, color: avg.healthy >= 70 ? 'var(--net-healthy)' : 'var(--net-warning)' },
            { label: 'Avg Uptime',     value: `${avg.uptime}%`,    icon: 'Shield'   as const, color: 'var(--net-healthy)' },
          ].map(c => {
            const Icon = NetIcons[c.icon];
            return (
              <div key={c.label} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--net-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon width={18} height={18} style={{ color: c.color }}/>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: c.color, letterSpacing: '-0.02em' }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--net-text-dim)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 32 }}>
          {STATS.map(isp => {
            const healthColor = isp.healthyPct >= 75 ? 'var(--net-healthy)' : isp.healthyPct >= 50 ? 'var(--net-warning)' : 'var(--net-critical)';
            return (
              <div key={isp.name} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <RankBadge rank={isp.rank}/>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--net-text)' }}>{isp.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--net-text-dim)', marginTop: 1 }}>{isp.agents} agents</div>
                    </div>
                  </div>
                  <div style={{ padding: '4px 10px', borderRadius: 99, background: healthColor + '22', color: healthColor, fontSize: 13, fontWeight: 700 }}>
                    {isp.healthyPct}% healthy
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Download', value: `${isp.avgDown} Mbps`,    pct: (isp.avgDown / 50) * 100,                              color: 'var(--net-brand-accent)' },
                    { label: 'Latency',  value: `${isp.avgLatency} ms`,   pct: Math.max(5, 100 - (isp.avgLatency / 500) * 100),       color: isp.avgLatency > 150 ? 'var(--net-warning)' : 'var(--net-healthy)' },
                    { label: 'Uptime',   value: `${isp.uptime}%`,         pct: isp.uptime,                                            color: 'var(--net-healthy)' },
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'var(--net-text-muted)', fontWeight: 600 }}>{m.label}</span>
                        <span style={{ fontSize: 12, color: 'var(--net-text)', fontWeight: 700, fontFamily: 'var(--net-font-mono)' }}>{m.value}</span>
                      </div>
                      <MiniBar pct={m.pct} color={m.color}/>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '1px solid var(--net-border)' }}>
                  {[{ label: 'Healthy', val: `${isp.healthyPct}%`, color: healthColor }, { label: 'Uptime', val: `${isp.uptime}%`, color: 'var(--net-text)' }, { label: 'Agents', val: String(isp.agents), color: 'var(--net-text)' }].map((s, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center', borderLeft: idx > 0 ? '1px solid var(--net-border)' : 'none', paddingLeft: idx > 0 ? 8 : 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: 'var(--net-text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="card table-scroll" style={{ padding: 0 }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--net-border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--net-text)', margin: 0 }}>ISP Comparison</h3>
          </div>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr><th>Rank</th><th>ISP</th><th>Agents</th><th>Avg Download</th><th>Avg Latency</th><th>Healthy %</th><th>Uptime</th></tr>
            </thead>
            <tbody>
              {STATS.map(isp => {
                const hc = isp.healthyPct >= 75 ? 'var(--net-healthy)' : isp.healthyPct >= 50 ? 'var(--net-warning)' : 'var(--net-critical)';
                const lc = isp.avgLatency <= 100 ? 'var(--net-healthy)' : isp.avgLatency <= 200 ? 'var(--net-warning)' : 'var(--net-critical)';
                return (
                  <tr key={isp.name}>
                    <td><RankBadge rank={isp.rank}/></td>
                    <td style={{ fontWeight: 600 }}>{isp.name}</td>
                    <td>{isp.agents}</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', color: 'var(--net-brand-accent)', fontWeight: 700 }}>{isp.avgDown} Mbps</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', color: lc, fontWeight: 700 }}>{isp.avgLatency} ms</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MiniBar pct={isp.healthyPct} color={hc}/>
                        <span style={{ fontSize: 12, fontWeight: 700, color: hc, fontFamily: 'var(--net-font-mono)', minWidth: 36 }}>{isp.healthyPct}%</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', fontWeight: 700, color: 'var(--net-healthy)' }}>{isp.uptime}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
