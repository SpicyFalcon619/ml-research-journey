// The "Bare code" view: the lesson's code with every comment removed (full-line
// comments, trailing comments, the title docstring and the `### Topic ###` lines),
// so only the code is left. Topics are re-pointed at their new line numbers, so the
// outline and jump links keep working.

import type { Topic } from '@/types'
import { skipModuleDocstring } from '@/lib/lesson'

interface Scanned {
  text: string
  /** Set when the line opens a triple-quoted string that continues on the next line. */
  triple: string | null
}

// Cuts a trailing `# comment` off one line, without touching a # inside a string.
function scanLine(line: string): Scanned {
  let i = 0
  let quote: string | null = null
  while (i < line.length) {
    const ch = line[i]
    if (quote) {
      if (ch === '\\') {
        i += 2
        continue
      }
      if (ch === quote) quote = null
      i++
      continue
    }
    if (ch === '#') return { text: line.slice(0, i).trimEnd(), triple: null }
    if (ch === '"' || ch === "'") {
      const triple = ch.repeat(3)
      if (line.startsWith(triple, i)) {
        const end = line.indexOf(triple, i + 3)
        if (end === -1) return { text: line, triple }
        i = end + 3
        continue
      }
      quote = ch
    }
    i++
  }
  return { text: line, triple: null }
}

export function toBareCode(code: string, topics: Topic[]): { code: string; topics: Topic[] } {
  const lines = code.split('\n')
  const topicByLine = new Map(topics.map((t) => [t.line, t]))
  const out: string[] = []
  const bareTopics: Topic[] = []
  let pending: Topic | null = null
  let inTriple: string | null = null

  const pushBlank = () => {
    if (out.length && out[out.length - 1] !== '') out.push('')
  }

  // The title docstring stays: it is the one piece of text a bare lesson keeps.
  const start = skipModuleDocstring(lines)
  out.push(...lines.slice(0, start).filter((l, i) => l.trim() || i > 0))
  pushBlank()

  for (let i = start; i < lines.length; i++) {
    const line = lines[i]

    if (inTriple) {
      const end = line.indexOf(inTriple)
      if (end === -1) {
        out.push(line)
        continue
      }
      const rest = scanLine(line.slice(end + 3))
      out.push(line.slice(0, end + 3) + rest.text)
      inTriple = rest.triple
      continue
    }

    const trimmed = line.trim()
    if (!trimmed) {
      pushBlank()
      continue
    }
    if (trimmed.startsWith('#')) {
      const topic = topicByLine.get(i + 1)
      if (topic) {
        pending = topic
        pushBlank() // a topic marker becomes a plain gap between sections
      }
      continue
    }

    const scanned = scanLine(line)
    if (pending) {
      bareTopics.push({ label: pending.label, line: out.length + 1 })
      pending = null
    }
    out.push(scanned.text)
    inTriple = scanned.triple
  }

  while (out.length && out[out.length - 1] === '') out.pop()
  return { code: out.join('\n'), topics: bareTopics }
}
