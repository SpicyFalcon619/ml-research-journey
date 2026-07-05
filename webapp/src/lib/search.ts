import Fuse from 'fuse.js'
import type { Snippet } from '@/types'
import { snippets } from '@/lib/content'

export interface SearchHit {
  snippet: Snippet
  topicLine?: number
  topicLabel?: string
}

const fuse = new Fuse(snippets, {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'tags', weight: 0.3 },
    { name: 'topics.label', weight: 0.2 },
    { name: 'categoryLabel', weight: 0.1 },
  ],
})

export function search(query: string, limit = 20): SearchHit[] {
  if (!query.trim()) return []
  return fuse
    .search(query, { limit })
    .map(({ item }) => {
      const q = query.toLowerCase()
      const matchedTopic = item.topics.find((t) => t.label.toLowerCase().includes(q))
      return {
        snippet: item,
        topicLine: matchedTopic?.line,
        topicLabel: matchedTopic?.label,
      }
    })
}
