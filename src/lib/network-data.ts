import type { NetworkAgent, HistoryRow, NetworkIncident, IspStats, ShiftSession, TestLogRow } from '@/types/network';
import { mulberry32 } from './network-utils';

export const TEAMS     = ['Customer Support', 'Technical Support', 'Sales', 'Back Office', 'QA'];
export const LOCATIONS = ['Addis Ababa', 'Nairobi', 'Lagos', 'Accra', 'Kampala', 'Dar es Salaam'];
export const ISPS      = ['Ethio Telecom', 'Safaricom', 'MTN Nigeria', 'AirtelTigo', 'Airtel Uganda', 'TTCL'];
export const SHIFTS    = ['06:00–14:00', '14:00–22:00', '22:00–06:00'];

const NAMES = [
  'Meklit Demissie','Dawit Tadesse','Selam Haile','Yonas Tesfaye','Tigist Alemu',
  'Biruk Mengistu','Hana Girma','Eyob Bekele','Meron Assefa','Abel Kebede',
  'Sara Mulugeta','Natnael Wolde','Lidya Ayele','Henok Asfaw','Bethlehem Tsegay',
  'Kiros Tesfai','Amanuel Hailu','Mimi Gebru','Tekeste Araya','Elsa Rezene',
];

function makeAgent(i: number): NetworkAgent {
  const rand    = mulberry32(i * 7 + 13);
  const ispIdx  = Math.floor(rand() * ISPS.length);
  const planDown = [10, 20, 50, 100][Math.floor(rand() * 4)];
  const planUp   = Math.floor(planDown * (0.3 + rand() * 0.4));
  const utilPct  = 30 + rand() * 65;
  const download = Math.max(2, (planDown * utilPct / 100) * (0.7 + rand() * 0.6));
  const upload   = Math.max(1, planUp * (0.4 + rand() * 0.5));
  const latency  = Math.floor(30 + rand() * 300);
  const loss     = Math.round((rand() * 3) * 100) / 100;
  const jitter   = Math.floor(rand() * 40);

  let status: NetworkAgent['status'] = 'healthy';
  if (download < 15 || latency > 400 || loss > 2) status = 'critical';
  else if (download < 25 || latency > 150 || loss > 0.5) status = 'warning';

  const spark = (base: number, amp: number, n = 24) =>
    Array.from({ length: n }, (_, k) => Math.max(0, base + Math.sin(k / 3) * amp + (mulberry32(i * k + 99)() - 0.5) * amp));

  return {
    id:          `AGENT-${String(i + 1).padStart(3, '0')}`,
    name:        NAMES[i % NAMES.length],
    team:        TEAMS[Math.floor(rand() * TEAMS.length)],
    location:    LOCATIONS[ispIdx % LOCATIONS.length],
    isp:         ISPS[ispIdx],
    ip:          `196.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
    vpn:         rand() > 0.75,
    areaMaxDown: planDown,
    areaMaxUp:   planUp,
    ispCapacity: Math.round(utilPct),
    planDown,
    planUp,
    download:    Math.round(download * 10) / 10,
    upload:      Math.round(upload   * 10) / 10,
    latency,
    loss,
    jitter,
    status,
    lastSeen:    Math.floor(rand() * 15),
    sparkDown:   spark(download, 8),
    sparkUp:     spark(upload, 3),
    sparkLatency:spark(latency, 50),
    shift:       SHIFTS[Math.floor(rand() * SHIFTS.length)],
    online:      rand() > 0.15,
    avatar:      `hsl(${Math.floor(rand() * 360)}, 60%, 55%)`,
  };
}

export const NET_AGENTS: NetworkAgent[] = Array.from({ length: 20 }, (_, i) => makeAgent(i));

export function genHistory(agentId: string): HistoryRow[] {
  const agent = NET_AGENTS.find(a => a.id === agentId) ?? NET_AGENTS[0];
  const seed  = agentId.charCodeAt(agentId.length - 1) + agentId.charCodeAt(0);
  const rand  = mulberry32(seed);
  const now   = Date.now();

  return Array.from({ length: 96 }, (_, i) => {
    const t    = new Date(now - (95 - i) * 15 * 60 * 1000);
    const dl   = Math.max(1, agent.download + Math.sin(i / 6) * 8 + (rand() - 0.5) * 12);
    const ul   = Math.max(0.5, agent.upload + (rand() - 0.5) * 4);
    const lat  = Math.max(20, agent.latency + Math.sin(i / 4) * 40 + (rand() - 0.5) * 60);
    const loss = Math.round((rand() * 2.5) * 100) / 100;
    const jitter = Math.floor(rand() * 35);
    let status: HistoryRow['status'] = 'healthy';
    if (dl < 15 || lat > 400 || loss > 2) status = 'critical';
    else if (dl < 25 || lat > 150 || loss > 0.5) status = 'warning';
    return {
      time:     t,
      download: Math.round(dl * 10) / 10,
      upload:   Math.round(ul * 10) / 10,
      latency:  Math.round(lat),
      loss,
      jitter,
      status,
    };
  });
}

export function genShiftHistory(agentId: string, days: number): ShiftSession[] {
  const seed  = agentId.charCodeAt(0) * 31 + agentId.charCodeAt(agentId.length - 1);
  const rand  = mulberry32(seed);
  const agent = NET_AGENTS.find(a => a.id === agentId) ?? NET_AGENTS[0];
  const [shiftStart] = agent.shift.split('–');
  const [h, m] = shiftStart.split(':').map(Number);

  return Array.from({ length: days }, (_, i) => {
    const base = new Date();
    base.setDate(base.getDate() - i - 1);
    base.setHours(h, m, 0, 0);
    const clockIn   = new Date(base.getTime() + (rand() - 0.5) * 20 * 60000);
    const workedMs  = (7 + rand() * 1.5) * 3600000;
    const clockOut  = new Date(clockIn.getTime() + workedMs);
    const breakMin  = Math.floor(rand() * 60) + 20;
    const activeMs  = workedMs - breakMin * 60000;
    const dl        = Math.max(10, agent.download + (rand() - 0.5) * 10);
    return {
      date:     clockIn.toISOString().slice(0, 10),
      clockIn,
      clockOut,
      workedMs,
      breakMin,
      activeMs,
      tests:    Math.floor(rand() * 30) + 20,
      incidents:Math.floor(rand() * 3),
      avgDown:  Math.round(dl * 10) / 10,
      avgUp:    Math.round(agent.upload * (0.8 + rand() * 0.4) * 10) / 10,
      avgLat:   Math.round(agent.latency * (0.8 + rand() * 0.4)),
    };
  });
}

export const NET_INCIDENTS: NetworkIncident[] = [
  { id: 1,  agent: 'AGENT-004', type: 'critical', msg: 'Download below 5 Mbps for 12 min', time: '2 min ago' },
  { id: 2,  agent: 'AGENT-012', type: 'warning',  msg: 'Latency spike 412ms', time: '8 min ago' },
  { id: 3,  agent: 'AGENT-007', type: 'critical', msg: 'Complete disconnect · 5 min', time: '14 min ago' },
  { id: 4,  agent: 'AGENT-019', type: 'warning',  msg: 'Packet loss 1.8%', time: '21 min ago' },
  { id: 5,  agent: 'AGENT-003', type: 'resolved', msg: 'Upload restored to 12 Mbps', time: '35 min ago' },
  { id: 6,  agent: 'AGENT-016', type: 'critical', msg: 'Upload below 2 Mbps', time: '1h ago' },
  { id: 7,  agent: 'AGENT-009', type: 'warning',  msg: 'Jitter 42ms sustained', time: '2h ago' },
];

export function getIspStats(): IspStats[] {
  const grouped: Record<string, NetworkAgent[]> = {};
  NET_AGENTS.forEach(a => {
    grouped[a.isp] = grouped[a.isp] ?? [];
    grouped[a.isp].push(a);
  });
  return Object.entries(grouped).map(([name, agents], i) => {
    const healthyPct = Math.round((agents.filter(a => a.status === 'healthy').length / agents.length) * 100);
    return {
      name,
      agents:     agents.length,
      avgDown:    Math.round((agents.reduce((s, a) => s + a.download, 0) / agents.length) * 10) / 10,
      avgLatency: Math.round(agents.reduce((s, a) => s + a.latency, 0) / agents.length),
      healthyPct,
      uptime:     Math.round((95 + mulberry32(i * 7)() * 5) * 10) / 10,
      rank:       i + 1,
    };
  }).sort((a, b) => b.healthyPct - a.healthyPct).map((s, i) => ({ ...s, rank: i + 1 }));
}

export function buildTestLog(): TestLogRow[] {
  const rows: TestLogRow[] = [];
  const now = Date.now();
  NET_AGENTS.forEach((agent, ai) => {
    for (let day = 0; day < 14; day++) {
      for (let test = 0; test < 8; test++) {
        const rand = mulberry32(ai * 1000 + day * 10 + test);
        const ts   = now - day * 86400000 - test * 3600000 * 1.5;
        const dl   = Math.max(2, agent.download + (rand() - 0.5) * 10);
        const ul   = Math.max(0.5, agent.upload + (rand() - 0.5) * 4);
        const ping = Math.max(10, agent.latency * 0.6 + (rand() - 0.5) * 20);
        rows.push({
          id:        `T-${String(ai).padStart(2,'0')}-${day}-${test}`,
          agentId:   agent.id,
          agentName: agent.name,
          team:      agent.team,
          ts,
          download:  Math.round(dl * 10) / 10,
          upload:    Math.round(ul * 10) / 10,
          ping:      Math.round(ping),
          latency:   Math.round(ping * 1.1),
          jitter:    Math.floor(rand() * 35),
          ip:        agent.ip,
          isp:       agent.isp,
          vpn:       agent.vpn,
          type:      test === 0 ? 'manual' : 'automated',
          sessionId: `S-${agent.id}-${day}`,
        });
      }
    }
  });
  return rows.sort((a, b) => b.ts - a.ts);
}
