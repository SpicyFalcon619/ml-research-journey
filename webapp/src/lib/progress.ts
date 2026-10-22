import type { Snippet } from '@/types'
import { navGroups, trailOrder } from '@/lib/roadmap'

// A "lesson" for progress purposes is a code lesson. The CSV data files that sit in the
// tracks are shown in the guide but aren't something you finish, so they don't count.
const isLesson = (snippet: Snippet) => !snippet.filename.endsWith('.csv')

export const allLessons: Snippet[] = trailOrder.filter(isLesson)

export interface TrackProgress {
  slug: string
  label: string
  total: number
  done: number
}

export function trackProgress(done: string[]): TrackProgress[] {
  const doneSet = new Set(done)
  return navGroups
    .flatMap((group) => group.categories)
    .map((category) => {
      const lessons = allLessons.filter((s) => s.categorySlug === category.slug)
      return {
        slug: category.slug,
        label: category.label,
        total: lessons.length,
        done: lessons.filter((s) => doneSet.has(s.id)).length,
      }
    })
}

export function overallProgress(done: string[]) {
  const tracks = trackProgress(done)
  const total = tracks.reduce((sum, t) => sum + t.total, 0)
  const doneCount = tracks.reduce((sum, t) => sum + t.done, 0)
  return { total, done: doneCount, percent: total ? Math.round((doneCount / total) * 100) : 0 }
}

/** The first lesson on the trail that isn't marked done yet: a sensible "what next". */
export function nextUpLesson(done: string[]): Snippet | undefined {
  const doneSet = new Set(done)
  return allLessons.find((s) => !doneSet.has(s.id))
}
