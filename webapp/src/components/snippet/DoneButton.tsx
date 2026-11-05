import { Check } from 'lucide-react'
import { useLibrary } from '@/hooks/useLibrary'
import { cn } from '@/lib/cn'

// Marks a lesson as finished. That feeds the progress marks on the map, the path rail and the
// Your progress page. It is the one filled action on a lesson, in the colour of the line you are on.
export function DoneButton({ id }: { id: string }) {
  const { isDone, toggleDone } = useLibrary()
  const done = isDone(id)

  return (
    <button
      onClick={() => toggleDone(id)}
      aria-pressed={done}
      className={cn(
        'flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-[13px] transition-colors',
        done
          ? 'border-[var(--stop)] text-[var(--color-ink)]'
          : 'border-transparent bg-[var(--color-accent)] font-semibold text-[var(--color-accent-ink)] hover:brightness-110',
      )}
    >
      <Check className={cn('h-3.5 w-3.5', done ? 'stroke-[3] text-[var(--stop)]' : 'stroke-[3]')} />
      {done ? 'Done' : 'Mark as done'}
      <span className="sr-only">{done ? ', press to undo' : ''}</span>
    </button>
  )
}
