import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

export interface ConfirmOptions {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** For things that can't be undone: the safe choice (Cancel) gets the focus and the action is drawn in the warning color. */
  danger?: boolean
}

// The site's own "are you sure?" box, used instead of the browser's confirm() pop-up, which can't be
// themed and looks like it belongs to a different site. It behaves like a native alert dialog:
// it traps Tab, closes with Escape or a click outside, and hands focus back afterwards.
export function ConfirmDialog({ options, onResolve }: { options: ConfirmOptions; onResolve: (confirmed: boolean) => void }) {
  const { title, message, confirmLabel = 'OK', cancelLabel = 'Cancel', danger = false } = options
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const messageId = useId()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    // Anything that can't be undone starts on Cancel, so a stray Enter doesn't destroy anything.
    ;(danger ? cancelRef.current : confirmRef.current)?.focus()
    return () => opener?.focus?.()
  }, [danger])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onResolve(false)
    } else if (event.key === 'Tab') {
      // Only two buttons, so Tab simply swaps between them.
      const first = cancelRef.current
      const last = confirmRef.current
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  const buttonBase = 'h-9 cursor-pointer rounded-lg px-4 text-sm font-medium transition-colors'
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onResolve(false)
      }}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
        onKeyDown={onKeyDown}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.97 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-glass)]"
      >
        <h2 id={titleId} className="text-base font-semibold text-[var(--color-ink)]">
          {title}
        </h2>
        {message && (
          <p id={messageId} className="mt-2 text-sm leading-relaxed text-[var(--color-ink-dim)]">
            {message}
          </p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={() => onResolve(false)}
            className={cn(buttonBase, 'border border-[var(--color-border-strong)] text-[var(--color-ink-dim)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]')}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={() => onResolve(true)}
            className={cn(
              buttonBase,
              danger
                ? 'border border-[var(--color-ember)] text-[var(--color-ember)] hover:bg-[var(--color-ember)] hover:text-[var(--color-bg)]'
                : 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:opacity-90',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
