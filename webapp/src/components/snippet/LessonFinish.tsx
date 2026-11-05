import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useLibrary } from '@/hooks/useLibrary'
import type { Snippet } from '@/types'
import { cn } from '@/lib/cn'

// The end of a lesson is where a beginner decides whether to keep going, so it
// answers the one question that matters: what is next, and can I tick this one off on the way.
export function LessonFinish({ snippet, next }: { snippet: Snippet; next?: Snippet }) {
  const { isDone, toggleDone } = useLibrary()
  const navigate = useNavigate()
  const done = isDone(snippet.id)
  const isLesson = !snippet.filename.endsWith('.csv')
  if (!isLesson && !next) return null

  const finishAndContinue = () => {
    if (!done) toggleDone(snippet.id)
    if (next) navigate(`/s/${next.id}`)
  }

  return (
    <section aria-label="Finish this lesson" className="mt-14 border-t border-[var(--color-border)] pt-8">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
        {done ? 'You have finished this lesson.' : 'Finished reading?'}
      </h2>
      <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
        {next
          ? `Next on the path: ${next.title}${next.categoryLabel !== snippet.categoryLabel ? ` (${next.categoryLabel})` : ''}.`
          : 'That is the last lesson so far. More are added as I learn them.'}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        {next ? (
          <button
            onClick={finishAndContinue}
            className="plate"
          >
            {done ? 'Next lesson' : 'Mark done, next lesson'}
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : null}
        {isLesson && (
          <button
            onClick={() => toggleDone(snippet.id)}
            aria-pressed={done}
            className={cn(
              'inline-flex min-h-6 cursor-pointer items-center gap-1.5 text-sm underline underline-offset-4 transition-colors',
              done
                ? 'text-[var(--color-accent-soft)] decoration-[var(--color-accent)]'
                : 'text-[var(--color-ink-dim)] decoration-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
            )}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={3} />
            {done ? 'Marked as done (undo)' : 'Just mark it done'}
          </button>
        )}
        {next && done && (
          <Link to={`/s/${next.id}`} className="sr-only">
            Skip to {next.title}
          </Link>
        )}
      </div>
    </section>
  )
}
