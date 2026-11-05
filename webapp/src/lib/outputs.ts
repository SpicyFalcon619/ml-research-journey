import rawCache from './output-cache.json'

export type OutputStatus = 'ok' | 'empty' | 'error' | 'interactive' | 'timeout'

/** What was printed, tagged with the lesson line that printed it: [line, text]. */
export type OutputSegment = [number, string]

export interface InteractiveScenario {
  label: string
  inputs: string[]
  stdout: string
  segments?: OutputSegment[]
}

export interface CapturedOutput {
  status: OutputStatus
  stdout: string
  stderr: string
  durationMs: number
  capturedAt: string
  scenarios?: InteractiveScenario[]
  images?: string[]
  segments?: OutputSegment[]
  /** Each figure with the lesson line that drew it: [line, url]. */
  figures?: [number, string][]
}

const outputCache = rawCache as unknown as Record<string, CapturedOutput>

/**
 * The output of ONE part of a lesson: whatever was printed by lines first..last.
 * Returns undefined when the part printed nothing (or the lesson has no per-line record).
 */
export function outputForLines(
  output: CapturedOutput | undefined,
  first: number,
  last: number,
  scenario = 0,
): string | undefined {
  const segments = output?.scenarios?.length ? output.scenarios[scenario]?.segments : output?.segments
  if (!segments) return undefined
  const text = segments
    .filter(([line]) => line >= first && line <= last)
    .map(([, chunk]) => chunk)
    .join('')
  return text.trim() ? text.replace(/\s+$/, '') : undefined
}

/** The figures drawn by lines first..last, in the order they were drawn. */
export function figuresForLines(output: CapturedOutput | undefined, first: number, last: number): string[] {
  return (output?.figures ?? []).filter(([line]) => line >= first && line <= last).map(([, url]) => url)
}

/** Does any scenario (or the single run) print or draw something for these lines? */
export function partHasOutput(output: CapturedOutput | undefined, first: number, last: number): boolean {
  if (!output) return false
  if (figuresForLines(output, first, last).length) return true
  const runs = output.scenarios?.length ? output.scenarios.length : 1
  for (let i = 0; i < runs; i++) if (outputForLines(output, first, last, i)) return true
  return false
}


export function getOutput(path: string): CapturedOutput | undefined {
  return outputCache[path]
}
