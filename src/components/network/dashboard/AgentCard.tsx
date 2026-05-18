'use client';
import { useRouter } from 'next/navigation';
import type { NetworkAgent } from '@/types/network';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { NetSparkline } from '@/components/network/ui/Sparkline';
import { NetIcons } from '@/components/network/ui/Icons';

function MiniStat({ icon, label, value, unit, spark, sparkColor, threshold }: {
  icon: React.ReactNode; label: string; value: number; unit: string;
  spark: number[]; sparkColor: string; threshold: number;
}) {
  return (
    <div style={{ background: 'var(--net-surface-2)', borderRadius: 7, padding: '8px 10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--net-text-muted)', marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--net-text)', letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>
        {value.toFixed(1)} <span style={{ fontSize: 10, color: 'var(--net-text-dim)', fontWeight: 400 }}>{unit}</span>
      </div>
      <div style={{ marginTop: 4, height: 20 }}>
        <NetSparkline data={spark} color={sparkColor} height={20} threshold={threshold}/>
      </div>
    </div>
  );
}

export function NetworkAgentCard({ agent }: { agent: NetworkAgent }) {
  const router = useRouter();
  const borderColor =
    agent.status === 'critical' ? 'var(--net-critical)' :
    agent.status === 'warning'  ? 'var(--net-warning)'  : 'var(--net-border)';

  return (
    <div
      onClick={() => router.push(`/admin/network/agents/${agent.id}`)}
      className="card"
      style={{
        padding: 16, cursor: 'pointer',
        borderColor, borderLeftWidth: 3,
        transition: 'box-shadow 0.15s',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--net-shadow-md)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--net-shadow-sm)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: agent.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {agent.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--net-text)' }}>{agent.id}</div>
            <div style={{ fontSize: 11, color: 'var(--net-text-dim)', marginTop: 1 }}>{agent.name}</div>
          </div>
        </div>
        <NetworkStatusChip status={agent.status} size="sm"/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <MiniStat icon={<NetIcons.Download width={12} height={12}/>} label="Down" value={agent.download} unit="Mbps" spark={agent.sparkDown} sparkColor="var(--net-brand-600)" threshold={15}/>
        <MiniStat icon={<NetIcons.Upload   width={12} height={12}/>} label="Up"   value={agent.upload}   unit="Mbps" spark={agent.sparkUp}   sparkColor="var(--net-brand-mid)"  threshold={5}/>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--net-text-muted)' }}>
            Ping <span style={{ fontWeight: 600, fontFamily: 'var(--net-font-mono)', color: agent.latency > 400 ? 'var(--net-critical)' : agent.latency > 150 ? 'var(--net-warning)' : 'var(--net-text)' }}>{agent.latency}ms</span>
          </span>
          <span style={{ fontSize: 11, color: 'var(--net-text-muted)' }}>
            Loss <span style={{ fontWeight: 600, fontFamily: 'var(--net-font-mono)', color: agent.loss > 2 ? 'var(--net-critical)' : agent.loss > 0.5 ? 'var(--net-warning)' : 'var(--net-text)' }}>{agent.loss}%</span>
          </span>
        </div>
        <span style={{ fontSize: 10.5, color: 'var(--net-text-dim)', fontFamily: 'var(--net-font-mono)' }}>
          {agent.lastSeen === 0 ? 'just now' : `${agent.lastSeen}m ago`}
        </span>
      </div>

      <div style={{ paddingTop: 8, borderTop: '1px solid var(--net-border)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10.5, color: 'var(--net-text-dim)' }}>{agent.isp}</span>
        <span style={{ fontSize: 10.5, color: 'var(--net-text-dim)' }}>{agent.location}</span>
      </div>
    </div>
  );
}
