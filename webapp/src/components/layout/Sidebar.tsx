import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { navGroups, basecamps } from '@/lib/roadmap'
import type { NavItem } from '@/types'
import { cn } from '@/lib/cn'

function NavNode({
  item,
  depth,
  expanded,
  toggle,
}: {
  item: NavItem
  depth: number
  expanded: Record<string, boolean>
  toggle: (slug: string) => void
}) {
  const isOpen = expanded[item.slug] ?? false
  const hasContent = item.children.length > 0 || item.snippets.length > 0

  return (
    <div>
      <button
        onClick={() => toggle(item.slug)}
        className="flex w-full items-center gap-1.5 rounded-lg py-1.5 pr-2 text-left text-[13px] font-medium text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)] cursor-pointer"
        style={{ paddingLeft: `${depth * 0.85 + 0.5}rem` }}
      >
        {hasContent ? (
          <ChevronRight className={cn('h-3.5 w-3.5 shrink-0 transition-transform duration-200', isOpen && 'rotate-90')} />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        <span className="truncate">{item.label}</span>
      </button>
      {isOpen && hasContent && (
        <div className="animate-fade-up">
          {item.children.map((child) => (
            <NavNode key={child.slug} item={child} depth={depth + 1} expanded={expanded} toggle={toggle} />
          ))}
          {item.snippets.map((snippet) => (
            <NavLink
              key={snippet.id}
              to={`/s/${snippet.id}`}
              className={({ isActive }) =>
                cn(
                  'block truncate rounded-lg py-1.5 pr-2 text-[13px] text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]',
                  isActive && 'bg-[var(--color-accent-glow)]/[0.18] text-[var(--color-accent-soft)]',
                )
              }
              style={{ paddingLeft: `${(depth + 1) * 0.85 + 0.5 + 1.25}rem` }}
            >
              {snippet.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    navGroups.forEach((group) => group.categories.forEach((c) => (initial[c.slug] = true)))
    return initial
  })

  const toggle = (slug: string) => setExpanded((prev) => ({ ...prev, [slug]: !(prev[slug] ?? false) }))

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-6">
      {navGroups.map((group) => {
        const basecamp = basecamps.find((b) => b.slug === group.slug)
        return (
          <div key={group.slug}>
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-faint)]">
                {group.label.replace(/^BASECAMP \d+:\s*/i, '')}
              </span>
              {basecamp && (
                <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">
                  {basecamp.doneCount}/{basecamp.totalCount}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.categories.map((category) => (
                <NavNode key={category.slug} item={category} depth={0} expanded={expanded} toggle={toggle} />
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}
