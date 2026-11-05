import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CornerDownLeft, History, MessageSquareText, Search, X } from 'lucide-react'
import { popularSearches, search, searchCategories, suggest, warmSearchIndex, type SearchHit } from '@/lib/search'
import { getSnippetById } from '@/lib/content'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { useLibrary } from '@/hooks/useLibrary'
import { useAssistant } from '@/hooks/useAssistant'
import { Highlight } from './Highlight'
import { ResultRow, hitKey, hitPath } from './ResultRow'
import { cn } from '@/lib/cn'

const itemClass =
  'flex cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-ink-dim)] data-[selected=true]:bg-[var(--color-surface-hover)] data-[selected=true]:text-[var(--color-ink)]'

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'min-h-6 shrink-0 cursor-pointer rounded-md border px-2.5 py-1 text-[13px] transition-colors',
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
  const { available: aiAvailable, openAssistant } = useAssistant()
  const trimmedQuery = query.trim()
  // Typing stays instant; the results follow a beat behind when the machine is busy.
  const deferred = useDeferredValue(trimmedQuery)
  const categoryFilter = category === 'all' ? undefined : category

  useEffect(() => {
    if (open) warmSearchIndex()
  }, [open])

  // One search across every track; the track chips then filter and count that same list.
  const everything = useMemo(() => search(deferred, 200), [deferred])
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const hit of everything) map.set(hit.snippet.categorySlug, (map.get(hit.snippet.categorySlug) ?? 0) + 1)
    return map
  }, [everything])
  const hits = useMemo(
    () => everything.filter((h) => !categoryFilter || h.snippet.categorySlug === categoryFilter).slice(0, 14),
    [everything, categoryFilter],
  )
  const closest = useMemo(() => (deferred && hits.length === 0 ? suggest(deferred) : []), [deferred, hits.length])

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
    navigate(hitPath(hit))
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
    .slice(0, 4)

  const ready = deferred === trimmedQuery
  const total = everything.length

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/65 px-3 pt-[6vh] sm:px-4 sm:pt-[10vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search lessons"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
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
                  placeholder="What do you want to understand? Try “KeyError” or “loop through a list”"
                  className="w-full bg-transparent text-base text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <kbd className="hidden shrink-0 rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-ink-faint)] sm:inline">
                  Esc
                </kbd>
              </div>

              <div className="flex gap-1.5 overflow-x-auto border-b border-[var(--color-border)] px-4 py-2.5" role="group" aria-label="Filter by track">
                <Chip active={category === 'all'} onClick={() => setCategory('all')}>
                  All tracks{trimmedQuery && ready ? ` · ${total}` : ''}
                </Chip>
                {searchCategories.map((c) => {
                  const n = counts.get(c.slug) ?? 0
                  return (
                    <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                      <span aria-hidden className="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" style={{ background: lineColor(trackIndexOf(c.slug)) }} />
                      {c.label.replace(/ Tutorial$/, '')}
                      {trimmedQuery && ready ? ` · ${n}` : ''}
                    </Chip>
                  )
                })}
              </div>

              <div role="status" aria-live="polite" className="sr-only">
                {trimmedQuery && ready ? `${hits.length} results${hits.length < total ? ` shown of ${total}` : ''}` : ''}
              </div>

              <Command.List className="max-h-[56vh] overflow-y-auto p-2">
                {!trimmedQuery && (
                  <>
                    <div className="px-3 pt-2 pb-1 text-[13px] text-[var(--color-ink-faint)]">Popular searches</div>
                    <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                      {popularSearches.map((q) => (
                        <button
                          key={q}
                          onClick={() => setQuery(q)}
                          className="cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-1 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {recentSearches.length > 0 && (
                      <Command.Group
                        heading={
                          <span className="flex items-center justify-between px-3 pt-1 pb-1.5 text-[13px] text-[var(--color-ink-faint)]">
                            Recent searches
                            <button onClick={clearSearches} className="cursor-pointer hover:text-[var(--color-ink)]">
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
                        heading={<span className="block px-3 pt-3 pb-1.5 text-[13px] text-[var(--color-ink-faint)]">Recently opened</span>}
                      >
                        {recentLessons.map((s) => (
                          <Command.Item key={s.id} value={`recent-lesson-${s.id}`} onSelect={() => goToSnippet(s.id)} className={itemClass}>
                            <span className="flex min-w-0 items-center gap-3">
                              <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lineColor(trackIndexOf(s.categorySlug)) }} />
                              <span className="flex min-w-0 flex-col">
                                <span className="truncate font-medium text-[var(--color-ink)]">{s.title}</span>
                                <span className="truncate text-[13px] text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                              </span>
                            </span>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    )}
                  </>
                )}

                {trimmedQuery && ready && hits.length === 0 && (
                  <div className="px-3 py-6">
                    <p className="text-[15px] text-[var(--color-ink)]">
                      Nothing found for “{trimmedQuery}”{categoryFilter ? ' in this track' : ''}.
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-ink-faint)]">Try a single keyword, a function name, or the plain-words version of what you mean.</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                      {categoryFilter && (
                        <button onClick={() => setCategory('all')} className="cursor-pointer text-[var(--color-accent-soft)] underline underline-offset-4">
                          Search all tracks
                        </button>
                      )}
                      {aiAvailable && (
                        <button
                          onClick={() => {
                            onClose()
                            openAssistant(trimmedQuery.endsWith('?') ? trimmedQuery : `${trimmedQuery}?`)
                          }}
                          className="inline-flex min-h-6 cursor-pointer items-center gap-1.5 text-[var(--color-accent-soft)] underline underline-offset-4"
                        >
                          <MessageSquareText className="h-3.5 w-3.5" /> Ask the AI instead
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {closest.length > 0 && (
                  <Command.Group heading={<span className="block px-3 pt-1 pb-1.5 text-[13px] text-[var(--color-ink-faint)]">Did you mean</span>}>
                    {closest.map((s) => (
                      <Command.Item key={s.id} value={`closest-${s.id}`} onSelect={() => goToSnippet(s.id)} className={itemClass}>
                        <span className="flex min-w-0 items-center gap-3">
                          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: lineColor(trackIndexOf(s.categorySlug)) }} />
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate font-medium text-[var(--color-ink)]">
                              <Highlight text={s.title} query={trimmedQuery} />
                            </span>
                            <span className="truncate text-[13px] text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                          </span>
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {trimmedQuery && hits.length > 0 && (
                  <Command.Item
                    value="__view-all__"
                    onSelect={goToAllResults}
                    className="mb-1 flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm text-[var(--color-accent-soft)] data-[selected=true]:border-[var(--color-border-strong)] data-[selected=true]:bg-[var(--color-surface-hover)]"
                  >
                    <span>
                      See all {categoryFilter ? (counts.get(categoryFilter) ?? 0) : total} results for <span className="font-medium">“{trimmedQuery}”</span>
                    </span>
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0" />
                  </Command.Item>
                )}

                {hits.map((hit) => (
                  <Command.Item key={hitKey(hit)} value={hitKey(hit)} onSelect={() => goToHit(hit)} className={itemClass}>
                    <ResultRow hit={hit} query={trimmedQuery} />
                  </Command.Item>
                ))}
              </Command.List>

              <div className="flex items-center gap-4 border-t border-[var(--color-border)] px-4 py-2.5 text-[13px] text-[var(--color-ink-faint)]">
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↑</kbd>
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↓</kbd> move
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="rounded border border-[var(--color-border)] px-1 font-mono">↵</kbd> open
                </span>
                <span className="ml-auto hidden sm:inline">Searches the explanations and the code, not just titles</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
