import { Minus, Plus } from 'lucide-react'
import { useCodeFontSize } from '@/hooks/useCodeFontSize'
import { MAX_CODE_FONT_SIZE, MIN_CODE_FONT_SIZE } from '@/lib/codeFontSize'

// Shared, persisted code text size — adjusting it here applies to every
// CodeBlock (and the terminal output) across the whole site, not just this one.
export function FontSizeControl() {
  const [size, setSize] = useCodeFontSize()

  return (
    <div className="flex items-center rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)]">
      <button
        onClick={() => setSize(Math.max(MIN_CODE_FONT_SIZE, size - 1))}
        disabled={size <= MIN_CODE_FONT_SIZE}
        aria-label="Decrease code font size"
        className="cursor-pointer rounded-l-md px-1.5 py-1 transition-colors hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="min-w-[1.5rem] px-0.5 text-center font-mono text-[10px] tabular-nums select-none">
        {size}
      </span>
      <button
        onClick={() => setSize(Math.min(MAX_CODE_FONT_SIZE, size + 1))}
        disabled={size >= MAX_CODE_FONT_SIZE}
        aria-label="Increase code font size"
        className="cursor-pointer rounded-r-md px-1.5 py-1 transition-colors hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  )
}
