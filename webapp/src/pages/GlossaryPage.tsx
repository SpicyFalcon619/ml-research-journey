import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { snippets } from '@/lib/content'
import { GLOSSARY } from '@/lib/glossary'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'

export function GlossaryPage() {
  useDocumentTitle('Glossary')
  const [params] = useSearchParams()
  const highlighted = params.get('term')
  const [query, setQuery] = useState('')

  const entries = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...GLOSSARY]
      .sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()))
      .filter((entry) => !needle || [entry.term, ...(entry.aliases ?? []), entry.short, entry.long].some((text) => text.toLowerCase().includes(needle)))
  }, [query])

  // Arriving from a lesson, bring the word into view.
  useEffect(() => {
    if (!highlighted) return
    document.getElementById(`term-${highlighted}`)?.scrollIntoView({ block: 'center' })
  }, [highlighted])

  const lessonFor = (title?: string) => (title ? snippets.find((s) => s.title === title) : undefined)

  return (
    <div className="mx-auto max-w-3xl animate-fade-up pb-16">
      <header className="mb-6">
        <h1 className="text-5xl leading-none font-bold text-[var(--color-ink)] sm:text-6xl">Glossary</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-dim)]">
          The words in the lessons that might make you stop: Python, NumPy, pandas, machine learning and PyTorch. Each has a one-line
          meaning, then a longer explanation.
        </p>
      </header>

      <label className="mb-6 flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 focus-within:border-[var(--color-accent)]">
        <Search className="h-4 w-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden />
        <span className="sr-only">Search the glossary</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a word, for example overfitting"
          className="min-w-0 flex-1 bg-transparent text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </label>

      <dl className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {entries.map((entry) => {
          const lesson = lessonFor(entry.lesson)
          return (
            <div key={entry.id} id={`term-${entry.id}`} className={cn('scroll-mt-24 py-5', highlighted === entry.id && 'bg-[var(--color-surface)] px-4')}>
              <dt className="text-xl font-semibold text-[var(--color-ink)]">{entry.term}</dt>
              <dd className="mt-1 text-[15px] leading-relaxed text-[var(--color-ink-dim)]">
                <p className="font-medium text-[var(--color-ink)]">{entry.short}</p>
                <p className="mt-2">{entry.long}</p>
                {lesson && (
                  <p className="mt-2">
                    <Link to={`/s/${lesson.id}`} className="text-[var(--color-accent-soft)] underline underline-offset-4">
                      Read the lesson: {lesson.title}
                    </Link>
                  </p>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
      {entries.length === 0 && <p className="mt-6 text-[var(--color-ink-dim)]">No word matches "{query}". Try a shorter search.</p>}
    </div>
  )
}
