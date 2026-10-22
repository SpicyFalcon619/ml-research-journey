import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ShikiTransformer } from 'shiki'
import { Camera, Check, ChevronDown, Copy, Download, RotateCcw, X } from 'lucide-react'
import { toBlob } from 'html-to-image'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import { THEME_OPTIONS, type ThemeId } from '@/lib/theme'
import { useTheme } from '@/hooks/useTheme'
import {
  BACKGROUNDS,
  DEFAULT_STYLE,
  FONT_SIZES,
  PADDINGS,
  RADII,
  SCALES,
  WINDOW_STYLES,
  formatRanges,
  loadStyle,
  saveStyle,
  type CaptureStyle,
} from '@/lib/captureSettings'
import type { CapturedOutput } from '@/lib/outputs'
import type { Topic } from '@/types'
import { CaptureCard } from './CaptureCard'
import { LinePicker } from './LinePicker'
import { Dropdown } from '@/components/ui/Dropdown'
import { ThemeDot } from '@/components/layout/ThemeToggle'
import { cn } from '@/lib/cn'

// Highlighting emits each source line as <span class="line" data-line="N">, so a
// capture can keep the real line numbers whichever lines are chosen. It also tags
// comment and docstring pieces (using the grammar's own scope names, so a "#" inside a
// string is never mistaken for a comment) so they can be left out of an image.
const captureTransformer: ShikiTransformer = {
  line(node, line) {
    node.properties['data-line'] = String(line)
    this.addClassToHast(node, 'code-line')
  },
  span(node, _line, _col, _lineElement, token) {
    const scopes = token.explanation?.flatMap((part) => part.scopes.map((scope) => scope.scopeName)) ?? []
    if (scopes.some((scope) => scope.startsWith('comment'))) this.addClassToHast(node, 'tok-comment')
    else if (scopes.some((scope) => scope.includes('docstring'))) this.addClassToHast(node, 'tok-docstring')
  },
}

interface LeaveOut {
  comments: boolean
  docstrings: boolean
  blank: boolean
}
const NOTHING_LEFT_OUT: LeaveOut = { comments: false, docstrings: false, blank: false }

/** Drop whitespace left dangling at the end of a line once a trailing comment was removed. */
function trimTrailingSpace(line: HTMLElement) {
  while (line.lastChild) {
    const last = line.lastChild
    const text = last.textContent ?? ''
    if (text.trim() === '') {
      last.remove()
      continue
    }
    if (last.childNodes.length === 1 && last.firstChild?.nodeType === Node.TEXT_NODE) last.textContent = text.replace(/\s+$/, '')
    break
  }
}

function parseCode(html: string): HTMLElement | null {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content.querySelector('code')
}

/** The highlighted markup inside each line, in order. */
function extractLines(html: string): string[] {
  const code = parseCode(html)
  return code ? [...code.querySelectorAll<HTMLElement>(':scope > span.line')].map((el) => el.innerHTML) : []
}

// Keeps only the wanted lines of the highlighted markup, with a "..." row wherever
// the chosen lines skip some. Done on the markup (not by re-highlighting just those
// lines) so colors stay right when a chosen line sits inside a multi-line string.
function keepLines(html: string, lines: number[], leaveOut: LeaveOut): string {
  const template = document.createElement('template')
  template.innerHTML = html
  const code = template.content.querySelector('code')
  if (!code) return html
  const wanted = new Set(lines)
  const all = [...code.querySelectorAll<HTMLElement>(':scope > span.line')]
  const filtering = leaveOut.comments || leaveOut.docstrings || leaveOut.blank
  code.replaceChildren()
  let previousSelected = 0
  let shown = 0
  for (const el of all) {
    const number = Number(el.dataset.line)
    if (!wanted.has(number)) continue
    // A gap is judged on the lines you picked, so lines dropped by "leave out" don't leave a "..." behind.
    const skipped = previousSelected > 0 && number > previousSelected + 1
    previousSelected = number

    let removed = false
    const hide = [leaveOut.comments && '.tok-comment', leaveOut.docstrings && '.tok-docstring'].filter(Boolean).join(',')
    if (hide) {
      for (const piece of el.querySelectorAll(hide)) {
        piece.remove()
        removed = true
      }
    }
    if (removed) trimTrailingSpace(el)
    const empty = (el.textContent ?? '').trim() === ''
    if (empty && (leaveOut.blank || removed)) continue // a comment-only line, or a blank one when asked

    if (skipped) {
      const gap = document.createElement('span')
      gap.className = 'capture-gap'
      gap.textContent = '⋯'
      code.append(gap)
    }
    // With things left out the numbers would skip, so the snippet is numbered from 1 instead.
    if (filtering) el.dataset.line = String(++shown)
    code.append(el)
  }
  return template.innerHTML
}

