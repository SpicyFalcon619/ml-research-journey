import { useMemo, type CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, FileSpreadsheet, Star } from 'lucide-react'
import { navGroups, flattenNavItems } from '@/lib/roadmap'
import { allLessons } from '@/lib/progress'
import { CATEGORY_INFO } from '@/lib/categoryInfo'
import { learnBullets } from '@/lib/lesson'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/hooks/useLibrary'
import type { Snippet } from '@/types'
import { cn } from '@/lib/cn'

const lessonIds = new Set(allLessons.map((s) => s.id))

// One line on what a lesson teaches: its first two "what you will learn" points, or its
// section names when it has no guide card.
function summaryOf(snippet: Snippet): string {
  const bullets = learnBullets(snippet.code)
  if (bullets.length > 0) return bullets.slice(0, 2).join(' · ')
  return snippet.topics
    .slice(0, 3)
    .map((t) => t.label.replace(/^Topic\s*\d*:?\s*/i, ''))
    .join(' · ')
}

export function CategoryPage() {
  const { categorySlug } = useParams()
  const { isDone, isFavorite } = useLibrary()
  const categories = navGroups.flatMap((g) => g.categories)
  const index = categories.findIndex((c) => c.slug === categorySlug)
  const category = categories[index]
  const nextCategory = categories[index + 1]

  useDocumentTitle(category?.label)

  const sections = useMemo(
    () => (category ? flattenNavItems([category]).filter((s) => s.snippets.length > 0) : []),
    [category],
  )
  const summaries = useMemo(() => new Map(sections.flatMap((s) => s.snippets).map((sn) => [sn.id, summaryOf(sn)])), [sections])

  if (!category) return <Navigate to="/" replace />

  const info = CATEGORY_INFO[category.slug]
  const lessons = sections.flatMap((s) => s.snippets).filter((s) => lessonIds.has(s.id))
  const doneCount = lessons.filter((s) => isDone(s.id)).length
  const nextHere = lessons.find((s) => !isDone(s.id))

  return (
    <div className="mx-auto max-w-5xl animate-fade-up pb-16" style={{ '--stop': lineColor(trackIndexOf(category.slug)) } as CSSProperties}>
      <header className="mb-10 max-w-3xl">
        <div aria-hidden className="mb-4 h-2 w-28 rounded-full bg-[var(--stop)]" />
        <h1 className="text-balance text-5xl leading-none font-bold text-[var(--color-ink)] sm:text-6xl">{category.label}</h1>
        {info && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-dim)]">{info}</p>}
        <p className="mt-3 text-sm text-[var(--color-ink-faint)]">
          {lessons.length} lessons{doneCount > 0 ? `, ${doneCount} finished` : ''}
        </p>
        {nextHere && (
          <Link
            to={`/s/${nextHere.id}`}
            className="plate mt-5"
          >
            {doneCount === 0 ? 'Start this track' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </header>

      <div className="flex max-w-3xl flex-col gap-10">
        {sections.map((section) => (
          <section key={section.slug}>
            {section.slug !== category.slug ? (
              <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">{section.label}</h2>
            ) : (
              // Keeps the heading outline valid (h1 > h2 > h3) when a track has no sub-sections.
              <h2 className="sr-only">Lessons</h2>
            )}
            <ol className="relative ml-[7px] border-l-[3px] border-l-[color:color-mix(in_srgb,var(--stop)_55%,transparent)]">
              {section.snippets.map((snippet) => {
                const isData = snippet.filename.endsWith('.csv')
                const finished = isDone(snippet.id)
                const isNext = nextHere?.id === snippet.id
                const summary = summaries.get(snippet.id)
                return (
                  <li key={snippet.id} className="relative">
                    <Link
                      to={`/s/${snippet.id}`}
                      className="group relative block rounded-r-lg py-3 pr-3 pl-6 transition-colors hover:bg-[var(--color-surface)]"
                    >
                      {isData ? (
                        <FileSpreadsheet aria-hidden className="absolute top-[1.15rem] -left-[7px] h-3.5 w-3.5 bg-[var(--color-bg)] text-[var(--color-ink-faint)]" />
                      ) : (
                        <span
                          aria-hidden
                          className={cn(
                            'absolute top-[1.25rem] -left-[7.5px] h-[12px] w-[12px] rounded-full border-[2.5px] bg-[var(--color-bg)]',
                            finished
                              ? 'border-[var(--stop)] bg-[var(--stop)]'
                              : isNext
                                ? 'border-[var(--color-ink)] bg-[var(--stop)] shadow-[0_0_0_3px_var(--stop)]'
                                : 'border-[var(--stop)] opacity-70',
                          )}
                        />
                      )}
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent-soft)]">{snippet.title}</h3>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-[var(--color-ink-faint)]">
                          {isNext && <span className="rounded-[3px] bg-[var(--color-accent-glow)]/30 px-2 py-0.5 text-xs font-medium text-[var(--color-accent-soft)]">next</span>}
                          {isFavorite(snippet.id) && <Star aria-label="Saved" className="h-3 w-3 fill-[var(--color-accent)] text-[var(--color-accent)]" />}
                          {finished && <Check aria-label="Done" className="h-3.5 w-3.5 text-[var(--color-accent-soft)]" strokeWidth={3} />}
                        </span>
                      </div>
                      {summary && <p className="mt-0.5 line-clamp-2 max-w-xl text-sm leading-relaxed text-[var(--color-ink-faint)]">{summary}</p>}
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      {nextCategory && (
        <Link
          to={`/c/${nextCategory.slug}`}
          className="mt-14 flex max-w-3xl items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
        >
          <span>
            <span className="block text-sm text-[var(--color-ink-faint)]">After this track</span>
            <span className="text-lg font-medium text-[var(--color-ink)]">{nextCategory.label}</span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
