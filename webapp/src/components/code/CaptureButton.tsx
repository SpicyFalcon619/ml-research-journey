import { useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Camera, Check } from 'lucide-react'
import { toPng } from 'html-to-image'

interface CaptureButtonProps {
  targetRef: RefObject<HTMLElement | null>
  filename?: string
}

// Exports the code block (chrome + syntax-highlighted code, and the output
// panel too if it's open) as a PNG — a shareable "screenshot" like VS Code
// screenshot extensions produce, without leaving the page.
export function CaptureButton({ targetRef, filename }: CaptureButtonProps) {
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle')

  async function handleCapture() {
    const node = targetRef.current
    if (!node || state === 'busy') return
    setState('busy')

    // Hide the action row (Run/Copy/Capture/font-size) for the export — the
    // window dots + filename stay, but a "shareable snippet" shouldn't bake in
    // our own UI buttons. visibility (not display) keeps layout stable since
    // we're capturing this exact element right after.
    const actionsRow = node.querySelector<HTMLElement>('[data-code-actions]')
    const previousVisibility = actionsRow?.style.visibility

    // html-to-image clones the live DOM, and a clone doesn't preserve scroll
    // offsets — but a scrollable container's overflow:auto would still crop
    // content that's simply wider/taller than its own box regardless of scroll
    // position, so expand every scrollable region to its full content size first.
    const scrollers = Array.from(
      node.querySelectorAll<HTMLElement>('.code-scroll, .csv-table-scroll, .output-scroll'),
    )
    const original = scrollers.map((el) => ({
      el,
      overflow: el.style.overflow,
      width: el.style.width,
      height: el.style.height,
      maxHeight: el.style.maxHeight,
    }))

    try {
      if (actionsRow) actionsRow.style.visibility = 'hidden'
      scrollers.forEach((el) => {
        el.style.overflow = 'visible'
        el.style.width = `${el.scrollWidth}px`
        el.style.height = `${el.scrollHeight}px`
        el.style.maxHeight = 'none'
      })

      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true })

      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `${(filename ?? 'snippet').replace(/\.\w+$/, '')}.png`
      link.click()

      setState('done')
      setTimeout(() => setState('idle'), 1500)
    } catch {
      setState('idle')
    } finally {
      if (actionsRow) actionsRow.style.visibility = previousVisibility ?? ''
      original.forEach(({ el, overflow, width, height, maxHeight }) => {
        el.style.overflow = overflow
        el.style.width = width
        el.style.height = height
        el.style.maxHeight = maxHeight
      })
    }
  }

  return (
    <button
      onClick={handleCapture}
      disabled={state === 'busy'}
      className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-2.5 py-1 text-xs text-[var(--color-code-ink-dim)] transition-colors hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)] disabled:cursor-wait disabled:opacity-60"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.span
            key="done"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Saved
          </motion.span>
        ) : (
          <motion.span
            key="capture"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Camera className="h-3.5 w-3.5" /> Capture
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
