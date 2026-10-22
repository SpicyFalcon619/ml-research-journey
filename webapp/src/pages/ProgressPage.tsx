import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Star, Upload } from 'lucide-react'
import { getSnippetById, snippets } from '@/lib/content'
import { allLessons, nextUpLesson, overallProgress, trackProgress } from '@/lib/progress'
import { THEME_OPTIONS } from '@/lib/theme'
import { MAX_CODE_FONT_SIZE, MIN_CODE_FONT_SIZE } from '@/lib/codeFontSize'
import { ROADMAP_PREFIX, KEYS, computeStreak, eraseAll, exportData, localDay, parseImport, storageSnapshot, timeAgo, writeEntries } from '@/lib/userData'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useLibrary } from '@/hooks/useLibrary'
import { useTheme } from '@/hooks/useTheme'
import { useCodeFontSize } from '@/hooks/useCodeFontSize'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { cn } from '@/lib/cn'

function Heading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">{title}</h2>
      {children && <span className="text-xs text-[var(--color-ink-faint)]">{children}</span>}
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 py-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 cursor-pointer accent-[var(--color-accent)]" />
      <span>
        <span className="block text-sm text-[var(--color-ink)]">{label}</span>
        <span className="block text-xs leading-relaxed text-[var(--color-ink-faint)]">{hint}</span>
      </span>
    </label>
  )
}

const buttonClass =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]'

