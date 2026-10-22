import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Palette } from 'lucide-react'
import { THEME_OPTIONS, type ThemeOption, type ThemeSwatch } from '@/lib/theme'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

// A small round swatch of a theme: its page color with the accent as the center dot and
// the second accent as a tiny dot beside it. "System" is drawn as a dark and a light half.
function SwatchHalf({ swatch, big }: { swatch: ThemeSwatch; big: boolean }) {
  return (
    <span className="relative block h-full flex-1" style={{ background: swatch.bg }}>
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: swatch.accent, width: big ? '46%' : '70%', aspectRatio: '1' }}
      />
      {big && (
        <span
          className="absolute right-[14%] bottom-[14%] rounded-full"
          style={{ background: swatch.ember, width: '20%', aspectRatio: '1' }}
        />
      )}
    </span>
  )
}

export function ThemeDot({ option, size }: { option: ThemeOption; size: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 overflow-hidden rounded-full border border-[var(--color-border-strong)]"
      style={{ width: size, height: size }}
    >
      <SwatchHalf swatch={option.swatch} big={!option.split} />
      {option.split && <SwatchHalf swatch={option.split} big={false} />}
    </span>
  )
}

export function ThemeToggle() {
  const [, setTheme, preference] = useTheme()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const activeOption = THEME_OPTIONS.find((o) => o.id === preference) ?? THEME_OPTIONS[0]

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-xs sm:py-2 sm:pr-2.5 sm:pl-2.5 font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] cursor-pointer"
        aria-label={`Theme: ${activeOption.label}. Change theme`}
        aria-haspopup="true"
        title="Change the colour theme"
        aria-expanded={open}
      >
        {/* A palette icon and the word "Theme" say what this is; the dot shows which one is on. */}
        <Palette className="h-4 w-4 shrink-0" aria-hidden />
        <ThemeDot option={activeOption} size={14} />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown className={cn('hidden h-3.5 w-3.5 shrink-0 transition-transform sm:block', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-64 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1 shadow-[var(--shadow-glass)]"
          >
            <p className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
              Choose a theme
            </p>
            {THEME_OPTIONS.map((option) => {
              const active = option.id === preference
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-left leading-tight transition-colors',
                    active
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent-soft)]'
                      : 'text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-hover)]',
                  )}
                >
                  <ThemeDot option={option} size={22} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="text-sm">{option.label}</span>
                    <span className="truncate text-[10px] text-[var(--color-ink-faint)]">{option.description}</span>
                  </span>
                  {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
