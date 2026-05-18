'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { NET_AGENTS, genHistory, genShiftHistory } from '@/lib/network-data';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { CapacityBar } from '@/components/network/ui/CapacityBar';
import { NetIcons } from '@/components/network/ui/Icons';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { HistoryTable } from './HistoryTable';
import { BigChart } from './BigChart';
import { LiveMetric } from './LiveMetric';
import { WorkHoursTab } from './WorkHoursTab';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ padding:'7px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, borderBottom:'1px solid var(--net-border)' }}>
      <span style={{ color:'var(--net-text-muted)' }}>{label}</span>
      <span style={{ color:'var(--net-text)', fontWeight:500 }}>{value}</span>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--net-border)', fontSize:13, fontWeight:600 }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Dot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:11.5, color:'var(--net-text-muted)' }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background:color }}/>
      {label}
    </span>
  );
}

const INCIDENTS_MOCK = [
  { time:'14:12',              type:'critical', title:'Packet loss 4.8% for 7 min',  note:'ISP routing recovered automatically', dur:'7m'  },
  { time:'11:38',              type:'warning',  title:'Latency 412ms peak',           note:'Self-resolved',                       dur:'3m'  },
  { time:'Yesterday · 17:21', type:'critical', title:'Complete disconnect · 18 min', note:'Agent restarted router',              dur:'18m' },
  { time:'Yesterday · 09:04', type:'warning',  title:'Upload < 2 Mbps',              note:'Self-resolved',                       dur:'12m' },
];

