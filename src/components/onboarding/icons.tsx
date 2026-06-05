// Inline stroke icons used across the onboarding flow.
// Kept as small components so step markup stays readable.
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function base(size: number, sw: number, props: P) {
  const { size: _omit, strokeWidth, ...rest } = props
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: strokeWidth ?? sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  }
}

export const CheckIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 2.4, p)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const ArrowRight = ({ size = 14, ...p }: P) => (
  <svg {...base(size, 2.4, p)}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)

export const ArrowLeft = ({ size = 14, ...p }: P) => (
  <svg {...base(size, 2.4, p)}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)

export const AlertCircle = ({ size = 13, ...p }: P) => (
  <svg {...base(size, 2.2, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

export const ClockIcon = ({ size = 15, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const EyeIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 1.8, p)}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const MailIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 1.6, p)}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
)

export const LockIcon = ({ size = 15, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const LockSmall = ({ size = 11, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)

export const SearchIcon = ({ size = 17, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

export const PlusIcon = ({ size = 13, ...p }: P) => (
  <svg {...base(size, 2.6, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const CloseIcon = ({ size = 16, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const TrashIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 2, p)}>
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
  </svg>
)

export const UploadIcon = ({ size = 26, ...p }: P) => (
  <svg {...base(size, 1.6, p)}>
    <path d="M12 16V4M7 9l5-5 5 5" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
)

export const BriefcaseIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 1.7, p)}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

export const CapIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 1.7, p)}>
    <path d="m3 7 9-4 9 4-9 4-9-4Z" />
    <path d="M7 9v5c0 1.5 2.5 3 5 3s5-1.5 5-3V9" />
  </svg>
)

export const ShieldIcon = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 1.7, p)}>
    <path d="M12 2 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6Z" />
  </svg>
)

export const ListIcon = ({ size = 20, ...p }: P) => (
  <svg {...base(size, 1.7, p)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
)

export const PlusCircle = ({ size = 20, ...p }: P) => (
  <svg {...base(size, 1.7, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8M12 8v8" />
  </svg>
)

// Small Ethiopian flag swatch reused in the phone prefix / nationality pill.
export const EthFlag = ({ className = 'flag' }: { className?: string }) => (
  <span className={className}>
    <i style={{ background: '#078930' }} />
    <i style={{ background: '#fcdd09' }} />
    <i style={{ background: '#da121a' }} />
  </span>
)
