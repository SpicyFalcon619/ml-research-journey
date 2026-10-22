import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageSquareText } from 'lucide-react'
import { useAssistant } from '@/hooks/useAssistant'

// The panel's code is a separate download. It is fetched once the page is idle, or as soon as
// the button is hovered or touched, so the first opening doesn't wait for it before sliding in.
const preload = () => void import('@/components/ai/AssistantPanel')

// A small pill pinned to the corner of every page. It slips away while the panel is open
// and comes back when it closes.
export function AskButton() {
  const { open, openAssistant } = useAssistant()
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    const timer = window.setTimeout(preload, 2500)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <AnimatePresence>
      {!open && (
        <motion.button
          key="ask"
          type="button"
          onClick={() => openAssistant()}
          onPointerEnter={preload}
          onFocus={preload}
          onTouchStart={preload}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="fixed right-4 bottom-4 z-40 flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-3.5 text-sm font-medium text-[var(--color-ink)] shadow-[var(--shadow-glass)] transition-colors hover:bg-[var(--color-surface-hover)]"
        >
          <MessageSquareText className="h-4 w-4 text-[var(--color-accent-soft)]" aria-hidden /> Ask AI
        </motion.button>
      )}
    </AnimatePresence>
  )
}
