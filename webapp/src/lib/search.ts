import Fuse from 'fuse.js'
import type { Snippet, Topic } from '@/types'
import { snippets } from '@/lib/content'

export interface FileHit {
  type: 'file'
  snippet: Snippet
}

export interface TopicHit {
  type: 'topic'
  snippet: Snippet
  topic: Topic
}

export type SearchHit = FileHit | TopicHit

const fileFuse = new Fuse(snippets, {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 0.45 },
    { name: 'tags', weight: 0.35 },
    { name: 'categoryLabel', weight: 0.2 },
  ],
})

interface TopicEntry {
  snippet: Snippet
  topic: Topic
}

const topicEntries: TopicEntry[] = snippets.flatMap((snippet) =>
  snippet.topics.map((topic) => ({ snippet, topic })),
)

const topicFuse = new Fuse(topicEntries, {
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  keys: [{ name: 'topic.label', weight: 1 }],
})

// File hits always open the snippet at the top (predictable); topic hits are
// shown as visually distinct rows and jump straight to that section.
export function search(query: string, limit = 20): SearchHit[] {
  const trimmed = query.trim()
  if (!trimmed) return []

  const fileResults = fileFuse.search(trimmed).map((r) => ({
    hit: { type: 'file' as const, snippet: r.item },
    score: r.score ?? 1,
  }))
  const topicResults = topicFuse.search(trimmed).map((r) => ({
    hit: { type: 'topic' as const, snippet: r.item.snippet, topic: r.item.topic },
    score: r.score ?? 1,
  }))

  return [...fileResults, ...topicResults]
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((r) => r.hit)
}
