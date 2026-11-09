import type { SVGProps } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'
import { cn } from '@/lib/cn'
import { isMac } from '@/lib/platform'
import { GUIDES, THIS_GUIDE } from '@/lib/guides'

function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

// The same pages, in the same order, in all three field guides. (This guide's Roadmap page is linked from the home page.)
const NAV = [
  { to: '/explore', label: 'Explore' },
  { to: '/sandbox', label: 'Sandbox' },
  { to: '/me', label: 'Progress' },
  { to: '/glossary', label: 'Glossary' },
]

export function TopBar({
  onOpenSearch,
  onOpenDrawer,
  sidebarOpen,
  onToggleSidebar,
}: {
  onOpenSearch: () => void
  onOpenDrawer: () => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}) {
  const location = useLocation()
  // On lesson pages the code block's own header is the sticky control (Run, Copy),
  // so this bar scrolls away there instead of competing with it.
  const isSnippetPage = location.pathname.startsWith('/s/')
  const linkBase = 'rounded-md px-2.5 py-1.5 text-sm transition-colors'

  return (
    <header
      className={cn(
        'z-30 flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 px-4 py-2.5 backdrop-blur-md sm:gap-3 sm:px-8',
        isSnippetPage ? 'relative' : 'sticky top-0',
      )}
    >
      {/* On a wide screen the lesson path is a sidebar, and its toggle sits first in the bar, where most sites keep it. */}
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? 'Hide the lesson path' : 'Show the lesson path'}
        aria-pressed={sidebarOpen}
        title={sidebarOpen ? 'Hide the lesson path' : 'Show the lesson path'}
        className="hidden shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] lg:flex"
      >
        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>
      {/* The path rail is hidden below the laptop breakpoint, so phones get a menu button for it. */}
      <button
        onClick={onOpenDrawer}
        aria-label="Open the lesson path"
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <Link to="/" aria-label="ML Field Guide home" className="flex shrink-0 items-center gap-2 pr-2 font-semibold tracking-tight text-[var(--color-ink)] sm:min-w-[14.5rem]">
        <Logo className="h-7 w-7 shrink-0" />
        <span className="hidden sm:inline">ML Field Guide</span>
      </Link>

      <nav aria-label="Site" className="hidden items-center gap-0.5 md:flex">
        {NAV.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                linkBase,
                isActive
                  ? 'bg-[var(--color-surface-hover)] font-medium text-[var(--color-ink)]'
                  : 'text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* The other field guides: separate sites that point at each other. Phones find them in the lesson menu. */}
      <nav aria-label="Other field guides" className="hidden items-center gap-0.5 border-l border-[var(--color-border)] pl-2 xl:flex">
        {/* The same three guides, in the same order, on every site, so they sit in the same place. The current one is marked. */}
        {GUIDES.map((guide) =>
          guide.id === THIS_GUIDE ? (
            <span
              key={guide.id}
              aria-current="page"
              title={`You are in the ${guide.name}`}
              className={cn(linkBase, 'inline-flex items-center gap-1 bg-[var(--color-surface-hover)] font-medium text-[var(--color-ink)]')}
            >
              {guide.short}
              <span className="h-3 w-3 shrink-0" aria-hidden />
              <span className="sr-only">Field Guide (this site)</span>
            </span>
          ) : (
            <a
              key={guide.id}
              href={guide.url}
              title={`${guide.name}: ${guide.blurb}`}
              className={cn(linkBase, 'inline-flex items-center gap-1 text-[var(--color-ink-dim)] hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]')}
            >
              {guide.short}
              <ArrowUpRight className="h-3 w-3 shrink-0 text-[var(--color-ink-faint)]" aria-hidden />
              <span className="sr-only">Field Guide</span>
            </a>
          ),
        )}
      </nav>

      <button
        onClick={onOpenSearch}
        className="ml-auto flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink-dim)] sm:max-w-sm"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate text-left">Find a concept</span>
        <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-ink-dim)] 2xl:inline">
          {isMac ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        <a
          href="https://github.com/SpicyFalcon619/ml-research-journey"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-lg border border-[var(--color-border)] p-2 text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
          aria-label="View repository on GitHub"
        >
          <GithubMark className="h-4 w-4" />
        </a>
      </div>
      <span aria-hidden className="line-stripe pointer-events-none absolute inset-x-0 -bottom-px" />
    </header>
  )
}