function Step({ number, title, children }: { number: number; title: string; children?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">
        <span className="mr-2 font-mono text-xs font-normal text-[var(--color-ink-faint)]">{number}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-[var(--color-ink-dim)]">{label}</div>
      {children}
    </div>
  )
}

function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors',
              active
                ? 'border-[var(--color-accent)] bg-[var(--color-surface-hover)] text-[var(--color-ink)]'
                : 'border-[var(--color-border)] text-[var(--color-ink-dim)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-ink-dim)]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]" />
      {label}
    </label>
  )
}

const smallButton =
  'cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40'

const CAPTURE_THEMES = THEME_OPTIONS.filter((o) => o.id !== 'system')

interface CaptureDialogProps {
  code: string
  filename?: string
  topics?: Topic[]
  output?: CapturedOutput
  onClose: () => void
}

function CaptureDialog({ code, filename, topics = [], output, onClose }: CaptureDialogProps) {
  const [siteTheme] = useTheme()
  const [style, setStyle] = useState<CaptureStyle>(loadStyle)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [withOutput, setWithOutput] = useState(false)
  const [leaveOut, setLeaveOut] = useState<LeaveOut>(NOTHING_LEFT_OUT)
  const [showMore, setShowMore] = useState(false)
  const [pickHtml, setPickHtml] = useState<string | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [status, setStatus] = useState<{ kind: 'idle' | 'busy' | 'done' | 'error'; message?: string }>({ kind: 'idle' })
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [available, setAvailable] = useState(0)

  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const renderTheme: ThemeId = style.theme === 'site' ? siteTheme : style.theme
  const stdout = output?.status === 'ok' ? output.stdout.trim() : ''

  // The appearance options are global: every change is saved for next time.
  useEffect(() => saveStyle(style), [style])
  const patch = (changes: Partial<CaptureStyle>) => setStyle((s) => ({ ...s, ...changes }))

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const draw = (theme: ThemeId) =>
        highlighter.codeToHtml(code, {
          lang: 'python',
          theme: SHIKI_THEME_BY_SITE_THEME[theme],
          includeExplanation: true,
          transformers: [captureTransformer],
        })
      // The picker is drawn in the site's own theme so it matches the page around it;
      // the preview (and the image) use whichever theme the capture is set to.
      const site = draw(siteTheme)
      setPickHtml(site)
      setPreviewHtml(renderTheme === siteTheme ? site : draw(renderTheme))
    })
    return () => {
      cancelled = true
    }
  }, [code, siteTheme, renderTheme])

  const pickLines = useMemo(() => (pickHtml ? extractLines(pickHtml) : []), [pickHtml])
  const total = pickLines.length || code.split('\n').length

  // Nothing selected means the whole file, so the default needs no clicks at all.
  const chosen = useMemo(() => {
    if (selected.size === 0) return Array.from({ length: total }, (_, i) => i + 1)
    return [...selected].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  }, [selected, total])
  const filtered = useMemo(() => (previewHtml ? keepLines(previewHtml, chosen, leaveOut) : null), [previewHtml, chosen, leaveOut])
  const wholeFile = selected.size === 0 || chosen.length === total

  function selectSection(index: number) {
    const topic = topics[index]
    if (!topic) return
    const end = topics[index + 1] ? topics[index + 1].line - 1 : total
    setSelected(new Set(Array.from({ length: Math.max(0, end - topic.line + 1) }, (_, i) => topic.line + i)))
  }

  // Scale the preview down to fit its frame; the exported image is never scaled.
  useLayoutEffect(() => {
    const card = cardRef.current
    const frame = frameRef.current
    if (!card || !frame) return
    const measure = () => {
      setSize({ w: card.offsetWidth, h: card.offsetHeight })
      setAvailable(frame.clientWidth)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(card)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [filtered !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  const previewScale = size.w > 0 ? Math.min(1, Math.max(0.1, (available - 32) / size.w)) : 1
  // Browsers cap canvas size; shrink the pixel ratio rather than fail on a very long capture.
  const exportRatio = size.w > 0 ? Math.min(style.scale, 16000 / Math.max(size.w, size.h)) : style.scale
  const pixels = { w: Math.round(size.w * exportRatio), h: Math.round(size.h * exportRatio) }

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, select, [tabindex="0"]')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  async function render(): Promise<Blob> {
    const node = cardRef.current
    if (!node) throw new Error('Nothing to capture yet.')
    const blob = await toBlob(node, { pixelRatio: exportRatio, cacheBust: true })
    if (!blob) throw new Error('The browser could not draw the image.')
    return blob
  }

  function fileName(): string {
    const base = (filename ?? 'snippet').replace(/\.\w+$/, '')
    if (wholeFile) return `${base}.png`
    const contiguous = chosen[chosen.length - 1] - chosen[0] + 1 === chosen.length
    return contiguous ? `${base}-lines-${chosen[0]}-${chosen[chosen.length - 1]}.png` : `${base}-selection.png`
  }

  async function handleDownload() {
    setStatus({ kind: 'busy' })
    try {
      const url = URL.createObjectURL(await render())
      const link = document.createElement('a')
      link.href = url
      link.download = fileName()
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus({ kind: 'done', message: 'Saved' })
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Could not create the image.' })
    }
  }

  async function handleCopy() {
    setStatus({ kind: 'busy' })
    try {
      if (!navigator.clipboard || typeof ClipboardItem === 'undefined') throw new Error('This browser cannot copy images. Use Download instead.')
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': await render() })])
      setStatus({ kind: 'done', message: 'Copied to clipboard' })
    } catch (error) {
      setStatus({ kind: 'error', message: error instanceof Error ? error.message : 'Could not copy the image.' })
    }
  }

  const busy = status.kind === 'busy'
  const canExport = filtered !== null && !busy
  const summary = wholeFile ? `Whole file, ${total} ${total === 1 ? 'line' : 'lines'}` : `${chosen.length} ${chosen.length === 1 ? 'line' : 'lines'} selected: ${formatRanges(chosen)}`

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="capture-title"
        className="flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-glass)]"
      >
        <header className="flex items-center justify-between gap-4 border-b border-[var(--color-border)] px-5 py-3.5">
          <div>
            <h2 id="capture-title" className="text-base font-semibold text-[var(--color-ink)]">
              Capture as image
            </h2>
            <p className="text-xs text-[var(--color-ink-faint)]">Pick the lines, check the preview, then copy or download. {filename && <span className="font-mono">{filename}</span>}</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg p-2 text-[var(--color-ink-dim)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto wide:h-[min(38rem,calc(100vh-11rem))] wide:grid-cols-2 wide:overflow-hidden">
          <section className="flex min-w-0 flex-col gap-3 p-5 wide:min-h-0 wide:border-r wide:border-[var(--color-border)]">
            <Step number={1} title="Choose lines">
              <div className="flex items-center gap-1.5">
                <button type="button" className={smallButton} onClick={() => setSelected(new Set(Array.from({ length: total }, (_, i) => i + 1)))}>
                  Select all
                </button>
                <button type="button" className={smallButton} disabled={selected.size === 0} onClick={() => setSelected(new Set())}>
                  Clear
                </button>
              </div>
            </Step>
            <p className="text-xs leading-relaxed text-[var(--color-ink-faint)]">
              Click lines to select them. Drag, or hold Shift and click, to select a range. Select nothing to capture the
              whole file.
            </p>
            {topics.length > 0 && (
              <Dropdown
                ariaLabel="Select a whole section"
                placeholder="Select a whole section..."
                value={null}
                options={topics.map((topic, i) => ({ value: i, label: topic.label, description: `from line ${topic.line}` }))}
                onChange={selectSection}
              />
            )}
            {/* A fixed height on phones: there the sections stack and the panel scrolls, so the list must not depend on a parent height. */}
            <div className="flex h-72 min-w-0 shrink-0 flex-col overflow-hidden wide:h-auto wide:min-h-0 wide:flex-1">
              {pickHtml ? (
                <LinePicker lines={pickLines} selected={selected} onChange={setSelected} />
              ) : (
                <p className="text-sm text-[var(--color-ink-faint)]">Loading the code...</p>
              )}
            </div>
            <p className="font-mono text-xs text-[var(--color-ink-faint)]" role="status">
              {summary}
            </p>
          </section>

          <section className="flex min-w-0 flex-col gap-3 border-t border-[var(--color-border)] p-5 wide:min-h-0 wide:overflow-y-auto wide:border-t-0">
            <Step number={2} title="Preview">
              <span className="font-mono text-xs text-[var(--color-ink-faint)]">{size.w ? `${pixels.w} x ${pixels.h} px` : ''}</span>
            </Step>
            <div ref={frameRef} className="min-h-[13rem] shrink-0 overflow-auto wide:shrink wide:flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              {filtered === null ? (
                <p className="text-sm text-[var(--color-ink-faint)]">Preparing preview...</p>
              ) : (
                <div style={{ width: size.w * previewScale || undefined, height: size.h * previewScale || undefined }}>
                  <div style={{ width: 'max-content', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                    <CaptureCard ref={cardRef} html={filtered} filename={filename} style={style} theme={renderTheme} output={withOutput ? stdout : undefined} />
                  </div>
                </div>
              )}
            </div>

            <Step number={3} title="Look" />
            <div className="flex flex-col gap-3">
              <Segmented label="Window style" value={style.windowStyle} options={WINDOW_STYLES.map((w) => ({ value: w.id, label: w.label }))} onChange={(windowStyle) => patch({ windowStyle })} />
              <div>
                <div className="mb-1.5 text-xs font-medium text-[var(--color-ink-dim)]">Leave out</div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  <Checkbox label="Comments" checked={leaveOut.comments} onChange={(comments) => setLeaveOut((l) => ({ ...l, comments }))} />
                  <Checkbox label="Docstrings" checked={leaveOut.docstrings} onChange={(docstrings) => setLeaveOut((l) => ({ ...l, docstrings }))} />
                  <Checkbox label="Blank lines" checked={leaveOut.blank} onChange={(blank) => setLeaveOut((l) => ({ ...l, blank }))} />
                </div>
                {(leaveOut.comments || leaveOut.docstrings || leaveOut.blank) && (
                  <p className="mt-1.5 text-xs text-[var(--color-ink-faint)]">With things left out, line numbers start again at 1.</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <Checkbox label="File name" checked={style.showTitle} onChange={(showTitle) => patch({ showTitle })} />
                {stdout && <Checkbox label="Include the output" checked={withOutput} onChange={setWithOutput} />}
                <button
                  type="button"
                  aria-expanded={showMore}
                  onClick={() => setShowMore((v) => !v)}
                  className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
                >
                  More options <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showMore && 'rotate-180')} />
                </button>
              </div>
              {showMore && (
                <div className="flex flex-col gap-4 border-t border-[var(--color-border)] pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Theme">
                      <Dropdown
                        ariaLabel="Capture theme"
                        value={style.theme}
                        onChange={(theme) => patch({ theme })}
                        options={[
                          { value: 'site' as CaptureStyle['theme'], label: 'Match the site', description: 'Uses whichever theme the site is showing' },
                          ...CAPTURE_THEMES.map((option) => ({
                            value: option.id as CaptureStyle['theme'],
                            label: option.label,
                            description: option.description,
                            icon: <ThemeDot option={option} size={18} />,
                          })),
                        ]}
                      />
                    </Field>
                    <Field label="Text size">
                      <Segmented label="Text size" value={style.fontSize} options={FONT_SIZES.map((v) => ({ value: v, label: `${v}` }))} onChange={(fontSize) => patch({ fontSize })} />
                    </Field>
                  </div>
                  <Field label="Background">
                    <Segmented label="Background" value={style.background} options={BACKGROUNDS.map((b) => ({ value: b.id, label: b.label }))} onChange={(background) => patch({ background })} />
                    {style.background === 'custom' && (
                      <label className="mt-2.5 flex items-center gap-2 text-xs text-[var(--color-ink-dim)]">
                        <input type="color" value={style.customColor} onChange={(e) => patch({ customColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border border-[var(--color-border)] bg-transparent p-0.5" />
                        <span className="font-mono">{style.customColor}</span>
                      </label>
                    )}
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Space around">
                      <Segmented label="Padding" value={style.padding} options={PADDINGS} onChange={(padding) => patch({ padding })} />
                    </Field>
                    <Field label="Corners">
                      <Segmented label="Corners" value={style.radius} options={RADII} onChange={(radius) => patch({ radius })} />
                    </Field>
                    <Field label="Resolution">
                      <Segmented label="Resolution" value={style.scale} options={SCALES.map((v) => ({ value: v, label: `${v}x` }))} onChange={(scale) => patch({ scale })} />
                    </Field>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Checkbox label="Line numbers" checked={style.lineNumbers} onChange={(lineNumbers) => patch({ lineNumbers })} />
                    <Checkbox label="Shadow" checked={style.shadow} onChange={(shadow) => patch({ shadow })} />
                    <button
                      type="button"
                      onClick={() => setStyle(DEFAULT_STYLE)}
                      className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-[var(--color-ink-faint)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset look
                    </button>
                  </div>
                  <p className="text-xs text-[var(--color-ink-faint)]">Your look is remembered for every capture.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] px-5 py-3">
          <p role="status" className={cn('text-sm', status.kind === 'error' ? 'text-[var(--color-ember)]' : 'text-[var(--color-ink-faint)]')}>
            {status.kind === 'busy' ? 'Drawing the image...' : status.message ?? (style.background === 'transparent' ? 'Transparent background: the PNG keeps its transparency.' : '')}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!canExport}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border-strong)] px-3.5 text-sm font-medium text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status.kind === 'done' && status.message?.startsWith('Copied') ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy image
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={!canExport}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3.5 text-sm font-medium text-[var(--color-accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="h-4 w-4" /> Download PNG
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  )
}

// Replaces the old one-click capture for code files: opens the dialog above.
export function CaptureDialogButton(props: Omit<CaptureDialogProps, 'onClose'>) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-2.5 py-1 text-xs text-[var(--color-code-ink-dim)] transition-colors hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]"
      >
        <Camera className="h-3.5 w-3.5" /> Capture
      </button>
      {open && <CaptureDialog {...props} onClose={() => setOpen(false)} />}
    </>
  )
}
