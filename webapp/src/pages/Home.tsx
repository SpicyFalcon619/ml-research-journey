import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquareText, Search, Terminal } from 'lucide-react'
import { getSnippetById } from '@/lib/content'
import { trailOrder } from '@/lib/roadmap'
import { allLessons, nextUpLesson, overallProgress } from '@/lib/progress'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAssistant } from '@/hooks/useAssistant'
import { useLibrary } from '@/hooks/useLibrary'
import { isMac } from '@/lib/platform'
import { JourneyMap } from '@/components/home/JourneyMap'
import { SisterGuide } from '@/components/home/SisterGuide'

// Shiki only loads once the preview mounts, so the first paint stays light.
const LessonPeek = lazy(() => import('@/components/home/LessonPeek'))

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const quietLink =
  'inline-flex min-h-6 cursor-pointer items-center gap-1.5 text-[15px] text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]'

export function Home({ onOpenSearch }: { onOpenSearch: () => void }) {
  useDocumentTitle()
  const { recent, done, prefs } = useLibrary()
  const { available, openAssistant } = useAssistant()
  const progress = overallProgress(done)

  // The stop to open: the lesson you were last reading unless you finished it; otherwise the
  // next unfinished stop on the map; on a first visit, stop one.
  const lastOpened = recent.map((entry) => getSnippetById(entry.id)).find((s) => s !== undefined)
  const unfinishedLast = prefs.showContinue && lastOpened && !done.includes(lastOpened.id) ? lastOpened : undefined
  const focus = unfinishedLast ?? nextUpLesson(done) ?? trailOrder[0]
  const returning = done.length > 0 || unfinishedLast !== undefined

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <section className="animate-fade-up pt-2 sm:pt-8">
        <h1 className="max-w-3xl text-balance text-5xl leading-[0.95] font-bold text-[var(--color-ink)] sm:text-7xl">
          {returning ? 'Welcome back.' : 'Learn it in the order I did.'}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--color-ink-dim)]">
          {returning
            ? `${progress.done > 0 ? `You have finished ${progress.done} of ${progress.total} stops. ` : 'You were partway through a stop. '}Pick up with ${focus.title}.`
            : 'My notebook from learning Python, then data science, then machine learning, drawn as one map. Each stop explains the idea, then shows the code beside its real output.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={`/s/${focus.id}`} className="plate">
            {returning ? 'Keep reading' : 'Start learning'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/playground" className={quietLink}>
            <Terminal className="h-3.5 w-3.5" />
            Try Python yourself
          </Link>
          <button onClick={onOpenSearch} className={`${quietLink} max-sm:hidden`}>
            <Search className="h-3.5 w-3.5" />
            Find a concept <kbd className="hidden font-sans text-[var(--color-ink-faint)] sm:inline">({isMac ? '⌘K' : 'Ctrl+K'})</kbd>
          </button>
          {available && (
            <button onClick={() => openAssistant()} className={`${quietLink} max-sm:hidden`}>
              <MessageSquareText className="h-3.5 w-3.5" />
              Ask the AI
            </button>
          )}
        </div>
      </section>

      <div className="animate-fade-up [animation-delay:60ms]">
        <SisterGuide />
      </div>

      <div className="animate-fade-up mt-8 [animation-delay:100ms] sm:mt-6">
        <JourneyMap focusId={focus.id} returning={returning} />
      </div>

      <section aria-label="The next stop" className="mt-12 border-t border-[var(--color-border)] pt-8">
        <Suspense fallback={<div className="h-72" aria-hidden />}>
          <LessonPeek snippet={focus} returning={returning} />
        </Suspense>
      </section>

      <p className="mt-16 text-sm text-[var(--color-ink-faint)]">
        {allLessons.length} stops, last updated {formatDate(__BUILD_DATE__)}. Everything you tick off stays in this browser only.{' '}
        <a
          href={`${import.meta.env.BASE_URL}ml-research-roadmap.html`}
          className="text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]"
        >
          See the whole roadmap
        </a>
        .
      </p>
    </div>
  )
}
