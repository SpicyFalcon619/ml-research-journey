import type { Snippet } from '@/types'
import { navGroups } from '@/lib/roadmap'
import { allLessons } from '@/lib/progress'

// The guide as a rail map. Every track is a line, every lesson a stop, and the whole
// path is one continuous journey in learning order that snakes across the page.

export interface Track {
  slug: string
  label: string
  index: number
  lessons: Snippet[]
}

export const tracks: Track[] = navGroups
  .flatMap((group) => group.categories)
  .map((category, index) => ({
    slug: category.slug,
    label: category.label,
    index,
    lessons: allLessons.filter((s) => s.categorySlug === category.slug),
  }))

const trackIndexBySlug = new Map(tracks.map((t) => [t.slug, t.index]))

/** Which line a track (by category slug) is. */
export const trackIndexOf = (categorySlug: string) => trackIndexBySlug.get(categorySlug) ?? 0

/** A few words on what each line covers, for the legend. */
export const trackBlurb: Record<string, string> = {
  'python-tutorial': 'Variables, loops, functions, classes',
  'numpy-basics': 'Arrays, indexing, masking',
  'pandas-basics': 'Tables, filtering, grouping',
  'classical-ml': 'Regression, trees, Titanic',
  'deep-learning-pytorch': 'Tensors and the training loop',
}

/** The CSS colour of a track's line. The five lines are derived from each theme's own accent. */
export const lineColor = (trackIndex: number) => `var(--line-${(trackIndex % 5) + 1})`

export interface Stop {
  snippet: Snippet
  trackIndex: number
  /** Position among all lessons, from 0. */
  n: number
  row: number
  x: number
  y: number
  /** The first stop of a line: where you change from the previous one. */
  interchange: boolean
}

export interface Segment {
  d: string
  trackIndex: number
  /** The stop this segment arrives at, so it can be drawn as ridden or still ahead. */
  toN: number
}

export interface Cue {
  x: number
  y: number
  /** 1 = the line runs left to right on this row, -1 = right to left. */
  dir: 1 | -1
  /** The line this arrowhead belongs to, so it can wear that line's colour. */
  trackIndex?: number
}

export interface Layout {
  width: number
  height: number
  rows: number
  stops: Stop[]
  segments: Segment[]
  /** Candidate arrowheads showing which way each line runs, best placement first per line. */
  cues: Cue[]
  /** The two ends of the line, drawn as bumpers. */
  start: Cue
  end: Cue
}

const PAD_X = 30
const PAD_TOP = 58
const ROW_H = 82

/**
 * Lays the stops out in rows that alternate direction, joined at the ends by 45 and 90
 * degree turns only. The number of stops per row follows the width, so a wide screen
 * gets a few long rows and a phone gets more, shorter ones.
 */
export function layoutJourney(width: number): Layout {
  const gapTarget = width < 520 ? 30 : 34
  const usable = Math.max(120, width - PAD_X * 2)
  const perRow = Math.max(4, Math.floor(usable / gapTarget) + 1)
  const gap = usable / (perRow - 1)
  const chamfer = Math.min(18, ROW_H / 4)

  const stops: Stop[] = allLessons.map((snippet, n) => {
    const row = Math.floor(n / perRow)
    const col = n % perRow
    const forward = row % 2 === 0
    const x = PAD_X + (forward ? col : perRow - 1 - col) * gap
    const trackIndex = trackIndexBySlug.get(snippet.categorySlug) ?? 0
    const previous = n > 0 ? trackIndexBySlug.get(allLessons[n - 1].categorySlug) : undefined
    return { snippet, trackIndex, n, row, x, y: PAD_TOP + row * ROW_H, interchange: n > 0 && previous !== trackIndex }
  })

  const segments: Segment[] = []
  for (let n = 1; n < stops.length; n++) {
    const a = stops[n - 1]
    const b = stops[n]
    let d: string
    if (a.row === b.row) {
      d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`
    } else {
      // A hairpin at the end of a row, made of two 45 degree chamfers and one vertical.
      const out = a.x > width / 2 ? chamfer : -chamfer
      d = `M ${a.x} ${a.y} L ${a.x + out} ${a.y + chamfer} L ${a.x + out} ${b.y - chamfer} L ${b.x} ${b.y}`
    }
    segments.push({ d, trackIndex: b.trackIndex, toN: n })
  }

  const rows = stops.length ? stops[stops.length - 1].row + 1 : 0

  // Candidate arrowheads, one per straight stretch of each line (a line that wraps onto the next
  // row is cut into stretches), longest stretch first. The map draws the first candidate of each
  // line that is not under the "start here" tag, so every line ends up with one arrow in its colour.
  const cues: Cue[] = []
  const trackIndexes = [...new Set(stops.map((st) => st.trackIndex))]
  for (const trackIndex of trackIndexes) {
    const stretches: Stop[][] = []
    for (let r = 0; r < rows; r++) {
      const stretch = stops.filter((st) => st.row === r && st.trackIndex === trackIndex)
      if (stretch.length >= 2) stretches.push(stretch)
    }
    stretches.sort((x, y) => y.length - x.length)
    for (const stretch of stretches) {
      const k = Math.max(Math.floor(stretch.length / 2) - 1, 0)
      cues.push({ x: (stretch[k].x + stretch[k + 1].x) / 2, y: stretch[0].y, dir: stretch[0].row % 2 === 0 ? 1 : -1, trackIndex })
    }
  }
  const first = stops[0]
  const last = stops[stops.length - 1]
  const lastDir: 1 | -1 = last && last.row % 2 === 0 ? 1 : -1
  return {
    width,
    height: PAD_TOP + (rows - 1) * ROW_H + 62,
    rows,
    stops,
    segments,
    cues,
    start: { x: first?.x ?? 0, y: first?.y ?? 0, dir: -1 },
    end: { x: last?.x ?? 0, y: last?.y ?? 0, dir: lastDir },
  }
}
