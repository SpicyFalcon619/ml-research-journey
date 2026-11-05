import Fuse from 'fuse.js'
import type { Snippet, Topic } from '@/types'
import { snippets } from '@/lib/content'
import { navGroups, trailOrder } from '@/lib/roadmap'
import { parseLesson } from '@/lib/lesson'

// Search over everything a lesson says: its title, its sections, the plain-words explanations,
// the exercises and the code itself. Every word you type has to turn up somewhere in the same
// lesson or section, so "dictionary keyerror" finds the part about missing keys, not every page
// that mentions either word.

export interface FileHit {
  type: 'file'
  snippet: Snippet
  score: number
  /** A sentence or line from the lesson that shows why it matched. */
  excerpt?: string
  excerptIsCode?: boolean
}

export interface TopicHit {
  type: 'topic'
  snippet: Snippet
  topic: Topic
  /** The section's heading without its "Topic 3:" prefix. */
  heading: string
  score: number
  excerpt?: string
  excerptIsCode?: boolean
}

export type SearchHit = FileHit | TopicHit

// ---------------------------------------------------------------------------------------------
// Words
// ---------------------------------------------------------------------------------------------

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with', 'is', 'are', 'it', 'its', 'do', 'does', 'how', 'what',
  'why', 'when', 'i', 'me', 'my', 'you', 'can', 'use', 'using', 'make', 'get', 'from', 'into', 'by', 'about', 'vs',
])

// What people type versus what the lessons say. Each side also matches the other.
const SYNONYMS: Record<string, string[]> = {
  dict: ['dictionary', 'dictionaries'],
  dicts: ['dictionary', 'dictionaries'],
  hashmap: ['dictionary'],
  list: ['lists'],
  array: ['arrays', 'ndarray'],
  ndarray: ['array', 'arrays'],
  df: ['dataframe', 'dataframes'],
  dataframe: ['table', 'tables', 'df'],
  table: ['dataframe'],
  np: ['numpy'],
  pd: ['pandas'],
  nan: ['missing', 'null'],
  null: ['none', 'missing', 'nan'],
  none: ['null'],
  missing: ['nan', 'dropna', 'fillna', 'null'],
  loop: ['loops', 'for', 'while', 'iterate', 'iteration'],
  loops: ['loop', 'for', 'while'],
  iterate: ['loop', 'for'],
  func: ['function', 'functions'],
  def: ['function', 'functions'],
  args: ['arguments', 'argument'],
  kwargs: ['keyword', 'arguments'],
  param: ['parameter', 'parameters'],
  class: ['classes', 'object', 'oop'],
  oop: ['class', 'classes', 'object'],
  error: ['exception', 'exceptions', 'try', 'except'],
  errors: ['exception', 'exceptions'],
  exception: ['error', 'errors', 'try', 'except'],
  crash: ['error', 'exception'],
  rand: ['random'],
  seed: ['random', 'reproducible'],
  average: ['mean'],
  avg: ['mean', 'average'],
  mean: ['average'],
  std: ['standard', 'deviation'],
  sort: ['sorted', 'order'],
  filter: ['mask', 'masking', 'condition'],
  mask: ['filter', 'boolean'],
  index: ['indexing', 'slice', 'slicing'],
  slice: ['slicing', 'indexing'],
  string: ['strings', 'text', 'str'],
  str: ['string', 'strings', 'text'],
  text: ['string', 'strings'],
  int: ['integer', 'integers', 'number', 'numbers'],
  float: ['decimal', 'decimals', 'number'],
  bool: ['boolean', 'true', 'false'],
  import: ['module', 'modules'],
  module: ['import', 'modules'],
  regression: ['linear', 'logistic'],
  tree: ['decision', 'trees'],
  split: ['train', 'test'],
  tensor: ['tensors', 'pytorch', 'torch'],
  torch: ['pytorch', 'tensor'],
  sklearn: ['scikit', 'learn'],
  csv: ['read_csv', 'file', 'load'],
  file: ['open', 'files'],
  groupby: ['group', 'aggregate'],
  lambda: ['anonymous'],
  comprehension: ['comprehensions'],
  fstring: ['f-string', 'format'],
  format: ['f-string', 'fstring'],
  print: ['output'],
  input: ['user'],
  copy: ['alias', 'view'],
  reshape: ['shape', 'flatten'],
  shape: ['reshape', 'dimensions'],
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9_.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** Splits into words. "np.array" and "f-string" also yield their pieces so either half can match. */
function wordsOf(text: string): string[] {
  const out: string[] = []
  for (const raw of normalize(text).split(' ')) {
    if (!raw) continue
    const piece = raw.replace(/^[.-]+|[.-]+$/g, '')
    if (!piece) continue
    out.push(piece)
    if (/[.-]/.test(piece)) for (const part of piece.split(/[.-]/)) if (part) out.push(part)
  }
  return out
}

/** A crude stem so "dictionaries" finds "dictionary" and "loops" finds "loop". */
function stems(word: string): string[] {
  const list = [word]
  if (word.endsWith('ies') && word.length > 4) list.push(word.slice(0, -3) + 'y')
  if (word.endsWith('es') && word.length > 4) list.push(word.slice(0, -2))
  if (word.endsWith('s') && word.length > 3) list.push(word.slice(0, -1))
  if (word.endsWith('ing') && word.length > 5) list.push(word.slice(0, -3))
  if (word.endsWith('y') && word.length > 3) list.push(word.slice(0, -1) + 'ies')
  return list
}

function levenshteinWithin1(a: string, b: string): boolean {
  if (a === b) return true
  const la = a.length
  const lb = b.length
  if (Math.abs(la - lb) > 1) return false
  let i = 0
  while (i < la && i < lb && a[i] === b[i]) i++
  if (la === lb) return a.slice(i + 1) === b.slice(i + 1) || (a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2))
  return la > lb ? a.slice(i + 1) === b.slice(i) : b.slice(i + 1) === a.slice(i)
}

