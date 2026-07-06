// The site's mark — same chevron+cursor motif as the browser-tab favicon, but
// built from CSS variables instead of hardcoded colors, so it re-themes live:
// the box lightens for Quiet Light, and the chevron/cursor pick up each
// theme's own accent/ember pair (Aurora's violet+amber, Vesper's peach+mint)
// instead of the favicon's single fixed palette (a <link rel="icon"> can't
// read page CSS, so that one has to stay static).
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="8"
        fill="var(--color-bg-elevated)"
        stroke="var(--color-border)"
        strokeWidth="1.5"
      />
      <path
        d="M11 12 L17 16 L11 20"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="19" y="18.5" width="7" height="2.6" rx="1.3" fill="var(--color-ember)" />
    </svg>
  )
}
