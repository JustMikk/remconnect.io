'use client';
import { useState, useEffect, useCallback } from 'react';
import { NET_AGENTS, genHistory } from '@/lib/network-data';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { NetSparkline } from '@/components/network/ui/Sparkline';
import { CapacityBar } from '@/components/network/ui/CapacityBar';
import { SpeedometerDial } from './SpeedometerDial';
import { ClockInFlow } from './ClockInFlow';
import { ClockedOutEmpty } from './ClockedOutEmpty';
import { WorkedTimePill } from './WorkedTimePill';

type ClockState = 'out' | 'animating' | 'in';
type Phase = 'idle' | 'ping' | 'download' | 'upload' | 'done';

export function AgentSpeedPanel() {
  const agent = NET_AGENTS[0];

  const [clockState,   setClockState]  = useState<ClockState>('out');
  const [clockInTime,  setClockInTime] = useState<number | null>(null);

  const [testing,    setTesting]   = useState(false);
  const [phase,      setPhase]     = useState<Phase>('idle');
  const [dialValue,  setDialValue] = useState(0);
  const [progress,   setProgress]  = useState(0);
  const [hasRun,     setHasRun]    = useState(false);
  const [liveDown,   setLiveDown]  = useState(0);
  const [liveUp,     setLiveUp]    = useState(0);
  const [livePing,   setLivePing]  = useState(0);
  const [liveJitter, setLiveJitter]= useState(0);
  const [liveLoss,   setLiveLoss]  = useState(0);

  const history = genHistory(agent.id).slice(0, 20);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const state = localStorage.getItem('rc-clock') as ClockState | null;
    const ts    = localStorage.getItem('rc-clock-in-ts');
    if (state === 'in' && ts) { setClockState('in'); setClockInTime(Number(ts)); }
  }, []);

  function handleClockIn()     { setClockState('animating'); }
  function handleClockInDone() {
    const ts = Date.now();
    localStorage.setItem('rc-clock', 'in');
    localStorage.setItem('rc-clock-in-ts', String(ts));
    setClockState('in');
    setClockInTime(ts);
    runSpeedTest();
  }
  function handleClockOut() {
    localStorage.removeItem('rc-clock');
    localStorage.removeItem('rc-clock-in-ts');
    setClockState('out');
    setClockInTime(null);
  }

  const runSpeedTest = useCallback(() => {
    if (testing) return;
    setTesting(true);
    setHasRun(false);
    setDialValue(0);
    setProgress(0);

    const steps: Array<{ ph: Phase; dur: number; target: () => number }> = [
      { ph: 'ping',     dur: 1500, target: () => Math.max(20, agent.latency  + (Math.random()-0.5)*40) },
      { ph: 'download', dur: 3000, target: () => Math.max(2,  agent.download + (Math.random()-0.5)*8)  },
      { ph: 'upload',   dur: 2500, target: () => Math.max(1,  agent.upload   + (Math.random()-0.5)*4)  },
    ];

    let elapsed = 0;
    const total = steps.reduce((s, x) => s + x.dur, 0);
    let stepIdx = 0;

    const tick = () => {
      const st = steps[stepIdx];
      elapsed += 100;
      const stepProgress = Math.min(1, elapsed / st.dur);
      const val = st.target() * stepProgress;

      setPhase(st.ph);
      setDialValue(val);
      setProgress((elapsed / total) * 100);

      if (st.ph === 'ping')     setLivePing(val);
      if (st.ph === 'download') setLiveDown(val);
      if (st.ph === 'upload')   setLiveUp(val);

      if (elapsed >= st.dur) {
        elapsed = 0;
        stepIdx++;
        if (stepIdx >= steps.length) {
          setPhase('done');
          setTesting(false);
          setHasRun(true);
          setLiveJitter(Math.floor(Math.random() * 30) + 5);
          setLiveLoss(Math.round(Math.random() * 1.5 * 100) / 100);
          return;
        }
      }
      setTimeout(tick, 100);
    };
    setTimeout(tick, 200);
  }, [testing, agent]);

  if (clockState === 'animating') {
    return <ClockInFlow agent={agent} onDone={handleClockInDone}/>;
  }

  return (
    <div className="self-body">
      {clockState === 'out' ? (
        <ClockedOutEmpty agent={agent} onClockIn={handleClockIn}/>
      ) : (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {clockInTime && <WorkedTimePill clockInTime={clockInTime} onClick={() => {}}/>}
            <button
              style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 6, background: 'var(--net-critical-bg)', border: '1px solid var(--net-critical)', color: 'var(--net-critical)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--net-font-sans)' }}
              onClick={handleClockOut}
            >
              Clock out
            </button>
          </div>

          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--net-text-muted)', textAlign: 'center' }}>
            {testing
              ? `Testing ${phase}…`
              : hasRun
              ? <span style={{ color: 'var(--net-healthy)', fontWeight: 700 }}>✓ Test complete</span>
              : 'Press GO to run a speed test'
            }
          </div>

          <div className="self-hero">
            {/* Connection info */}
            <div className="card" style={{ padding: 20 }}>
              <div className="label" style={{ marginBottom: 14 }}>Connection info</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: 'ISP',  value: agent.isp,  mono: false },
                  { label: 'IP',   value: agent.ip,   mono: true  },
                  { label: 'Plan', value: `${agent.planDown} / ${agent.planUp} Mbps`, mono: false },
                  { label: 'VPN',  value: agent.vpn ? 'Detected' : 'None', mono: false, color: agent.vpn ? 'var(--net-warning)' : 'var(--net-healthy)' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--net-border)', fontSize: 12 }}>
                    <span style={{ color: 'var(--net-text-muted)' }}>{r.label}</span>
                    <span style={{ fontFamily: r.mono ? 'var(--net-font-mono)' : undefined, fontWeight: 500, color: (r as { color?: string }).color ?? 'var(--net-text)', fontSize: r.mono ? 11 : undefined }}>{r.value}</span>
                  </div>
                ))}
              </div>
              {hasRun && (
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <CapacityBar label="Download" value={liveDown} plan={agent.planDown}/>
                  <CapacityBar label="Upload"   value={liveUp}   plan={agent.planUp}/>
                </div>
              )}
            </div>

            {/* Dial */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <SpeedometerDial
                testing={testing} phase={phase} dialValue={dialValue} progress={progress}
                onRun={runSpeedTest} hasRun={hasRun}
                liveDown={liveDown} liveUp={liveUp} livePing={livePing}
              />
            </div>

            {/* Results */}
            <div className="card" style={{ padding: 20 }}>
              <div className="label" style={{ marginBottom: 14 }}>Test results</div>
              {hasRun ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { label: 'Download', value: liveDown.toFixed(1),          unit: 'Mbps', status: liveDown  >= 25 ? 'healthy' : liveDown  >= 15 ? 'warning' : 'critical' },
                    { label: 'Upload',   value: liveUp.toFixed(1),            unit: 'Mbps', status: liveUp    >= 15 ? 'healthy' : liveUp    >= 10 ? 'warning' : 'critical' },
                    { label: 'Ping',     value: String(Math.round(livePing)), unit: 'ms',   status: livePing  <= 50 ? 'healthy' : livePing  <= 100 ? 'warning' : 'critical' },
                    { label: 'Jitter',   value: String(liveJitter),           unit: 'ms',   status: liveJitter<= 10 ? 'healthy' : liveJitter<= 30  ? 'warning' : 'critical' },
                    { label: 'Loss',     value: String(liveLoss),             unit: '%',    status: liveLoss  <= 0.5 ? 'healthy' : liveLoss <= 2   ? 'warning' : 'critical' },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--net-border)' }}>
                      <span style={{ fontSize: 12, color: 'var(--net-text-muted)' }}>{r.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
                        <span style={{ fontSize: 11, color: 'var(--net-text-dim)' }}>{r.unit}</span>
                        <NetworkStatusChip status={r.status as 'healthy'|'warning'|'critical'} size="sm"/>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--net-text-dim)', fontSize: 13 }}>
                  Run a test to see results
                </div>
              )}
            </div>
          </div>

          {/* Sparklines */}
          <div className="self-sparklines">
            {[
              { label: 'Download 24h', data: agent.sparkDown,    color: 'var(--net-brand-600)', unit: 'Mbps', threshold: 15  },
              { label: 'Upload 24h',   data: agent.sparkUp,      color: 'var(--net-brand-mid)', unit: 'Mbps', threshold: 5   },
              { label: 'Latency 24h',  data: agent.sparkLatency, color: 'var(--net-warning)',   unit: 'ms',   threshold: 150 },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 16 }}>
                <div className="label" style={{ marginBottom: 8 }}>{s.label}</div>
                <NetSparkline data={s.data} color={s.color} height={52} threshold={s.threshold} fill showDots/>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--net-text-dim)' }}>
                  <span>24h ago</span><span>now</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent tests table */}
          {hasRun && (
            <div className="card table-scroll" style={{ padding: 0 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--net-border)', fontSize: 14, fontWeight: 600 }}>Recent tests</div>
              <table className="data-table">
                <thead style={{ background: 'var(--net-surface-2)' }}>
                  <tr>
                    {['Time','Download','Upload','Ping','Loss','Jitter'].map(h => (
                      <th key={h} style={{ textAlign: h === 'Time' ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.slice(0, 8).map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--net-font-mono)', fontSize: 12 }}>
                        {r.time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>{r.download} Mbps</td>
                      <td style={{ textAlign: 'right' }}>{r.upload} Mbps</td>
                      <td style={{ textAlign: 'right', color: r.latency > 150 ? 'var(--net-warning)' : 'var(--net-text-muted)' }}>{r.latency} ms</td>
                      <td style={{ textAlign: 'right', color: r.loss > 0.5 ? 'var(--net-warning)' : 'var(--net-text-muted)' }}>{r.loss}%</td>
                      <td style={{ textAlign: 'right', color: 'var(--net-text-muted)' }}>{r.jitter} ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
