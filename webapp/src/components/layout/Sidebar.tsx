import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Check, ChevronRight, FileSpreadsheet, Star } from 'lucide-react'
import { ancestorSlugs, flattenNavItems, navGroups, orderedEntries, parseBasecampLabel } from '@/lib/roadmap'
import { getSnippetById } from '@/lib/content'
import { allLessons, nextUpLesson, overallProgress } from '@/lib/progress'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { useLibrary } from '@/hooks/useLibrary'
import type { NavItem, Snippet } from '@/types'
import { cn } from '@/lib/cn'

const lessonIds = new Set(allLessons.map((s) => s.id))

function lessonsIn(item: NavItem) {
  return flattenNavItems([item]).flatMap((node) => node.snippets).filter((s) => lessonIds.has(s.id))
}

// A stop on the path: filled when done, ringed when it is the lesson you are on,
// hollow while it is still ahead of you.
function Stop({ state }: { state: 'done' | 'here' | 'next' | 'ahead' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute top-1/2 -left-[6.5px] h-[10px] w-[10px] -translate-y-1/2 rounded-full border-[2px] bg-[var(--color-bg)] transition-colors',
        state === 'done' && 'border-[var(--stop)] bg-[var(--stop)]',
        state === 'here' && 'border-[var(--color-ink)] bg-[var(--stop)] shadow-[0_0_0_3px_var(--stop)]',
        state === 'next' && 'border-[var(--stop)]',
        state === 'ahead' && 'border-[var(--stop)] opacity-60',
      )}
    />
  )
}

// Sub-folders and lessons in learning order, with neighbouring lessons kept together on one rail.
type EntryGroup = { type: 'section'; item: NavItem } | { type: 'lessons'; snippets: Snippet[] }
function groupEntries(item: NavItem): EntryGroup[] {
  const groups: EntryGroup[] = []
  for (const entry of orderedEntries(item)) {
    if (entry.kind === 'section') {
      groups.push({ type: 'section', item: entry.item })
    } else {
      const last = groups[groups.length - 1]
      if (last?.type === 'lessons') last.snippets.push(entry.snippet)
      else groups.push({ type: 'lessons', snippets: [entry.snippet] })
    }
  }
  return groups
}

