import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Snippet } from '@/types'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { cn } from '@/lib/cn'

function Card({ snippet, direction }: { snippet: Snippet; direction: 'prev' | 'next' }) {
  const next = direction === 'next'
  return (
    <Link to={`/s/${snippet.id}`}>
      <GlassPanel
        className={cn(
          'h-full p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]',
          next && 'text-right',
        )}
      >
        <p className={cn('flex items-center gap-1.5 text-xs text-[var(--color-ink-faint)]', next && 'justify-end')}>
          {!next && <ArrowLeft className="h-3 w-3" />}
          {next ? 'Next' : 'Previous'}
          {next && <ArrowRight className="h-3 w-3" />}
        </p>
        <h3 className="mt-1 truncate font-medium text-[var(--color-ink)]">{snippet.title}</h3>
        <p className="mt-0.5 truncate font-mono text-xs text-[var(--color-ink-faint)]">{snippet.filename}</p>
      </GlassPanel>
    </Link>
  )
}

export function PrevNext({ prev, next }: { prev?: Snippet; next?: Snippet }) {
  if (!prev && !next) return null
  return (
    <nav aria-label="Lesson navigation" className="mt-8 grid gap-3 sm:grid-cols-2">
      {prev ? <Card snippet={prev} direction="prev" /> : <span className="hidden sm:block" />}
      {next ? <Card snippet={next} direction="next" /> : <span className="hidden sm:block" />}
    </nav>
  )
}