// ---------------------------------------------------------------------------------------------
// The index
// ---------------------------------------------------------------------------------------------

interface Field {
  /** The whole field, normalised, for substring and phrase checks. */
  text: string
  words: string[]
  wordSet: Set<string>
}

const makeField = (text: string): Field => {
  const words = wordsOf(text)
  return { text: normalize(text), words, wordSet: new Set(words) }
}

interface Doc {
  kind: 'lesson' | 'section'
  snippet: Snippet
  topic?: Topic
  heading: string
  /** Original-case sentences of the section's explanation, for excerpts. */
  sentences: string[]
  codeLines: string[]
  fields: { title: Field; heading: Field; tags: Field; track: Field; bullets: Field; prose: Field; code: Field }
}

const WEIGHTS = { title: 10, heading: 9, tags: 5, track: 2.5, bullets: 4.5, prose: 2.6, code: 3.6 } as const
type FieldName = keyof typeof WEIGHTS

const EMPTY = makeField('')
const cleanHeading = (label: string) => label.replace(/^Topic\s*\d*\s*:?\s*/i, '').trim()

function splitSentences(text: string): string[] {
  return text
    .split(/\n|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
}

function buildDocs(): Doc[] {
  const docs: Doc[] = []
  for (const snippet of snippets) {
    const isData = snippet.filename.endsWith('.csv')
    const blocks = isData ? [] : parseLesson(snippet.code)

    let bullets: string[] = []
    const lessonProse: string[] = []
    const lessonCode: string[] = []
    const sections: { topic: Topic; heading: string; prose: string[]; code: string[] }[] = []
    let current: (typeof sections)[number] | null = null

    for (const block of blocks) {
      if (block.type === 'banner') {
        const items = block.sections.flatMap((s) => s.items).map((i) => i.text)
        if (block.kind === 'learn') bullets = items
        else lessonProse.push(...items)
      } else if (block.type === 'topic') {
        const topic = snippet.topics.find((t) => t.line === block.line)
        current = { topic: topic ?? { label: block.title, line: block.line }, heading: cleanHeading(block.title), prose: [], code: [] }
        sections.push(current)
      } else if (block.type === 'prose') {
        const text = block.nodes
          .map((n) => (n.type === 'list' ? n.items.join('\n') : n.type === 'p' ? n.text : n.text))
          .join('\n')
        ;(current ? current.prose : lessonProse).push(text)
      } else if (block.type === 'code') {
        ;(current ? current.code : lessonCode).push(block.code)
      }
    }

    // Lessons that are not written in the guided format keep their old-style `### Topic ###` markers.
    if (sections.length === 0) {
      for (const topic of snippet.topics) sections.push({ topic, heading: cleanHeading(topic.label), prose: [], code: [] })
    }

    const concept = snippet.tags.filter((t) => !/^topic\b/.test(t))
    const lessonSentences = splitSentences(lessonProse.join('\n'))
    const lessonCodeLines = lessonCode.join('\n').split('\n').filter((l) => l.trim())
    docs.push({
      kind: 'lesson',
      snippet,
      heading: snippet.title,
      sentences: [...bullets, ...lessonSentences],
      codeLines: lessonCodeLines,
      fields: {
        title: makeField(snippet.title),
        heading: EMPTY,
        tags: makeField(concept.join(' ')),
        track: makeField([snippet.categoryLabel, ...snippet.subSegments].join(' ')),
        bullets: makeField(bullets.join(' ')),
        prose: makeField(lessonProse.join(' ')),
        code: makeField(lessonCode.join(' ')),
      },
    })

    for (const section of sections) {
      const prose = section.prose.join('\n')
      docs.push({
        kind: 'section',
        snippet,
        topic: section.topic,
        heading: section.heading,
        sentences: splitSentences(prose),
        codeLines: section.code.join('\n').split('\n').filter((l) => l.trim()),
        fields: {
          title: makeField(snippet.title),
          heading: makeField(section.heading),
          tags: EMPTY,
          track: EMPTY,
          bullets: EMPTY,
          prose: makeField(prose),
          code: makeField(section.code.join(' ')),
        },
      })
    }
  }
  return docs
}

let docsCache: Doc[] | undefined
const getDocs = () => (docsCache ??= buildDocs())

/** Builds the index ahead of time (it takes a few milliseconds), e.g. when the search box opens. */
export function warmSearchIndex() {
  getDocs()
}

const trailPosition = new Map(trailOrder.map((s, i) => [s.id, i]))

// ---------------------------------------------------------------------------------------------
// Matching and ranking
// ---------------------------------------------------------------------------------------------

/** How well one word matches one field: 1 exact word, 0.8 starts-with, 0.55 inside a word, 0.4 one typo away. */
function matchWord(field: Field, word: string): number {
  if (!field.words.length) return 0
  if (field.wordSet.has(word)) return 1
  let best = 0
  for (const w of field.words) {
    if (w.startsWith(word) && word.length >= 2) return 0.8
    if (best < 0.55 && word.length >= 3 && w.includes(word)) best = 0.55
  }
  if (best) return best
  if (word.length >= 5) for (const w of field.words) if (w.length >= 5 && levenshteinWithin1(w, word)) return 0.4
  return 0
}

interface QueryToken {
  /** The word itself, then its stems (full credit) and its synonyms (a little less). */
  variants: { word: string; factor: number }[]
}

function parseQuery(query: string): { tokens: QueryToken[]; phrase: string } {
  const phrase = normalize(query)
  let words = wordsOf(query)
  const meaningful = words.filter((w) => !STOP_WORDS.has(w))
  if (meaningful.length) words = meaningful
  const unique = [...new Set(words)]
  const tokens = unique.map((word) => {
    const variants: QueryToken['variants'] = stems(word).map((w) => ({ word: w, factor: 1 }))
    for (const syn of SYNONYMS[word] ?? []) for (const w of stems(syn)) variants.push({ word: w, factor: 0.85 })
    return { variants }
  })
  return { tokens, phrase }
}

function scoreToken(doc: Doc, token: QueryToken): { score: number; field: FieldName | null } {
  let best = 0
  let bestField: FieldName | null = null
  for (const name of Object.keys(WEIGHTS) as FieldName[]) {
    const field = doc.fields[name]
    if (!field.words.length) continue
    for (const { word, factor } of token.variants) {
      const m = matchWord(field, word) * factor * WEIGHTS[name]
      if (m > best) {
        best = m
        bestField = name
      }
    }
  }
  return { score: best, field: bestField }
}

function scoreDoc(doc: Doc, tokens: QueryToken[], phrase: string, relaxed: boolean): { score: number; fields: FieldName[] } | null {
  let total = 0
  let matched = 0
  const fields: FieldName[] = []
  for (const token of tokens) {
    const r = scoreToken(doc, token)
    if (r.score > 0) {
      total += r.score
      matched++
      if (r.field) fields.push(r.field)
    } else if (!relaxed) {
      return null
    }
  }
  if (matched === 0) return null
  if (relaxed && matched < Math.ceil(tokens.length / 2)) return null
  if (relaxed) total *= matched / tokens.length

  // Reward the words appearing together, in order, where it matters most.
  if (phrase.length >= 3) {
    if (doc.fields.title.text === phrase) total += 25
    else if (doc.fields.title.text.startsWith(phrase)) total += 12
    else if (doc.fields.title.text.includes(phrase)) total += 9
    if (doc.fields.heading.text === phrase) total += 22
    else if (doc.fields.heading.text.includes(phrase)) total += 10
    if (doc.fields.tags.text.includes(phrase)) total += 5
    if (doc.fields.bullets.text.includes(phrase)) total += 6
    if (doc.fields.prose.text.includes(phrase)) total += 5
    if (doc.fields.code.text.includes(phrase)) total += 4
  }
  // The beginner-friendly tie-break: earlier on the path wins when everything else is equal.
  total += (80 - (trailPosition.get(doc.snippet.id) ?? 80)) * 0.01
  // A section whose own heading matched is usually what the person wanted over a mere mention.
  if (doc.kind === 'section' && fields.includes('heading')) total += 2
  return { score: total, fields }
}

/** The sentence (or code line) that best shows why this matched, with the matched word kept in view. */
function excerptFor(doc: Doc, tokens: QueryToken[], fields: FieldName[]): { text: string; code: boolean } | undefined {
  const words = tokens.flatMap((t) => t.variants.map((v) => v.word))
  const hasWord = (line: string) => {
    const lower = line.toLowerCase()
    return words.filter((w) => lower.includes(w)).length
  }
  const wantsCode = fields.includes('code') && !fields.includes('prose') && !fields.includes('bullets')
  const pool = wantsCode ? doc.codeLines : doc.sentences
  let best: string | undefined
  let bestScore = 0
  for (const line of pool) {
    const s = hasWord(line)
    if (s > bestScore) {
      bestScore = s
      best = line
    }
  }
  if (!best) return undefined
  const trimmed = best.replace(/^#+\s*/, '').trim()
  if (trimmed.length <= 150) return { text: trimmed, code: wantsCode }
  // Long line: keep a window around the first match.
  const lower = trimmed.toLowerCase()
  const at = Math.max(0, Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0)))
  const start = Math.max(0, at - 50)
  return { text: `${start > 0 ? '…' : ''}${trimmed.slice(start, start + 150).trim()}…`, code: wantsCode }
}

