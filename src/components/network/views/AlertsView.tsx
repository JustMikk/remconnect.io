'use client';
import { useState } from 'react';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetworkStatusChip } from '@/components/network/ui/StatusChip';
import { Toggle } from '@/components/network/ui/Toggle';
import { NetIcons } from '@/components/network/ui/Icons';
import type { AlertRule, NetworkStatus } from '@/types/network';

const INITIAL_RULES: AlertRule[] = [
  { id: 'r1', name: 'Low Download Speed',  metric: 'Download', condition: '< 15 Mbps for 5 min',  severity: 'critical', enabled: true,  triggered: 12 },
  { id: 'r2', name: 'Download Warning',     metric: 'Download', condition: '< 25 Mbps for 10 min', severity: 'warning',  enabled: true,  triggered: 28 },
  { id: 'r3', name: 'High Latency Alert',   metric: 'Latency',  condition: '> 400 ms for 3 min',   severity: 'critical', enabled: true,  triggered: 7  },
  { id: 'r4', name: 'Latency Warning',      metric: 'Latency',  condition: '> 150 ms for 5 min',   severity: 'warning',  enabled: true,  triggered: 19 },
  { id: 'r5', name: 'Packet Loss Critical', metric: 'Loss',     condition: '> 2% for 5 min',       severity: 'critical', enabled: true,  triggered: 4  },
  { id: 'r6', name: 'Packet Loss Warning',  metric: 'Loss',     condition: '> 0.5% for 10 min',    severity: 'warning',  enabled: false, triggered: 11 },
  { id: 'r7', name: 'Agent Offline',        metric: 'Status',   condition: 'No data for 15 min',   severity: 'critical', enabled: true,  triggered: 3  },
  { id: 'r8', name: 'Upload Speed Warning', metric: 'Upload',   condition: '< 10 Mbps for 10 min', severity: 'warning',  enabled: false, triggered: 16 },
  { id: 'r9', name: 'Jitter Elevated',      metric: 'Jitter',   condition: '> 30 ms for 5 min',    severity: 'warning',  enabled: true,  triggered: 22 },
];

const CHANNELS = [
  { name: 'Slack',      connected: true,  detail: '#network-alerts channel', color: '#4A154B' },
  { name: 'Email',      connected: true,  detail: 'ops-team@remconnect.io',  color: '#0099CC' },
  { name: 'PagerDuty', connected: false, detail: 'Not configured',           color: '#06AC38' },
  { name: 'Webhook',   connected: false, detail: 'Not configured',           color: '#888'    },
];

export function AlertsView() {
  const [rules, setRules] = useState(INITIAL_RULES);

  function toggle(id: string) {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  const enabledCount   = rules.filter(r => r.enabled).length;
  const totalTriggered = rules.reduce((s, r) => s + r.triggered, 0);

  return (
    <>
      <NetTopbar
        title="Alert Rules"
        subtitle={`${enabledCount} active rules · ${totalTriggered} triggers today`}
        actions={
          <button className="btn btn-primary" style={{ gap: 6, fontSize: 13 }}>
            <NetIcons.Plus width={14} height={14}/> Add Rule
          </button>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Active Rules',    value: enabledCount,                                                          color: 'var(--net-brand-accent)' },
            { label: 'Disabled Rules',  value: rules.length - enabledCount,                                           color: 'var(--net-text-muted)'   },
            { label: 'Triggers Today',  value: totalTriggered,                                                        color: 'var(--net-warning)'       },
            { label: 'Critical Rules',  value: rules.filter(r => r.severity === 'critical' && r.enabled).length,     color: 'var(--net-critical)'      },
          ].map(c => (
            <div key={c.label} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, letterSpacing: '-0.03em' }}>{c.value}</div>
              <div style={{ fontSize: 12, color: 'var(--net-text-muted)', marginTop: 4, fontWeight: 600 }}>{c.label}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--net-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Notification Channels</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {CHANNELS.map(ch => (
            <div key={ch.name} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: ch.connected ? ch.color + '22' : 'var(--net-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <NetIcons.Activity width={18} height={18} style={{ color: ch.connected ? ch.color : 'var(--net-text-dim)' }}/>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: ch.connected ? 'var(--net-healthy-bg)' : 'var(--net-surface-2)', color: ch.connected ? 'var(--net-healthy)' : 'var(--net-text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {ch.connected ? 'Connected' : 'Not set up'}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--net-text)', marginBottom: 2 }}>{ch.name}</div>
                <div style={{ fontSize: 12, color: 'var(--net-text-dim)' }}>{ch.detail}</div>
              </div>
              <button className={ch.connected ? 'btn btn-ghost' : 'btn btn-secondary'} style={{ fontSize: 12, padding: '6px 12px' }}>
                {ch.connected ? 'Configure' : 'Set up'}
              </button>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--net-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Alert Rules</h3>
        <div className="card table-scroll" style={{ padding: 0 }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ paddingLeft: 20 }}>Rule Name</th>
                <th>Metric</th><th>Condition</th><th>Severity</th>
                <th style={{ textAlign: 'center' }}>Triggered Today</th>
                <th style={{ textAlign: 'center' }}>Enabled</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} style={{ opacity: rule.enabled ? 1 : 0.55 }}>
                  <td style={{ paddingLeft: 20, fontWeight: 600 }}>{rule.name}</td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 100, fontSize: 11, fontWeight: 600, background: 'var(--net-brand-100)', color: 'var(--net-brand-mid)', border: '1px solid var(--net-brand-200)' }}>{rule.metric}</span></td>
                  <td style={{ fontFamily: 'var(--net-font-mono)', fontSize: 12, color: 'var(--net-text-muted)' }}>{rule.condition}</td>
                  <td><NetworkStatusChip status={rule.severity as NetworkStatus}/></td>
                  <td style={{ textAlign: 'center', fontFamily: 'var(--net-font-mono)', fontWeight: 700, color: rule.triggered > 10 ? 'var(--net-warning)' : 'var(--net-text)' }}>{rule.triggered}</td>
                  <td style={{ textAlign: 'center' }}><Toggle checked={rule.enabled} onChange={() => toggle(rule.id)}/></td>
                  <td><button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }}><NetIcons.Settings width={13} height={13}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
