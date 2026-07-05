import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { getSnippetById } from '@/lib/content'
import { getOutput } from '@/lib/outputs'
import { CodeBlock } from '@/components/code/CodeBlock'
import { Badge } from '@/components/ui/Badge'

function jumpToLine(line: number) {
  const el = document.getElementById(`L${line}`)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('line-flash')
  setTimeout(() => el.classList.remove('line-flash'), 1800)
}

export function SnippetPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const snippet = id ? getSnippetById(id) : undefined

  if (!snippet) return <Navigate to="/" replace />

  const lineParam = searchParams.get('line')
  const focusLine = lineParam ? Number(lineParam) : undefined
  const githubUrl = `https://github.com/SpicyFalcon619/ml-research-journey/blob/master/${encodeURI(snippet.path)}`
  const output = getOutput(snippet.path)

  return (
    // Keyed by snippet id so navigating between snippets (same route pattern, `/s/:id`)
    // remounts this whole subtree instead of reusing it — otherwise CodeBlock's
    // "Run" toggle state (and highlighted-language cache) would leak from one
    // snippet's code block into the next one's.
    <div key={snippet.id} className="mx-auto max-w-4xl animate-fade-up pb-16">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
        <Link to={`/c/${snippet.categorySlug}`} className="hover:text-[var(--color-ink-dim)]">
          {snippet.categoryLabel}
        </Link>
        {snippet.subSegments.map((seg) => (
          <span key={seg} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" /> {seg}
          </span>
        ))}
      </nav>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{snippet.title}</h1>
          <p className="mt-1 font-mono text-xs text-[var(--color-ink-faint)]">{snippet.path}</p>
        </div>
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
        >
          <ExternalLink className="h-3.5 w-3.5" /> GitHub
        </a>
      </div>

      {snippet.topics.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {snippet.topics.map((topic) => (
            <button
              key={topic.line}
              onClick={() => jumpToLine(topic.line)}
              className="cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-accent-glow)] hover:text-[var(--color-accent-soft)]"
            >
              {topic.label}
            </button>
          ))}
        </div>
      )}

      <CodeBlock code={snippet.code} filename={snippet.filename} focusLine={focusLine} output={output} />

      <div className="mt-6 flex flex-wrap gap-1.5">
        {snippet.tags.slice(0, 12).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  )
}
