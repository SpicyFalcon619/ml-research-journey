import { useEffect, useRef, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import { askAboutSelection } from '@/lib/assistantPrompts'
import { useAssistant } from '@/hooks/useAssistant'

interface Spot {
  text: string
  left: number
  top: number
}

// When code or text on a page is highlighted with a mouse, a small "Ask AI" button appears
// beside it that asks about exactly that part. Left out on touch screens, where selecting text
// already brings up the phone's own menu.
export function SelectionAsk() {
  const { openAssistant } = useAssistant()
  const [spot, setSpot] = useState<Spot | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    function update() {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (!selection || selection.rangeCount === 0 || text.length < 4 || text.length > 3000) {
        setSpot(null)
        return
      }
      const range = selection.getRangeAt(0)
      const anchor = range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement
      // Not inside the assistant itself, a text field, or the search palette.
      if (!anchor || anchor.closest('[role=dialog], input, textarea, [cmdk-root]')) {
        setSpot(null)
        return
      }
      const rect = range.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) {
        setSpot(null)
        return
      }
      const above = rect.top > 56
      setSpot({ text, left: Math.min(Math.max(rect.left + rect.width / 2, 60), window.innerWidth - 60), top: above ? rect.top - 40 : rect.bottom + 8 })
    }
    const afterPointer = () => window.setTimeout(update, 0)
    const hide = () => setSpot(null)
    document.addEventListener('mouseup', afterPointer)
    document.addEventListener('keyup', afterPointer)
    document.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      document.removeEventListener('mouseup', afterPointer)
      document.removeEventListener('keyup', afterPointer)
      document.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [])

  if (!spot) return null
  return (
    <button
      ref={buttonRef}
      type="button"
      // Keep the selection while the button is pressed.
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        openAssistant(askAboutSelection(spot.text))
        window.getSelection()?.removeAllRanges()
        setSpot(null)
      }}
      style={{ left: spot.left, top: spot.top }}
      className="fixed z-[65] flex -translate-x-1/2 animate-fade-up cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink)] shadow-[var(--shadow-glass)] hover:bg-[var(--color-surface-hover)]"
    >
      <MessageSquareText className="h-3.5 w-3.5 text-[var(--color-accent-soft)]" aria-hidden /> Ask AI about this
    </button>
  )
}
