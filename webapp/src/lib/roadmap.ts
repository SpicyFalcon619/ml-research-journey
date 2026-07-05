import type { NavGroup, NavItem, Snippet } from '@/types'
import { compareOrderKey, extractOrderKey, slugify, snippets } from '@/lib/content'
import roadmapRaw from '../../../ROADMAP.md?raw'

export interface ChecklistItem {
  label: string
  done: boolean
  children: ChecklistItem[]
}

export interface Basecamp {
  slug: string
  title: string
  tagline?: string
  items: ChecklistItem[]
  doneCount: number
  totalCount: number
}

// Which content categories (by categorySlug from content.ts) live under each basecamp.
const BASECAMP_CATEGORY_MAP: Record<string, string[]> = {
  'basecamp-0': ['python-tutorial', 'numpy-basics', 'pandas-basics'],
  'basecamp-1': ['classical-ml'],
}

function countChecklist(items: ChecklistItem[]): { done: number; total: number } {
  let done = 0
  let total = 0
  for (const item of items) {
    total += 1
    if (item.done) done += 1
    const nested = countChecklist(item.children)
    done += nested.done
    total += nested.total
  }
  return { done, total }
}

function parseBasecamps(markdown: string): Basecamp[] {
  const lines = markdown.split('\n')
  const basecamps: Basecamp[] = []

  let current: { title: string; tagline?: string; bodyLines: string[] } | null = null
  const flush = () => {
    if (!current) return
    const items = parseChecklist(current.bodyLines)
    const { done, total } = countChecklist(items)
    basecamps.push({
      slug: slugify(current.title.split(':')[0]),
      title: current.title,
      tagline: current.tagline,
      items,
      doneCount: done,
      totalCount: total,
    })
    current = null
  }

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(BASECAMP\s+\d+.*)$/)
    if (headingMatch) {
      flush()
      current = { title: headingMatch[1].trim(), bodyLines: [] }
      continue
    }
    if (/^##\s+/.test(line)) {
      // A non-basecamp heading (SUPPLY LINE, THE FORK, etc.) ends the current basecamp.
      flush()
      continue
    }
    if (current) {
      if (!current.tagline) {
        const taglineMatch = line.match(/^\*(.+)\*$/)
        if (taglineMatch) {
          current.tagline = taglineMatch[1].trim()
          continue
        }
      }
      current.bodyLines.push(line)
    }
  }
  flush()

  return basecamps
}

function parseChecklist(lines: string[]): ChecklistItem[] {
  // Two-space-indented markdown checklist, e.g.:
  // - [x] **Title**
  //   - [x] Sub item
  const root: ChecklistItem[] = []
  const stack: { indent: number; item: ChecklistItem }[] = []

  for (const rawLine of lines) {
    const match = rawLine.match(/^(\s*)-\s\[( |x|X)\]\s*(.+)$/)
    if (!match) continue
    const indent = match[1].length
    const done = match[2].toLowerCase() === 'x'
    const label = match[3].replace(/\*\*/g, '').trim()
    const item: ChecklistItem = { label, done, children: [] }

    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop()
    if (stack.length === 0) {
      root.push(item)
    } else {
      stack[stack.length - 1].item.children.push(item)
    }
    stack.push({ indent, item })
  }

  return root
}

export const basecamps: Basecamp[] = parseBasecamps(roadmapRaw)

function buildNavItem(label: string, slug: string, items: Snippet[], depth: number): NavItem {
  const direct: Snippet[] = []
  const groups = new Map<string, Snippet[]>()

  for (const item of items) {
    if (depth >= item.subSegments.length) {
      direct.push(item)
    } else {
      const key = item.subSegments[depth]
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(item)
    }
  }

  const rawSegmentOf = (item: Snippet) => item.path.split('/')[depth + 1] ?? ''

  const children = Array.from(groups.entries()).map(([childLabel, childItems]) =>
    buildNavItem(childLabel, `${slug}-${slugify(childLabel)}`, childItems, depth + 1),
  )

  // Sort children using the raw numeric folder prefix (e.g. "4.9_More_on...") for natural order.
  children.sort((a, b) => {
    const aItems = groups.get(a.label) ?? []
    const bItems = groups.get(b.label) ?? []
    const aOrder = aItems[0] ? extractOrderKey(rawSegmentOf(aItems[0])) : []
    const bOrder = bItems[0] ? extractOrderKey(rawSegmentOf(bItems[0])) : []
    return compareOrderKey(aOrder, bOrder) || a.label.localeCompare(b.label)
  })

  direct.sort((a, b) => compareOrderKey(a.orderKey, b.orderKey) || a.title.localeCompare(b.title))

  return { label, slug, snippets: direct, children }
}

function buildCategoryNav(categorySlug: string): NavItem | null {
  const items = snippets.filter((s) => s.categorySlug === categorySlug)
  if (items.length === 0) return null
  return buildNavItem(items[0].categoryLabel, categorySlug, items, 0)
}

export const navGroups: NavGroup[] = basecamps
  .map((basecamp) => {
    const categorySlugs = BASECAMP_CATEGORY_MAP[basecamp.slug] ?? []
    const categories = categorySlugs
      .map(buildCategoryNav)
      .filter((c): c is NavItem => c !== null)
    return { label: basecamp.title, slug: basecamp.slug, categories }
  })
  .filter((group) => group.categories.length > 0)

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...flattenNavItems(item.children)])
}

export function countSnippets(item: NavItem): number {
  return flattenNavItems([item]).reduce((sum, node) => sum + node.snippets.length, 0)
}
