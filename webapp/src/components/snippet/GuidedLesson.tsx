import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ShikiTransformer } from 'shiki'
import { AnimatePresence, motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import type { BannerSection, LessonBlock, ProseNode } from '@/lib/lesson'
import type { CapturedOutput } from '@/lib/outputs'
import type { Topic } from '@/types'
import { useTheme } from '@/hooks/useTheme'
import { CopyButton } from '@/components/code/CopyButton'
import { FontSizeControl } from '@/components/code/FontSizeControl'
import { CaptureDialogButton } from '@/components/code/CaptureDialog'
import { OutputPanel } from '@/components/code/OutputPanel'
import { cn } from '@/lib/cn'

interface GuidedLessonProps {
  blocks: LessonBlock[]
  code: string
  filename: string
  topics: Topic[]
  output?: CapturedOutput
  focusLine?: number
}

// Words in prose that are really code: `backticked`, name(...) calls, __dunders__.
const INLINE_CODE = /(`[^`]+`|(?<!\w)\.?[A-Za-z_][\w.]*\((?:[^()]|\([^()]*\))*\)|__\w+__)/g

function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(INLINE_CODE).map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="guide-inline-code">
            {part.startsWith('`') ? part.slice(1, -1) : part}
          </code>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
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
              <pre key={index} className="guide-pre">
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
              <aside key={index} className="guide-callout">
                <span className="guide-callout-label">{node.callout}</span>
                <p className={node.breaks ? 'guide-breaks' : undefined}>
                  <Inline text={node.text} />
                </p>
              </aside>
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
              <pre key={gi} className="guide-pre">
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

function chunkTransformer(firstLine: number): ShikiTransformer {
  return {
    line(node, line) {
      // Real file line numbers, so a search hit or a "line" link lands on the right spot.
      node.properties.id = `L${firstLine + line - 1}`
      this.addClassToHast(node, 'code-line')
    },
  }
}

export function GuidedLesson({ blocks, code, filename, topics, output, focusLine }: GuidedLessonProps) {
  const [siteTheme] = useTheme()
  const [chunks, setChunks] = useState<Record<number, string>>({})
  const [showOutput, setShowOutput] = useState(false)

  const codeBlocks = useMemo(
    () => blocks.filter((b): b is Extract<LessonBlock, { type: 'code' }> => b.type === 'code'),
    [blocks],
  )

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
            {block.eyebrow && <span className="guide-topic-eyebrow">{block.eyebrow}</span>}
            {block.title}
          </h2>
        )
      case 'prose':
        return (
          <div key={`p${block.line}`} id={`L${block.line}`} className="scroll-mt-24">
            <Prose nodes={block.nodes} />
          </div>
        )
      case 'code':
        return (
          <div
            key={`c${block.line}`}
            className="guide-code code-font"
            style={{ ['--line-start' as string]: block.line - 1 }}
          >
            {chunks[block.line] ? (
              <div className="overflow-x-auto py-2.5" dangerouslySetInnerHTML={{ __html: chunks[block.line] }} />
            ) : (
              <pre className="overflow-x-auto px-4 py-2.5 font-mono text-[var(--color-code-ink-dim)]">{block.code}</pre>
            )}
          </div>
        )
    }
  })

  return (
    <div className="guide">
      <div className="guide-toolbar" data-code-actions>
        <span className="font-mono text-xs text-[var(--color-code-ink-faint)]">{filename}</span>
        <div className="flex flex-wrap items-center gap-2">
          {output && (
            <button
              onClick={() => setShowOutput((v) => !v)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors',
                showOutput
                  ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
                  : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
              )}
            >
              <Play className="h-3.5 w-3.5" /> Run whole lesson
            </button>
          )}
          <FontSizeControl />
          <CopyButton text={code} />
          <CaptureDialogButton code={code} filename={filename} topics={topics} output={output} />
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
