import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Search, Star } from 'lucide-react'
import { snippets } from '@/lib/content'
import { navGroups } from '@/lib/roadmap'
import { CATEGORY_INFO } from '@/lib/categoryInfo'
import { allTagCounts, tagPath } from '@/lib/tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/hooks/useLibrary'
import { cn } from '@/lib/cn'
import type { NavItem, Snippet } from '@/types'

type View = 'track' | 'tag' | 'az'
type Status = 'all' | 'todo' | 'done' | 'saved'

const VIEWS: { id: View; label: string }[] = [
  { id: 'track', label: 'By track' },
  { id: 'tag', label: 'By tag' },
  { id: 'az', label: 'A to Z' },
]
const STATUSES: { id: Status; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'todo', label: 'Not done' },
  { id: 'done', label: 'Done' },
  { id: 'saved', label: 'Saved' },
]
const TAG_PREVIEW = 80

function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (id: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={option.id === value}
          onClick={() => onChange(option.id)}
          className={cn(
            'cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors',
            option.id === value
              ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
              : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

// One lesson in a list. The round tick on the left marks it done and the star on the right
// saves it, so both can be done straight from here without opening the lesson. They are
// buttons beside the link (a button can't sit inside a link), not part of it.
function LessonRow({ snippet }: { snippet: Snippet }) {
  const { isDone, isFavorite, toggleDone, toggleFavorite } = useLibrary()
  const done = isDone(snippet.id)
  const saved = isFavorite(snippet.id)
  const isData = snippet.filename.endsWith('.csv')
  return (
    <li className="group flex items-center gap-1 rounded-lg px-1 transition-colors hover:bg-[var(--color-surface-hover)]">
      {isData ? (
        // Data files aren't something you finish, so they get no tick (but can still be saved).
        <span aria-hidden className="h-8 w-8 shrink-0" />
      ) : (
        <button
          type="button"
          onClick={() => toggleDone(snippet.id)}
          aria-pressed={done}
          aria-label={`Mark ${snippet.title} as done`}
          title={done ? 'Done. Click to undo' : 'Mark as done'}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
        >
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border transition-colors',
              done
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-ink)]'
                : 'border-[var(--color-border-strong)] text-transparent group-hover:border-[var(--color-ink-faint)] hover:!border-[var(--color-accent)] hover:!text-[var(--color-accent-soft)]',
            )}
          >
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
        </button>
      )}
      <Link to={`/s/${snippet.id}`} className="flex min-w-0 flex-1 items-center gap-3 py-2 pr-1">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--color-ink)]">{snippet.title}</span>
          <span className="block truncate font-mono text-xs text-[var(--color-ink-faint)]">{snippet.filename}</span>
        </span>
        <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-faint)]">{isData ? 'data' : `${snippet.lineCount}L`}</span>
      </Link>
      <button
        type="button"
        onClick={() => toggleFavorite(snippet.id)}
        aria-pressed={saved}
        aria-label={`Save ${snippet.title}`}
        title={saved ? 'Saved. Click to remove' : 'Save for later'}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full"
      >
        <Star
          className={cn(
            'h-4 w-4 transition-colors',
            saved
              ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
              : 'text-[var(--color-ink-faint)]/60 hover:text-[var(--color-ink)] group-hover:text-[var(--color-ink-faint)]',
          )}
        />
      </button>
    </li>
  )
}

function Section({ item, depth, show }: { item: NavItem; depth: number; show: (s: Snippet) => boolean }) {
  const lessons = item.snippets.filter(show)
  const children = item.children
  const nonEmpty = (node: NavItem): boolean => node.snippets.some(show) || node.children.some(nonEmpty)
  if (!nonEmpty(item)) return null
  // Track titles are h2, so sub-sections start at h3 and nest from there (no skipped levels).
  const SubHeading = depth === 1 ? 'h3' : 'h4'
  return (
    <div className={cn(depth > 0 && 'mt-4')}>
      {depth > 0 && <SubHeading className="mb-1 px-2 text-xs font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">{item.label}</SubHeading>}
      {children.map((child) => (
        <Section key={child.slug} item={child} depth={depth + 1} show={show} />
      ))}
      {lessons.length > 0 && <ul className="flex flex-col">{lessons.map((s) => <LessonRow key={s.id} snippet={s} />)}</ul>}
    </div>
  )
}

