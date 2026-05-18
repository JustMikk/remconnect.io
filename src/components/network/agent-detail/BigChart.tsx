'use client';
import type { NetworkAgent } from '@/types/network';
import { mulberry32 } from '@/lib/network-utils';

export function BigChart({ agent }: { agent: NetworkAgent }) {
  const n    = 60;
  const rand = mulberry32(agent.id.charCodeAt(agent.id.length - 1) * 7);
  const down = Array.from({ length: n }, (_, i) => Math.max(2, agent.download + Math.sin(i/4)*6 + (rand()-0.5)*8));
  const up   = Array.from({ length: n }, (_, i) => Math.max(1, agent.upload   + Math.sin(i/5)*3 + (rand()-0.5)*4));
  const lat  = Array.from({ length: n }, (_, i) => Math.max(20, agent.latency + Math.sin(i/3)*40 + (rand()-0.5)*60));

  const w = 900, h = 260;
  const pad = { l: 42, r: 42, t: 12, b: 24 };
  const iW  = w - pad.l - pad.r;
  const iH  = h - pad.t - pad.b;
  const dMax = Math.max(...down, ...up, agent.planDown ?? 50) * 1.15;
  const lMax = Math.max(...lat, 500) * 1.15;

  const path = (series: number[], max: number) =>
    series.map((v, i) => {
      const x = pad.l + (i / (series.length - 1)) * iW;
      const y = pad.t + (1 - v / max) * iH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

  const fillD = `${path(down, dMax)} L ${(w-pad.r).toFixed(1)} ${h-pad.b} L ${pad.l} ${h-pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display:'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="bcf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--net-brand-accent)" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="var(--net-brand-accent)" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect x={pad.l} y={pad.t+(1-150/lMax)*iH} width={iW} height={((1-100/lMax)-(1-150/lMax))*iH} fill="var(--net-warning)" opacity="0.05"/>
      <rect x={pad.l} y={pad.t} width={iW} height={(1-400/lMax)*iH} fill="var(--net-critical)" opacity="0.05"/>
      <line x1={pad.l} y1={pad.t+(1-150/lMax)*iH} x2={w-pad.r} y2={pad.t+(1-150/lMax)*iH} stroke="var(--net-warning)" strokeDasharray="3 4" opacity="0.5" strokeWidth="1"/>
      <line x1={pad.l} y1={pad.t+(1-400/lMax)*iH} x2={w-pad.r} y2={pad.t+(1-400/lMax)*iH} stroke="var(--net-critical)" strokeDasharray="3 4" opacity="0.5" strokeWidth="1"/>
      {[0.25,0.5,0.75].map(f => (
        <line key={f} x1={pad.l} y1={pad.t+f*iH} x2={w-pad.r} y2={pad.t+f*iH} stroke="var(--net-border)" strokeWidth="1"/>
      ))}
      <path d={fillD} fill="url(#bcf)"/>
      <path d={path(down, dMax)} fill="none" stroke="var(--net-brand-accent)" strokeWidth="2" strokeLinejoin="round"/>
      <path d={path(up,   dMax)} fill="none" stroke="var(--net-brand-mid)" strokeWidth="1.6" strokeLinejoin="round" opacity="0.9"/>
      <path d={path(lat,  lMax)} fill="none" stroke="var(--net-warning)" strokeWidth="1.4" strokeLinejoin="round" opacity="0.9"/>
      {[0,0.25,0.5,0.75,1].map(f => {
        const y = pad.t + (1-f)*iH;
        return (
          <g key={f}>
            <text x={pad.l-6} y={y+3} textAnchor="end"   fontSize="10" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{Math.round(dMax*f)}</text>
            <text x={w-pad.r+6} y={y+3} textAnchor="start" fontSize="10" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{Math.round(lMax*f)}</text>
          </g>
        );
      })}
      {[0,0.25,0.5,0.75,1].map(f => {
        const x = pad.l + f*iW;
        const hrs = Math.round((1-f)*24);
        return <text key={f} x={x} y={h-7} textAnchor="middle" fontSize="10" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{hrs===0?'now':`-${hrs}h`}</text>;
      })}
      <text x={pad.l-6} y={pad.t-3} textAnchor="end" fontSize="9" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">Mbps</text>
      <text x={w-pad.r+6} y={pad.t-3} textAnchor="start" fontSize="9" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">ms</text>
    </svg>
  );
}