/**
 * Ranked results. A lesson that matches comes back as one row; the specific sections inside
 * lessons that match come back as rows that jump straight to that section.
 */
export function search(query: string, limit = 20, categorySlug?: string): SearchHit[] {
  if (!query.trim()) return []
  const { tokens, phrase } = parseQuery(query)
  if (tokens.length === 0) return []

  const run = (relaxed: boolean) => {
    const scored: { doc: Doc; score: number; fields: FieldName[] }[] = []
    for (const doc of getDocs()) {
      if (categorySlug && doc.snippet.categorySlug !== categorySlug) continue
      const r = scoreDoc(doc, tokens, phrase, relaxed)
      if (r) scored.push({ doc, ...r })
    }
    return scored
  }

  let scored = run(false)
  if (scored.length < 3 && tokens.length > 1) {
    // Fewer than three exact answers: also show lessons that match most of the words.
    const seen = new Set(scored.map((s) => s.doc))
    scored = scored.concat(run(true).filter((s) => !seen.has(s.doc)))
  }
  scored.sort((a, b) => b.score - a.score)

  const perLesson = new Map<string, number>()
  const hits: SearchHit[] = []
  for (const { doc, score, fields } of scored) {
    const used = perLesson.get(doc.snippet.id) ?? 0
    if (doc.kind === 'section' && used >= 3) continue
    perLesson.set(doc.snippet.id, used + 1)
    const excerpt = excerptFor(doc, tokens, fields)
    if (doc.kind === 'lesson') {
      hits.push({ type: 'file', snippet: doc.snippet, score, excerpt: excerpt?.text, excerptIsCode: excerpt?.code })
    } else {
      hits.push({
        type: 'topic',
        snippet: doc.snippet,
        topic: doc.topic!,
        heading: doc.heading,
        score,
        excerpt: excerpt?.text,
        excerptIsCode: excerpt?.code,
      })
    }
    if (hits.length >= limit) break
  }
  return hits
}

