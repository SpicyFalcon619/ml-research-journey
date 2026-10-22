import type { SVGProps } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Logo } from './Logo'
import { cn } from '@/lib/cn'
import { isMac } from '@/lib/platform'

function GithubMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

export function TopBar({
  onOpenSearch,
  onOpenDrawer,
  sidebarOpen = true,
}: {
  onOpenSearch: () => void
  onOpenDrawer: () => void
  sidebarOpen?: boolean
}) {
  const location = useLocation()
  // On snippet pages the code block's own header takes over as the persistent,
  // reachable control (Run/Copy), so the site nav scrolls away instead of
  // competing with it for sticky real estate.
  const isSnippetPage = location.pathname.startsWith('/s/')

  return (
    <header
      className={cn(
        'glass-panel solid z-30 mx-4 mt-4 flex items-center gap-2 rounded-2xl px-3 py-3 sm:mx-6 sm:gap-3 sm:px-4',
        // Both are positioned, so the search box below can be centered against this bar.
        isSnippetPage ? 'relative' : 'sticky top-4',
      )}
    >
      {/* The sidebar is hidden below the laptop breakpoint, so phones get a menu button for it. */}
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>
      <Link to="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-[var(--color-ink)]">
        <Logo className="h-7 w-7 shrink-0" />
        <span className="hidden sm:inline">Field Guide</span>
      </Link>
      
      {/* On wide screens the search box is pinned to the true middle of the bar. Left in the
          flex row it sat between the logo and the buttons, and because the buttons are wider
          than the logo it drifted left of the page's center line. */}
      <div className="flex min-w-0 flex-1 justify-center transition-all duration-300 xl:absolute xl:top-1/2 xl:left-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 xl:flex-none">
        <button
          onClick={onOpenSearch}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink-faint)] transition-all hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink-dim)] cursor-pointer",
            sidebarOpen ? "w-full max-w-md xl:w-[28rem]" : "w-full max-w-2xl xl:w-[42rem]"
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate text-left">
            Search<span className="hidden sm:inline"> snippets…</span>
          </span>
          <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        {/* The roadmap is a separate static page on the same site (copied in by the deploy workflow). */}
        <a
          href={`${import.meta.env.BASE_URL}ml-research-roadmap.html`}
          className="hidden items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] sm:flex"
        >
          Roadmap
        </a>
        <ThemeToggle />
        <a
          href="https://github.com/SpicyFalcon619/ml-research-journey"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-[var(--color-ink-faint)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
          aria-label="View repository on GitHub"
        >
          <GithubMark className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
