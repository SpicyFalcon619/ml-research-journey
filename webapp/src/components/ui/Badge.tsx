import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-white/[0.04] px-2.5 py-0.5 text-xs text-[var(--color-ink-dim)]',
        className,
      )}
      {...props}
    />
  )
}
