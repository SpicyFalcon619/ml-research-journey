import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { cn } from '@/lib/cn'

interface LinePickerProps {
  /** The highlighted markup inside each source line, in order (index 0 is line 1). */
  lines: string[]
  selected: Set<number>
  onChange: (next: Set<number>) => void
}

const span = (a: number, b: number) => {
  const low = Math.min(a, b)
  const high = Math.max(a, b)
  return Array.from({ length: high - low + 1 }, (_, i) => low + i)
}

// The code itself, as something you pick from: click a line to select it, drag or
// Shift+click for a range, or use the keyboard. Nothing selected means "the whole file".
export function LinePicker({ lines, selected, onChange }: LinePickerProps) {
  const [cursor, setCursor] = useState(1)
  const [focused, setFocused] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const anchor = useRef<number | null>(null)
  const drag = useRef<{ start: number; base: Set<number>; moved: boolean; wasSelected: boolean } | null>(null)
  const latest = useRef({ onChange })
  latest.current = { onChange }

  // A click on an already-selected line that never turned into a drag un-selects it.
  useEffect(() => {
    function endDrag() {
      const d = drag.current
      drag.current = null
      if (d && !d.moved && d.wasSelected) {
        const next = new Set(d.base)
        next.delete(d.start)
        latest.current.onChange(next)
      }
    }
    window.addEventListener('mouseup', endDrag)
    return () => window.removeEventListener('mouseup', endDrag)
  }, [])

  function handleMouseDown(event: MouseEvent, line: number) {
    if (event.button !== 0) return
    event.preventDefault() // no text selection while dragging across lines
    listRef.current?.focus()
    setCursor(line)
    if (event.shiftKey && anchor.current !== null) {
      onChange(new Set([...selected, ...span(anchor.current, line)]))
      return
    }
    anchor.current = line
    drag.current = { start: line, base: new Set(selected), moved: false, wasSelected: selected.has(line) }
    onChange(new Set([...selected, line]))
  }

  function handleMouseEnter(line: number) {
    const d = drag.current
    if (!d) return
    if (line !== d.start) d.moved = true
    onChange(new Set([...d.base, ...span(d.start, line)]))
  }

  function moveTo(line: number, extend: boolean) {
    const next = Math.min(lines.length, Math.max(1, line))
    setCursor(next)
    if (extend) {
      const from = anchor.current ?? cursor
      anchor.current = from
      onChange(new Set([...selected, ...span(from, next)]))
    }
    listRef.current?.querySelector(`[data-line="${next}"]`)?.scrollIntoView({ block: 'nearest' })
  }

  function handleKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      event.preventDefault()
      onChange(new Set(span(1, lines.length)))
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveTo(cursor + (event.key === 'ArrowDown' ? 1 : -1), event.shiftKey)
    } else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      const next = new Set(selected)
      if (next.has(cursor)) next.delete(cursor)
      else next.add(cursor)
      anchor.current = cursor
      onChange(next)
    }
  }

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-multiselectable="true"
      aria-label="Lines of code. Space selects a line, Shift and the arrow keys select a range."
      aria-activedescendant={`pick-line-${cursor}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      // font-mono also switches off the ligatures that would otherwise fuse "###" and "---" into one glyph.
      className="max-h-full min-h-0 overflow-auto rounded-xl border border-[var(--color-code-border)] bg-[var(--color-code-bg)] py-2 font-mono text-[var(--color-code-ink)] outline-none focus-visible:border-[var(--color-accent)]"
      style={{ fontSize: 13 }}
    >
      {lines.map((markup, index) => {
        const line = index + 1
        const isSelected = selected.has(line)
        return (
          <div
            key={line}
            id={`pick-line-${line}`}
            role="option"
            aria-selected={isSelected}
            data-line={line}
            onMouseDown={(event) => handleMouseDown(event, line)}
            onMouseEnter={() => handleMouseEnter(line)}
            className={cn(
              'flex min-w-max cursor-pointer select-none leading-[1.7] transition-colors',
              isSelected
                ? 'bg-[var(--color-code-accent-glow)]/30 shadow-[inset_3px_0_0_var(--color-accent)]'
                : 'hover:bg-[var(--color-code-surface-hover)]',
              focused && cursor === line && 'outline-1 -outline-offset-1 outline-[var(--color-accent)]',
            )}
          >
            <span className="w-12 shrink-0 pr-3 text-right text-[var(--color-code-ink-faint)]">{line}</span>
            <span className="pr-4 whitespace-pre" dangerouslySetInnerHTML={{ __html: markup || ' ' }} />
          </div>
        )
      })}
    </div>
  )
}
