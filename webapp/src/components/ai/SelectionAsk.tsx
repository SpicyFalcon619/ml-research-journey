import { useEffect, useRef, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import { askAboutSelection } from '@/lib/assistantPrompts'
import { useAssistant } from '@/hooks/useAssistant'

interface Spot {
  text: string
  /** Where the mouse was released, in viewport coordinates. */
  x: number
  y: number
}

const BUTTON_WIDTH = 150
const GAP = 14

// When lesson code is highlighted with a mouse, a small "Ask AI" button appears right beside
// the cursor and asks about exactly that part. It only appears for code (not for any text on the
// page), and never on touch screens, where selecting text already brings up the phone's own menu.
export function SelectionAsk() {
  const { openAssistant } = useAssistant()
  const [spot, setSpot] = useState<Spot | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    function update(pointer?: { x: number; y: number }) {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (!selection || selection.rangeCount === 0 || text.length < 4 || text.length > 3000) {
        setSpot(null)
        return
      }
      const range = selection.getRangeAt(0)
      const anchor = range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement
      // Only code in a lesson, so ordinary text on the page doesn't pop a button up.
      if (!anchor?.closest('.code-scroll')) {
        setSpot(null)
        return
      }
      // From the keyboard there is no pointer: use the end of the selection instead.
      const rects = range.getClientRects()
      const end = rects[rects.length - 1]
      if (!pointer && !end) {
        setSpot(null)
        return
      }
      setSpot({ text, x: pointer ? pointer.x : end.right, y: pointer ? pointer.y : end.top + end.height / 2 })
    }
    const afterMouse = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return
      const pointer = { x: event.clientX, y: event.clientY }
      window.setTimeout(() => update(pointer), 0)
    }
    const afterKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSpot(null)
      else window.setTimeout(() => update(), 0)
    }
    // Starting a new selection (or clicking elsewhere) clears the old button straight away, so it
    // never lingers beside text that is no longer selected.
    const beforeMouse = (event: MouseEvent) => {
      if (!buttonRef.current?.contains(event.target as Node)) setSpot(null)
    }
    const hide = () => setSpot(null)
    document.addEventListener('mousedown', beforeMouse)
    document.addEventListener('mouseup', afterMouse)
    document.addEventListener('keyup', afterKey)
    document.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      document.removeEventListener('mousedown', beforeMouse)
      document.removeEventListener('mouseup', afterMouse)
      document.removeEventListener('keyup', afterKey)
      document.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [])

  if (!spot) return null
  // Just to the right of the cursor; to its left when there isn't room, and kept on screen.
  const fitsRight = spot.x + GAP + BUTTON_WIDTH <= window.innerWidth - 8
  const left = fitsRight ? spot.x + GAP : Math.max(8, spot.x - GAP - BUTTON_WIDTH)
  const top = Math.min(Math.max(spot.y - 16, 8), window.innerHeight - 44)

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
      style={{ left, top, width: BUTTON_WIDTH }}
      className="float-solid fixed z-[65] flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] py-1.5 text-xs font-medium whitespace-nowrap text-[var(--color-ink)] shadow-[var(--shadow-glass)]"
    >
      <MessageSquareText className="h-3.5 w-3.5 text-[var(--color-accent-soft)]" aria-hidden /> Ask AI about this
    </button>
  )
}
