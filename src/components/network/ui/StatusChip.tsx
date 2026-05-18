'use client';
import type { NetworkStatus } from '@/types/network';

interface Props {
  status: NetworkStatus | 'resolved';
  size?: 'sm' | 'md';
}

const DOT = { width: 6, height: 6, borderRadius: '50%' };

export function NetworkStatusChip({ status, size = 'md' }: Props) {
  const colors: Record<string, { bg: string; fg: string }> = {
    healthy:  { bg: 'var(--net-healthy-bg)',  fg: 'var(--net-healthy)'  },
    warning:  { bg: 'var(--net-warning-bg)',  fg: 'var(--net-warning)'  },
    critical: { bg: 'var(--net-critical-bg)', fg: 'var(--net-critical)' },
    resolved: { bg: 'var(--net-surface-2)',   fg: 'var(--net-text-dim)' },
  };
  const { bg, fg } = colors[status] ?? colors.resolved;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: size === 'sm' ? '2px 8px' : '3px 10px',
      borderRadius: 100, background: bg,
      fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, color: fg,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ ...DOT, background: fg }}/>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
