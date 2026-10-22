import type { Snippet } from '@/types'
import { snippets } from '@/lib/content'
import { trailOrder } from '@/lib/roadmap'

// Every lesson carrying a tag, in the same order the sidebar lists them, so a tag
// page reads like a slice of the guide rather than an arbitrary list.
const order = new Map(trailOrder.map((snippet, index) => [snippet.id, index]))
const byTag = new Map<string, Snippet[]>()

for (const snippet of snippets) {
  for (const tag of snippet.tags) {
    const list = byTag.get(tag) ?? []
    list.push(snippet)
    byTag.set(tag, list)
  }
}
for (const list of byTag.values()) {
  list.sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity))
}

export function getSnippetsByTag(tag: string): Snippet[] {
  return byTag.get(tag.toLowerCase()) ?? []
}

export interface RelatedTag {
  tag: string
  count: number
}

/** Tags that appear on the same lessons as `tag`, most-shared first. */
export function getRelatedTags(tag: string, limit = 10): RelatedTag[] {
  const counts = new Map<string, number>()
  for (const snippet of getSnippetsByTag(tag)) {
    for (const other of snippet.tags) {
      if (other !== tag.toLowerCase()) counts.set(other, (counts.get(other) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ tag: name, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit)
}

/** Every tag with the number of lessons carrying it, most-used first. */
export function allTagCounts(): RelatedTag[] {
  return [...byTag.entries()]
    .map(([tag, list]) => ({ tag, count: list.length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function tagPath(tag: string): string {
  return `/tag/${encodeURIComponent(tag)}`
}
