'use client';
import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;
const base: IconProps = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const NetIcons = {
  Dashboard:  (p: IconProps) => <svg {...base} {...p}><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>,
  Agents:     (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg>,
  Incidents:  (p: IconProps) => <svg {...base} {...p}><path d="M8 2L14 12H2L8 2z"/><path d="M8 7v3"/><circle cx="8" cy="11.5" r=".5" fill="currentColor" stroke="none"/></svg>,
  Isp:        (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6"/></svg>,
  Shifts:     (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>,
  Alerts:     (p: IconProps) => <svg {...base} {...p}><path d="M13.5 13.5l-3-3"/><circle cx="7" cy="7" r="5"/><path d="M7 4v3M7 9.5V10"/></svg>,
  Settings:   (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42"/></svg>,
  Search:     (p: IconProps) => <svg {...base} {...p}><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg>,
  Download:   (p: IconProps) => <svg {...base} {...p}><path d="M8 2v8"/><path d="M5 7l3 3 3-3"/><path d="M2 13h12"/></svg>,
  Upload:     (p: IconProps) => <svg {...base} {...p}><path d="M8 14V6"/><path d="M5 9l3-3 3 3"/><path d="M2 3h12"/></svg>,
  Zap:        (p: IconProps) => <svg {...base} {...p}><path d="M9 2L4 9h5l-2 5 7-7H9L11 2z" fill="currentColor" stroke="none"/></svg>,
  Refresh:    (p: IconProps) => <svg {...base} {...p}><path d="M13 8A5 5 0 1 1 8 3"/><path d="M13 2v5h-5"/></svg>,
  Plus:       (p: IconProps) => <svg {...base} {...p}><path d="M8 3v10M3 8h10"/></svg>,
  ArrowRight: (p: IconProps) => <svg {...base} {...p}><path d="M3 8h10M9 5l4 3-4 3"/></svg>,
  ChevronRight:(p: IconProps) => <svg {...base} {...p}><path d="M6 4l4 4-4 4"/></svg>,
  ChevronDown:(p: IconProps) => <svg {...base} {...p}><path d="M4 6l4 4 4-4"/></svg>,
  Clock:      (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/></svg>,
  Sun:        (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42"/></svg>,
  Moon:       (p: IconProps) => <svg {...base} {...p}><path d="M12 10a6 6 0 1 1-6-8 4.5 4.5 0 0 0 6 8z"/></svg>,
  Logout:     (p: IconProps) => <svg {...base} {...p}><path d="M10 3h3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3"/><path d="M7 5l-3 3 3 3"/><path d="M4 8h8"/></svg>,
  User:       (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6"/></svg>,
  Check:      (p: IconProps) => <svg {...base} {...p}><path d="M3 8l4 4 6-7"/></svg>,
  Globe:      (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6"/></svg>,
  Monitor:    (p: IconProps) => <svg {...base} {...p}><rect x="1" y="3" width="14" height="9" rx="1.5"/><path d="M5 14h6M8 12v2"/></svg>,
  Activity:   (p: IconProps) => <svg {...base} {...p}><path d="M1 8h3l2-5 3 10 2-5 2 3 2-3h1" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Report:     (p: IconProps) => <svg {...base} {...p}><rect x="3" y="2" width="10" height="12" rx="1"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3"/></svg>,
  Filter:     (p: IconProps) => <svg {...base} {...p}><path d="M2 4h12M5 8h6M7 12h2"/></svg>,
  Calendar:   (p: IconProps) => <svg {...base} {...p}><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 2v2M11 2v2M2 7h12"/></svg>,
  VpnOn:      (p: IconProps) => <svg {...base} {...p}><path d="M8 2l5 3v4c0 3.5-2.5 6-5 7-2.5-1-5-3.5-5-7V5l5-3z"/><path d="M5.5 8l2 2 3-3"/></svg>,
  VpnOff:     (p: IconProps) => <svg {...base} {...p}><path d="M8 2l5 3v4c0 .9-.1 1.8-.4 2.6M4 5.4l-1 .6v4c0 3.5 2.5 6 5 7 .9-.4 1.7-.9 2.5-1.6"/><path d="M2 2l12 12"/></svg>,
  ClockIn:    (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/><path d="M12 1l3 3-3 3"/></svg>,
  ClockOut:   (p: IconProps) => <svg {...base} {...p}><circle cx="8" cy="8" r="6"/><path d="M8 5v3l2 2"/><path d="M15 1l-3 3 3 3"/></svg>,
  Shield:     (p: IconProps) => <svg {...base} {...p}><path d="M8 2l5 3v4c0 3.5-2.5 6-5 7-2.5-1-5-3.5-5-7V5l5-3z"/></svg>,
  Pin:        (p: IconProps) => <svg {...base} {...p}><path d="M8 2a4 4 0 0 1 4 4c0 3-4 8-4 8S4 9 4 6a4 4 0 0 1 4-4z"/><circle cx="8" cy="6" r="1.5" fill="currentColor" stroke="none"/></svg>,
};
