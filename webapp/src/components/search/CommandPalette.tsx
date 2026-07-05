import { useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, FileText, Search } from 'lucide-react'
import { search, type SearchHit } from '@/lib/search'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const hits = useMemo(() => search(query), [query])
  const trimmedQuery = query.trim()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [open, onClose])

  function goToHit(hit: SearchHit) {
    onClose()
    if (hit.type === 'topic') {
      navigate(`/s/${hit.snippet.id}?line=${hit.topic.line}`)
    } else {
      navigate(`/s/${hit.snippet.id}`)
    }
  }

  function goToAllResults() {
    onClose()
    navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="glass-panel w-full max-w-xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false} className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder='Search "linear regression", "pandas dropna"…'
                  className="w-full bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
                />
                <kbd className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-faint)]">
                  Esc
                </kbd>
              </div>
              <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                {hits.length === 0 && (
                  <div className="px-3 py-10 text-center text-sm text-[var(--color-ink-faint)]">
                    {trimmedQuery ? 'No snippets found.' : 'Start typing to search your field guide…'}
                  </div>
                )}

                {trimmedQuery && hits.length > 0 && (
                  <Command.Item
                    value="__view-all__"
                    onSelect={goToAllResults}
                    className="mb-1 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-accent-soft)] data-[selected=true]:border-[var(--color-border-strong)] data-[selected=true]:bg-[var(--color-surface-hover)]"
                  >
                    <span>
                      View all results for <span className="font-medium">"{trimmedQuery}"</span>
                    </span>
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0" />
                  </Command.Item>
                )}

                {hits.map((hit) => (
                  <Command.Item
                    key={hit.type === 'topic' ? `topic-${hit.snippet.id}-${hit.topic.line}` : `file-${hit.snippet.id}`}
                    value={hit.type === 'topic' ? `topic-${hit.snippet.id}-${hit.topic.line}` : `file-${hit.snippet.id}`}
                    onSelect={() => goToHit(hit)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink-dim)] data-[selected=true]:bg-[var(--color-surface-hover)] data-[selected=true]:text-[var(--color-ink)]"
                  >
                    {hit.type === 'topic' ? (
                      <div className="flex min-w-0 items-center gap-2">
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-soft)]" />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-[var(--color-ink)]">{hit.topic.label}</span>
                          <span className="truncate text-xs text-[var(--color-ink-faint)]">
                            within {hit.snippet.title}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)]" />
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-[var(--color-ink)]">{hit.snippet.title}</span>
                          <span className="truncate text-xs text-[var(--color-ink-faint)]">
                            {hit.snippet.categoryLabel}
                          </span>
                        </div>
                      </div>
                    )}
                    <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">
                      {hit.snippet.filename}
                    </span>
                  </Command.Item>
                ))}
              </Command.List>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
