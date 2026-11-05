import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MessageSquareText } from 'lucide-react'
import { popularSearches, search, searchCategories, suggest } from '@/lib/search'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAssistant } from '@/hooks/useAssistant'
import { ResultRow, hitKey, hitPath } from '@/components/search/ResultRow'
import { cn } from '@/lib/cn'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('c') ?? undefined
  const { available: aiAvailable, openAssistant } = useAssistant()

  const everything = useMemo(() => search(query, 200), [query])
  const hits = useMemo(() => everything.filter((h) => !category || h.snippet.categorySlug === category), [everything, category])
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const hit of everything) map.set(hit.snippet.categorySlug, (map.get(hit.snippet.categorySlug) ?? 0) + 1)
    return map
  }, [everything])
  const closest = useMemo(() => (hits.length === 0 ? suggest(query) : []), [hits.length, query])

  useDocumentTitle(query ? `Search: ${query}` : 'Search')

  const filterLink = (slug?: string) => {
    const params = new URLSearchParams({ q: query })
    if (slug) params.set('c', slug)
    return `/search?${params.toString()}`
  }

  return (
    <div className="mx-auto max-w-5xl animate-fade-up pb-16">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-4xl leading-none font-bold text-[var(--color-ink)] sm:text-5xl">{query ? `“${query}”` : 'Search'}</h1>
        <p className="mt-3 text-[15px] text-[var(--color-ink-faint)]" role="status">
          {query ? `${hits.length} ${hits.length === 1 ? 'result' : 'results'}${category ? ' in this track' : ''}` : 'Type in the search box above, or press / from any page.'}
        </p>
      </header>

      {query && (
        <div className="mb-6 flex max-w-3xl flex-wrap gap-1.5" role="group" aria-label="Filter by track">
          {[{ slug: undefined, label: 'All tracks' }, ...searchCategories].map((c) => {
            const active = c.slug === category
            const n = c.slug ? (counts.get(c.slug) ?? 0) : everything.length
            return (
              <Link
                key={c.slug ?? 'all'}
                to={filterLink(c.slug)}
                replace
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'inline-flex min-h-6 items-center rounded-md border px-2.5 py-1 text-[13px] transition-colors',
                  active
                    ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
                    : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
                )}
              >
                {c.slug && <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: lineColor(trackIndexOf(c.slug)) }} />}
                {c.label.replace(/ Tutorial$/, '')} · {n}
              </Link>
            )
          })}
        </div>
      )}

      {query && hits.length === 0 && (
        <div className="max-w-3xl border-y border-[var(--color-border)] py-8">
          <p className="text-lg text-[var(--color-ink)]">
            Nothing matched “{query}”{category ? ' in this track' : ''}.
          </p>
          <p className="mt-1 text-[15px] text-[var(--color-ink-dim)]">Try a single keyword, a function name, or the plain-words version of what you mean.</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
            {category && (
              <Link to={filterLink()} replace className="text-[var(--color-accent-soft)] underline underline-offset-4">
                Search all tracks
              </Link>
            )}
            {aiAvailable && (
              <button
                onClick={() => openAssistant(query.endsWith('?') ? query : `${query}?`)}
                className="inline-flex min-h-6 cursor-pointer items-center gap-1.5 text-[var(--color-accent-soft)] underline underline-offset-4"
              >
                <MessageSquareText className="h-4 w-4" /> Ask the AI instead
              </button>
            )}
          </div>
          {closest.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-[var(--color-ink)]">Did you mean</h2>
              <ul className="mt-2 flex flex-col">
                {closest.map((s) => (
                  <li key={s.id}>
                    <Link to={`/s/${s.id}`} className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--color-surface)]">
                      <span className="flex items-center gap-3">
                        <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lineColor(trackIndexOf(s.categorySlug)) }} />
                        <span className="font-medium text-[var(--color-ink)]">{s.title}</span>
                        <span className="text-[13px] text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="max-w-3xl">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">Popular searches</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {popularSearches.map((q) => (
              <Link key={q} to={`/search?q=${encodeURIComponent(q)}`} className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-[15px] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]">
                {q}
              </Link>
            ))}
          </div>
        </div>
      )}

      <ul className="flex max-w-3xl flex-col">
        {hits.map((hit) => (
          <li key={hitKey(hit)}>
            <Link to={hitPath(hit)} className="block rounded-lg px-3 py-3 transition-colors hover:bg-[var(--color-surface)]">
              <ResultRow hit={hit} query={query} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
