'use client';
import type { HistoryRow } from '@/types/network';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';

export function HistoryTable({ rows }: { rows: HistoryRow[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            {['Time','Download','Upload','Latency','Loss','Jitter','Status'].map(h => (
              <th key={h} style={{ textAlign: h === 'Time' ? 'left' : 'right' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ fontFamily: 'var(--net-font-mono)', color: 'var(--net-text-muted)', fontSize: 12 }}>
                {r.time.toLocaleString('en-US', { month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit', hour12: true })}
              </td>
              <td style={{ textAlign:'right', fontWeight:600, color:'var(--net-text)', fontFamily: 'var(--net-font-mono)' }}>
                {r.download} <span style={{ color:'var(--net-text-dim)', fontWeight:400, fontSize:11 }}>Mbps</span>
              </td>
              <td style={{ textAlign:'right', fontFamily: 'var(--net-font-mono)' }}>
                {r.upload} <span style={{ color:'var(--net-text-dim)', fontSize:11 }}>Mbps</span>
              </td>
              <td style={{ textAlign:'right', fontFamily: 'var(--net-font-mono)', color: r.latency>400?'var(--net-critical)':r.latency>150?'var(--net-warning)':'var(--net-text)' }}>
                {r.latency} ms
              </td>
              <td style={{ textAlign:'right', fontFamily: 'var(--net-font-mono)', color: r.loss>2?'var(--net-critical)':r.loss>0.5?'var(--net-warning)':'var(--net-text-muted)' }}>
                {r.loss}%
              </td>
              <td style={{ textAlign:'right', fontFamily: 'var(--net-font-mono)', color:'var(--net-text-muted)' }}>{r.jitter} ms</td>
              <td style={{ textAlign:'right' }}><NetworkStatusChip status={r.status} size="sm"/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