export function AgentDetail({ agentId }: { agentId: string }) {
  const router   = useRouter();
  const agent    = NET_AGENTS.find(a => a.id === agentId) ?? NET_AGENTS[0];
  const history  = useMemo(() => genHistory(agent.id),           [agent.id]);
  const sessions = useMemo(() => genShiftHistory(agent.id, 14),  [agent.id]);
  const [tab,    setTab]   = useState('overview');
  const [range,  setRange] = useState('24h');

  return (
    <>
      <NetTopbar
        crumbs={[
          { label:'Network Operations', onClick:() => router.push('/admin/network/dashboard') },
          { label:'Agents',             onClick:() => router.push('/admin/network/agents')    },
          { label: agent.id },
        ]}
        title={
          <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
            {agent.id}
            <span style={{ color:'var(--net-text-dim)', fontWeight:500, fontSize:16 }}>· {agent.name}</span>
            <NetworkStatusChip status={agent.status}/>
          </span>
        }
        subtitle={
          <span style={{ display:'inline-flex', gap:10, alignItems:'center' }}>
            <NetIcons.Pin width={12} height={12}/> {agent.location} · {agent.team} · {agent.isp} · Shift {agent.shift}
          </span>
        }
        actions={
          <>
            <button className="btn btn-secondary btn-sm"><NetIcons.Refresh width={13} height={13}/> Refresh</button>
            <button className="btn btn-secondary btn-sm"><NetIcons.Download width={13} height={13}/> Export</button>
            <button className="btn btn-primary btn-sm"><NetIcons.Zap width={13} height={13}/> Run test now</button>
          </>
        }
      />

      <div className="tab-strip">
        {[
          { id:'overview',   label:'Overview'   },
          { id:'history',    label:'History'    },
          { id:'work-hours', label:'Work hours' },
          { id:'incidents',  label:'Incidents'  },
          { id:'settings',   label:'Settings'   },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn${tab===t.id?' active':''}`}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding:'20px 28px 40px', display:'flex', flexDirection:'column', gap:20 }}>

        {tab === 'overview' && <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr) 1.6fr', gap:14 }}>
            <LiveMetric label="Download"    value={agent.download.toFixed(1)} unit="Mbps" plan={agent.planDown}   spark={agent.sparkDown}    color="var(--net-brand-accent)" threshold={15} goodWhen="higher"/>
            <LiveMetric label="Upload"      value={agent.upload.toFixed(1)}   unit="Mbps" plan={agent.planUp}     spark={agent.sparkUp}      color="var(--net-brand-mid)"    threshold={5}  goodWhen="higher"/>
            <LiveMetric label="Latency"     value={agent.latency}             unit="ms"                            spark={agent.sparkLatency}
              color={agent.latency>400?'var(--net-critical)':agent.latency>150?'var(--net-warning)':'var(--net-healthy)'}
              threshold={150} goodWhen="lower"/>
            <LiveMetric label="Packet loss" value={agent.loss.toFixed(2)}     unit="%"
              color={agent.loss>2?'var(--net-critical)':agent.loss>0.5?'var(--net-warning)':'var(--net-healthy)'}
              threshold={0.5} goodWhen="lower"/>
            <div className="card" style={{ padding:16, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)' }}>ISP capacity utilization</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, marginTop:6 }}>
                  <span style={{ fontSize:28, fontWeight:700, color:'var(--net-brand-accent)', letterSpacing:'-0.02em', fontFamily: 'var(--net-font-mono)' }}>{agent.ispCapacity}%</span>
                  <span style={{ fontSize:11, color:'var(--net-text-dim)' }}>of {agent.planDown} Mbps plan</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:10 }}>
                <CapacityBar label="Down" value={agent.download} plan={agent.planDown}/>
                <CapacityBar label="Up"   value={agent.upload}   plan={agent.planUp}/>
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:20 }}>
            <div className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:600 }}>Connection history</div>
                  <div style={{ fontSize:11.5, color:'var(--net-text-muted)', marginTop:2 }}>Thresholds shown as dashed bands</div>
                </div>
                <div style={{ display:'flex', background:'var(--net-surface-2)', padding:3, borderRadius:8 }}>
                  {['1h','6h','24h','7d','30d'].map(r => (
                    <button key={r} onClick={() => setRange(r)} style={{
                      padding:'4px 10px', fontSize:11.5, borderRadius:5, fontWeight:500,
                      color:range===r?'var(--net-text)':'var(--net-text-muted)',
                      background:range===r?'var(--net-surface)':'transparent',
                      border:'none', cursor:'pointer', fontFamily:'var(--net-font-sans)',
                    }}>{r}</button>
                  ))}
                </div>
              </div>
              <BigChart agent={agent}/>
              <div style={{ display:'flex', gap:18, marginTop:14, paddingTop:14, borderTop:'1px solid var(--net-border)' }}>
                <Dot color="var(--net-brand-accent)" label="Download"/>
                <Dot color="var(--net-brand-mid)"    label="Upload"/>
                <Dot color="var(--net-warning)"      label="Latency"/>
                <span style={{ color:'var(--net-text-dim)', marginLeft:'auto', fontSize:11.5 }}>Threshold bands: healthy · warning · critical</span>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <Card title="Agent info">
                <InfoRow label="Agent ID" value={agent.id}/>
                <InfoRow label="Full name" value={agent.name}/>
                <InfoRow label="Team"     value={agent.team}/>
                <InfoRow label="Location" value={<span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><NetIcons.Pin width={11} height={11}/>{agent.location}</span>}/>
                <InfoRow label="Shift"    value={agent.shift}/>
                <InfoRow label="Status"   value={<NetworkStatusChip status={agent.status} size="sm"/>}/>
              </Card>
              <Card title="Connection">
                <InfoRow label="ISP"        value={agent.isp}/>
                <InfoRow label="Plan"       value={`${agent.planDown} / ${agent.planUp} Mbps`}/>
                <InfoRow label="IP"         value={<span style={{ fontFamily: 'var(--net-font-mono)', fontSize:11 }}>{agent.ip}</span>}/>
                <InfoRow label="VPN"        value={agent.vpn ? <span style={{ color:'var(--net-warning)', fontWeight:600 }}>Detected</span> : <span style={{ color:'var(--net-healthy)', fontWeight:600 }}>None</span>}/>
                <InfoRow label="Last test"  value={agent.lastSeen===0?'just now':`${agent.lastSeen} min ago`}/>
                <InfoRow label="Tests today" value="96"/>
              </Card>
            </div>
          </div>

          <div className="card">
            <div style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--net-border)' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600 }}>Recent tests</div>
                <div style={{ fontSize:11.5, color:'var(--net-text-muted)' }}>Last {Math.min(12,history.length)} measurements</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setTab('history')}><NetIcons.ArrowRight width={12} height={12}/> View all</button>
            </div>
            <HistoryTable rows={history.slice(0,12)}/>
          </div>
        </>}

        {tab === 'history'    && <div className="card"><HistoryTable rows={history}/></div>}
        {tab === 'work-hours' && <WorkHoursTab agent={agent} sessions={sessions}/>}

        {tab === 'incidents' && (
          <div className="card">
            <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--net-border)', fontSize:14, fontWeight:600 }}>Incident log for {agent.id}</div>
            {INCIDENTS_MOCK.map((inc,idx) => {
              const color = inc.type==='critical'?'var(--net-critical)':'var(--net-warning)';
              return (
                <div key={idx} style={{ padding:'14px 20px', display:'flex', gap:14, alignItems:'center', borderBottom:idx<INCIDENTS_MOCK.length-1?'1px solid var(--net-border)':'none' }}>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:color, flexShrink:0 }}/>
                  <div style={{ fontFamily: 'var(--net-font-mono)', fontSize:11.5, color:'var(--net-text-dim)', width:140 }}>{inc.time}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{inc.title}</div>
                    <div style={{ fontSize:11.5, color:'var(--net-text-muted)', marginTop:2 }}>{inc.note}</div>
                  </div>
                  <div style={{ fontSize:11.5, color:'var(--net-text-dim)' }}>Duration <span style={{ fontFamily: 'var(--net-font-mono)', color:'var(--net-text)', fontWeight:600 }}>{inc.dur}</span></div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <Card title="Thresholds">
              <InfoRow label="Min download"  value="15 Mbps"/>
              <InfoRow label="Min upload"    value="5 Mbps"/>
              <InfoRow label="Max latency"   value="150 ms"/>
              <InfoRow label="Max loss"      value="0.5 %"/>
              <InfoRow label="Test interval" value="15 min"/>
            </Card>
            <Card title="Alerts">
              <InfoRow label="Slack channel"     value="#netops-alerts"/>
              <InfoRow label="Email on critical" value="ops@remconnect.io"/>
              <InfoRow label="Escalate after"    value="3 failed tests"/>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
