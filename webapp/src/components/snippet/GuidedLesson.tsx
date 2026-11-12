import { createContext, lazy, Suspense, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Pencil, Play } from 'lucide-react'
import { getTerm, TERM_PATTERN, termIdOf, termsIn } from '@/lib/glossary'
import { chunkTransformer, getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import type { BannerSection, LessonBlock, ProseNode } from '@/lib/lesson'
import { figuresForLines, outputForLines, partHasOutput, type CapturedOutput } from '@/lib/outputs'
import type { Topic } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { CopyButton } from '@/components/code/CopyButton'
import { FontSizeControl } from '@/components/code/FontSizeControl'
import { CaptureDialogButton } from '@/components/code/CaptureDialog'
import { ImageLightbox, OutputPanel, withBase } from '@/components/code/OutputPanel'
import { cn } from '@/lib/cn'

// The editor, the Python runner and Pyodide are a separate download, fetched only when someone opens an editor.
const LiveRunner = lazy(() => import('@/components/code/LiveRunner'))

interface GuidedLessonProps {
  /** Shown at the left of the toolbar (the lesson's view switcher). */
  leading?: ReactNode
  blocks: LessonBlock[]
  code: string
  filename: string
  topics: Topic[]
  output?: CapturedOutput
  focusLine?: number
  /** The lesson's repo path and id, for running its code in the browser. Absent means it cannot run here. */
  live?: { path: string; id: string }
  /** Where to open this lesson as a notebook, for lessons that cannot run in the browser (PyTorch). */
  colabUrl?: string
}

// Words in prose that are really code: `backticked`, name(...) calls, __dunders__.
const INLINE_CODE = /(`[^`]+`|(?<!\w)\.?[A-Za-z_][\w.]*\((?:[^()]|\([^()]*\))*\)|__\w+__)/g

// The glossary terms that may be underlined in the block being drawn: only the first block of a lesson that
// uses a term underlines it, so the page is not full of underlines.
const TermsContext = createContext<ReadonlySet<string>>(new Set())
const NO_TERMS: ReadonlySet<string> = new Set()

// A word with a meaning behind it. Hover (mouse), tap or Enter (touch, keyboard) shows the short meaning.
function Term({ id, children }: { id: string; children: ReactNode }) {
  const entry = getTerm(id)
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLSpanElement>(null)
  const card = useRef<HTMLSpanElement>(null)
  const mouse = useRef(false)
  const closing = useRef(0)

  useEffect(() => () => window.clearTimeout(closing.current), [])

  useEffect(() => {
    if (!open) return
    const outside = (event: MouseEvent) => {
      const inside = wrap.current?.contains(event.target as Node) || card.current?.contains(event.target as Node)
      if (!inside) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  if (!entry) return <>{children}</>

  // On a phone the card is a sheet fixed to the bottom of the screen. The lesson fades in with a transform, and a
  // transformed ancestor becomes the reference for `position: fixed`, which would put the sheet far down the page.
  // So there the card is drawn on the page itself.
  const phone = window.matchMedia('(max-width: 640px)').matches
  const popover = (
    <span ref={card} role="tooltip" id={`term-${id}`} className="guide-term-pop">
      <strong>{entry.term}</strong> {entry.short}{' '}
      <Link to={`/glossary?term=${id}`} className="guide-term-more">
        More in the glossary
      </Link>
    </span>
  )
  return (
    <span
      ref={wrap}
      className="guide-term-wrap"
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') {
          mouse.current = true
          window.clearTimeout(closing.current)
          setOpen(true)
        }
      }}
      onPointerLeave={(event) => {
        // A short grace period, so a slightly off path toward the card does not dismiss it.
        if (event.pointerType === 'mouse') closing.current = window.setTimeout(() => setOpen(false), 180)
      }}
    >
      <button
        type="button"
        className="guide-term"
        aria-expanded={open}
        aria-describedby={open ? `term-${id}` : undefined}
        onClick={() => setOpen((value) => (mouse.current ? true : !value))}
      >
        {children}
      </button>
      {open && (phone ? createPortal(popover, document.body) : popover)}
    </span>
  )
}

function Plain({ text }: { text: string }) {
  const allowed = useContext(TermsContext)
  if (allowed.size === 0) return <>{text}</>
  const out: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(TERM_PATTERN)) {
    const id = termIdOf(match[1])
    if (!id || !allowed.has(id)) continue
    out.push(text.slice(last, match.index))
    out.push(
      <Term key={`${id}-${match.index}`} id={id}>
        {match[1]}
      </Term>,
    )
    last = match.index + match[0].length
  }
  out.push(text.slice(last))
  return <>{out}</>
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE_CODE).map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="guide-inline-code">
            {part.startsWith('`') ? part.slice(1, -1) : part}
          </code>
        ) : (
          <Plain key={index} text={part} />
        ),
      )}
    </>
  )
}

