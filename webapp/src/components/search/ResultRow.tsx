import type { SearchHit } from '@/lib/search'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { allLessons } from '@/lib/progress'
import { Highlight } from './Highlight'
import { cn } from '@/lib/cn'

/** Where a search hit opens: a lesson at the top, or a section of a lesson. */
export const hitPath = (hit: SearchHit) =>
  hit.type === 'topic' ? `/s/${hit.snippet.id}?line=${hit.topic.line}` : `/s/${hit.snippet.id}`

export const hitKey = (hit: SearchHit) => (hit.type === 'topic' ? `topic-${hit.snippet.id}-${hit.topic.line}` : `file-${hit.snippet.id}`)

// One search result, the same in the search box and on the results page: the title (or the
// section heading), where it lives, and the sentence or line that shows why it matched.
export function ResultRow({ hit, query }: { hit: SearchHit; query: string }) {
  const stop = allLessons.findIndex((l) => l.id === hit.snippet.id) + 1
  const where =
    hit.type === 'topic'
      ? `in ${hit.snippet.title}`
      : [hit.snippet.categoryLabel, ...hit.snippet.subSegments].join(' / ')

  return (
    <div className="flex min-w-0 flex-1 items-start gap-3">
      <span aria-hidden className="mt-[0.45rem] h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lineColor(trackIndexOf(hit.snippet.categorySlug)) }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate font-medium text-[var(--color-ink)]">
            <Highlight text={hit.type === 'topic' ? hit.heading : hit.snippet.title} query={query} />
          </span>
          <span className="shrink-0 text-[13px] text-[var(--color-ink-faint)]">{hit.type === 'topic' ? 'section' : stop > 0 ? `stop ${stop}` : 'data'}</span>
        </div>
        <span className="block truncate text-[13px] text-[var(--color-ink-faint)]">{where}</span>
        {hit.excerpt && (
          <span
            className={cn(
              'mt-1 line-clamp-2 block text-[13px] leading-snug text-[var(--color-ink-dim)]',
              hit.excerptIsCode && 'font-mono text-[12.5px]',
            )}
          >
            <Highlight text={hit.excerpt} query={query} />
          </span>
        )}
      </div>
    </div>
  )
}
