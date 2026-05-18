'use client';
import type { NetworkAgent, ShiftSession } from '@/types/network';
import { NetIcons } from '@/components/network/ui/Icons';

function NetMetric({ label, value, unit, tone = 'default' }: { label: string; value: string | number; unit?: string; tone?: 'default'|'brand'|'healthy'|'warning' }) {
  const colors = { default: 'var(--net-text)', brand: 'var(--net-brand-accent)', healthy: 'var(--net-healthy)', warning: 'var(--net-warning)' };
  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, color: 'var(--net-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: colors[tone], letterSpacing: '-0.02em', lineHeight: 1, fontFamily: 'var(--net-font-mono)' }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{unit}</span>}
      </div>
    </div>
  );
}

function TimelineBar({ startPct, endPct }: { startPct: number; endPct: number }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: 24 }}>
      <div style={{ position:'absolute', left:0, right:0, top:10, height:4, borderRadius:999, background:'var(--net-surface-2)' }}/>
      {[0,0.25,0.5,0.75,1].map(p => (
        <div key={p} style={{ position:'absolute', left:`${p*100}%`, top:7, height:10, width:1, background:'var(--net-border)', opacity:0.6 }}/>
      ))}
      <div style={{
        position:'absolute', left:`${startPct*100}%`,
        width:`${(endPct-startPct)*100}%`,
        top:8, height:8,
        background:'linear-gradient(90deg, var(--net-brand-100) 0%, var(--net-brand-accent) 60%, var(--net-brand-mid) 100%)',
        borderRadius:999,
      }}/>
    </div>
  );
}

export function WorkHoursTab({ agent, sessions }: { agent: NetworkAgent; sessions: ShiftSession[] }) {
  const sorted   = [...sessions].sort((a, b) => b.clockIn.getTime() - a.clockIn.getTime());
  const totalMs  = sorted.reduce((s, x) => s + x.workedMs, 0);
  const activeMs = sorted.reduce((s, x) => s + x.activeMs, 0);
  const breakMin = sorted.reduce((s, x) => s + x.breakMin, 0);
  const totalH   = Math.floor(totalMs / 3600000);
  const totalM   = Math.floor((totalMs / 60000) % 60);
  const activeH  = Math.floor(activeMs / 3600000);
  const last7    = sorted.slice(0, 7).reverse();
  const maxH     = Math.max(...last7.map(s => s.workedMs / 3600000), 9);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr) 1.4fr', gap:14 }}>
        <NetMetric label="Sessions"     value={sorted.length}           unit="days"       tone="brand"/>
        <NetMetric label="Total worked" value={`${totalH}h`}            unit={`${String(totalM).padStart(2,'0')}m`} tone="healthy"/>
        <NetMetric label="Active time"  value={`${activeH}h`}           unit="hands-on"/>
        <NetMetric label="Break time"   value={`${Math.floor(breakMin/60)}h`} unit={`${breakMin%60}m`} tone="warning"/>
        <div className="card" style={{ padding:16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)', marginBottom: 10 }}>Last 7 sessions</div>
          <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:50 }}>
            {last7.map((s,i) => {
              const hrs = s.workedMs / 3600000;
              return (
                <div key={i} title={`${s.date}: ${Math.round(hrs*10)/10}h`} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <div style={{ width:'100%', height:`${(hrs/maxH)*100}%`, background:'var(--net-brand-accent)', borderRadius:4, minHeight:4, opacity: 0.8 }}/>
                </div>
              );
            })}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:9.5, color:'var(--net-text-dim)', fontFamily: 'var(--net-font-mono)' }}>
            <span>{last7[0]?.date.slice(5)}</span>
            <span>{last7[last7.length-1]?.date.slice(5)}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid var(--net-border)' }}>
          <div>
            <div style={{ fontSize:14, fontWeight:700 }}>Clock-in / clock-out sessions</div>
            <div style={{ fontSize:11.5, color:'var(--net-text-muted)' }}>{agent.name} · last 14 days</div>
          </div>
          <button className="btn btn-secondary btn-sm"><NetIcons.Download width={12} height={12}/> Export</button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                {['Date','Clock in','Clock out','Shift timeline','Worked','Active','Breaks','Tests','Avg ↓'].map((h,i) => (
                  <th key={h} style={{ textAlign: i < 4 ? 'left' : 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(s => {
                const inT  = s.clockIn.toLocaleTimeString('en-US',  { hour:'numeric', minute:'2-digit' });
                const outT = s.clockOut.toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit' });
                const wH   = Math.floor(s.workedMs / 3600000);
                const wM   = Math.floor((s.workedMs / 60000) % 60);
                const aH   = Math.floor(s.activeMs / 3600000);
                const aM   = Math.floor((s.activeMs / 60000) % 60);
                const sP   = (s.clockIn.getHours()  * 60 + s.clockIn.getMinutes())  / 1440;
                const eP   = (s.clockOut.getHours() * 60 + s.clockOut.getMinutes()) / 1440;
                return (
                  <tr key={s.date}>
                    <td>
                      <div style={{ fontWeight:600, color:'var(--net-text)' }}>
                        {s.clockIn.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                      </div>
                      <div style={{ fontFamily: 'var(--net-font-mono)', fontSize:10.5, color:'var(--net-text-dim)' }}>{s.date}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', color:'var(--net-healthy)', fontWeight:600 }}>{inT}</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', color:'var(--net-critical)', fontWeight:600 }}>{outT}</td>
                    <td style={{ minWidth:200 }}><TimelineBar startPct={sP} endPct={eP}/></td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', textAlign:'right', fontWeight:700, color:'var(--net-brand-accent)' }}>{wH}h {String(wM).padStart(2,'0')}m</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', textAlign:'right', color:'var(--net-text)' }}>{aH}h {String(aM).padStart(2,'0')}m</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', textAlign:'right', color:'var(--net-text-muted)' }}>{s.breakMin}m</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', textAlign:'right', color:'var(--net-text-muted)' }}>{s.tests}</td>
                    <td style={{ fontFamily: 'var(--net-font-mono)', textAlign:'right' }}>
                      <span style={{ fontWeight:600 }}>{s.avgDown}</span>
                      <span style={{ color:'var(--net-text-dim)', fontSize:10.5 }}> Mbps</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
