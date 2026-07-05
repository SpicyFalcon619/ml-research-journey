import { Link, useSearchParams } from 'react-router-dom'
import { CornerDownLeft, FileText } from 'lucide-react'
import { search } from '@/lib/search'
import { GlassPanel } from '@/components/ui/GlassPanel'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const hits = search(query, 100)

  return (
    <div className="mx-auto max-w-3xl animate-fade-up pb-16">
      <header className="mb-8">
        <p className="text-sm text-[var(--color-ink-faint)]">Search results for</p>
        <h1 className="text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">"{query}"</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-faint)]">
          {hits.length} {hits.length === 1 ? 'match' : 'matches'}
        </p>
      </header>

      {hits.length === 0 && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--color-ink-faint)]">
          No snippets matched "{query}". Try a different function name, topic, or keyword.
        </GlassPanel>
      )}

      <div className="flex flex-col gap-2.5">
        {hits.map((hit) => (
          <Link
            key={hit.type === 'topic' ? `topic-${hit.snippet.id}-${hit.topic.line}` : `file-${hit.snippet.id}`}
            to={hit.type === 'topic' ? `/s/${hit.snippet.id}?line=${hit.topic.line}` : `/s/${hit.snippet.id}`}
          >
            <GlassPanel className="flex items-center justify-between gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]">
              {hit.type === 'topic' ? (
                <div className="flex min-w-0 items-center gap-3">
                  <CornerDownLeft className="h-4 w-4 shrink-0 text-[var(--color-accent-soft)]" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-[var(--color-ink)]">{hit.topic.label}</span>
                    <span className="truncate text-xs text-[var(--color-ink-faint)]">
                      within {hit.snippet.title} · {hit.snippet.categoryLabel}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex min-w-0 items-center gap-3">
                  <FileText className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-[var(--color-ink)]">{hit.snippet.title}</span>
                    <span className="truncate text-xs text-[var(--color-ink-faint)]">{hit.snippet.categoryLabel}</span>
                  </div>
                </div>
              )}
              <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">
                {hit.snippet.filename}
              </span>
            </GlassPanel>
          </Link>
        ))}
      </div>
    </div>
  )
}
