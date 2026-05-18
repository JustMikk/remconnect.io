export type NetworkStatus = 'healthy' | 'warning' | 'critical';

export interface NetworkAgent {
  id: string;
  name: string;
  team: string;
  location: string;
  isp: string;
  ip: string;
  vpn: boolean;
  areaMaxDown: number;
  areaMaxUp: number;
  ispCapacity: number;
  planDown: number;
  planUp: number;
  download: number;
  upload: number;
  latency: number;
  loss: number;
  jitter: number;
  status: NetworkStatus;
  lastSeen: number;
  sparkDown: number[];
  sparkUp: number[];
  sparkLatency: number[];
  shift: string;
  online: boolean;
  avatar: string;
}

export interface NetworkIncident {
  id: number;
  agent: string;
  type: NetworkStatus | 'resolved';
  msg: string;
  time: string;
}

export interface IspStats {
  name: string;
  agents: number;
  avgDown: number;
  avgLatency: number;
  healthyPct: number;
  uptime: number;
  rank: number;
}

export interface HistoryRow {
  time: Date;
  download: number;
  upload: number;
  latency: number;
  loss: number;
  jitter: number;
  status: NetworkStatus;
}

export interface ShiftSession {
  date: string;
  clockIn: Date;
  clockOut: Date;
  workedMs: number;
  breakMin: number;
  activeMs: number;
  tests: number;
  incidents: number;
  avgDown: number;
  avgUp: number;
  avgLat: number;
}

export interface TestLogRow {
  id: string;
  agentId: string;
  agentName: string;
  team: string;
  ts: number;
  download: number;
  upload: number;
  ping: number;
  latency: number;
  jitter: number;
  ip: string;
  isp: string;
  vpn: boolean;
  type: 'automated' | 'manual';
  sessionId: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  severity: NetworkStatus;
  enabled: boolean;
  triggered: number;
}
