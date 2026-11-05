import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageSquareText } from 'lucide-react'
import { useAssistant } from '@/hooks/useAssistant'

// The panel's code is a separate download. It is fetched once the page is idle, or as soon as
// the button is hovered or touched, so the first opening doesn't wait for it before sliding in.
const preload = () => void import('@/components/ai/AssistantPanel')

// A small pill pinned to the corner of every page. It slips away while the panel is open
// and comes back when it closes.
export function AskButton() {
  const { open, available, openAssistant } = useAssistant()
  const reduceMotion = useReducedMotion()
  // On a phone the button would sit over the text being read, so it steps aside while you scroll down
  // and comes back as soon as you scroll up or reach the top. Larger screens always show it.
  const [tucked, setTucked] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const phone = window.matchMedia('(max-width: 639px)').matches
      if (!phone || y < 120) setTucked(false)
      else if (y > last + 8) setTucked(true)
      else if (y < last - 8) setTucked(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    const timer = window.setTimeout(preload, 2500)
    return () => window.clearTimeout(timer)
  }, [])
  if (!available) return null
  return (
    <AnimatePresence>
      {!open && !tucked && (
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
          aria-label="Ask the AI"
          className="fixed right-3 bottom-3 z-40 flex h-11 w-11 cursor-pointer items-center justify-center rounded-[3px] float-solid border border-[var(--color-border-strong)] text-sm font-medium text-[var(--color-ink)] shadow-[var(--shadow-glass)] sm:h-auto sm:w-auto sm:gap-2 sm:px-3.5 sm:py-2.5"
        >
          <MessageSquareText className="h-4 w-4 text-[var(--color-accent-soft)]" aria-hidden />
          <span className="hidden sm:inline">Ask AI</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
