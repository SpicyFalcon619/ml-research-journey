import { useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, FileText, History, Search, X } from 'lucide-react'
import { search, searchCategories, type SearchHit } from '@/lib/search'
import { getSnippetById } from '@/lib/content'
import { useLibrary } from '@/hooks/useLibrary'
import { Highlight } from './Highlight'
import { cn } from '@/lib/cn'

const itemClass =
  'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--color-ink-dim)] data-[selected=true]:bg-[var(--color-surface-hover)] data-[selected=true]:text-[var(--color-ink)]'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors',
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
          : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
      )}
    >
      {children}
    </button>
  )
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const navigate = useNavigate()
  const { recent, recentSearches, addSearch, clearSearches } = useLibrary()
  const trimmedQuery = query.trim()
  const categoryFilter = category === 'all' ? undefined : category
  const hits = useMemo(() => search(query, 20, categoryFilter), [query, categoryFilter])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setCategory('all')
    }
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
    addSearch(trimmedQuery)
    onClose()
    if (hit.type === 'topic') {
      navigate(`/s/${hit.snippet.id}?line=${hit.topic.line}`)
    } else {
      navigate(`/s/${hit.snippet.id}`)
    }
  }

  function goToAllResults() {
    addSearch(trimmedQuery)
    onClose()
    const params = new URLSearchParams({ q: trimmedQuery })
    if (categoryFilter) params.set('c', categoryFilter)
    navigate(`/search?${params.toString()}`)
  }

  function goToSnippet(id: string) {
    onClose()
    navigate(`/s/${id}`)
  }

  const recentLessons = recent
    .map((entry) => getSnippetById(entry.id))
    .filter((s) => s !== undefined)
    .filter((s) => !categoryFilter || s.categorySlug === categoryFilter)
    .slice(0, 5)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[10vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search lessons"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-glass)]"
            onClick={(e) => e.stopPropagation()}
          >
            <Command shouldFilter={false} className="flex flex-col" label="Search lessons">
              <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] px-4 py-3.5">
                <Search className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" />
                <Command.Input
                  autoFocus
                  value={query}
                  onValueChange={setQuery}
                  placeholder='Search "linear regression", "pandas dropna"…'
                  className="w-full bg-transparent text-[15px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="shrink-0 cursor-pointer rounded-md p-1 text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-ink-faint)]">
                  Esc
                </kbd>
              </div>

              <div className="flex gap-1.5 overflow-x-auto border-b border-[var(--color-border)] px-4 py-2.5" role="group" aria-label="Filter by track">
                <Chip active={category === 'all'} onClick={() => setCategory('all')}>
                  All tracks
                </Chip>
                {searchCategories.map((c) => (
                  <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                    {c.label}
                  </Chip>
                ))}
              </div>

              <Command.List className="max-h-[52vh] overflow-y-auto p-2">
                {!trimmedQuery && (
                  <>
                    {recentSearches.length > 0 && (
                      <Command.Group
                        heading={
                          <span className="flex items-center justify-between px-3 pt-1 pb-1.5 text-[11px] font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
                            Recent searches
                            <button
                              onClick={clearSearches}
                              className="cursor-pointer font-normal tracking-normal normal-case hover:text-[var(--color-ink)]"
                            >
                              Clear
                            </button>
                          </span>
                        }
                      >
                        {recentSearches.map((q) => (
                          <Command.Item key={q} value={`recent-search-${q}`} onSelect={() => setQuery(q)} className={itemClass}>
                            <span className="flex items-center gap-2">
                              <History className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)]" />
                              {q}
                            </span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}

                    {recentLessons.length > 0 && (
                      <Command.Group
                        heading={
                          <span className="block px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
                            Recently opened
                          </span>
                        }
                      >
                        {recentLessons.map((s) => (
                          <Command.Item key={s.id} value={`recent-lesson-${s.id}`} onSelect={() => goToSnippet(s.id)} className={itemClass}>
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate font-medium text-[var(--color-ink)]">{s.title}</span>
                              <span className="truncate text-xs text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                            </span>
                            <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{s.filename}</span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}

                    {recentSearches.length === 0 && recentLessons.length === 0 && (
                      <div className="px-3 py-10 text-center text-sm text-[var(--color-ink-faint)]">
                        Start typing to search every lesson, section and API name.
                      </div>
                    )}
                  </>
                )}

                {trimmedQuery && hits.length === 0 && (
                  <div className="px-3 py-10 text-center text-sm text-[var(--color-ink-faint)]">
                    No lessons found{categoryFilter ? ' in this track' : ''}. Try a function name or a broader word.
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

                {hits.map((hit) => {
                  const key = hit.type === 'topic' ? `topic-${hit.snippet.id}-${hit.topic.line}` : `file-${hit.snippet.id}`
                  return (
                    <Command.Item key={key} value={key} onSelect={() => goToHit(hit)} className={itemClass}>
                      <div className="flex min-w-0 items-center gap-2.5">
                        {hit.type === 'topic' ? (
                          <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-soft)]" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--color-ink-faint)]" />
                        )}
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate font-medium text-[var(--color-ink)]">
                            <Highlight text={hit.type === 'topic' ? hit.topic.label : hit.snippet.title} query={trimmedQuery} />
                          </span>
                          <span className="truncate text-xs text-[var(--color-ink-faint)]">
                            {hit.type === 'topic' ? `within ${hit.snippet.title}` : hit.snippet.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-[var(--color-ink-faint)]">{hit.snippet.filename}</span>
                    </Command.Item>
                  )
                })}
              </Command.List>

              <div className="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-2.5 text-[11px] text-[var(--color-ink-faint)]">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↑</kbd>
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↓</kbd> navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↵</kbd> open
                </span>
                <span className="ml-auto hidden sm:inline">Section matches jump straight to the code</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
