import { Star } from 'lucide-react'
import { useLibrary } from '@/hooks/useLibrary'
import { cn } from '@/lib/cn'

export function FavoriteButton({ id, className }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useLibrary()
  const on = isFavorite(id)

  return (
    <button
      onClick={() => toggleFavorite(id)}
      aria-pressed={on}
      className={cn(
        'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors',
        on
          ? 'border-[var(--color-accent-glow)] bg-[var(--color-accent-glow)]/20 text-[var(--color-accent-soft)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
        className,
      )}
    >
      <Star className={cn('h-3.5 w-3.5', on && 'fill-current')} />
      {on ? 'Saved' : 'Save'}
      <span className="sr-only">{on ? ' to favorites, remove' : ' to favorites'}</span>
    </button>
  )
}
