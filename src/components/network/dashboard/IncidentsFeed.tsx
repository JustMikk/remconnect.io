'use client';
import Link from 'next/link';
import { NET_INCIDENTS } from '@/lib/network-data';
import { NetIcons } from '@/components/network/ui/Icons';

export function IncidentsFeed() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--net-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>Active incidents</div>
        <Link href="/admin/network/incidents" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 6, fontSize: 11, color: 'var(--net-brand-accent)', textDecoration: 'none', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          View all <NetIcons.ArrowRight width={12} height={12}/>
        </Link>
      </div>
      {NET_INCIDENTS.map(inc => {
        const color =
          inc.type === 'critical' ? 'var(--net-critical)' :
          inc.type === 'warning'  ? 'var(--net-warning)'  : 'var(--net-text-dim)';
        return (
          <div key={inc.id} style={{ padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'flex-start', borderBottom: '1px solid var(--net-border)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 3, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--net-text)' }}>{inc.agent}</div>
              <div style={{ fontSize: 11, color: 'var(--net-text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inc.msg}</div>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--net-text-dim)', flexShrink: 0, fontFamily: 'var(--net-font-mono)' }}>{inc.time}</div>
          </div>
        );
      })}
    </div>
  );
}
