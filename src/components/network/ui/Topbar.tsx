'use client';
import React from 'react';

interface Crumb { label: React.ReactNode; onClick?: () => void; }

interface TopbarProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  crumbs?: Crumb[];
}

export function NetTopbar({ title, subtitle, actions, crumbs }: TopbarProps) {
  return (
    <div className="topbar">
      <div style={{ minWidth: 0 }}>
        {crumbs && crumbs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--net-text-dim)', marginBottom: 6, flexWrap: 'wrap' }}>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
                {c.onClick
                  ? <button onClick={c.onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--net-brand-accent)', fontFamily: 'var(--net-font-sans)', fontSize: 12, padding: 0 }}>{c.label}</button>
                  : <span>{c.label}</span>
                }
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--net-text)', letterSpacing: '-0.01em', margin: 0, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {title}
        </h1>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--net-text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  );
}
