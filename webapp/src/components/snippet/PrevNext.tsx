import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Snippet } from '@/types'
import { cn } from '@/lib/cn'

// Two plain doors at the end of a lesson: back, and on. Marking a lesson done is
// a separate choice (the tick at the top), so moving on never changes your progress.
function Door({ lesson, from, direction }: { lesson: Snippet; from: Snippet; direction: 'prev' | 'next' }) {
  const next = direction === 'next'
  const Arrow = next ? ArrowRight : ArrowLeft
  const otherSection = lesson.categoryLabel !== from.categoryLabel
  return (
    <Link
      to={`/s/${lesson.id}`}
      className={cn(
        'group flex min-h-20 flex-col justify-center gap-1 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)]',
        next ? 'items-end text-right sm:col-start-2' : 'items-start text-left',
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase transition-colors group-hover:text-[var(--color-accent-soft)]">
        {!next && <Arrow className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />}
        {next ? 'Next lesson' : 'Previous lesson'}
        {next && <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
      </span>
      <span className="text-[15px] font-medium text-[var(--color-ink)]">{lesson.title}</span>
      {otherSection && <span className="text-xs text-[var(--color-ink-dim)]">{lesson.categoryLabel}</span>}
    </Link>
  )
}

export function PrevNext({ snippet, prev, next }: { snippet: Snippet; prev?: Snippet; next?: Snippet }) {
  if (!prev && !next) return null
  return (
    <nav aria-label="Lesson navigation" className="mt-14 grid gap-3 border-t border-[var(--color-border)] pt-8 sm:grid-cols-2">
      {prev && <Door lesson={prev} from={snippet} direction="prev" />}
      {next && <Door lesson={next} from={snippet} direction="next" />}
    </nav>
  )
}
