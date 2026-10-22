import { snippets } from '@/lib/content'
import { navGroups, trailOrder } from '@/lib/roadmap'
import { CATEGORY_INFO } from '@/lib/categoryInfo'
import type { Snippet } from '@/types'

// A compact map of the whole guide for the assistant: each track, what it covers, and its
// lesson titles. With it the assistant can point someone to a real lesson instead of guessing,
// and the reply renderer can turn those exact titles into links.

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/^["'“”`*]+|["'“”`*.:,;!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

// A title shared by two lessons maps to nothing: a link has to go to one place.
const byTitle = new Map<string, Snippet | null>()
for (const snippet of snippets) {
  const key = normalize(snippet.title)
  byTitle.set(key, byTitle.has(key) ? null : snippet)
}

/** The lesson with exactly this title, if there is exactly one. */
export function lessonByTitle(text: string): Snippet | undefined {
  const key = normalize(text)
  return key.length < 4 ? undefined : (byTitle.get(key) ?? undefined)
}

let cached: string | undefined
export function siteMap(): string {
  if (cached) return cached
  const lines = navGroups
    .flatMap((group) => group.categories)
    .map((category) => {
      const titles = trailOrder.filter((s) => s.categorySlug === category.slug && !s.filename.endsWith('.csv')).map((s) => s.title)
      const blurb = CATEGORY_INFO[category.slug]
      return `- ${category.label}${blurb ? `: ${blurb}` : ''}${titles.length ? ` Lessons: ${titles.join('; ')}.` : ''}`
    })
  cached = `The guide's tracks, in the order they are meant to be followed, with every lesson title (when you point someone to a lesson, use its exact title from here):\n${lines.join('\n')}`
  return cached
}