function Section({
  line,
  item,
  depth,
  expanded,
  toggle,
  currentId,
  nextId,
  onNavigate,
}: {
  line: number
  item: NavItem
  depth: number
  expanded: Record<string, boolean>
  toggle: (slug: string) => void
  currentId?: string
  nextId?: string
  onNavigate?: () => void
}) {
  const { isFavorite, isDone } = useLibrary()
  const isOpen = expanded[item.slug] ?? false
  const lessons = lessonsIn(item)
  const doneCount = lessons.filter((s) => isDone(s.id)).length
  const allDone = lessons.length > 0 && doneCount === lessons.length

  return (
    <div style={{ '--stop': lineColor(line) } as CSSProperties}>
      <button
        onClick={() => toggle(item.slug)}
        aria-expanded={isOpen}
        className={cn(
          'group flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-left text-[13px] transition-colors hover:bg-[var(--color-surface-hover)]',
          depth === 0 ? 'font-medium text-[var(--color-ink)]' : 'text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]',
        )}
        style={{ paddingLeft: `${depth * 0.9 + 0.35}rem` }}
      >
        <ChevronRight
          className={cn('h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)] transition-transform duration-200', isOpen && 'rotate-90')}
        />
        {depth === 0 && <span aria-hidden className="h-2 w-5 shrink-0 rounded-full bg-[var(--stop)]" />}
        <span className="truncate">{item.label}</span>
        {lessons.length > 0 && (
          <span className="ml-auto flex shrink-0 items-center gap-1 text-[11px] tabular-nums text-[var(--color-ink-faint)]">
            {allDone ? <Check className="h-3 w-3 text-[var(--color-accent-soft)]" strokeWidth={3} aria-label="All done" /> : `${doneCount}/${lessons.length}`}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-fade-up">
          {groupEntries(item).map((group, groupIndex) =>
            group.type === 'section' ? (
              <Section
                key={group.item.slug}
                line={line}
                item={group.item}
                depth={depth + 1}
                expanded={expanded}
                toggle={toggle}
                currentId={currentId}
                nextId={nextId}
                onNavigate={onNavigate}
              />
            ) : (
              <div
                key={`lessons-${groupIndex}`}
                className="relative my-0.5 border-l-[3px] border-l-[color:color-mix(in_srgb,var(--stop)_55%,transparent)]"
                style={{ marginLeft: `${(depth + 1) * 0.9 + 0.35 + 0.3}rem` }}
              >
                {group.snippets.map((snippet) => {
                  const isData = snippet.filename.endsWith('.csv')
                  const finished = isDone(snippet.id)
                  const state = snippet.id === currentId ? 'here' : finished ? 'done' : snippet.id === nextId ? 'next' : 'ahead'
                  return (
                    <NavLink
                      key={snippet.id}
                      to={`/s/${snippet.id}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          'relative flex items-center gap-1.5 rounded-r-md py-1.5 pr-2 pl-4 text-[13px] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]',
                          isActive
                            ? 'bg-[var(--color-surface-hover)] font-medium text-[var(--color-ink)]'
                            : finished
                              ? 'text-[var(--color-ink-faint)]'
                              : 'text-[var(--color-ink-dim)]',
                        )
                      }
                    >
                      {!isData && <Stop state={state} />}
                      {isData && <FileSpreadsheet className="h-3 w-3 shrink-0 text-[var(--color-ink-faint)]" aria-hidden />}
                      <span className="truncate">{snippet.title}</span>
                      <span className="ml-auto flex shrink-0 items-center gap-1.5">
                        {state === 'next' && (
                          <span className="rounded-[3px] bg-[var(--color-accent-glow)]/30 px-1.5 text-xs font-medium text-[var(--color-accent-soft)]">
                            next
                          </span>
                        )}
                        {isFavorite(snippet.id) && (
                          <Star aria-label="Saved" className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                        )}
                      </span>
                    </NavLink>
                  )
                })}
              </div>
            ),
          )}
        </div>
      )}
    </div>
  )
}

// `onNavigate` lets the mobile drawer close itself when a lesson is chosen.
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const { favorites, done } = useLibrary()
  const currentId = location.pathname.match(/^\/s\/(.+)$/)?.[1]
  const next = useMemo(() => nextUpLesson(done), [done])
  const progress = overallProgress(done)
  const savedLessons = favorites.map(getSnippetById).filter((s) => s !== undefined)

  // Only the sections that hold the lesson you are on (or the one you should do next)
  // start open, so the path is a short list you can read, not 85 rows.
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    const focus = currentId ?? next?.id
    const firstTrack = navGroups[0]?.categories[0]
    if (focus) ancestorSlugs(focus).forEach((slug) => (initial[slug] = true))
    else if (firstTrack) initial[firstTrack.slug] = true
    return initial
  })

  const toggle = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }))

  // Arriving from search or a link opens the trail down to the lesson and keeps it in view.
  useEffect(() => {
    if (!currentId) return
    const open = ancestorSlugs(currentId)
    if (open.length) setExpanded((prev) => ({ ...prev, ...Object.fromEntries(open.map((slug) => [slug, true])) }))
    const frame = requestAnimationFrame(() => {
      navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
    })
    return () => cancelAnimationFrame(frame)
  }, [currentId])

  return (
    <nav ref={navRef} aria-label="Lessons" className="flex h-full flex-col gap-5 overflow-y-auto px-3 py-5">
      <div className="px-2">
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Your path</h2>
        <p className="mt-0.5 text-xs text-[var(--color-ink-faint)]">
          {progress.done === 0 ? `${progress.total} lessons, in order` : `${progress.done} of ${progress.total} lessons done`}
        </p>
        <div
          className="mt-2 h-[3px] overflow-hidden rounded-full bg-[var(--color-border)]"
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lessons done"
        >
          <div className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      {savedLessons.length > 0 && (
        <div>
          <div className="mb-1 flex items-center gap-1.5 px-2 text-xs font-medium text-[var(--color-ink-dim)]">
            <Star className="h-3 w-3" /> Saved
          </div>
          <div className="flex flex-col">
            {savedLessons.map((snippet) => (
              <NavLink
                key={snippet.id}
                to={`/s/${snippet.id}`}
                onClick={onNavigate}
                className="truncate rounded-md px-2 py-1.5 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]"
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
            <div className="mb-1 flex items-baseline justify-between gap-2 px-2">
              <span className="text-[13px] font-semibold leading-snug text-[var(--color-ink)]">{label.name}</span>
              {label.duration && <span className="shrink-0 text-[11px] text-[var(--color-ink-faint)]">{label.duration}</span>}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.categories.map((category) => (
                <Section
                  key={category.slug}
                  line={trackIndexOf(category.slug)}
                  item={category}
                  depth={0}
                  expanded={expanded}
                  toggle={toggle}
                  currentId={currentId}
                  nextId={next?.id}
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
