'use client';
import { useState } from 'react';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { NetIcons } from '@/components/network/ui/Icons';
import { NET_INCIDENTS, NET_AGENTS } from '@/lib/network-data';
import { networkStatusColor, networkStatusBg } from '@/lib/network-utils';
import type { NetworkStatus } from '@/types/network';

const EXTRA_INCIDENTS = [
  { id: 8,  agent: 'AGENT-011', type: 'warning'  as const, msg: 'Download degraded to 8.4 Mbps', time: '3h ago' },
  { id: 9,  agent: 'AGENT-005', type: 'critical' as const, msg: 'VPN tunnel dropped', time: '4h ago' },
  { id: 10, agent: 'AGENT-014', type: 'resolved' as const, msg: 'Latency normalized after ISP reboot', time: '5h ago' },
  { id: 11, agent: 'AGENT-002', type: 'warning'  as const, msg: 'Packet loss 0.9% · 20 min sustained', time: '6h ago' },
  { id: 12, agent: 'AGENT-018', type: 'critical' as const, msg: 'No test results for 45 min', time: '7h ago' },
  { id: 13, agent: 'AGENT-006', type: 'resolved' as const, msg: 'Upload restored after line reset', time: '9h ago' },
  { id: 14, agent: 'AGENT-020', type: 'warning'  as const, msg: 'Jitter 38ms — above threshold', time: '11h ago' },
  { id: 15, agent: 'AGENT-013', type: 'critical' as const, msg: 'Speedtest timeout × 3 consecutive', time: '14h ago' },
];

const ALL = [...NET_INCIDENTS, ...EXTRA_INCIDENTS];
type Filter = 'all' | 'critical' | 'warning' | 'resolved';

export function IncidentsView() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const visible = ALL.filter(inc => {
    if (filter !== 'all' && inc.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      const agentName = NET_AGENTS.find(a => a.id === inc.agent)?.name ?? '';
      return inc.agent.toLowerCase().includes(q) || agentName.toLowerCase().includes(q) || inc.msg.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all:      ALL.length,
    critical: ALL.filter(i => i.type === 'critical').length,
    warning:  ALL.filter(i => i.type === 'warning').length,
    resolved: ALL.filter(i => i.type === 'resolved').length,
  };

  return (
    <>
      <NetTopbar
        title="Incidents"
        subtitle={`${ALL.length} total incidents in the last 24 hours`}
        actions={
          <button className="btn btn-primary" style={{ gap: 6, fontSize: 13 }}>
            <NetIcons.Download width={14} height={14}/> Export
          </button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total',    value: ALL.length,       color: 'var(--net-brand-accent)' },
            { label: 'Critical', value: counts.critical,  color: 'var(--net-critical)'     },
            { label: 'Warning',  value: counts.warning,   color: 'var(--net-warning)'       },
            { label: 'Resolved', value: counts.resolved,  color: 'var(--net-healthy)'       },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: c.color, letterSpacing: '-0.03em' }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--net-text-muted)', marginTop: 4, fontWeight: 600 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '0 0 280px' }}>
            <NetIcons.Search width={14} height={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--net-text-dim)', pointerEvents: 'none' }}/>
            <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} placeholder="Search agent or message…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div className="tab-strip" style={{ padding: 3 }}>
            {(['all', 'critical', 'warning', 'resolved'] as Filter[]).map(f => (
              <button key={f} className={`tab-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span style={{ marginLeft: 5, fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 99, background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--net-surface-2)', color: filter === f ? '#fff' : 'var(--net-text-dim)' }}>{counts[f]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          {visible.length === 0 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', color: 'var(--net-text-dim)' }}>
              <NetIcons.Check width={32} height={32} style={{ margin: '0 auto 12px', opacity: 0.3 }}/>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No incidents match your filters</div>
            </div>
          ) : (
            visible.map((inc, i) => {
              const agent = NET_AGENTS.find(a => a.id === inc.agent);
              const color = networkStatusColor(inc.type as NetworkStatus | 'resolved');
              const bg    = networkStatusBg(inc.type as NetworkStatus | 'resolved');
              return (
                <div
                  key={inc.id}
                  style={{ display: 'grid', gridTemplateColumns: '4px 48px 1fr auto', gap: 0, alignItems: 'stretch', borderBottom: i < visible.length - 1 ? '1px solid var(--net-border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--net-surface-2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}
                >
                  <div style={{ background: color }}/>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <NetIcons.Incidents width={15} height={15} style={{ color }}/>
                    </div>
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--net-text)' }}>{agent?.name ?? inc.agent}</span>
                      <span style={{ fontSize: 11, color: 'var(--net-text-dim)', fontFamily: 'var(--net-font-mono)' }}>{inc.agent}</span>
                      <NetworkStatusChip status={inc.type as NetworkStatus | 'resolved'}/>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--net-text-muted)' }}>{inc.msg}</div>
                    {agent && (
                      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--net-text-dim)' }}>{agent.team}</span>
                        <span style={{ fontSize: 11, color: 'var(--net-text-dim)' }}>{agent.isp}</span>
                        <span style={{ fontSize: 11, color: 'var(--net-text-dim)' }}>{agent.location}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--net-text-dim)', whiteSpace: 'nowrap' }}>{inc.time}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
