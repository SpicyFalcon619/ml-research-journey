import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import { parseLesson } from '@/lib/lesson'
import { getOutput } from '@/lib/outputs'
import { allLessons } from '@/lib/progress'
import { useTheme } from '@/hooks/useTheme'
import { chunkTransformer } from '@/components/snippet/GuidedLesson'
import type { Snippet } from '@/types'

const MAX_CODE_LINES = 12
const MAX_OUTPUT_LINES = 6

// The next lesson, already open: what it will teach, the first piece of code and the
// output that code really printed. It is the proof that the guide delivers, shown
// before the visitor has clicked anything.
export default function LessonPeek({ snippet, returning = false }: { snippet: Snippet; returning?: boolean }) {
  const [siteTheme] = useTheme()
  const [html, setHtml] = useState<string | null>(null)

  const { learn, code } = useMemo(() => {
    const blocks = parseLesson(snippet.code)
    const card = blocks.find((b) => b.type === 'banner' && b.kind === 'learn')
    const first = blocks.find((b) => b.type === 'code')
    const bullets =
      card && card.type === 'banner'
        ? card.sections.flatMap((s) => s.items).filter((i) => i.kind === 'bullet').map((i) => i.text)
        : []
    // A lesson without a guide card shows the top of its file instead.
    const fallback = snippet.code.split('\n').slice(0, MAX_CODE_LINES).join('\n')
    const lines = first && first.type === 'code' ? first.code.split('\n') : null
    return {
      learn: bullets.slice(0, 5),
      code: lines
        ? { line: first!.type === 'code' ? first!.line : 1, text: lines.slice(0, MAX_CODE_LINES).join('\n') }
        : { line: 1, text: fallback },
    }
  }, [snippet])

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      setHtml(
        highlighter.codeToHtml(code.text, {
          lang: 'python',
          theme: SHIKI_THEME_BY_SITE_THEME[siteTheme],
          transformers: [chunkTransformer(code.line)],
        }),
      )
    })
    return () => {
      cancelled = true
    }
  }, [code, siteTheme])

  const output = getOutput(snippet.path)
  const printed = (output?.stdout || output?.scenarios?.[0]?.stdout || '').trimEnd().split('\n').slice(0, MAX_OUTPUT_LINES)

  return (
    <article aria-label={`Preview of ${snippet.title}`}>
      <h2 className="text-4xl leading-none font-bold text-[var(--color-ink)] sm:text-5xl">{snippet.title}</h2>
      <p className="mt-3 text-[15px] text-[var(--color-ink-faint)]">
        {returning ? 'Where you left off · ' : ''}
        {[snippet.categoryLabel, ...snippet.subSegments].join(' / ')} · stop {allLessons.findIndex((l) => l.id === snippet.id) + 1} of {allLessons.length}
      </p>

      {learn.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">What you will learn</h3>
          <ul className="mt-2 max-w-2xl space-y-1.5 text-[15px] leading-relaxed text-[var(--color-ink-dim)]">
            {learn.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-[var(--color-accent-soft)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="guide-code code-font mt-6" style={{ ['--line-start' as string]: code.line - 1 }}>
        {html ? (
          <div className="overflow-x-auto py-2.5" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="overflow-x-auto px-4 py-2.5 font-mono text-[var(--color-code-ink-dim)]">{code.text}</pre>
        )}
        {printed.length > 0 && (
          <div className="border-t border-[var(--color-code-border)] bg-[var(--color-code-terminal-bg)] px-4 py-3">
            <p className="mb-1.5 text-xs text-[var(--color-code-ink-faint)]">What it printed when I ran it</p>
            <pre className="code-font font-mono leading-relaxed whitespace-pre text-[var(--color-code-ink)]">{printed.join('\n')}</pre>
          </div>
        )}
      </div>

      <Link
        to={`/s/${snippet.id}`}
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent-soft)] underline-offset-4 hover:underline"
      >
        Read the whole lesson
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  )
}
