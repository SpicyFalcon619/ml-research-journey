import { allLessons } from '@/lib/progress'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { useLibrary } from '@/hooks/useLibrary'
import { cn } from '@/lib/cn'

// Your whole journey in one thin strip: a tick per stop, filled in its line's colour once done,
// with the stop you are on standing taller. It shows position and extent at any width.
export function TickRail({ currentId, className }: { currentId?: string; className?: string }) {
  const { isDone } = useLibrary()
  const currentIndex = allLessons.findIndex((s) => s.id === currentId)

  return (
    <div
      role="img"
      aria-label={currentIndex >= 0 ? `Stop ${currentIndex + 1} of ${allLessons.length} on the path` : `${allLessons.length} stops on the path`}
      className={cn('flex h-5 items-end gap-[2px]', className)}
    >
      {allLessons.map((lesson, index) => {
        const here = index === currentIndex
        const finished = isDone(lesson.id)
        return (
          <span
            key={lesson.id}
            className={cn('flex-1 rounded-[1px] transition-colors', here ? 'h-5' : 'h-2.5')}
            style={{
              background: here
                ? 'var(--color-ink)'
                : finished
                  ? lineColor(trackIndexOf(lesson.categorySlug))
                  : 'color-mix(in srgb, var(--color-ink) 16%, transparent)',
            }}
          />
        )
      })}
    </div>
  )
}
