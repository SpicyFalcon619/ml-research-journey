import { useEffect, useState } from 'react'
import type { Snippet } from '@/types'
import { jumpToLine } from '@/lib/scroll'
import { cn } from '@/lib/cn'

// How far below the top of the viewport a section heading counts as "current".
// Leaves room for the code window's sticky header.
const SPY_OFFSET_PX = 110

// A lesson's table of contents: its `### Topic ###` sections, with the one you
// are reading highlighted as you scroll. Shown beside the code on wide screens;
// narrower screens keep the jump chips under the title.
export function Outline({ snippet }: { snippet: Snippet }) {
  const [active, setActive] = useState<number | null>(null)
  const { topics } = snippet

  useEffect(() => {
    if (topics.length === 0) return
    let frame = 0

    function update() {
      let current: number | null = null
      for (const topic of topics) {
        const el = document.getElementById(`L${topic.line}`)
        if (!el) continue
        if (el.getBoundingClientRect().top <= SPY_OFFSET_PX) current = topic.line
        else break
      }
      setActive(current)
    }
    function onScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // The code is highlighted asynchronously, so its lines appear a moment
    // after mount; measure again once they exist.
    const timers = [300, 900, 2000].map((ms) => window.setTimeout(update, ms))
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      timers.forEach(window.clearTimeout)
    }
  }, [topics])

  return (
    <aside aria-label="In this lesson" className="sticky top-6 hidden self-start xl:block">
      <h2 className="mb-3 text-xs font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
        In this lesson
      </h2>
      {topics.length > 0 ? (
        <ol className="flex flex-col border-l border-[var(--color-border)]">
          {topics.map((topic) => {
            const isActive = topic.line === active
            return (
              <li key={topic.line}>
                <button
                  onClick={() => jumpToLine(topic.line)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    '-ml-px block w-full cursor-pointer border-l py-1.5 pr-2 pl-3 text-left text-[13px] leading-snug transition-colors',
                    isActive
                      ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                      : 'border-transparent text-[var(--color-ink-faint)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink-dim)]',
                  )}
                >
                  {topic.label}
                </button>
              </li>
            )
          })}
        </ol>
      ) : (
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-faint)]">
          One continuous example, {snippet.lineCount} lines. Press Run on the code to see its output.
        </p>
      )}
    </aside>
  )
}
