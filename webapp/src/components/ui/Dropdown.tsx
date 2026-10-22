import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface DropdownOption<T extends string | number> {
  value: T
  label: string
  description?: string
  icon?: ReactNode
}

interface DropdownProps<T extends string | number> {
  /** The chosen value, or null to show the placeholder (a menu of actions rather than a setting). */
  value: T | null
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  ariaLabel: string
  placeholder?: string
}

// A themed replacement for <select>. The browser draws a native select's list itself, as a
// light system panel, which clashes with every dark theme and made the text unreadable here.
// The list is portaled to the page and positioned from the button, so it is never clipped by
// a scrolling or overflow-hidden parent such as a dialog.
export function Dropdown<T extends string | number>({ value, options, onChange, ariaLabel, placeholder = 'Choose...' }: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState<CSSProperties | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const id = useId()
  const selectedIndex = options.findIndex((option) => option.value === value)
  const current = selectedIndex >= 0 ? options[selectedIndex] : null

  function openList() {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const below = window.innerHeight - rect.bottom - 12
    const above = rect.top - 12
    const flip = below < 200 && above > below
    setPosition({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(140, Math.min(320, flip ? above : below)),
      ...(flip ? { bottom: window.innerHeight - rect.top + 6 } : { top: rect.bottom + 6 }),
    })
    setActive(Math.max(0, selectedIndex))
    setOpen(true)
  }

  function close(refocus: boolean) {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }

  function choose(index: number) {
    onChange(options[index].value)
    close(true)
  }

  // Land keyboard focus on the list so arrow keys work straight away.
  useEffect(() => {
    if (open) listRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (!listRef.current?.contains(target) && !triggerRef.current?.contains(target)) setOpen(false)
    }
    const dismiss = () => setOpen(false)
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('resize', dismiss)
    window.addEventListener('scroll', dismiss, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('resize', dismiss)
      window.removeEventListener('scroll', dismiss, true)
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) openList()
    }
  }

  function handleListKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActive((i) => (i + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActive((i) => (i - 1 + options.length) % options.length)
        break
      case 'Home':
        event.preventDefault()
        setActive(0)
        break
      case 'End':
        event.preventDefault()
        setActive(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(active)
        break
      case 'Escape':
        // Stop here so a surrounding dialog doesn't also close.
        event.preventDefault()
        event.stopPropagation()
        close(true)
        break
      case 'Tab':
        close(false)
        break
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${ariaLabel}${current ? `: ${current.label}` : ''}`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={handleTriggerKeyDown}
        className="flex h-8 w-full cursor-pointer items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-left text-sm transition-colors hover:border-[var(--color-border-strong)] focus-visible:border-[var(--color-accent)]"
      >
        {current?.icon}
        <span className={cn('min-w-0 flex-1 truncate', current ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink-faint)]')}>
          {current ? current.label : placeholder}
        </span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)] transition-transform', open && 'rotate-180')} />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-activedescendant={`${id}-${active}`}
            onKeyDown={handleListKeyDown}
            style={position}
            className="z-[95] overflow-y-auto rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] p-1 shadow-[var(--shadow-glass)] outline-none"
          >
            {options.map((option, index) => (
              <div
                key={String(option.value)}
                id={`${id}-${index}`}
                role="option"
                aria-selected={option.value === value}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors',
                  index === active ? 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]' : 'text-[var(--color-ink-dim)]',
                  option.value === value && 'text-[var(--color-accent-soft)]',
                )}
              >
                {option.icon}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{option.label}</span>
                  {option.description && <span className="block truncate text-[11px] text-[var(--color-ink-faint)]">{option.description}</span>}
                </span>
                {option.value === value && <Check className="h-3.5 w-3.5 shrink-0" />}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </>
  )
}
