import rawCache from './output-cache.json'

export type OutputStatus = 'ok' | 'empty' | 'error' | 'interactive' | 'timeout'

export interface InteractiveScenario {
  label: string
  inputs: string[]
  stdout: string
}

export interface CapturedOutput {
  status: OutputStatus
  stdout: string
  stderr: string
  durationMs: number
  capturedAt: string
  scenarios?: InteractiveScenario[]
  images?: string[]
}

const outputCache = rawCache as Record<string, CapturedOutput>

export function getOutput(path: string): CapturedOutput | undefined {
  return outputCache[path]
}
