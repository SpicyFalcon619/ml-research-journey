import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Star, X } from 'lucide-react'
import { getSnippetById, snippets } from '@/lib/content'
import { basecamps, countSnippets, navGroups, parseBasecampLabel, trailOrder } from '@/lib/roadmap'
import { CATEGORY_INFO } from '@/lib/categoryInfo'
import { overallProgress } from '@/lib/progress'
import { cn } from '@/lib/cn'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/hooks/useLibrary'
import { isMac } from '@/lib/platform'
import { GlassPanel } from '@/components/ui/GlassPanel'

const SUGGESTED_SEARCHES = ['train test split', 'groupby', 'broadcasting', 'list comprehension', 'tensors']

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">{title}</h2>
      {children && <span className="text-xs text-[var(--color-ink-faint)]">{children}</span>}
    </div>
  )
}

export function Home({ onOpenSearch }: { onOpenSearch: () => void }) {
  useDocumentTitle()
  const { recent, favorites, done, prefs, dismissedResume, dismissResume } = useLibrary()
  const progress = overallProgress(done)

  const categories = navGroups.flatMap((g) => g.categories)
  const totalLines = snippets.reduce((sum, s) => sum + s.lineCount, 0)
  const firstLesson = trailOrder[0]
  const roadmapUrl = `${import.meta.env.BASE_URL}ml-research-roadmap.html`

  const lastOpened = recent.map((entry) => getSnippetById(entry.id)).find((s) => s !== undefined)
  // The card can be dismissed; it comes back once a different lesson is opened, and the
  // Your progress page has a switch to turn it off for good.
  const resume = prefs.showContinue && lastOpened && dismissedResume !== lastOpened.id ? lastOpened : undefined
  const favoriteLessons = favorites.map(getSnippetById).filter((s) => s !== undefined).slice(0, 6)

  const current = basecamps.find((b) => b.totalCount > 0 && b.doneCount < b.totalCount)
  const currentLabel = current ? parseBasecampLabel(current.title) : null

  const howTo = [
    {
      title: 'Browse in order',
      text: 'Tracks run in the order I learned them, from Python basics up to PyTorch. The sidebar follows the same order, and every lesson links to the one after it.',
    },
    {
      title: 'See the real output',
      text: 'Each example has a Run button that shows the output captured when the code was actually run. Nothing is executed in your browser.',
    },
    {
      title: 'Search everything',
      text: `Press ${isMac ? '⌘K' : 'Ctrl+K'} or / to search lessons and the sections inside them. A search for "groupby" or "train test split" jumps straight to that code.`,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <section className="animate-fade-up py-10 text-center sm:py-16">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[var(--color-accent-soft)] uppercase">
          Personal Field Guide
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
          Every line you've written,
          <br className="hidden sm:block" /> one search away.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[var(--color-ink-dim)]">
          A reference of working code from my machine learning journey, from Python basics through NumPy, Pandas,
          scikit-learn and PyTorch. Every lesson shows the code next to the real output it produced, and all of it is
          searchable.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-accent-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="h-4 w-4" /> Search the guide
          </button>
          <Link
            to={`/s/${firstLesson.id}`}
            className="rounded-xl border border-[var(--color-border-strong)] px-5 py-3 text-sm font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
          >
            Start from the beginning
          </Link>
        </div>
        <p className="mt-5 text-sm text-[var(--color-ink-faint)]">
          Try:{' '}
          {SUGGESTED_SEARCHES.map((term, i) => (
            <span key={term}>
              {i > 0 && ', '}
              <Link
                to={`/search?q=${encodeURIComponent(term)}`}
                className="text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
              >
                {term}
              </Link>
            </span>
          ))}
        </p>
        <p className="mt-8 font-mono text-xs text-[var(--color-ink-faint)]">
          {snippets.length} lessons · {categories.length} tracks · {totalLines.toLocaleString()} lines of code · Updated{' '}
          {formatDate(__BUILD_DATE__)}
        </p>
        <p className="mt-3 text-sm text-[var(--color-ink-faint)]">
          <Link to="/explore" className="text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]">
            Explore all lessons
          </Link>
          {' · '}
          <Link to="/me" className="text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]">
            Your progress{progress.done > 0 ? ` (${progress.done} of ${progress.total} done)` : ''}
          </Link>
        </p>
      </section>

      {(resume || favoriteLessons.length > 0) && (
        <section className="mb-12 grid gap-4 sm:grid-cols-2">
          {resume && (
            <div className={cn('relative', favoriteLessons.length === 0 && 'sm:col-span-2')}>
              <button
                onClick={() => dismissResume(resume.id)}
                aria-label="Dismiss this suggestion"
                title="Hide this until you open another lesson"
                className="absolute top-3 right-3 z-10 cursor-pointer rounded-md p-1.5 text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]"
              >
                <X className="h-4 w-4" />
              </button>
            <Link to={`/s/${resume.id}`} className="group block h-full">
              <GlassPanel className="flex h-full flex-col justify-between gap-6 p-5 transition-colors group-hover:border-[var(--color-border-strong)]">
                <div>
                  <p className="text-xs font-medium text-[var(--color-ink-faint)]">Continue where you left off</p>
                  <h2 className="mt-2 text-lg font-medium text-[var(--color-ink)]">{resume.title}</h2>
                  <p className="mt-0.5 text-sm text-[var(--color-ink-faint)]">
                    {[resume.categoryLabel, ...resume.subSegments].join(' / ')}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-sm text-[var(--color-accent-soft)]">
                  Resume <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </GlassPanel>
            </Link>
            </div>
          )}
          {favoriteLessons.length > 0 && (
            <GlassPanel className="p-5">
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium text-[var(--color-ink-faint)]">
                <Star className="h-3.5 w-3.5" /> Saved lessons
              </p>
              <ul className="flex flex-col gap-0.5">
                {favoriteLessons.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/s/${s.id}`}
                      className="flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]"
                    >
                      <span className="truncate">{s.title}</span>
                      <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          )}
        </section>
      )}

      <section>
        <SectionHeading title="How to use this guide" />
        <div className="grid gap-6 border-t border-[var(--color-border)] pt-6 sm:grid-cols-3">
          {howTo.map((item) => (
            <div key={item.title}>
              <h3 className="font-medium text-[var(--color-ink)]">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading title="Tracks">Read top to bottom: each one builds on the last.</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((category, i) => {
            const inCategory = snippets.filter((s) => s.categorySlug === category.slug)
            const lines = inCategory.reduce((sum, s) => sum + s.lineCount, 0)
            // Preview real lessons in sidebar order; raw data files (CSVs) would read as odd "lessons".
            const preview = trailOrder
              .filter((s) => s.categorySlug === category.slug && !s.filename.endsWith('.csv'))
              .slice(0, 3)
            const info = CATEGORY_INFO[category.slug]
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Link to={`/c/${category.slug}`} className="group block h-full">
                  <GlassPanel className="flex h-full flex-col p-5 transition-colors group-hover:border-[var(--color-border-strong)]">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-mono text-xs text-[var(--color-ink-faint)]">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-xs text-[var(--color-ink-faint)]">
                        {countSnippets(category)} lessons · {lines.toLocaleString()} lines
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-[var(--color-ink)]">{category.label}</h3>
                    {info && <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">{info}</p>}
                    {preview.length > 0 && (
                      <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-faint)]">
                        Starts with {preview.map((s) => s.title).join(', ')}.
                      </p>
                    )}
                    <span className="mt-auto flex items-center gap-1 pt-4 text-sm text-[var(--color-accent-soft)]">
                      Open track <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </GlassPanel>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="mt-14 pb-16">
        <SectionHeading title="Where I am on the roadmap">
          <a href={roadmapUrl} className="underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
            Full roadmap
          </a>
        </SectionHeading>
        {currentLabel && (
          <p className="mb-4 text-sm text-[var(--color-ink-dim)]">
            Currently working on <span className="font-medium text-[var(--color-ink)]">{currentLabel.name}</span>.
          </p>
        )}
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {basecamps.map((b) => {
            const label = parseBasecampLabel(b.title)
            const cleared = b.totalCount > 0 && b.doneCount === b.totalCount
            const pct = b.totalCount ? (b.doneCount / b.totalCount) * 100 : 0
            const status = cleared ? 'Done' : b.doneCount > 0 ? `${b.doneCount} of ${b.totalCount} steps` : 'Not started'
            return (
              <li
                key={b.slug}
                className="grid items-center gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_12rem_7.5rem]"
              >
                <div className="min-w-0">
                  <p className="text-xs text-[var(--color-ink-faint)]">
                    {label.eyebrow}
                    {label.duration ? ` · ${label.duration}` : ''}
                  </p>
                  <p className="text-sm font-medium text-[var(--color-ink)]">{label.name}</p>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${label.eyebrow} progress`}
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-hover)]"
                >
                  <div className="h-full rounded-full bg-[var(--color-accent)] transition-[width] duration-500" style={{ width: `${pct}%` }} />
                </div>
                <p className="font-mono text-xs text-[var(--color-ink-faint)] sm:text-right">{status}</p>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
