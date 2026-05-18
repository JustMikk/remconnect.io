'use client';
import { useState, useMemo } from 'react';
import { NET_AGENTS, ISPS, buildTestLog } from '@/lib/network-data';
import { metricStatus, networkStatusColor, networkStatusBg } from '@/lib/network-utils';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetIcons } from '@/components/network/ui/Icons';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import type { TestLogRow, NetworkStatus } from '@/types/network';

const LOG = buildTestLog();

function SummaryStat({ label, value, unit, hint }: { label: string; value: string | number; unit?: string; hint?: string }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--net-brand-accent)', letterSpacing: '-0.02em', fontFamily: 'var(--net-font-mono)' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{unit}</span>}
      </div>
      {hint && <div style={{ fontSize: 11, color: 'var(--net-text-muted)', marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

function TrendChart({ trend }: { trend: Array<{ date: string; avgDown: number; avgUp: number; avgPing: number }> }) {
  if (!trend.length) return null;
  const w = 800, h = 160;
  const pad = { l: 36, r: 10, t: 10, b: 24 };
  const iW = w - pad.l - pad.r;
  const iH = h - pad.t - pad.b;

  const maxDown = Math.max(...trend.map(t => t.avgDown), 50) * 1.1;
  const maxPing  = Math.max(...trend.map(t => t.avgPing), 200) * 1.1;

  const pts = (series: number[], max: number) =>
    trend.map((_, i) => ({
      x: pad.l + (i / Math.max(1, trend.length - 1)) * iW,
      y: pad.t + (1 - series[i] / max) * iH,
    }));

  const line = (series: number[], max: number) =>
    pts(series, max).map((p, i) => `${i===0?'M':'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const downPts = pts(trend.map(t => t.avgDown), maxDown);
  const fillD = `${line(trend.map(t => t.avgDown), maxDown)} L ${downPts[downPts.length-1].x} ${h-pad.b} L ${downPts[0].x} ${h-pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display:'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="rptFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--net-brand-accent)" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="var(--net-brand-accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <line x1={pad.l} y1={pad.t+(1-25/maxDown)*iH} x2={w-pad.r} y2={pad.t+(1-25/maxDown)*iH} stroke="var(--net-healthy)" strokeDasharray="3 4" opacity="0.5" strokeWidth="1"/>
      {[0.25,0.5,0.75].map(f => (
        <line key={f} x1={pad.l} y1={pad.t+f*iH} x2={w-pad.r} y2={pad.t+f*iH} stroke="var(--net-border)" strokeWidth="1"/>
      ))}
      <path d={fillD} fill="url(#rptFill)"/>
      <path d={line(trend.map(t=>t.avgDown), maxDown)} fill="none" stroke="var(--net-brand-accent)" strokeWidth="2" strokeLinejoin="round"/>
      <path d={line(trend.map(t=>t.avgUp),   maxDown)} fill="none" stroke="var(--net-brand-mid)"    strokeWidth="1.6" strokeLinejoin="round" opacity="0.9"/>
      <path d={line(trend.map(t=>t.avgPing), maxPing)} fill="none" stroke="var(--net-warning)"       strokeWidth="1.4" strokeLinejoin="round" opacity="0.8"/>
      {trend.filter((_,i) => i % Math.ceil(trend.length/6) === 0 || i === trend.length-1).map((t,i) => {
        const idx = trend.indexOf(t);
        const x = pad.l + (idx / Math.max(1, trend.length-1)) * iW;
        return <text key={i} x={x} y={h-7} textAnchor="middle" fontSize="9" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{t.date.slice(5)}</text>;
      })}
      {[0,0.5,1].map(f => {
        const y = pad.t + (1-f)*iH;
        return <text key={f} x={pad.l-4} y={y+3} textAnchor="end" fontSize="9" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{Math.round(maxDown*f)}</text>;
      })}
    </svg>
  );
}

function ThresholdCell({ value, metric }: { value: number; metric: 'download'|'upload'|'ping'|'latency'|'jitter' }) {
  const st = metricStatus(metric, value);
  return (
    <span style={{ padding:'2px 8px', borderRadius:4, background: networkStatusBg(st as NetworkStatus), color: networkStatusColor(st as NetworkStatus), fontWeight:600, fontSize:12, fontFamily: 'var(--net-font-mono)' }}>{value}</span>
  );
}

export function ReportsView() {
  const [scope,          setScope]          = useState<'collective'|'individual'>('collective');
  const [agentFilter,    setAgentFilter]    = useState('all');
  const [dateFrom,       setDateFrom]       = useState('');
  const [dateTo,         setDateTo]         = useState('');
  const [ispFilter,      setIspFilter]      = useState('all');
  const [speedThreshold, setSpeedThreshold] = useState(0);
  const [sortBy,         setSortBy]         = useState<keyof TestLogRow>('ts');
  const [sortDir,        setSortDir]        = useState<'asc'|'desc'>('desc');
  const [page,           setPage]           = useState(0);
  const PAGE_SIZE = 50;

  const filtered = useMemo(() => {
    let rows = LOG;
    if (agentFilter !== 'all') rows = rows.filter(r => r.agentId === agentFilter);
    if (ispFilter   !== 'all') rows = rows.filter(r => r.isp     === ispFilter);
    if (dateFrom) rows = rows.filter(r => r.ts >= new Date(dateFrom).getTime());
    if (dateTo)   rows = rows.filter(r => r.ts <= new Date(dateTo).getTime() + 86399999);
    if (speedThreshold > 0) rows = rows.filter(r => r.download < speedThreshold);
    return [...rows].sort((a,b) => {
      const va = a[sortBy] as number, vb = b[sortBy] as number;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
  }, [agentFilter, ispFilter, dateFrom, dateTo, speedThreshold, sortBy, sortDir]);

  const stats = useMemo(() => ({
    tests:   filtered.length,
    avgDown: filtered.length ? (filtered.reduce((s,r)=>s+r.download,0)/filtered.length).toFixed(1) : '—',
    avgUp:   filtered.length ? (filtered.reduce((s,r)=>s+r.upload,0)/filtered.length).toFixed(1)   : '—',
    avgPing: filtered.length ? Math.round(filtered.reduce((s,r)=>s+r.ping,0)/filtered.length)       : '—',
    avgJitt: filtered.length ? Math.round(filtered.reduce((s,r)=>s+r.jitter,0)/filtered.length)     : '—',
    vpnPct:  filtered.length ? Math.round((filtered.filter(r=>r.vpn).length/filtered.length)*100)   : 0,
  }), [filtered]);

  const trend = useMemo(() => {
    const byDay: Record<string, TestLogRow[]> = {};
    filtered.forEach(r => {
      const d = new Date(r.ts).toISOString().slice(0,10);
      byDay[d] = byDay[d] ?? [];
      byDay[d].push(r);
    });
    return Object.entries(byDay).sort(([a],[b])=>a.localeCompare(b)).map(([date,rows])=>({
      date,
      avgDown: Math.round((rows.reduce((s,r)=>s+r.download,0)/rows.length)*10)/10,
      avgUp:   Math.round((rows.reduce((s,r)=>s+r.upload,0)/rows.length)*10)/10,
      avgPing: Math.round( rows.reduce((s,r)=>s+r.ping,0)/rows.length),
    }));
  }, [filtered]);

  const perAgent = useMemo(() => {
    const byAgent: Record<string, TestLogRow[]> = {};
    filtered.forEach(r => {
      byAgent[r.agentId] = byAgent[r.agentId] ?? [];
      byAgent[r.agentId].push(r);
    });
    return Object.entries(byAgent).map(([id, rows]) => ({
      id, name: rows[0].agentName, team: rows[0].team,
      tests:   rows.length,
      avgDown: Math.round((rows.reduce((s,r)=>s+r.download,0)/rows.length)*10)/10,
      avgUp:   Math.round((rows.reduce((s,r)=>s+r.upload,0)/rows.length)*10)/10,
      avgPing: Math.round( rows.reduce((s,r)=>s+r.ping,0)/rows.length),
    })).sort((a,b)=>a.id.localeCompare(b.id));
  }, [filtered]);

  function downloadCSV() {
    const headers = ['ID','Agent','Team','Timestamp','Download','Upload','Ping','Jitter','ISP','VPN','Type'];
    const rows = filtered.map(r => [
      r.id, r.agentName, r.team,
      new Date(r.ts).toISOString(),
      r.download, r.upload, r.ping, r.jitter, r.isp, r.vpn ? 'Yes' : 'No', r.type,
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'remconnect-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  function sort(col: keyof TestLogRow) {
    if (sortBy === col) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortBy(col); setSortDir('desc'); }
    setPage(0);
  }

  const paged = filtered.slice(page * PAGE_SIZE, (page+1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <>
      <NetTopbar
        title="Reports"
        subtitle="Fleet-wide network performance analytics"
        actions={
          <>
            <button className="btn btn-secondary btn-sm" onClick={downloadCSV}><NetIcons.Download width={13} height={13}/> Export CSV</button>
            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><NetIcons.Report width={13} height={13}/> Print PDF</button>
          </>
        }
      />

      <div style={{ padding:'20px 28px 40px', display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ display:'flex', gap:6 }}>
          {(['collective','individual'] as const).map(s => (
            <button key={s} onClick={() => setScope(s)} className="btn btn-sm" style={{
              background: scope===s ? 'var(--net-brand-100)' : 'var(--net-surface-2)',
              color:      scope===s ? 'var(--net-brand-mid)' : 'var(--net-text-muted)',
              border: '1px solid var(--net-border)',
            }}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>
          ))}
        </div>

        <div className="card" style={{ padding:16, display:'flex', gap:12, flexWrap:'wrap', alignItems:'flex-end' }}>
          {scope==='individual' && (
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>Agent</div>
              <select className="input" style={{ width:180 }} value={agentFilter} onChange={e=>setAgentFilter(e.target.value)}>
                <option value="all">All agents</option>
                {NET_AGENTS.map(a=><option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}
              </select>
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>From</div>
            <input type="date" className="input" style={{ width:150 }} value={dateFrom} onChange={e=>setDateFrom(e.target.value)}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>To</div>
            <input type="date" className="input" style={{ width:150 }} value={dateTo} onChange={e=>setDateTo(e.target.value)}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>ISP</div>
            <select className="input" style={{ width:160 }} value={ispFilter} onChange={e=>setIspFilter(e.target.value)}>
              <option value="all">All ISPs</option>
              {ISPS.map(i=><option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>Flag below (Mbps)</div>
            <input type="number" className="input" style={{ width:130 }} value={speedThreshold||''} placeholder="e.g. 15" onChange={e=>setSpeedThreshold(Number(e.target.value))} min={0}/>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => { setAgentFilter('all'); setDateFrom(''); setDateTo(''); setIspFilter('all'); setSpeedThreshold(0); }}>
            <NetIcons.Refresh width={13} height={13}/> Reset
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
          <SummaryStat label="Tests"      value={stats.tests}               hint={`${PAGE_SIZE} per page`}/>
          <SummaryStat label="Avg ↓"      value={stats.avgDown}  unit="Mbps"/>
          <SummaryStat label="Avg ↑"      value={stats.avgUp}    unit="Mbps"/>
          <SummaryStat label="Avg ping"   value={stats.avgPing}  unit="ms"/>
          <SummaryStat label="Avg jitter" value={stats.avgJitt}  unit="ms"/>
          <SummaryStat label="VPN usage"  value={`${stats.vpnPct}%`}        hint="of sessions"/>
        </div>

        {trend.length > 1 && (
          <div className="card" style={{ padding:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:600 }}>Daily trend</div>
                <div style={{ fontSize:11.5, color:'var(--net-text-muted)', marginTop:2 }}>Avg download, upload and ping per day</div>
              </div>
              <div style={{ display:'flex', gap:16, fontSize:11.5, alignItems:'center' }}>
                <span style={{ color:'var(--net-brand-accent)' }}>● Download</span>
                <span style={{ color:'var(--net-brand-mid)' }}>● Upload</span>
                <span style={{ color:'var(--net-warning)' }}>● Ping</span>
                <span style={{ color:'var(--net-healthy)', fontSize:10 }}>— 25 Mbps threshold</span>
              </div>
            </div>
            <TrendChart trend={trend}/>
          </div>
        )}

        {scope === 'collective' && (
          <div className="card">
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--net-border)', fontSize:14, fontWeight:600 }}>Per-agent summary</div>
            <div style={{ overflowX:'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {['Agent','Team','Tests','Avg ↓ Mbps','Avg ↑ Mbps','Avg ping ms'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {perAgent.map(a => (
                    <tr key={a.id}>
                      <td><span style={{ fontWeight:600, color:'var(--net-text)' }}>{a.id}</span> <span style={{ color:'var(--net-text-dim)', fontSize:11 }}>{a.name}</span></td>
                      <td>{a.team}</td>
                      <td style={{ fontFamily: 'var(--net-font-mono)' }}>{a.tests}</td>
                      <td><ThresholdCell value={a.avgDown} metric="download"/></td>
                      <td><ThresholdCell value={a.avgUp}   metric="upload"/></td>
                      <td><ThresholdCell value={a.avgPing} metric="ping"/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card">
          <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--net-border)' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>Raw test log</div>
              <div style={{ fontSize:11.5, color:'var(--net-text-muted)' }}>{filtered.length.toLocaleString()} records · showing {paged.length}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)} className="btn btn-secondary btn-sm">← Prev</button>
              <span style={{ fontSize:12, color:'var(--net-text-muted)' }}>Page {page+1}/{totalPages||1}</span>
              <button disabled={page>=totalPages-1} onClick={()=>setPage(p=>p+1)} className="btn btn-secondary btn-sm">Next →</button>
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  {(['ts','agentId','team','download','upload','ping','jitter','isp','vpn'] as const).map(col => {
                    const labels: Record<string, string> = { ts:'Time', agentId:'Agent', team:'Team', download:'↓ Mbps', upload:'↑ Mbps', ping:'Ping ms', jitter:'Jitter ms', isp:'ISP', vpn:'VPN' };
                    return (
                      <th key={col} onClick={() => sort(col)} style={{ cursor:'pointer' }}>
                        {labels[col]}{sortBy===col ? (sortDir==='asc'?' ↑':' ↓') : ''}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paged.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--net-font-mono)', fontSize:11 }}>{new Date(r.ts).toLocaleString('en-US',{month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:true})}</td>
                    <td style={{ fontWeight:600, color:'var(--net-text)', fontSize:12 }}>{r.agentId}</td>
                    <td style={{ fontSize:11, color:'var(--net-text-muted)' }}>{r.team}</td>
                    <td><ThresholdCell value={r.download} metric="download"/></td>
                    <td><ThresholdCell value={r.upload}   metric="upload"/></td>
                    <td><ThresholdCell value={r.ping}     metric="ping"/></td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', color:'var(--net-text-muted)' }}>{r.jitter}</td>
                    <td style={{ fontSize:11 }}>{r.isp}</td>
                    <td>
                      {r.vpn
                        ? <span style={{ color:'var(--net-warning)', fontWeight:600, fontSize:11 }}>VPN</span>
                        : <span style={{ color:'var(--net-text-dim)', fontSize:11 }}>None</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
