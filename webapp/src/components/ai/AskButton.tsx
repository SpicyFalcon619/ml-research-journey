import { MessageSquareText } from 'lucide-react'
import { useAssistant } from '@/hooks/useAssistant'

// A small pill pinned to the corner of every page. It hides while the panel is open.
export function AskButton() {
  const { open, openAssistant } = useAssistant()
  if (open) return null
  return (
    <button
      type="button"
      onClick={() => openAssistant()}
      className="fixed right-4 bottom-4 z-40 flex cursor-pointer items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] py-2.5 pr-4 pl-3.5 text-sm font-medium text-[var(--color-ink)] shadow-[var(--shadow-glass)] transition-colors hover:bg-[var(--color-surface-hover)]"
    >
      <MessageSquareText className="h-4 w-4 text-[var(--color-accent-soft)]" aria-hidden /> Ask AI
    </button>
  )
}
