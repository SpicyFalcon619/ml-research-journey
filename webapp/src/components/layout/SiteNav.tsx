import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/cn'

// Where the sidebar is a lesson tree, this is the way around the rest of the site, so
// Explore and Your progress are reachable from the main page and not only from the sidebar.
const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/explore', label: 'Explore', end: false },
  { to: '/me', label: 'Your progress', end: false },
]

export function SiteNav() {
  const roadmapUrl = `${import.meta.env.BASE_URL}ml-research-roadmap.html`
  const base =
    'whitespace-nowrap border-b-2 px-0.5 pb-2 pt-1 text-sm transition-colors'

  return (
    <nav aria-label="Site" className="mx-4 mt-4 flex gap-6 overflow-x-auto border-b border-[var(--color-border)] px-2 sm:mx-6">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            cn(
              base,
              isActive
                ? 'border-[var(--color-accent)] font-medium text-[var(--color-ink)]'
                : 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]',
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
      <a
        href={roadmapUrl}
        className={cn(base, 'border-transparent text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]')}
      >
        Roadmap
      </a>
    </nav>
  )
}
