// Where the "keep reading" / "start here" tag goes on the journey map.
//
// The tag hangs in the strip just above the stop you should read next. That strip is shared:
// the row above hangs its line names ("NUMPY BASICS / Numpy speed test") into the same space.
// So the tag may sit anywhere along the strip, as long as it misses every name, and a thin
// connector joins it to its stop. On a narrow screen it shortens itself, first to just the verb,
// then to a small marker plate, so a clear spot always exists and no name ever has to be hidden.

export interface LabelBox {
  id: string
  left: number
  right: number
  top: number
  bottom: number
}

export interface TagPlacement {
  x: number
  /** 'full' = "KEEP READING: Lesson title", 'short' = "KEEP READING", 'mark' = a small plate with an arrow. */
  variant: 'full' | 'short' | 'mark'
  /** Names that could not be kept clear of the tag, so they are faded out while it is up. */
  hidden: string[]
}

/** The tag box sits from 44px to 22px above the stop's centre. */
export const TAG_TOP_OFFSET = 44
export const TAG_HEIGHT = 22

const PAD = 8
const STEP = 4

export function placeTag({
  stopX,
  stopY,
  fullWidth,
  shortWidth,
  markWidth,
  labels,
  layoutWidth,
  edge,
}: {
  stopX: number
  stopY: number
  fullWidth: number
  shortWidth: number
  markWidth: number
  labels: LabelBox[]
  layoutWidth: number
  /** Keep the tag this far from the left and right edges, where the line turns between rows. */
  edge: number
}): TagPlacement {
  const top = stopY - TAG_TOP_OFFSET - 4
  const bottom = stopY - TAG_TOP_OFFSET + TAG_HEIGHT + 4
  const hits = (x: number, width: number) =>
    labels.filter((l) => l.top < bottom && l.bottom > top && l.left < x + width + PAD && l.right > x - PAD)

  const widths = { full: fullWidth, short: shortWidth, mark: markWidth }
  for (const variant of ['full', 'short', 'mark'] as const) {
    const width = widths[variant]
    for (const margin of [edge, PAD]) {
      const min = margin
      const max = layoutWidth - width - margin
      if (max < min) continue
      const ideal = Math.min(Math.max(stopX - width / 2, min), max)
      const options: number[] = []
      for (let x = min; x <= max; x += STEP) options.push(x)
      options.push(ideal)
      options.sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal))
      const clear = options.find((x) => hits(x, width).length === 0)
      if (clear !== undefined) return { x: clear, variant, hidden: [] }
    }
  }

  // Not even the marker fits (an extremely narrow screen): it goes over its stop, and the names it covers fade out.
  const x = Math.min(Math.max(stopX - markWidth / 2, PAD), Math.max(layoutWidth - markWidth - PAD, PAD))
  return { x, variant: 'mark', hidden: hits(x, markWidth).map((l) => l.id) }
}
