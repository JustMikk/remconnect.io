'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { NetIcons } from '@/components/network/ui/Icons';
import { NET_AGENTS, TEAMS, ISPS } from '@/lib/network-data';
import type { NetworkStatus } from '@/types/network';

type SortKey = 'name' | 'download' | 'upload' | 'latency' | 'status';

export function AgentsView() {
  const router = useRouter();
  const [search, setSearch]             = useState('');
  const [teamFilter, setTeamFilter]     = useState('all');
  const [ispFilter, setIspFilter]       = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | NetworkStatus>('all');
  const [sort, setSort]                 = useState<SortKey>('name');
  const [sortAsc, setSortAsc]           = useState(true);

  function handleSort(key: SortKey) {
    if (sort === key) setSortAsc(a => !a);
    else { setSort(key); setSortAsc(true); }
  }

  const filtered = NET_AGENTS
    .filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (teamFilter !== 'all' && a.team !== teamFilter) return false;
      if (ispFilter  !== 'all' && a.isp  !== ispFilter)  return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      let diff = 0;
      if (sort === 'name')     diff = a.name.localeCompare(b.name);
      else if (sort === 'download') diff = a.download - b.download;
      else if (sort === 'upload')   diff = a.upload   - b.upload;
      else if (sort === 'latency')  diff = a.latency  - b.latency;
      else if (sort === 'status') {
        const order = { critical: 0, warning: 1, healthy: 2 };
        diff = order[a.status] - order[b.status];
      }
      return sortAsc ? diff : -diff;
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sort !== col) return <NetIcons.ChevronDown width={12} height={12} style={{ opacity: 0.3 }}/>;
    return sortAsc
      ? <NetIcons.ChevronDown width={12} height={12} style={{ transform: 'rotate(180deg)', color: 'var(--net-brand-accent)' }}/>
      : <NetIcons.ChevronDown width={12} height={12} style={{ color: 'var(--net-brand-accent)' }}/>;
  }

  const counts = {
    healthy:  NET_AGENTS.filter(a => a.status === 'healthy').length,
    warning:  NET_AGENTS.filter(a => a.status === 'warning').length,
    critical: NET_AGENTS.filter(a => a.status === 'critical').length,
  };

  return (
    <>
      <NetTopbar
        title="Agents"
        subtitle={`${NET_AGENTS.length} agents · ${NET_AGENTS.filter(a => a.online).length} online now`}
      />

      <div style={{ padding: '24px 32px' }}>
        <div className="kpi-grid" style={{ marginBottom: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Agents', value: NET_AGENTS.length, color: 'var(--net-brand-accent)' },
            { label: 'Healthy',      value: counts.healthy,    color: 'var(--net-healthy)'       },
            { label: 'Warning',      value: counts.warning,    color: 'var(--net-warning)'        },
            { label: 'Critical',     value: counts.critical,   color: 'var(--net-critical)'       },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: '18px 22px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, letterSpacing: '-0.03em' }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--net-text-muted)', marginTop: 2, fontWeight: 600 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '0 0 240px' }}>
            <NetIcons.Search width={14} height={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--net-text-dim)', pointerEvents: 'none' }}/>
            <input className="input" style={{ paddingLeft: 32, fontSize: 13 }} placeholder="Search agents…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <select className="input" style={{ width: 'auto' }} value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
            <option value="all">All Teams</option>
            {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="input" style={{ width: 'auto' }} value={ispFilter} onChange={e => setIspFilter(e.target.value)}>
            <option value="all">All ISPs</option>
            {ISPS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <div className="tab-strip" style={{ padding: 3 }}>
            {(['all', 'healthy', 'warning', 'critical'] as const).map(s => (
              <button key={s} className={`tab-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--net-text-dim)' }}>{filtered.length} agents</span>
        </div>

        <div className="card table-scroll" style={{ padding: 0 }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>
                  <button onClick={() => handleSort('name')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--net-font-sans)', fontSize: 11, fontWeight: 700, color: 'inherit', padding: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Agent <SortIcon col="name"/>
                  </button>
                </th>
                <th>Status</th><th>Team</th><th>ISP</th><th>Location</th>
                <th><button onClick={() => handleSort('download')} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--net-font-sans)', fontSize: 11, fontWeight: 700, color: 'inherit', padding: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>DL <SortIcon col="download"/></button></th>
                <th><button onClick={() => handleSort('upload')}   style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--net-font-sans)', fontSize: 11, fontWeight: 700, color: 'inherit', padding: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>UL <SortIcon col="upload"/></button></th>
                <th><button onClick={() => handleSort('latency')}  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--net-font-sans)', fontSize: 11, fontWeight: 700, color: 'inherit', padding: 0, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ping <SortIcon col="latency"/></button></th>
                <th>Shift</th><th>Last seen</th><th/>
              </tr>
            </thead>
            <tbody>
              {filtered.map(agent => (
                <tr key={agent.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/admin/network/agents/${agent.id}`)}>
                  <td style={{ paddingLeft: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: agent.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                          {agent.name.charAt(0)}
                        </div>
                        {agent.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: 'var(--net-healthy)', border: '2px solid var(--net-surface)' }}/>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--net-text)' }}>{agent.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--net-text-dim)', fontFamily: 'var(--net-font-mono)' }}>{agent.id}</div>
                      </div>
                    </div>
                  </td>
                  <td><NetworkStatusChip status={agent.status}/></td>
                  <td style={{ color: 'var(--net-text-muted)', fontSize: 12 }}>{agent.team}</td>
                  <td style={{ color: 'var(--net-text-muted)', fontSize: 12 }}>{agent.isp}</td>
                  <td style={{ color: 'var(--net-text-muted)', fontSize: 12 }}>{agent.location}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--net-font-mono)', fontSize: 12, fontWeight: 700, color: agent.download >= 25 ? 'var(--net-healthy)' : agent.download >= 15 ? 'var(--net-warning)' : 'var(--net-critical)' }}>{agent.download}</span>
                    <span style={{ fontSize: 10, color: 'var(--net-text-dim)', marginLeft: 2 }}>Mbps</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--net-font-mono)', fontSize: 12, fontWeight: 700, color: agent.upload >= 15 ? 'var(--net-healthy)' : agent.upload >= 10 ? 'var(--net-warning)' : 'var(--net-critical)' }}>{agent.upload}</span>
                    <span style={{ fontSize: 10, color: 'var(--net-text-dim)', marginLeft: 2 }}>Mbps</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--net-font-mono)', fontSize: 12, fontWeight: 700, color: agent.latency <= 100 ? 'var(--net-healthy)' : agent.latency <= 200 ? 'var(--net-warning)' : 'var(--net-critical)' }}>{agent.latency}</span>
                    <span style={{ fontSize: 10, color: 'var(--net-text-dim)', marginLeft: 2 }}>ms</span>
                  </td>
                  <td style={{ fontFamily: 'var(--net-font-mono)', fontSize: 11, color: 'var(--net-text-muted)' }}>{agent.shift}</td>
                  <td style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{agent.online ? 'Now' : `${agent.lastSeen}m ago`}</td>
                  <td>
                    <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={e => { e.stopPropagation(); router.push(`/admin/network/agents/${agent.id}`); }}>
                      <NetIcons.ChevronRight width={14} height={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--net-text-dim)' }}>
              <NetIcons.Agents width={28} height={28} style={{ margin: '0 auto 10px', opacity: 0.3 }}/>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No agents match your filters</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
