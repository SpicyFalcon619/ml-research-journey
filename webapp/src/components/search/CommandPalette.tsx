import { useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { search, type SearchHit } from '@/lib/search'

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const hits = useMemo(() => search(query), [query])

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  function go(hit: SearchHit) {
    onClose()
    navigate(`/s/${hit.snippet.id}${hit.topicLine ? `?line=${hit.topicLine}` : ''}`)
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
                    {query ? 'No snippets found.' : 'Start typing to search your field guide…'}
                  </div>
                )}
                {hits.map((hit) => (
                  <Command.Item
                    key={`${hit.snippet.id}-${hit.topicLine ?? ''}`}
                    value={`${hit.snippet.id}-${hit.topicLine ?? ''}`}
                    onSelect={() => go(hit)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink-dim)] data-[selected=true]:bg-white/[0.06] data-[selected=true]:text-[var(--color-ink)]"
                  >
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium text-[var(--color-ink)]">{hit.snippet.title}</span>
                      <span className="truncate text-xs text-[var(--color-ink-faint)]">
                        {hit.snippet.categoryLabel}
                        {hit.topicLabel ? ` · ${hit.topicLabel}` : ''}
                      </span>
                    </div>
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
