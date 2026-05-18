import type { NetworkStatus } from '@/types/network';

export function mulberry32(seed: number) {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export const THRESHOLDS = {
  download:  { healthy: 25, warning: 15 },
  upload:    { healthy: 15, warning: 10 },
  ping:      { healthy: 50, warning: 100 },
  latency:   { healthy: 50, warning: 100 },
  jitter:    { healthy: 10, warning: 30 },
};

export function metricStatus(metric: keyof typeof THRESHOLDS, value: number): NetworkStatus {
  const t = THRESHOLDS[metric];
  if (metric === 'download' || metric === 'upload') {
    if (value >= t.healthy) return 'healthy';
    if (value >= t.warning) return 'warning';
    return 'critical';
  }
  if (value <= t.healthy) return 'healthy';
  if (value <= t.warning) return 'warning';
  return 'critical';
}

export function networkStatusColor(status: NetworkStatus | 'resolved'): string {
  switch (status) {
    case 'healthy':  return 'var(--net-healthy)';
    case 'warning':  return 'var(--net-warning)';
    case 'critical': return 'var(--net-critical)';
    case 'resolved': return 'var(--net-text-dim)';
    default:         return 'var(--net-text-dim)';
  }
}

export function networkStatusBg(status: NetworkStatus | 'resolved'): string {
  switch (status) {
    case 'healthy':  return 'var(--net-healthy-bg)';
    case 'warning':  return 'var(--net-warning-bg)';
    case 'critical': return 'var(--net-critical-bg)';
    case 'resolved': return 'var(--net-surface-2)';
    default:         return 'var(--net-surface-2)';
  }
}

export function fmtTime(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
