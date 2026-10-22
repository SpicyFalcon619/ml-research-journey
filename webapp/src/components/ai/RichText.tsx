import { createContext, Fragment, useContext, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import { lessonByTitle } from '@/lib/siteIndex'
import { cn } from '@/lib/cn'

// Called when a lesson link in a reply is followed, so a full-screen panel on a phone can get out of the way.
const NavigateContext = createContext<() => void>(() => {})

// Renders a model's reply. It understands only what replies actually use (paragraphs, lists,
// headings, tables, `code`, **bold** and fenced code blocks) and draws everything as React
// text nodes, never as HTML, so nothing a model writes can inject markup into the page.

function Inline({ text }: { text: string }) {
  const onNavigate = useContext(NavigateContext)
  const parts = text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="rounded bg-[var(--color-surface-hover)] px-1 py-0.5 font-mono text-[0.85em] text-[var(--color-ink)]">
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
          // A bold phrase that is exactly one lesson's title links to that lesson.
          const lesson = lessonByTitle(part.slice(2, -2))
          if (lesson) {
            return (
              <Link
                key={i}
                to={`/s/${lesson.id}`}
                onClick={onNavigate}
                title={`Open the lesson: ${lesson.title}`}
                className="font-semibold text-[var(--color-ink)] underline decoration-[var(--color-accent)] underline-offset-4 hover:text-[var(--color-accent-soft)]"
              >
                {lesson.title}
              </Link>
            )
          }
          return (
            <strong key={i} className="font-semibold text-[var(--color-ink)]">
              {part.slice(2, -2)}
            </strong>
          )
        }
        return <Fragment key={i}>{part}</Fragment>
      })}
    </>
  )
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="group relative my-2">
      <pre className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-xs leading-relaxed text-[var(--color-ink)]">
        <code>{code}</code>
      </pre>
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(code).then(() => {
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1400)
          })
        }}
        aria-label="Copy code"
        className="absolute top-1.5 right-1.5 flex cursor-pointer items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-1.5 py-0.5 text-[11px] text-[var(--color-ink-faint)] opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--color-ink)] focus-visible:opacity-100 max-sm:opacity-100"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

const LIST_ITEM = /^\s*(?:[-*]|\d+[.)])\s+(.*)$/
const ORDERED = /^\s*\d+[.)]\s+/
const HEADING = /^#{1,4}\s+(.*)$/
const TABLE_ROW = /^\s*\|.*\|\s*$/
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/

function cells(row: string): string[] {
  return row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
}

function Prose({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i++
    } else if (HEADING.test(line)) {
      blocks.push(
        <p key={key++} className="mt-3 mb-1 font-semibold text-[var(--color-ink)]">
          <Inline text={line.match(HEADING)![1]} />
        </p>,
      )
      i++
    } else if (TABLE_ROW.test(line)) {
      const rows: string[][] = []
      while (i < lines.length && TABLE_ROW.test(lines[i])) {
        if (!TABLE_RULE.test(lines[i])) rows.push(cells(lines[i]))
        i++
      }
      const [head, ...body] = rows
      blocks.push(
        <div key={key++} className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr>
                {head.map((c, n) => (
                  <th key={n} className="border-b border-[var(--color-border-strong)] px-2 py-1 font-semibold text-[var(--color-ink)]">
                    <Inline text={c} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((r, n) => (
                <tr key={n}>
                  {r.map((c, m) => (
                    <td key={m} className="border-b border-[var(--color-border)] px-2 py-1 align-top">
                      <Inline text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
    } else if (LIST_ITEM.test(line)) {
      const ordered = ORDERED.test(line)
      const items: string[] = []
      while (i < lines.length && LIST_ITEM.test(lines[i])) {
        items.push(lines[i].match(LIST_ITEM)![1])
        i++
      }
      const Tag = ordered ? 'ol' : 'ul'
      blocks.push(
        <Tag key={key++} className={cn('my-2 space-y-1 pl-5', ordered ? 'list-decimal' : 'list-disc')}>
          {items.map((item, n) => (
            <li key={n}>
              <Inline text={item} />
            </li>
          ))}
        </Tag>,
      )
    } else {
      const para: string[] = []
      while (i < lines.length && lines[i].trim() !== '' && !HEADING.test(lines[i]) && !LIST_ITEM.test(lines[i]) && !TABLE_ROW.test(lines[i])) {
        para.push(lines[i])
        i++
      }
      blocks.push(
        <p key={key++} className="my-2 first:mt-0">
          <Inline text={para.join(' ')} />
        </p>,
      )
    }
  }
  return <>{blocks}</>
}

export function RichText({ text, className, onNavigate }: { text: string; className?: string; onNavigate?: () => void }) {
  // Fences split the reply into text (even parts) and code (odd parts). A fence that is
  // still open while the reply streams in is drawn as code until it closes.
  const parts = text.split('```')
  return (
    <NavigateContext.Provider value={onNavigate ?? (() => {})}>
      <div className={cn('text-sm leading-relaxed text-[var(--color-ink-dim)]', className)}>
        {parts.map((part, index) =>
          index % 2 === 1 ? <CodeBlock key={index} code={part.replace(/^[\w+#.-]*\n/, '').replace(/\n$/, '')} /> : <Prose key={index} text={part} />,
        )}
      </div>
    </NavigateContext.Provider>
  )
}
