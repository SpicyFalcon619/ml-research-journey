import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { THEME_OPTIONS } from '@/lib/theme'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

export function ThemeToggle() {
  const [theme, setTheme] = useTheme()
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

  const activeOption = THEME_OPTIONS.find((o) => o.id === theme) ?? THEME_OPTIONS[0]

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs font-medium text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] cursor-pointer"
        aria-label="Change theme"
      >
        {activeOption.label}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-48 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1 shadow-[var(--shadow-glass)]"
          >
            {THEME_OPTIONS.map((option) => {
              const active = option.id === theme
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start rounded-lg px-2.5 py-2 text-left leading-tight transition-colors',
                    active
                      ? 'bg-[var(--color-surface)] text-[var(--color-accent-soft)]'
                      : 'text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-hover)]',
                  )}
                >
                  <span className="text-sm">{option.label}</span>
                  <span className="text-[10px] text-[var(--color-ink-faint)]">{option.description}</span>
                </button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
