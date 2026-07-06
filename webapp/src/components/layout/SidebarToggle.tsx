import { PanelLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

// Lives outside the TopBar and Sidebar's own scroll/sticky contexts, as a
// viewport-fixed control, so it's always reachable — including on snippet
// pages, where the TopBar intentionally gives up its sticky position once you
// scroll (so the code block's own header can take over that space instead).
export function SidebarToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
      className={cn(
        'glass-panel fixed top-1/2 z-40 hidden -translate-y-1/2 items-center justify-center rounded-full p-2 text-[var(--color-ink-dim)] transition-[left,color] duration-300 ease-in-out hover:text-[var(--color-ink)] lg:flex cursor-pointer',
        open ? 'left-[17rem]' : 'left-3',
      )}
    >
      <PanelLeft className="h-4 w-4" />
    </button>
  )
}