/** Words to highlight in results: what was typed plus its stems, never the synonyms. */
export function highlightWords(query: string): string[] {
  return [...new Set(wordsOf(query).filter((w) => w.length >= 2 && !STOP_WORDS.has(w)).flatMap(stems))]
}

// ---------------------------------------------------------------------------------------------
// When nothing matches
// ---------------------------------------------------------------------------------------------

let didYouMeanFuse: Fuse<{ snippet: Snippet; text: string }> | undefined
/** The lessons whose title or sections are closest to what was typed, for a "did you mean" row. */
export function suggest(query: string, limit = 4): Snippet[] {
  didYouMeanFuse ??= new Fuse(
    snippets.filter((s) => !s.filename.endsWith('.csv')).map((snippet) => ({ snippet, text: `${snippet.title} ${snippet.topics.map((t) => cleanHeading(t.label)).join(' ')}` })),
    { keys: ['text'], threshold: 0.55, ignoreLocation: true },
  )
  return didYouMeanFuse.search(query.trim()).slice(0, limit).map((r) => r.item.snippet)
}

/** Searches worth trying, shown when the box is empty. Each one is checked to return results. */
export const popularSearches = ['list comprehension', 'dictionary', 'KeyError', 'f-string', 'groupby', 'broadcasting', 'random seed', 'train test split']

// ---------------------------------------------------------------------------------------------

export interface SearchCategory {
  slug: string
  label: string
}

/** The tracks a search can be narrowed to, in the order the sidebar lists them. */
export const searchCategories: SearchCategory[] = navGroups.flatMap((group) =>
  group.categories.map((category) => ({ slug: category.slug, label: category.label })),
)
