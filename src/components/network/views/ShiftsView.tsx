'use client';
import { NetTopbar } from '@/components/network/ui/Topbar';
import { NetIcons } from '@/components/network/ui/Icons';
import { NET_AGENTS, SHIFTS } from '@/lib/network-data';
import { mulberry32 } from '@/lib/network-utils';

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hoursInRange(shift: string): number[] {
  const [start, end] = shift.split('–').map(t => parseInt(t.split(':')[0]));
  if (start < end) return HOURS.filter(h => h >= start && h < end);
  return HOURS.filter(h => h >= start || h < end);
}

function ShiftTimeline({ shift }: { shift: string }) {
  const active = new Set(hoursInRange(shift));
  return (
    <div style={{ display: 'flex', gap: 2, height: 28 }}>
      {HOURS.map(h => (
        <div
          key={h}
          title={`${String(h).padStart(2, '0')}:00`}
          style={{
            flex: 1, borderRadius: 3,
            background: active.has(h) ? 'var(--net-brand-accent)' : 'var(--net-surface-2)',
            opacity: active.has(h) ? 1 : 0.5,
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  );
}

function AgentAvatar({ name, color, online }: { name: string; color: string; online: boolean }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
        {name.charAt(0)}
      </div>
      {online && (
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 8, height: 8, borderRadius: '50%', background: 'var(--net-healthy)', border: '2px solid var(--net-surface)' }}/>
      )}
    </div>
  );
}

export function ShiftsView() {
  const today = new Date();
  const nowHour = today.getHours();

  return (
    <>
      <NetTopbar
        title="Shifts"
        subtitle={`Today · ${today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
        actions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-ghost" style={{ fontSize: 13, gap: 6 }}>
              <NetIcons.Calendar width={14} height={14}/> Schedule
            </button>
            <button className="btn btn-primary" style={{ fontSize: 13, gap: 6 }}>
              <NetIcons.Download width={14} height={14}/> Export
            </button>
          </div>
        }
      />

      <div style={{ padding: '24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Agents',  value: NET_AGENTS.length,                          icon: 'Agents'   as const, color: 'var(--net-brand-accent)' },
            { label: 'Online Now',    value: NET_AGENTS.filter(a => a.online).length,    icon: 'Activity' as const, color: 'var(--net-healthy)'      },
            { label: 'Active Shifts', value: 3,                                          icon: 'Shifts'   as const, color: 'var(--net-brand-mid)'    },
            { label: 'Coverage',      value: '100%',                                     icon: 'Check'    as const, color: 'var(--net-healthy)'      },
          ].map(c => {
            const Icon = NetIcons[c.icon];
            return (
              <div key={c.label} className="card" style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--net-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon width={18} height={18} style={{ color: c.color }}/>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: c.color, letterSpacing: '-0.02em' }}>{c.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--net-text-dim)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {HOURS.map(h => (
              <div key={h} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: h === nowHour ? 'var(--net-brand-accent)' : 'var(--net-text-dim)', fontFamily: 'var(--net-font-mono)', fontWeight: h === nowHour ? 700 : 400 }}>
                {h % 6 === 0 || h === nowHour ? String(h).padStart(2, '0') : ''}
              </div>
            ))}
          </div>
          <div style={{ position: 'relative', height: 4, marginTop: 3 }}>
            <div style={{ height: 2, background: 'var(--net-border)', borderRadius: 1 }}/>
            <div style={{
              position: 'absolute', top: -3,
              left: `${(nowHour / 24) * 100}%`,
              transform: 'translateX(-50%)',
              width: 2, height: 10, background: 'var(--net-brand-accent)', borderRadius: 1,
            }}/>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {SHIFTS.map((shift, si) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const rand = mulberry32(si * 31 + 7);
            const shiftAgents = NET_AGENTS.filter(a => a.shift === shift);
            const online = shiftAgents.filter(a => a.online).length;
            const isActive = hoursInRange(shift).includes(nowHour);

            return (
              <div key={shift} className="card" style={{ padding: '24px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: isActive ? 'var(--net-brand-accent)' : 'var(--net-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <NetIcons.Clock width={18} height={18} style={{ color: isActive ? '#fff' : 'var(--net-text-dim)' }}/>
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--net-text)', letterSpacing: '-0.01em', fontFamily: 'var(--net-font-mono)' }}>{shift}</span>
                        {isActive && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'var(--net-brand-accent)', color: '#fff' }}>ACTIVE NOW</span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--net-text-muted)', marginTop: 2 }}>
                        {shiftAgents.length} agents assigned · {online} online
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: online >= shiftAgents.length * 0.8 ? 'var(--net-healthy)' : 'var(--net-warning)', letterSpacing: '-0.02em' }}>
                      {shiftAgents.length > 0 ? Math.round((online / shiftAgents.length) * 100) : 0}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--net-text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Present</div>
                  </div>
                </div>

                <ShiftTimeline shift={shift}/>

                {shiftAgents.length > 0 && (
                  <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--net-border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--net-text-dim)', marginBottom: 12 }}>
                      Agents ({shiftAgents.length})
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                      {shiftAgents.map(agent => (
                        <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--net-surface-2)' }}>
                          <AgentAvatar name={agent.name} color={agent.avatar} online={agent.online}/>
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--net-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--net-text-dim)' }}>{agent.team}</div>
                          </div>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: agent.online ? 'var(--net-healthy)' : 'var(--net-border)', flexShrink: 0 }}/>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
