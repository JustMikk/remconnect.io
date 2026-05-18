'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`toggle-track${checked ? ' on' : ''}`}
    >
      <span className="toggle-thumb"/>
    </button>
  );
}