/** All the plain text of a prose block (code spans taken out), to find which glossary words it uses. */
function proseText(nodes: ProseNode[]): string {
  return nodes
    .flatMap((node) => (node.type === 'p' ? [node.text] : node.type === 'list' ? node.items : []))
    .join('\n')
    .replace(/`[^`]*`/g, ' ')
}

function Prose({ nodes }: { nodes: ProseNode[] }) {
  return (
    <div className="guide-prose">
      {nodes.map((node, index) => {
        switch (node.type) {
          case 'sub':
            return (
              <h3 key={index} className="guide-sub">
                {node.text}
              </h3>
            )
          case 'pre':
            return (
              <pre key={index} className="guide-pre" tabIndex={0}>
                {node.text}
              </pre>
            )
          case 'list': {
            const List = node.ordered ? 'ol' : 'ul'
            return (
              <List key={index} className={node.ordered ? 'guide-list guide-list-ordered' : 'guide-list'}>
                {node.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            )
          }
          default:
            return node.callout ? (
              <div key={index} role="note" className="guide-callout">
                <p className={node.breaks ? 'guide-breaks' : undefined}>
                  <span className="guide-callout-label">{node.callout}.</span>
                  <Inline text={node.text} />
                </p>
              </div>
            ) : (
              <p key={index} className={node.breaks ? 'guide-breaks' : undefined}>
                <Inline text={node.text} />
              </p>
            )
        }
      })}
    </div>
  )
}

function Banner({ kind, sections }: { kind: 'learn' | 'practice' | 'note'; sections: BannerSection[] }) {
  return (
    <section className={cn('guide-card', kind === 'practice' && 'guide-card-practice')}>
      {sections.map((section, index) => (
        <div key={index} className={index > 0 ? 'mt-4' : undefined}>
          {section.heading && (
            <h2 className="guide-card-title">
              {section.heading}
              {section.subtitle && <span className="guide-card-subtitle"> {section.subtitle}</span>}
            </h2>
          )}
          {groupItems(section).map((group, gi) =>
            group.type === 'text' ? (
              <p key={gi} className="guide-card-text">
                <Inline text={group.text} />
              </p>
            ) : group.type === 'pre' ? (
              <pre key={gi} className="guide-pre" tabIndex={0}>
                {group.text}
              </pre>
            ) : (
              <ul key={gi} className={cn('guide-card-list', group.ordered && 'guide-card-list-ordered')}>
                {group.items.map((item, ii) => (
                  <li key={ii}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            ),
          )}
        </div>
      ))}
    </section>
  )
}

type ItemGroup =
  | { type: 'text'; text: string }
  | { type: 'pre'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }

// Consecutive bullets (or numbers) become one list; text and preformatted lines stay as they are.
function groupItems(section: BannerSection): ItemGroup[] {
  const groups: ItemGroup[] = []
  for (const item of section.items) {
    if (item.kind === 'bullet' || item.kind === 'number') {
      const ordered = item.kind === 'number'
      const last = groups[groups.length - 1]
      if (last?.type === 'list' && last.ordered === ordered) last.items.push(item.text)
      else groups.push({ type: 'list', ordered, items: [item.text] })
    } else {
      groups.push(item.kind === 'pre' ? { type: 'pre', text: item.text } : { type: 'text', text: item.text })
    }
  }
  return groups
}


// One code block's own buttons. "Run this part" shows what that part printed in the captured run of the
// whole lesson, instantly. "Edit and run" opens a real editor under the block and runs Python in the browser.
function PartRun({
  output,
  first,
  last,
  open,
  onToggle,
  scenario,
  onScenario,
  live,
}: {
  /** The captured run, when this part printed or drew something in it. */
  output?: CapturedOutput
  first: number
  last: number
  open: boolean
  onToggle: () => void
  scenario: number
  onScenario: (index: number) => void
  live?: { open: boolean; onToggle: () => void; sessionKey: string; filename: string; code: string; earlier: string[] }
}) {
  const text = output ? outputForLines(output, first, last, scenario) : undefined
  const figures = output ? figuresForLines(output, first, last) : []
  const [zoomed, setZoomed] = useState<string | null>(null)
  const scenarios = output?.scenarios ?? []
  const barButton = (active: boolean) =>
    cn(
      'flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] transition-colors',
      active
        ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
        : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
    )
  return (
    <>
      <div className="guide-part-bar">
        <div className="flex flex-wrap items-center gap-2">
          {output && (
            <button type="button" onClick={onToggle} aria-expanded={open} className={barButton(open)}>
              <Play className="h-3 w-3" aria-hidden /> {open ? 'Hide output' : 'Run this part'}
            </button>
          )}
          {live && (
            <button type="button" onClick={live.onToggle} aria-expanded={live.open} className={barButton(live.open)}>
              <Pencil className="h-3 w-3" aria-hidden /> {live.open ? 'Close editor' : 'Edit and run'}
            </button>
          )}
        </div>
        {output && open && scenarios.length > 1 && (
          <label className="flex items-center gap-2 text-xs text-[var(--color-code-ink-faint)]">
            Typed input
            <select
              value={scenario}
              onChange={(event) => onScenario(Number(event.target.value))}
              className="min-h-6 max-w-[16rem] cursor-pointer rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-1.5 text-[13px] text-[var(--color-code-ink)]"
            >
              {scenarios.map((s, index) => (
                <option key={s.label} value={index}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {output && open && (
        <div className="guide-part-out" role="region" aria-label="Output of this part">
          {text && <pre tabIndex={0}>{text}</pre>}
          {figures.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setZoomed(withBase(src))}
              aria-label="Enlarge the figure drawn by this part"
              className="guide-part-figure"
            >
              <img src={withBase(src)} alt="Figure drawn by this part of the lesson" />
            </button>
          ))}
          {!text && figures.length === 0 && (
            <p className="guide-part-none">This part prints nothing for the input you picked.</p>
          )}
        </div>
      )}
      {zoomed && <ImageLightbox src={zoomed} onClose={() => setZoomed(null)} />}
      {live?.open && (
        <Suspense fallback={<p className="guide-part-none">Opening the editor...</p>}>
          <LiveRunner
            sessionKey={live.sessionKey}
            filename={live.filename}
            initialCode={live.code}
            firstLine={first}
            priorCode={live.earlier}
          />
        </Suspense>
      )}
    </>
  )
}

export function GuidedLesson({ leading, blocks, code, filename, topics, output, focusLine, live, colabUrl }: GuidedLessonProps) {
  const [siteTheme] = useTheme()
  const [chunks, setChunks] = useState<Record<number, string>>({})
  const [showOutput, setShowOutput] = useState(false)
  const [openParts, setOpenParts] = useState<Set<number>>(() => new Set())
  const [openEditors, setOpenEditors] = useState<Set<number>>(() => new Set())
  const [scenario, setScenario] = useState(0)

  const togglePart = (line: number) =>
    setOpenParts((current) => {
      const next = new Set(current)
      if (!next.delete(line)) next.add(line)
      return next
    })
  const toggleEditor = (line: number) =>
    setOpenEditors((current) => {
      const next = new Set(current)
      if (!next.delete(line)) next.add(line)
      return next
    })

  const codeBlocks = useMemo(
    () => blocks.filter((b): b is Extract<LessonBlock, { type: 'code' }> => b.type === 'code'),
    [blocks],
  )

  // Which glossary words each block of explanation may underline: the first block to use a word gets it.
  const termsByBlock = useMemo(() => {
    const seen = new Set<string>()
    const byBlock = new Map<number, Set<string>>()
    for (const block of blocks) {
      if (block.type !== 'prose') continue
      const fresh = termsIn(proseText(block.nodes)).filter((id) => !seen.has(id))
      fresh.forEach((id) => seen.add(id))
      if (fresh.length) byBlock.set(block.line, new Set(fresh))
    }
    return byBlock
  }, [blocks])

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const next: Record<number, string> = {}
      for (const block of codeBlocks) {
        next[block.line] = highlighter.codeToHtml(block.code, {
          lang: 'python',
          theme: SHIKI_THEME_BY_SITE_THEME[siteTheme],
          transformers: [chunkTransformer(block.line)],
        })
      }
      setChunks(next)
    })
    return () => {
      cancelled = true
    }
  }, [codeBlocks, siteTheme])

  // Jump to a line from a search result / link. Prose has no per-line elements, so
  // fall back to the nearest earlier line that exists.
  const ready = Object.keys(chunks).length > 0
  useEffect(() => {
    if (!ready || !focusLine) return
    for (let n = focusLine; n >= 1; n--) {
      const el = document.getElementById(`L${n}`)
      if (!el) continue
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('line-flash')
      const timer = window.setTimeout(() => el.classList.remove('line-flash'), 1800)
      return () => window.clearTimeout(timer)
    }
  }, [ready, focusLine])

  const body: ReactNode[] = blocks.map((block) => {
    switch (block.type) {
      case 'banner':
        return (
          <div key={`b${block.line}`} id={`L${block.line}`}>
            <Banner kind={block.kind} sections={block.sections} />
          </div>
        )
      case 'topic':
        return (
          <h2 key={`t${block.line}`} id={`L${block.line}`} className="guide-topic">
            {block.eyebrow && <span className="guide-topic-num">{block.eyebrow.replace(/^Topic\s+/, '')}</span>}
            {block.title}
          </h2>
        )
      case 'prose':
        return (
          <div key={`p${block.line}`} id={`L${block.line}`} className="scroll-mt-24">
            <TermsContext.Provider value={termsByBlock.get(block.line) ?? NO_TERMS}>
              <Prose nodes={block.nodes} />
            </TermsContext.Provider>
          </div>
        )
      case 'code': {
        const last = block.line + block.code.replace(/\s+$/, '').split('\n').length - 1
        const hasCaptured = Boolean(output && partHasOutput(output, block.line, last))
        const earlier = codeBlocks.filter((b) => b.line < block.line).map((b) => b.code)
        return (
          <div
            key={`c${block.line}`}
            className="guide-code code-font"
            style={{ ['--line-start' as string]: block.line - 1 }}
          >
            {/* While the editor is open it holds this same code, so the plain copy steps aside. */}
            <div className={cn(live && openEditors.has(block.line) && 'hidden')}>
              {chunks[block.line] ? (
                <div className="overflow-x-auto py-2.5" tabIndex={0} role="group" aria-label="Code, scrollable" dangerouslySetInnerHTML={{ __html: chunks[block.line] }} />
              ) : (
                <pre className="overflow-x-auto px-4 py-2.5 font-mono text-[var(--color-code-ink-dim)]" tabIndex={0}>{block.code}</pre>
              )}
            </div>
            {(hasCaptured || live) && (
              <PartRun
                output={hasCaptured ? output : undefined}
                first={block.line}
                last={last}
                open={openParts.has(block.line)}
                onToggle={() => togglePart(block.line)}
                scenario={scenario}
                onScenario={setScenario}
                live={
                  live
                    ? {
                        open: openEditors.has(block.line),
                        onToggle: () => toggleEditor(block.line),
                        sessionKey: `lesson:${live.id}`,
                        filename: live.path,
                        code: block.code.replace(/\s+$/, ''),
                        earlier,
                      }
                    : undefined
                }
              />
            )}
          </div>
        )
      }
    }
  })

  return (
    <div className="guide">
      <div className="guide-toolbar" data-code-actions>
        {leading ?? <span className="font-mono text-xs text-[var(--color-code-ink-faint)]">{filename}</span>}
        <div className="flex flex-wrap items-center gap-2">
          {output && (
            <button
              onClick={() => setShowOutput((v) => !v)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-[13px] transition-colors',
                showOutput
                  ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
                  : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
              )}
            >
              <Play className="h-3.5 w-3.5" /> Run<span className="hidden sm:inline"> whole lesson</span>
            </button>
          )}
          {colabUrl && (
            <a
              href={colabUrl}
              target="_blank"
              rel="noreferrer"
              title="PyTorch cannot run in the browser, so this opens the lesson as a notebook in Google Colab (free, with a GPU)"
              className="flex items-center gap-1.5 rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-2.5 py-1 text-[13px] text-[var(--color-code-ink-dim)] transition-colors hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open in Colab
            </a>
          )}
          <span className="hidden sm:contents">
            <FontSizeControl />
          </span>
          <CopyButton text={code} />
          <span className="hidden sm:contents">
            <CaptureDialogButton code={code} filename={filename} topics={topics} output={output} />
          </span>
        </div>
      </div>

      <div className="guide-body">{body}</div>

      <AnimatePresence initial={false}>
        {showOutput && output && (
          <motion.div
            key="output"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="guide-output"
          >
            <OutputPanel output={output} filename={filename} onClose={() => setShowOutput(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
