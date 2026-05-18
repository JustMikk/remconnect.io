'use client';
import { useState, useMemo, useEffect } from 'react';
import { NET_AGENTS, TEAMS, LOCATIONS, ISPS } from '@/lib/network-data';
import type { NetworkAgent } from '@/types/network';
import { NetworkAgentCard } from './AgentCard';
import { KpiCard } from './KpiCard';
import { FleetTrendCard } from './FleetTrendCard';
import { IncidentsFeed } from './IncidentsFeed';
import { IspRanking } from './IspRanking';
import { TodayVsYesterday } from './TodayVsYesterday';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { LivePill } from '@/components/network/ui/LivePill';
import { NetIcons } from '@/components/network/ui/Icons';

type GroupBy   = 'none' | 'team' | 'location' | 'isp';
type SortBy    = 'id' | 'download' | 'latency' | 'status';
type FilterBy  = 'all' | 'healthy' | 'warning' | 'critical';

export function NetworkDashboard() {
  const [search,  setSearch]  = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [sortBy,  setSortBy]  = useState<SortBy>('status');
  const [filter,  setFilter]  = useState<FilterBy>('all');
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  const agents = useMemo(() =>
    NET_AGENTS.map(a => ({
      ...a,
      download: Math.max(1, a.download + Math.sin(tick * 0.7 + a.id.charCodeAt(6)) * 1.5),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tick]
  );

  const filtered = useMemo(() => {
    let list = [...agents];
    if (search) list = list.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.isp.toLowerCase().includes(search.toLowerCase())
    );
    if (filter !== 'all') list = list.filter(a => a.status === filter);
    const order: Record<string, number> = { critical: 0, warning: 1, healthy: 2 };
    list.sort((a, b) => {
      if (sortBy === 'download') return b.download - a.download;
      if (sortBy === 'latency')  return a.latency  - b.latency;
      if (sortBy === 'status')   return (order[a.status] ?? 3) - (order[b.status] ?? 3);
      return a.id.localeCompare(b.id);
    });
    return list;
  }, [agents, search, filter, sortBy]);

  const healthy  = agents.filter(a => a.status === 'healthy').length;
  const warning  = agents.filter(a => a.status === 'warning').length;
  const critical = agents.filter(a => a.status === 'critical').length;
  const avgDown  = (agents.reduce((s, a) => s + a.download, 0) / agents.length).toFixed(1);

  function renderGrid(list: NetworkAgent[]) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
        {list.map(a => <NetworkAgentCard key={a.id} agent={a}/>)}
      </div>
    );
  }

  function renderGrouped() {
    const keys = groupBy === 'team' ? TEAMS : groupBy === 'location' ? LOCATIONS : ISPS;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {keys.map(key => {
          const group = filtered.filter(a => a[groupBy as 'team' | 'location' | 'isp'] === key);
          if (!group.length) return null;
          return (
            <div key={key}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {key}
                <span style={{ background: 'var(--net-surface-2)', border: '1px solid var(--net-border)', borderRadius: 100, padding: '1px 8px', fontSize: 10, color: 'var(--net-text-muted)' }}>{group.length}</span>
              </div>
              {renderGrid(group)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <NetTopbar
        title="Network Operations"
        subtitle={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LivePill/> {agents.filter(a => a.online).length} agents online
          </span>
        }
        actions={
          <>
            <button className="btn btn-secondary btn-sm"><NetIcons.Download width={13} height={13}/> Export</button>
            <button className="btn btn-primary btn-sm"><NetIcons.Zap width={13} height={13}/> Run fleet test</button>
          </>
        }
      />

      <div style={{ padding: '20px 28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="kpi-strip">
          <KpiCard label="Total agents" value={agents.length}/>
          <KpiCard label="Healthy"  value={healthy}  tone="healthy"  dot/>
          <KpiCard label="Warning"  value={warning}  tone="warning"  dot/>
          <KpiCard label="Critical" value={critical} tone="critical" dot sub={critical > 0 ? 'Needs attention' : 'All clear'}/>
          <KpiCard label="Avg download" value={avgDown} unit="Mbps" tone="brand"/>
          <FleetTrendCard agents={agents}/>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 300 }}>
            <NetIcons.Search width={14} height={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--net-text-dim)', pointerEvents: 'none' }}/>
            <input className="input" placeholder="Search agents, ISP…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32 }}/>
          </div>

          <div style={{ display: 'flex', gap: 5 }}>
            {(['all', 'healthy', 'warning', 'critical'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className="btn btn-sm" style={{
                background: filter === f
                  ? f === 'all'     ? 'var(--net-brand-100)'   : f === 'healthy' ? 'var(--net-healthy-bg)'
                  : f === 'warning' ? 'var(--net-warning-bg)'  : 'var(--net-critical-bg)'
                  : 'var(--net-surface-2)',
                color: filter === f
                  ? f === 'all'     ? 'var(--net-brand-mid)'   : f === 'healthy' ? 'var(--net-healthy)'
                  : f === 'warning' ? 'var(--net-warning)'     : 'var(--net-critical)'
                  : 'var(--net-text-muted)',
                border: '1px solid var(--net-border)',
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <select className="input" style={{ width: 'auto', paddingRight: 28 }} value={groupBy} onChange={e => setGroupBy(e.target.value as GroupBy)}>
              <option value="none">No grouping</option>
              <option value="team">Group: Team</option>
              <option value="location">Group: Location</option>
              <option value="isp">Group: ISP</option>
            </select>
            <select className="input" style={{ width: 'auto', paddingRight: 28 }} value={sortBy} onChange={e => setSortBy(e.target.value as SortBy)}>
              <option value="status">Sort: Status</option>
              <option value="download">Sort: Download</option>
              <option value="latency">Sort: Latency</option>
              <option value="id">Sort: ID</option>
            </select>
          </div>
        </div>

        <div className="dash-layout">
          <div style={{ minWidth: 0 }}>
            {filtered.length === 0
              ? <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--net-text-dim)' }}>No agents match your filter.</div>
              : groupBy === 'none' ? renderGrid(filtered) : renderGrouped()
            }
          </div>
          <div className="dash-sidebar">
            <IncidentsFeed/>
            <IspRanking/>
            <TodayVsYesterday/>
          </div>
        </div>
      </div>
    </>
  );
}
