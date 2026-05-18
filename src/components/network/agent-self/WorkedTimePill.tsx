'use client';
import { useState, useEffect } from 'react';
import { fmtTime } from '@/lib/network-utils';
import { NetIcons } from '@/components/network/ui/Icons';

export function WorkedTimePill({ clockInTime, onClick }: { clockInTime: number; onClick: () => void }) {
  const [elapsed, setElapsed] = useState(Date.now() - clockInTime);

  useEffect(() => {
    const id = setInterval(() => setElapsed(Date.now() - clockInTime), 1000);
    return () => clearInterval(id);
  }, [clockInTime]);

  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '6px 14px', borderRadius: 100,
      background: 'var(--net-surface-2)', border: '1px solid var(--net-border)',
      cursor: 'pointer', color: 'var(--net-text)', fontFamily: 'var(--net-font-sans)',
      transition: 'background 0.15s',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--net-healthy)', animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0 }}/>
      <span style={{ fontSize: 12, fontWeight: 600 }}>Worked</span>
      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--net-font-mono)', fontVariantNumeric: 'tabular-nums' }}>{fmtTime(elapsed)}</span>
      <NetIcons.Clock width={13} height={13} style={{ opacity: 0.7 }}/>
    </button>
  );
}
