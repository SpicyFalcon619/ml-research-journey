import { Check } from 'lucide-react'
import { useLibrary } from '@/hooks/useLibrary'
import { cn } from '@/lib/cn'

// Marks a lesson as finished. That feeds the progress bars on the home, track and
// Your progress pages, and the tick beside the lesson in the sidebar.
export function DoneButton({ id }: { id: string }) {
  const { isDone, toggleDone } = useLibrary()
  const done = isDone(id)

  return (
    <button
      onClick={() => toggleDone(id)}
      aria-pressed={done}
      className={cn(
        'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors',
        done
          ? 'border-[var(--color-accent)] text-[var(--color-accent-soft)]'
          : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
      )}
    >
      <Check className={cn('h-3.5 w-3.5', done && 'stroke-[3]')} />
      {done ? 'Done' : 'Mark as done'}
      <span className="sr-only">{done ? ', press to undo' : ''}</span>
    </button>
  )
}