// Everything in the guide on one page, so the sidebar isn't the only way to find a lesson:
// browse by track, by tag, or A to Z, filter by text, and narrow by your own progress.
export function ExplorePage() {
  useDocumentTitle('Explore')
  const { isDone, isFavorite } = useLibrary()
  const [params, setParams] = useSearchParams()
  const view = (VIEWS.some((v) => v.id === params.get('view')) ? params.get('view') : 'track') as View
  const status = (STATUSES.some((s) => s.id === params.get('show')) ? params.get('show') : 'all') as Status
  const query = params.get('q') ?? ''
  const [showAllTags, setShowAllTags] = useState(false)

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value && value !== 'all' && !(key === 'view' && value === 'track')) next.set(key, value)
      else next.delete(key)
    }
    setParams(next, { replace: true })
  }

  const needle = query.trim().toLowerCase()
  const show = (snippet: Snippet): boolean => {
    if (needle && !(snippet.title.toLowerCase().includes(needle) || snippet.filename.toLowerCase().includes(needle) || snippet.tags.some((t) => t.includes(needle)))) return false
    switch (status) {
      case 'todo':
        return !isDone(snippet.id)
      case 'done':
        return isDone(snippet.id)
      case 'saved':
        return isFavorite(snippet.id)
      default:
        return true
    }
  }

  const categories = navGroups.flatMap((g) => g.categories)
  const matching = useMemo(() => snippets.filter(show), [needle, status, isDone, isFavorite]) // eslint-disable-line react-hooks/exhaustive-deps
  const tags = useMemo(() => allTagCounts().filter((t) => !needle || t.tag.includes(needle)), [needle])
  const alphabetical = useMemo(() => [...matching].sort((a, b) => a.title.localeCompare(b.title)), [matching])
  const letters = useMemo(() => {
    const groups = new Map<string, Snippet[]>()
    for (const s of alphabetical) {
      const letter = /[a-z]/i.test(s.title[0]) ? s.title[0].toUpperCase() : '#'
      groups.set(letter, [...(groups.get(letter) ?? []), s])
    }
    return [...groups.entries()]
  }, [alphabetical])

  const countLabel = view === 'tag' ? `${tags.length} tags` : `${matching.length} of ${snippets.length} lessons`

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Explore</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-dim)]">
          Everything in the guide in one place. Browse by track, by tag or A to Z, and use the filters to find what you
          have left to do or what you've saved.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4 border-y border-[var(--color-border)] py-4">
        <label className="relative block">
          <span className="sr-only">Filter</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]" />
          <input
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={view === 'tag' ? 'Filter tags' : 'Filter by title, file name or tag'}
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pr-3 pl-9 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <Segmented label="View" value={view} options={VIEWS} onChange={(id) => update({ view: id })} />
          {view !== 'tag' && <Segmented label="Show" value={status} options={STATUSES} onChange={(id) => update({ show: id })} />}
        </div>
        <p className="font-mono text-xs text-[var(--color-ink-faint)]" role="status">{countLabel}</p>
      </div>

      {view === 'track' && (
        <div className="flex flex-col gap-12">
          {categories.map((category, index) => {
            const lessons = snippets.filter((s) => s.categorySlug === category.slug && show(s))
            if (lessons.length === 0) return null
            return (
              <section key={category.slug}>
                <div className="mb-2 flex items-baseline justify-between gap-4">
                  <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                    <span className="mr-2 font-mono text-xs font-normal text-[var(--color-ink-faint)]">{String(index + 1).padStart(2, '0')}</span>
                    {category.label}
                  </h2>
                  <Link to={`/c/${category.slug}`} className="shrink-0 text-xs text-[var(--color-ink-faint)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
                    Open track
                  </Link>
                </div>
                {CATEGORY_INFO[category.slug] && <p className="mb-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-faint)]">{CATEGORY_INFO[category.slug]}</p>}
                <Section item={category} depth={0} show={show} />
              </section>
            )
          })}
          {matching.length === 0 && <p className="text-sm text-[var(--color-ink-faint)]">No lessons match those filters.</p>}
        </div>
      )}

      {view === 'tag' && (
        <div>
          <div className="flex flex-wrap gap-2">
            {(showAllTags || needle ? tags : tags.slice(0, TAG_PREVIEW)).map((item) => (
              <Link
                key={item.tag}
                to={tagPath(item.tag)}
                className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2.5 py-1 text-sm text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
              >
                {item.tag}
                <span className="font-mono text-[11px] text-[var(--color-ink-faint)]">{item.count}</span>
              </Link>
            ))}
          </div>
          {!showAllTags && !needle && tags.length > TAG_PREVIEW && (
            <button onClick={() => setShowAllTags(true)} className="mt-5 cursor-pointer text-sm text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
              Show all {tags.length} tags
            </button>
          )}
          {tags.length === 0 && <p className="text-sm text-[var(--color-ink-faint)]">No tags match "{query}".</p>}
        </div>
      )}

      {view === 'az' && (
        <div className="flex flex-col gap-8">
          {letters.map(([letter, group]) => (
            <section key={letter}>
              <h2 className="mb-1 px-2 font-mono text-sm font-semibold text-[var(--color-ink-faint)]">{letter}</h2>
              <ul className="flex flex-col">{group.map((s) => <LessonRow key={s.id} snippet={s} />)}</ul>
            </section>
          ))}
          {matching.length === 0 && <p className="text-sm text-[var(--color-ink-faint)]">No lessons match those filters.</p>}
        </div>
      )}
    </div>
  )
}
