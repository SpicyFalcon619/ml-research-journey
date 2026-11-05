import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ChevronRight, ExternalLink, MessageSquareText } from 'lucide-react'
import { getSnippetById } from '@/lib/content'
import { getOutput } from '@/lib/outputs'
import { getAdjacent } from '@/lib/roadmap'
import { jumpToLine } from '@/lib/scroll'
import { tagPath } from '@/lib/tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/hooks/useLibrary'
import { useAssistant } from '@/hooks/useAssistant'
import { CodeBlock } from '@/components/code/CodeBlock'
import { GuidedLesson } from '@/components/snippet/GuidedLesson'
import { hasGuide, parseLesson } from '@/lib/lesson'
import { toBareCode } from '@/lib/bare'
import { getOriginal } from '@/lib/originals'
import { cn } from '@/lib/cn'
import { DoneButton } from '@/components/snippet/DoneButton'
import { FavoriteButton } from '@/components/snippet/FavoriteButton'
import { Outline } from '@/components/snippet/Outline'
import { PrevNext } from '@/components/snippet/PrevNext'
import { Badge } from '@/components/ui/Badge'

type LessonView = 'guided' | 'code' | 'bare' | 'original'
const VIEWS: { id: LessonView; label: string; hint: string }[] = [
  { id: 'guided', label: 'Guided', hint: 'Explanations as readable text, with the code in short pieces' },
  { id: 'code', label: 'Full code', hint: 'The whole file, comments included' },
  { id: 'bare', label: 'Bare code', hint: 'Only the code, with every comment removed' },
  { id: 'original', label: 'Original', hint: 'Your first version of this lesson, before the guided rewrite' },
]
const VIEW_KEY = 'mlfg-lesson-view'

function readView(): LessonView {
  try {
    const stored = window.localStorage.getItem(VIEW_KEY)
    if (stored === 'guided' || stored === 'code' || stored === 'bare' || stored === 'original') return stored
  } catch {
    // storage blocked: fall back to the default
  }
  return 'guided'
}

export function SnippetPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { recordVisit } = useLibrary()
  const { available, openAssistant } = useAssistant()
  const snippet = id ? getSnippetById(id) : undefined
  const [view, setViewState] = useState<LessonView>(readView)
  // Only lessons written with a "What you will learn" card have a guided version.
  const blocks = useMemo(() => (snippet ? parseLesson(snippet.code) : []), [snippet])
  const guided = hasGuide(blocks)
  const bare = useMemo(() => (snippet ? toBareCode(snippet.code, snippet.topics) : null), [snippet])
  const original = snippet ? getOriginal(snippet.path) : undefined
  const views = VIEWS.filter((v) => v.id !== 'original' || original !== undefined)
  // A remembered view that this lesson doesn't have (no original, say) falls back to Guided.
  const activeView: LessonView = guided ? (views.some((v) => v.id === view) ? view : 'guided') : 'code'
  const viewTopics = activeView === 'bare' ? (bare?.topics ?? []) : activeView === 'original' ? [] : (snippet?.topics ?? [])

  function setView(next: LessonView) {
    setViewState(next)
    try {
      window.localStorage.setItem(VIEW_KEY, next)
    } catch {
      // not persisted, still applies for this visit
    }
  }

  useDocumentTitle(snippet?.title)
  // Remembered locally so the home page can offer "continue where you left off".
  useEffect(() => {
    if (snippet) recordVisit(snippet.id)
  }, [snippet, recordVisit])

  if (!snippet) return <Navigate to="/" replace />

  const lineParam = searchParams.get('line')
  const focusLine = lineParam ? Number(lineParam) : undefined
  const githubUrl = `https://github.com/SpicyFalcon619/ml-research-journey/blob/master/${encodeURI(snippet.path)}`
  const output = getOutput(snippet.path)
  const { prev, next } = getAdjacent(snippet.id)

  return (
    // Keyed by snippet id so navigating between snippets (same route pattern, `/s/:id`)
    // remounts this whole subtree instead of reusing it — otherwise CodeBlock's
    // "Run" toggle state (and highlighted-language cache) would leak from one
    // snippet's code block into the next one's.
    <div
      key={snippet.id}
      className="mx-auto grid max-w-[72rem] animate-fade-up gap-x-8 pb-16 xl:grid-cols-[minmax(0,1fr)_13rem]"
    >
      <div className="min-w-0">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-ink-faint)]">
        <Link to={`/c/${snippet.categorySlug}`} className="hover:text-[var(--color-ink-dim)]">
          {snippet.categoryLabel}
        </Link>
        {snippet.subSegments.map((seg) => (
          <span key={seg} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" /> {seg}
          </span>
        ))}
      </nav>

      {/* Stacked on phones: the title and three buttons side by side are wider than the screen. */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-[var(--color-ink)] sm:text-3xl">{snippet.title}</h1>
          <p className="mt-1 font-mono text-xs break-all text-[var(--color-ink-faint)]">{snippet.path}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {/* Data files are shown in the guide but aren't something you finish. */}
          {!snippet.filename.endsWith('.csv') && <DoneButton id={snippet.id} />}
          <FavoriteButton id={snippet.id} />
          {available && (
          <button
            type="button"
            onClick={() => openAssistant()}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
          >
            <MessageSquareText className="h-3.5 w-3.5" /> Ask AI
          </button>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
          >
            <ExternalLink className="h-3.5 w-3.5" /> GitHub
          </a>
        </div>
      </div>

      {/* On wide screens the same sections live in the "In this lesson" rail instead. */}
      {viewTopics.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 xl:hidden">
          {viewTopics.map((topic) => (
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

      {guided && (
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div
            role="group"
            aria-label="Lesson view"
            className="inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
          >
            {views.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setView(option.id)}
                aria-pressed={activeView === option.id}
                title={option.hint}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-1 text-xs transition-colors',
                  activeView === option.id
                    ? 'bg-[var(--color-surface-hover)] text-[var(--color-ink)] shadow-sm'
                    : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-ink-faint)]">{views.find((v) => v.id === activeView)?.hint}</p>
        </div>
      )}

      {activeView === 'guided' ? (
        <GuidedLesson
          blocks={blocks}
          code={snippet.code}
          filename={snippet.filename}
          topics={snippet.topics}
          output={output}
          focusLine={focusLine}
        />
      ) : activeView === 'original' && original !== undefined ? (
        <>
          <p className="mb-3 max-w-[44rem] text-sm leading-relaxed text-[var(--color-ink-dim)]">
            This is the lesson exactly as first written, kept for reference. The Guided, Full code and Bare code views
            show the improved version.
          </p>
          <CodeBlock code={original} filename={snippet.filename} />
        </>
      ) : activeView === 'bare' && bare ? (
        <CodeBlock code={bare.code} filename={snippet.filename} output={output} topics={bare.topics} />
      ) : (
        <CodeBlock
          code={snippet.code}
          filename={snippet.filename}
          focusLine={focusLine}
          output={output}
          topics={snippet.topics}
        />
      )}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {snippet.tags.slice(0, 12).map((tag) => (
          <Link key={tag} to={tagPath(tag)} className="group" title={`All lessons tagged "${tag}"`}>
            <Badge className="transition-colors group-hover:border-[var(--color-border-strong)] group-hover:text-[var(--color-ink)]">
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      <PrevNext prev={prev} next={next} />
      </div>

      {activeView !== 'original' && <Outline snippet={{ ...snippet, topics: viewTopics }} />}
    </div>
  )
}
