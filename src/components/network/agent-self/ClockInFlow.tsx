'use client';
import { useState, useEffect } from 'react';
import type { NetworkAgent } from '@/types/network';
import { NetIcons } from '@/components/network/ui/Icons';

const STEPS = [
  { id: 'welcome',  desc: 'Setting up your session…'   },
  { id: 'ping',     desc: 'Testing latency…'           },
  { id: 'download', desc: 'Measuring download speed…'  },
  { id: 'upload',   desc: 'Measuring upload speed…'    },
  { id: 'ready',    desc: 'Your shift has started!'    },
];

interface Props {
  agent: NetworkAgent;
  onDone: () => void;
}

export function ClockInFlow({ agent, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [ip,   setIp]   = useState('...');

  useEffect(() => {
    const t = setTimeout(() => setIp(agent.ip), 1200);
    return () => clearTimeout(t);
  }, [agent.ip]);

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const delay = step === 0 ? 1000 : 2200;
      const t = setTimeout(() => setStep(s => s + 1), delay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onDone, 2000);
      return () => clearTimeout(t);
    }
  }, [step, onDone]);

  const cur = STEPS[step];
  const pct = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'linear-gradient(160deg, #003366 0%, #005A9E 50%, #0099CC 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect x="2"  y="20" width="5" height="10" rx="1.5" fill="rgba(255,255,255,0.4)"/>
          <rect x="9"  y="14" width="5" height="16" rx="1.5" fill="rgba(255,255,255,0.7)"/>
          <rect x="16" y="8"  width="5" height="22" rx="1.5" fill="#fff"/>
          <rect x="23" y="4"  width="5" height="26" rx="1.5" fill="#fff" opacity="0.85"/>
          <circle cx="26" cy="4" r="3.5" fill="#34D399"/>
        </svg>
        <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
          RemConnect<span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>.io</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>
          {step === 0 ? `Good to see you, ${agent.name.split(' ')[0]}!` : step === STEPS.length - 1 ? 'Your shift has started!' : 'Running speed test…'}
        </div>
        <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{cur.desc}</div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i <= step ? '#fff' : 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.3s',
            }}>
              {i < step
                ? <NetIcons.Check width={14} height={14} style={{ color: '#0099CC' }}/>
                : <span style={{ fontSize: 11, fontWeight: 700, color: i === step ? '#0099CC' : 'rgba(255,255,255,0.5)' }}>{i + 1}</span>
              }
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 36, height: 2, background: i < step ? '#fff' : 'rgba(255,255,255,0.2)', borderRadius: 1, transition: 'background 0.3s' }}/>
            )}
          </div>
        ))}
      </div>

      <div style={{ width: 300 }}>
        <div style={{ height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#fff', borderRadius: 999, width: `${pct}%`, transition: 'width 0.6s ease' }}/>
        </div>
      </div>

      {step >= 2 && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px' }}>
          <NetIcons.Globe width={14} height={14} style={{ color: 'rgba(255,255,255,0.7)' }}/>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'JetBrains Mono, monospace' }}>{ip}</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{agent.isp}</span>
        </div>
      )}

      {step === STEPS.length - 1 && (
        <div style={{ animation: 'pop-in 0.4s ease both' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.5)' }}>
            <NetIcons.Check width={28} height={28} style={{ color: '#fff' }}/>
          </div>
        </div>
      )}
    </div>
  );
}
