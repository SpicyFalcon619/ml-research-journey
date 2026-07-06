import type { Snippet, Topic } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  'python tutorial': 'Python Tutorial',
  NumPy_Basics: 'NumPy Basics',
  Pandas_Basics: 'Pandas Basics',
  Classical_ML: 'Classical ML',
  Deep_Learning_PyTorch: 'PyTorch',
}

// Keyword -> extra search tags. Matched against raw source text.
const API_KEYWORD_TAGS: [RegExp, string][] = [
  [/\.dropna\(/, 'dropna'],
  [/\.fillna\(/, 'fillna'],
  [/\.groupby\(/, 'groupby aggregation'],
  [/\.describe\(/, 'describe'],
  [/\.info\(/, 'info'],
  [/\.head\(/, 'head'],
  [/\.loc\[/, 'loc'],
  [/\.iloc\[/, 'iloc'],
  [/\.merge\(/, 'merge join'],
  [/\.concat\(|pd\.concat\(/, 'concat'],
  [/\.sort_values\(/, 'sort_values'],
  [/\.value_counts\(/, 'value_counts'],
  [/read_csv\(/, 'read_csv'],
  [/\.isnull\(|\.isna\(/, 'isnull missing data'],
  [/\.apply\(/, 'apply'],
  [/\.reshape\(/, 'reshape'],
  [/np\.arange\(/, 'arange'],
  [/np\.linspace\(/, 'linspace'],
  [/np\.vstack\(|np\.hstack\(/, 'stacking'],
  [/\.argsort\(/, 'argsort'],
  [/np\.where\(/, 'where'],
  [/LinearRegression/, 'linear regression sklearn'],
  [/LogisticRegression/, 'logistic regression classification sklearn'],
  [/train_test_split/, 'train test split'],
  [/StandardScaler/, 'standard scaler normalization'],
  [/np\.random/, 'random numbers'],
  [/lambda /, 'lambda expressions'],
  [/\btry:/, 'try except error handling'],
  [/\bmatch .+:/, 'match statement'],
  [/\bdef \w+\(/, 'functions'],
  [/\bclass \w+/, 'classes'],
  [/\[.+ for .+ in .+\]/, 'list comprehension'],
]

function titleCase(words: string): string {
  return words
    .split(' ')
    .filter(Boolean)
    .map((w) => (w.length <= 3 && w === w.toLowerCase() ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ')
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function prettifySegment(segment: string): string {
  // Strip a leading numeric prefix like "4.9_" or "1_" or "4.9.6_"
  const withoutPrefix = segment.replace(/^[\d]+(\.\d+)*_/, '')
  return titleCase(withoutPrefix.replace(/[_.]/g, ' ').trim())
}

function parseDocstringTitle(code: string): string | null {
  const match = code.match(/^\s*"""([\s\S]*?)"""/)
  if (!match) return null
  const body = match[1].trim().replace(/\s+/g, ' ')
  if (!body) return null
  const colonIndex = body.indexOf(':')
  if (colonIndex !== -1) {
    const afterColon = body.slice(colonIndex + 1).trim()
    if (afterColon) return afterColon[0].toUpperCase() + afterColon.slice(1)
  }
  return body
}

function parseTopics(code: string): Topic[] {
  const lines = code.split('\n')
  const topics: Topic[] = []
  const topicPattern = /^#{2,}\s*(.+?)\s*#{2,}$/
  lines.forEach((line, index) => {
    const match = line.trim().match(topicPattern)
    if (match) {
      topics.push({ label: match[1].trim(), line: index + 1 })
    }
  })
  return topics
}

export function extractOrderKey(name: string): number[] {
  const match = name.match(/^(\d+(?:\.\d+)*)/)
  if (!match) return []
  return match[1].split('.').map(Number)
}

export function compareOrderKey(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}

// Globs every top-level folder in the repo (except this app and the Test/
// scratch folder), so a brand-new Basecamp folder shows up the moment it
// exists — no allowlist here to remember to update each time.
const rawModules = import.meta.glob(
  ['../../../**/*.{py,csv}', '!../../../webapp/**', '!../../../Test/**'],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>

function buildSnippets(): Snippet[] {
  const snippets: Snippet[] = []

  for (const [modulePath, code] of Object.entries(rawModules)) {
    // modulePath looks like "../../../Classical_ML/1_linear_regression.py"
    const relative = modulePath.replace(/^(\.\.\/)+/, '')
    const segments = relative.split('/')
    const categoryKey = segments[0]
    const filename = segments[segments.length - 1]
    const middleSegments = segments.slice(1, -1) // folders between category root and file

    const categoryLabel = CATEGORY_LABELS[categoryKey] ?? prettifySegment(categoryKey)
    const categorySlug = slugify(categoryKey)
    const subSegments = middleSegments.map(prettifySegment)

    const docTitle = parseDocstringTitle(code)
    const title = docTitle ?? prettifySegment(filename.replace(/\.(py|csv)$/, ''))
    const topics = parseTopics(code)

    const tagSet = new Set<string>()
    tagSet.add(categoryLabel.toLowerCase())
    subSegments.forEach((s) => tagSet.add(s.toLowerCase()))
    prettifySegment(filename.replace(/\.(py|csv)$/, ''))
      .toLowerCase()
      .split(' ')
      .forEach((w) => w.length > 2 && tagSet.add(w))
    topics.forEach((t) => tagSet.add(t.label.toLowerCase()))
    API_KEYWORD_TAGS.forEach(([pattern, tag]) => {
      if (pattern.test(code)) tagSet.add(tag)
    })

    const id = slugify(relative.replace(/\.(py|csv)$/, ''))

    snippets.push({
      id,
      path: relative,
      filename,
      title,
      categoryLabel,
      categorySlug,
      subSegments,
      orderKey: extractOrderKey(filename),
      tags: Array.from(tagSet),
      topics,
      code,
      lineCount: code.split('\n').length,
    })
  }

  return snippets.sort((a, b) => {
    if (a.categorySlug !== b.categorySlug) return a.categorySlug.localeCompare(b.categorySlug)
    const aSub = a.subSegments.join('/')
    const bSub = b.subSegments.join('/')
    if (aSub !== bSub) return aSub.localeCompare(bSub)
    return compareOrderKey(a.orderKey, b.orderKey) || a.title.localeCompare(b.title)
  })
}

export const snippets: Snippet[] = buildSnippets()

export function getSnippetById(id: string): Snippet | undefined {
  return snippets.find((s) => s.id === id)
}