export function ProgressPage() {
  useDocumentTitle('Your progress')
  const lib = useLibrary()
  const [theme, setTheme, themePreference] = useTheme()
  const [codeSize, setCodeSize] = useCodeFontSize()
  const importRef = useRef<HTMLInputElement>(null)
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null)

  const overall = overallProgress(lib.done)
  const tracks = trackProgress(lib.done)
  const next = nextUpLesson(lib.done)
  const streak = computeStreak(lib.activityDays, localDay())
  const savedLessons = lib.favorites.map(getSnippetById).filter((s) => s !== undefined)
  const recentLessons = lib.recent.flatMap((entry) => {
    const snippet = getSnippetById(entry.id)
    return snippet ? [{ snippet, at: entry.at }] : []
  })

  // The last 30 days as a strip: filled where something was opened or finished.
  const activeSet = new Set(lib.activityDays)
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const day = localDay(date)
    return { day, active: activeSet.has(day) }
  })
  const activeIn30 = last30.filter((d) => d.active).length

  const snapshot = storageSnapshot()
  const roadmapTicks = Object.entries(snapshot).filter(([key, value]) => key.startsWith(ROADMAP_PREFIX) && value === 'true').length
  const captureSaved = KEYS.capture in snapshot

  function confirmThen(message: string, action: () => void) {
    if (window.confirm(message)) action()
  }

  function handleExport() {
    const url = URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `field-guide-progress-${localDay()}.json`
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice({ kind: 'ok', text: 'Exported. Keep the file somewhere safe: it holds your saved lessons, progress and preferences.' })
  }

  async function handleImport(file: File | undefined) {
    if (!file) return
    const result = parseImport(await file.text())
    if (!result.ok) {
      setNotice({ kind: 'error', text: result.error })
      return
    }
    const count = Object.keys(result.entries).length
    confirmThen(`Import ${count} saved items from "${file.name}"? This replaces the matching progress and preferences stored in this browser.`, () => {
      writeEntries(result.entries)
      window.location.reload()
    })
  }

  const dataRows: { label: string; detail: string; onClear?: () => void; clearLabel?: string }[] = [
    { label: 'Lessons marked done', detail: `${lib.done.length}`, onClear: lib.clearDone },
    { label: 'Saved lessons', detail: `${lib.favorites.length}`, onClear: lib.clearFavorites },
    { label: 'Recently opened list', detail: `${lib.recent.length}`, onClear: lib.clearRecent },
    { label: 'Recent searches', detail: `${lib.recentSearches.length}`, onClear: lib.clearSearches },
    { label: 'Active days', detail: `${lib.activityDays.length}`, onClear: lib.clearActivity },
    {
      label: 'Capture appearance',
      detail: captureSaved ? 'customised' : 'default',
      clearLabel: 'Reset',
      onClear: captureSaved ? () => { window.localStorage.removeItem(KEYS.capture); window.location.reload() } : undefined,
    },
    { label: 'Roadmap steps ticked', detail: `${roadmapTicks}` },
  ]

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Your progress</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-dim)]">
          What you've finished and saved, in one place. It's kept in this browser only, so it's private to you and
          nobody else sees it.
        </p>
      </header>

      <section aria-label="Overview" className="mb-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-[var(--color-border)] py-6 sm:grid-cols-4">
          {[
            ['Done', `${overall.done}`, `of ${overall.total} lessons · ${overall.percent}%`],
            ['To do', `${overall.total - overall.done}`, 'lessons left'],
            ['Saved', `${lib.favorites.length}`, 'lessons'],
            ['Day streak', `${streak.current}`, `best ${streak.longest} · ${lib.activityDays.length} active ${lib.activityDays.length === 1 ? 'day' : 'days'}`],
          ].map(([label, value, detail]) => (
            <div key={label}>
              <dt className="text-xs text-[var(--color-ink-faint)]">{label}</dt>
              <dd className="mt-1 font-mono text-3xl font-medium text-[var(--color-ink)] tabular-nums">{value}</dd>
              <dd className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{detail}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {next && (
            <Link to={`/s/${next.id}`} className="group flex items-center gap-2 text-sm text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]">
              <span className="text-[var(--color-ink-faint)]">Next up</span>
              <span className="font-medium text-[var(--color-ink)]">{next.title}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
          {!next && overall.total > 0 && <p className="text-sm text-[var(--color-ink-dim)]">You've marked every lesson as done.</p>}
        </div>
      </section>

      <section className="mb-12">
        <Heading title="By track">Mark lessons as done on their page.</Heading>
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {tracks.map((track) => {
            const pct = track.total ? (track.done / track.total) * 100 : 0
            return (
              <li key={track.slug} className="grid grid-cols-1 items-center gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_14rem_9rem]">
                <Link to={`/c/${track.slug}`} className="min-w-0 text-sm font-medium text-[var(--color-ink)] hover:underline">
                  {track.label}
                </Link>
                <div
                  role="progressbar"
                  aria-label={`${track.label} lessons done`}
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-hover)]"
                >
                  <div className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-accent)]" style={{ width: `${pct}%` }} />
                </div>
                <p className="font-mono text-xs text-[var(--color-ink-faint)] sm:text-right">
                  {track.done} of {track.total} done
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <Heading title="Saved lessons">{savedLessons.length}</Heading>
          {savedLessons.length === 0 ? (
            <p className="text-sm leading-relaxed text-[var(--color-ink-faint)]">Nothing saved yet. Press Save on a lesson to keep it here.</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {savedLessons.map((s) => (
                <li key={s.id} className="flex items-center gap-2">
                  <Link to={`/s/${s.id}`} className="flex min-w-0 flex-1 items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]">
                    <span className="truncate">{s.title}</span>
                    <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{s.categoryLabel}</span>
                  </Link>
                  <button onClick={() => lib.toggleFavorite(s.id)} aria-label={`Remove ${s.title} from saved`} className="shrink-0 cursor-pointer rounded-md p-1.5 text-[var(--color-accent)] transition-colors hover:bg-[var(--color-surface-hover)]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <Heading title="Recently opened">{lib.prefs.keepHistory ? '' : 'history is off'}</Heading>
          {recentLessons.length === 0 ? (
            <p className="text-sm leading-relaxed text-[var(--color-ink-faint)]">
              {lib.prefs.keepHistory ? 'Lessons you open will appear here.' : "History is switched off, so nothing is being remembered."}
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {recentLessons.map(({ snippet, at }) => (
                <li key={snippet.id}>
                  <Link to={`/s/${snippet.id}`} className="flex items-baseline justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]">
                    <span className="truncate">{snippet.title}</span>
                    <span className="shrink-0 text-xs text-[var(--color-ink-faint)]">{timeAgo(at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mb-12">
        <Heading title="Activity">{activeIn30} {activeIn30 === 1 ? 'day' : 'days'} in the last 30</Heading>
        <div className="flex gap-1" role="img" aria-label={`Active on ${activeIn30} of the last 30 days`}>
          {last30.map((d) => (
            <span
              key={d.day}
              title={d.day}
              className={cn('h-6 flex-1 rounded-sm', d.active ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface-hover)]')}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Oldest on the left, today on the right. A day counts when you open or finish a lesson.</p>
      </section>

      <section className="mb-12">
        <Heading title="Preferences">Applied on this device.</Heading>
        <GlassPanel className="divide-y divide-[var(--color-border)] px-5">
          <div className="py-4">
            <p className="mb-2 text-sm text-[var(--color-ink)]">Theme</p>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Theme">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={option.id === themePreference}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    'cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors',
                    option.id === themePreference
                      ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
                      : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-faint)]">Showing {THEME_OPTIONS.find((o) => o.id === theme)?.label} right now.</p>
          </div>
          <div className="py-4">
            <p className="mb-2 text-sm text-[var(--color-ink)]">Code text size</p>
            <div className="flex items-center gap-2" role="group" aria-label="Code text size">
              <button type="button" className={buttonClass} disabled={codeSize <= MIN_CODE_FONT_SIZE} onClick={() => setCodeSize(Math.max(MIN_CODE_FONT_SIZE, codeSize - 1))} aria-label="Smaller code text">−</button>
              <span className="w-14 text-center font-mono text-sm text-[var(--color-ink)]">{codeSize}px</span>
              <button type="button" className={buttonClass} disabled={codeSize >= MAX_CODE_FONT_SIZE} onClick={() => setCodeSize(Math.min(MAX_CODE_FONT_SIZE, codeSize + 1))} aria-label="Larger code text">+</button>
            </div>
          </div>
          <Toggle
            label='Show "Continue where you left off" on the home page'
            hint="Turn this off if you'd rather the home page didn't remember your last lesson."
            checked={lib.prefs.showContinue}
            onChange={(showContinue) => lib.setPrefs({ showContinue })}
          />
          <Toggle
            label="Remember the lessons I open and the searches I make"
            hint="Off means nothing new is added to Recently opened, Recent searches or your activity. Marking a lesson done or saving it still works."
            checked={lib.prefs.keepHistory}
            onChange={(keepHistory) => lib.setPrefs({ keepHistory })}
          />
        </GlassPanel>
      </section>

      <section>
        <Heading title="Your data" />
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
          Everything above is stored in this browser's local storage on this device. It is not sent to a server or to the
          site's repository, and it isn't shared with your other browsers or devices. Clearing your browser's site data
          erases it. Use Export to keep a copy or to move it to another browser.
        </p>
        <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {dataRows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-sm text-[var(--color-ink-dim)]">{row.label}</span>
              <span className="flex items-center gap-4">
                <span className="font-mono text-xs text-[var(--color-ink-faint)]">{row.detail}</span>
                {row.label === 'Roadmap steps ticked' ? (
                  <a href={`${import.meta.env.BASE_URL}ml-research-roadmap.html`} className="text-xs text-[var(--color-ink-faint)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
                    Manage
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled={!row.onClear || row.detail === '0'}
                    onClick={() => row.onClear && confirmThen(`${row.clearLabel ?? 'Clear'}: ${row.label.toLowerCase()}?`, row.onClear)}
                    className="cursor-pointer text-xs text-[var(--color-ink-faint)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40"
                  >
                    {row.clearLabel ?? 'Clear'}
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button type="button" onClick={handleExport} className={buttonClass}>
            <Download className="h-3.5 w-3.5" /> Export my data
          </button>
          <button type="button" onClick={() => importRef.current?.click()} className={buttonClass}>
            <Upload className="h-3.5 w-3.5" /> Import
          </button>
          <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { handleImport(e.target.files?.[0]); e.target.value = '' }} />
          <button
            type="button"
            onClick={() => confirmThen('Erase all saved progress, saved lessons, history and preferences from this browser? This cannot be undone.', () => { eraseAll(); window.location.reload() })}
            className={cn(buttonClass, 'ml-auto')}
          >
            Erase everything
          </button>
        </div>
        {notice && (
          <p role="status" className={cn('mt-3 text-sm', notice.kind === 'error' ? 'text-[var(--color-ember)]' : 'text-[var(--color-ink-dim)]')}>
            {notice.text}
          </p>
        )}
        <p className="mt-6 text-xs text-[var(--color-ink-faint)]">
          {allLessons.length} lessons count towards progress. The {snippets.length - allLessons.length} data files in the tracks are for reference and aren't something you finish.
        </p>
      </section>
    </div>
  )
}
