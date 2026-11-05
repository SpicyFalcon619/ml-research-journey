import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import type { Snippet } from '@/types'

// The way forward is the big button above (LessonFinish); this is only the way back.
export function PrevNext({ prev }: { prev?: Snippet; next?: Snippet }) {
  if (!prev) return null
  return (
    <nav aria-label="Lesson navigation" className="mt-8">
      <Link
        to={`/s/${prev.id}`}
        className="group inline-flex min-h-6 items-center gap-2 text-sm text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Previous lesson: <span className="text-[var(--color-ink-dim)] group-hover:text-[var(--color-ink)]">{prev.title}</span>
      </Link>
    </nav>
  )
}
