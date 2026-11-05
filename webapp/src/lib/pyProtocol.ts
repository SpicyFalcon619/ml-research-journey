// Messages between the page and the Python worker (src/workers/pyodide.worker.ts).

export type PyStream = 'out' | 'err'

export type ToWorker =
  | { type: 'init'; files: Record<string, string> }
  | {
      type: 'run'
      id: number
      /** Which variable space to run in. One per lesson, one for the playground. */
      key: string
      code: string
      /** The lesson file's repo path, so `__file__` and relative file paths behave as they do on disk. */
      filename: string
      /** One entry per input() call the program makes. */
      inputs: string[]
      /** Run without showing printed output or figures (used for "run the earlier parts first"). */
      silent: boolean
    }
  | { type: 'reset'; key: string }

export type FromWorker =
  | { type: 'status'; message: string }
  | { type: 'ready' }
  | { type: 'out'; id: number; stream: PyStream; text: string }
  | { type: 'done'; id: number; ok: boolean; images: string[]; ms: number }
  | { type: 'fatal'; message: string }
