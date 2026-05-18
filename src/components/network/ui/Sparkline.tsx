'use client';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  fill?: boolean;
  threshold?: number;
  showDots?: boolean;
}

export function NetSparkline({ data, color = 'var(--net-brand-accent)', height = 36, fill = true, threshold, showDots = false }: SparklineProps) {
  if (!data || data.length < 2) return null;
  const w = 200;
  const h = height;
  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const fillD = `${d} L ${pts[pts.length-1].x} ${h} L ${pts[0].x} ${h} Z`;

  const threshY = threshold != null
    ? pad + (1 - (threshold - min) / range) * (h - pad * 2)
    : null;

  const gradId = `nsg-${color.replace(/[^a-z0-9]/gi, '')}-${height}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={height} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <path d={fillD} fill={`url(#${gradId})`}/>}
      {threshY != null && (
        <line x1={pad} y1={threshY} x2={w - pad} y2={threshY}
          stroke={color} strokeWidth="1" strokeDasharray="3 4" opacity="0.6"/>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {showDots && pts.length > 0 && (
        <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="3"
          fill={color} stroke="var(--net-surface)" strokeWidth="1.5"/>
      )}
    </svg>
  );
}
