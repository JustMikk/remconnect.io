'use client';
import { useEffect, useState } from 'react';

export function LivePill() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px', borderRadius: 100, background: 'var(--net-surface-2)', border: '1px solid var(--net-border)', fontSize: 12, color: 'var(--net-text-muted)' }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--net-healthy)', animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0 }}/>
      <span style={{ fontWeight: 600, color: 'var(--net-healthy)' }}>LIVE</span>
      <span style={{ fontFamily: 'var(--net-font-mono)', fontSize: 11 }}>{time}</span>
    </div>
  );
}
