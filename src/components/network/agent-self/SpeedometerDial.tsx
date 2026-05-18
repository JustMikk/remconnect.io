'use client';
import { useEffect, useRef } from 'react';

const LOG_MARKS = [0, 1, 5, 10, 25, 50, 100, 250, 500, 750, 1000];
const ARC_DEG   = 240;
const START_DEG = 150;

function mbpsToAngle(v: number): number {
  const logMax = Math.log10(1001);
  const logV   = Math.log10(Math.max(1, v) + 1);
  return START_DEG + (logV / logMax) * ARC_DEG;
}

function polarXY(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

interface Props {
  testing: boolean;
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'done';
  dialValue: number;
  progress: number;
  onRun: () => void;
  hasRun: boolean;
  liveDown?: number;
  liveUp?: number;
  livePing?: number;
}

const PHASE_COLOR: Record<string, string> = {
  idle:     '#0099CC',
  ping:     '#D08509',
  download: '#0099CC',
  upload:   '#005A9E',
  done:     '#138A4A',
};

export function SpeedometerDial({ testing, phase, dialValue, progress, onRun, hasRun, liveDown, liveUp, livePing }: Props) {
  const needleRef = useRef<SVGLineElement>(null);
  const targetRef = useRef(0);
  const currentRef= useRef(0);
  const rafRef    = useRef<number>(0);

  const CX = 150, CY = 155, R = 110, NR = 88;

  useEffect(() => {
    targetRef.current = testing ? mbpsToAngle(dialValue) : START_DEG;
    const animate = () => {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.5) {
        currentRef.current += diff * 0.08;
        if (needleRef.current) {
          const rad = (currentRef.current * Math.PI) / 180;
          needleRef.current.setAttribute('x2', (CX + NR * Math.cos(rad)).toFixed(2));
          needleRef.current.setAttribute('y2', (CY + NR * Math.sin(rad)).toFixed(2));
        }
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dialValue, testing]);

  const arcAngle = testing ? mbpsToAngle(dialValue) : START_DEG;
  const arcPt1   = polarXY(CX, CY, R, START_DEG);
  const arcPt2   = polarXY(CX, CY, R, arcAngle);
  const sweep    = arcAngle - START_DEG;
  const largeArc = sweep > 180 ? 1 : 0;
  const color    = PHASE_COLOR[phase] ?? '#0099CC';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg viewBox="0 0 300 190" width="300" height="190" style={{ overflow: 'visible' }}>
        {(() => {
          const p1 = polarXY(CX, CY, R, START_DEG);
          const p2 = polarXY(CX, CY, R, START_DEG + ARC_DEG);
          return <path d={`M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${R} ${R} 0 1 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`} fill="none" stroke="var(--net-surface-3)" strokeWidth="10" strokeLinecap="round"/>;
        })()}

        {testing && sweep > 0 && (
          <path d={`M ${arcPt1.x.toFixed(1)} ${arcPt1.y.toFixed(1)} A ${R} ${R} 0 ${largeArc} 1 ${arcPt2.x.toFixed(1)} ${arcPt2.y.toFixed(1)}`}
            fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"/>
        )}

        {LOG_MARKS.map(v => {
          const deg   = mbpsToAngle(v);
          const outer = polarXY(CX, CY, R + 8, deg);
          const inner = polarXY(CX, CY, R - 4, deg);
          const label = polarXY(CX, CY, R + 20, deg);
          return (
            <g key={v}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="var(--net-border-strong)" strokeWidth="1.5"/>
              {[0, 10, 25, 100, 500, 1000].includes(v) && (
                <text x={label.x} y={label.y + 3} textAnchor="middle" fontSize="9" fill="var(--net-text-dim)" fontFamily="var(--net-font-mono)">{v >= 1000 ? '1k' : v}</text>
              )}
            </g>
          );
        })}

        <line ref={needleRef}
          x1={CX} y1={CY}
          x2={CX + NR * Math.cos(START_DEG * Math.PI / 180)}
          y2={CY + NR * Math.sin(START_DEG * Math.PI / 180)}
          stroke={color} strokeWidth="2.5" strokeLinecap="round"
        />
        <circle cx={CX} cy={CY} r="6" fill={color}/>
        <circle cx={CX} cy={CY} r="3" fill="var(--net-surface)"/>

        <text x={CX} y={CY - 24} textAnchor="middle" fontSize="36" fontWeight="800" fill={color} fontFamily="var(--net-font-mono)" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {testing ? dialValue.toFixed(1) : hasRun ? (liveDown ?? 0).toFixed(1) : '—'}
        </text>
        <text x={CX} y={CY - 8} textAnchor="middle" fontSize="11" fill="var(--net-text-dim)" fontFamily="var(--net-font-sans)">
          {phase === 'download' ? 'Mbps ↓' : phase === 'upload' ? 'Mbps ↑' : phase === 'ping' ? 'Ping ms' : 'Mbps'}
        </text>

        {!testing && (
          <g onClick={onRun} style={{ cursor: 'pointer' }}>
            <circle cx={CX} cy={CY + 52} r="28" fill={color} opacity="0.15"/>
            <circle cx={CX} cy={CY + 52} r="22" fill={color}/>
            <text x={CX} y={CY + 57} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="var(--net-font-sans)">GO</text>
          </g>
        )}
      </svg>

      {(testing || hasRun) && (
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: '↓', value: liveDown, unit: 'Mbps', color: 'var(--net-brand-600)' },
            { label: '↑', value: liveUp,   unit: 'Mbps', color: 'var(--net-brand-mid)'  },
            { label: '◇', value: livePing, unit: 'ms',   color: 'var(--net-warning)'    },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value?.toFixed(1) ?? '—'}</div>
              <div style={{ fontSize: 10, color: 'var(--net-text-dim)' }}>{s.label} {s.unit}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
