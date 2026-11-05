import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { ExternalLink, MessageSquareText } from 'lucide-react'
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
import { LessonFinish } from '@/components/snippet/LessonFinish'
import { TickRail } from '@/components/snippet/TickRail'
import { lineColor, trackIndexOf } from '@/lib/journey'
import { allLessons } from '@/lib/progress'
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

  // Tags are search helpers; the ones worth showing are the concept words, not section titles or filler.
  const conceptTags = (snippet?.tags ?? [])
    .filter((t) => !/^topic/.test(t) && t.length > 3 && !['and', 'the', 'with', 'for', 'basics'].includes(t))
    .slice(0, 6)

  const viewSwitcher = guided ? (
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
            'cursor-pointer rounded-md px-3 py-1 text-[13px] transition-colors',
            activeView === option.id
              ? 'bg-[var(--color-surface-hover)] font-medium text-[var(--color-ink)] shadow-sm'
              : 'text-[var(--color-ink-faint)] hover:text-[var(--color-ink-dim)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  ) : null

  return (
    // Keyed by snippet id so navigating between snippets (same route pattern, `/s/:id`)
    // remounts this whole subtree instead of reusing it — otherwise CodeBlock's
    // "Run" toggle state (and highlighted-language cache) would leak from one
    // snippet's code block into the next one's.
    <div
      key={snippet.id}
      className="mx-auto grid max-w-[72rem] animate-fade-up gap-x-8 pb-16 xl:grid-cols-[minmax(0,1fr)_13rem]"
      style={{ ['--stop' as string]: lineColor(trackIndexOf(snippet.categorySlug)) }}
    >
      <div className="min-w-0">
      <div className="mb-5">
        <TickRail currentId={snippet.id} />
      </div>

      {/* Stacked on phones: the title and the buttons side by side are wider than the screen. */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-4xl leading-none font-bold text-[var(--color-ink)] sm:text-5xl">{snippet.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px] text-[var(--color-ink-dim)]">
            <span aria-hidden className="h-1.5 w-8 shrink-0 rounded-full bg-[var(--stop)]" />
            <Link to={`/c/${snippet.categorySlug}`} className="underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
              {snippet.categoryLabel}
            </Link>
            {snippet.subSegments.length > 0 && <span>{snippet.subSegments.join(' / ')}</span>}
            {allLessons.some((l) => l.id === snippet.id) && (
              <span className="text-[var(--color-ink-faint)]">
                stop {allLessons.findIndex((l) => l.id === snippet.id) + 1} of {allLessons.length}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {/* Data files are shown in the guide but aren't something you finish. */}
          {!snippet.filename.endsWith('.csv') && <DoneButton id={snippet.id} />}
          <FavoriteButton id={snippet.id} />
          {available && (
            <button
              type="button"
              onClick={() => openAssistant()}
              aria-label="Ask the AI about this lesson"
              className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]"
            >
              <MessageSquareText className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Ask AI</span>
            </button>
          )}
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 text-[13px] text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] sm:flex"
          >
            <ExternalLink className="h-3.5 w-3.5" /> GitHub
          </a>
        </div>
      </div>

      {/* On wide screens the same sections live in the "In this lesson" rail instead. */}
      {viewTopics.length > 0 && (
        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 xl:hidden">
          {viewTopics.map((topic) => (
            <button
              key={topic.line}
              onClick={() => jumpToLine(topic.line)}
              className="shrink-0 cursor-pointer rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-[13px] whitespace-nowrap text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-accent-glow)] hover:text-[var(--color-accent-soft)]"
            >
              {topic.label}
            </button>
          ))}
        </div>
      )}

      {guided && activeView !== 'guided' && <div className="mb-4">{viewSwitcher}</div>}

      {activeView === 'guided' ? (
        <GuidedLesson
          leading={viewSwitcher}
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
        {conceptTags.map((tag) => (
          <Link key={tag} to={tagPath(tag)} className="group" title={`All lessons tagged "${tag}"`}>
            <Badge className="transition-colors group-hover:border-[var(--color-border-strong)] group-hover:text-[var(--color-ink)]">
              {tag}
            </Badge>
          </Link>
        ))}
      </div>

      <LessonFinish snippet={snippet} next={next} />

      <PrevNext prev={prev} next={next} />
      </div>

      {activeView !== 'original' && <Outline snippet={{ ...snippet, topics: viewTopics }} />}
    </div>
  )
}
