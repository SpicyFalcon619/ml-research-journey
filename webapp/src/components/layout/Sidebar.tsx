import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Check, ChevronRight, FileSpreadsheet, Star } from 'lucide-react'
import { ancestorSlugs, navGroups, parseBasecampLabel } from '@/lib/roadmap'
import { getSnippetById } from '@/lib/content'
import { useLibrary } from '@/hooks/useLibrary'
import type { NavItem } from '@/types'
import { cn } from '@/lib/cn'

function NavNode({
  item,
  depth,
  expanded,
  toggle,
  onNavigate,
}: {
  item: NavItem
  depth: number
  expanded: Record<string, boolean>
  toggle: (slug: string) => void
  onNavigate?: () => void
}) {
  const { isFavorite, isDone } = useLibrary()
  const isOpen = expanded[item.slug] ?? false
  const hasContent = item.children.length > 0 || item.snippets.length > 0

  return (
    <div>
      <button
        onClick={() => toggle(item.slug)}
        className="flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-[13px] font-medium text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] cursor-pointer"
        style={{ paddingLeft: `${depth * 0.85 + 0.5}rem` }}
      >
        {hasContent ? (
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')} />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="truncate">{item.label}</span>
      </button>
      {isOpen && hasContent && (
        <div className="animate-fade-up">
          {item.children.map((child) => (
            <NavNode
              key={child.slug}
              item={child}
              depth={depth + 1}
              expanded={expanded}
              toggle={toggle}
              onNavigate={onNavigate}
            />
          ))}
          {item.snippets.map((snippet) => {
            const isData = snippet.filename.endsWith('.csv')
            return (
              <NavLink
                key={snippet.id}
                to={`/s/${snippet.id}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 truncate rounded-lg py-1.5 pr-2 text-[13px] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]',
                    isData ? 'font-semibold text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]',
                    isActive && 'bg-[var(--color-accent-glow)]/[0.18] text-[var(--color-accent-soft)]',
                  )
                }
                style={{ paddingLeft: `${(depth + 1) * 0.85 + 0.5 + 1.25}rem` }}
              >
                {isData && <FileSpreadsheet className="h-3 w-3 shrink-0" />}
                <span className="truncate">{snippet.title}</span>
                {(isDone(snippet.id) || isFavorite(snippet.id)) && (
                  <span className="ml-auto flex shrink-0 items-center gap-1.5">
                    {isFavorite(snippet.id) && (
                      <Star aria-label="Saved" className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                    )}
                    {isDone(snippet.id) && (
                      <Check aria-label="Done" className="h-3 w-3 text-[var(--color-accent-soft)]" strokeWidth={3} />
                    )}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

// `onNavigate` lets the mobile drawer close itself when a lesson is chosen.
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navGroups.forEach((group) => group.categories.forEach((c) => (initial[c.slug] = true)))
    return initial
  })

  const toggle = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !(prev[slug] ?? false) }))

  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const { favorites } = useLibrary()
  const savedLessons = favorites.map(getSnippetById).filter((s) => s !== undefined)

  // Open whichever sections hold the lesson you're on and keep it in view, so
  // arriving from search or a link shows where you are in the trail.
  useEffect(() => {
    const match = location.pathname.match(/^\/s\/(.+)$/)
    if (!match) return
    const open = ancestorSlugs(match[1])
    if (open.length) setExpanded((prev) => ({ ...prev, ...Object.fromEntries(open.map((slug) => [slug, true])) }))
    const frame = requestAnimationFrame(() => {
      navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  return (
    <nav ref={navRef} aria-label="Lessons" className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
      {savedLessons.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
            <Star className="h-3 w-3" /> Saved
          </div>
          <div className="flex flex-col gap-0.5">
            {savedLessons.map((snippet) => (
              <NavLink
                key={snippet.id}
                to={`/s/${snippet.id}`}
                onClick={onNavigate}
                className="truncate rounded-lg px-2 py-1.5 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]"
              >
                {snippet.title}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      {navGroups.map((group) => {
        const label = parseBasecampLabel(group.label)
        return (
          <div key={group.slug}>
            <div className="mb-2 px-2">
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                {label.eyebrow}
                {label.duration ? ` · ${label.duration}` : ''}
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-[var(--color-ink-dim)]">{label.name}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {group.categories.map((category) => (
                <NavNode
                  key={category.slug}
                  item={category}
                  depth={0}
                  expanded={expanded}
                  toggle={toggle}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
