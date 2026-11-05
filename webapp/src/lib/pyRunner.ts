// The page's handle on the Python worker. One worker is shared by every editor on the site; it
// starts the first time someone presses Run (never for people who are just reading), and runs
// one program at a time.
import { useSyncExternalStore } from 'react'
import { snippets } from '@/lib/content'
import type { FromWorker, PyStream, ToWorker } from '@/lib/pyProtocol'

export type PyPhase = 'idle' | 'loading' | 'ready' | 'running'
export interface PyStatus {
  phase: PyPhase
  message: string
}

export interface RunOptions {
  /** Variable space: one per lesson, so its parts share variables like cells in a notebook. */
  key: string
  code: string
  /** The lesson's repo path, or a made-up name like "playground.py". */
  filename: string
  inputs?: string[]
  silent?: boolean
  onOutput?: (stream: PyStream, text: string) => void
}

export interface RunResult {
  ok: boolean
  /** Figures as data: URLs, in the order they were drawn. */
  images: string[]
  ms: number
}

/** Thrown to a waiting run when the learner presses Stop. */
export class RunStopped extends Error {
  constructor() {
    super('Stopped')
    this.name = 'RunStopped'
  }
}

interface Pending {
  options: RunOptions
  resolve(result: RunResult): void
  reject(error: Error): void
}

// Lesson data files (the CSVs), so code like pd.read_csv("Pandas_Basics/mock_data.csv") finds them.
function dataFiles(): Record<string, string> {
  const files: Record<string, string> = {}
  for (const snippet of snippets) if (snippet.filename.endsWith('.csv')) files[snippet.path] = snippet.code
  return files
}

class PyRunner {
  private worker: Worker | null = null
  private ready: Promise<void> | null = null
  private pending = new Map<number, Pending>()
  private nextId = 1
  private queue: Promise<unknown> = Promise.resolve()
  private status: PyStatus = { phase: 'idle', message: '' }
  private listeners = new Set<() => void>()

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => void this.listeners.delete(listener)
  }
  getStatus = () => this.status

  private setStatus(phase: PyPhase, message = '') {
    this.status = { phase, message }
    this.listeners.forEach((listener) => listener())
  }

  private start(): Promise<void> {
    if (this.ready) return this.ready
    this.setStatus('loading', 'Loading Python…')
    const worker = new Worker(new URL('../workers/pyodide.worker.ts', import.meta.url), { type: 'module' })
    this.worker = worker
    this.ready = new Promise<void>((resolve, reject) => {
      const fail = (message: string) => {
        this.failAll(new Error(message))
        this.discardWorker()
        reject(new Error(message))
      }
      worker.onmessage = (event: MessageEvent<FromWorker>) => {
        const message = event.data
        switch (message.type) {
          case 'status':
            this.setStatus(this.status.phase === 'running' ? 'running' : 'loading', message.message)
            break
          case 'ready':
            this.setStatus('ready')
            resolve()
            break
          case 'out':
            this.pending.get(message.id)?.options.onOutput?.(message.stream, message.text)
            break
          case 'done': {
            const pending = this.pending.get(message.id)
            this.pending.delete(message.id)
            this.setStatus('ready')
            pending?.resolve({ ok: message.ok, images: message.images.map((png) => `data:image/png;base64,${png}`), ms: message.ms })
            break
          }
          case 'fatal':
            fail(message.message)
            break
        }
      }
      worker.onerror = () => fail('Python could not start. Check your internet connection and try again.')
      worker.postMessage({ type: 'init', files: dataFiles() } satisfies ToWorker)
    })
    // A failed start must not stay cached, or "try again" would never retry.
    this.ready.catch(() => undefined)
    return this.ready
  }

  private failAll(error: Error) {
    for (const pending of this.pending.values()) pending.reject(error)
    this.pending.clear()
  }

  private discardWorker() {
    this.worker?.terminate()
    this.worker = null
    this.ready = null
    this.setStatus('idle')
  }

  run(options: RunOptions): Promise<RunResult> {
    const task = this.queue.then(async () => {
      await this.start()
      const worker = this.worker
      if (!worker) throw new Error('Python is not running.')
      const id = this.nextId++
      this.setStatus('running', 'Running…')
      return new Promise<RunResult>((resolve, reject) => {
        this.pending.set(id, { options, resolve, reject })
        worker.postMessage({
          type: 'run',
          id,
          key: options.key,
          code: options.code,
          filename: options.filename,
          inputs: options.inputs ?? [],
          silent: options.silent ?? false,
        } satisfies ToWorker)
      })
    })
    // The next run waits for this one to finish, however it ends.
    this.queue = task.catch(() => undefined)
    return task
  }

  /** Forget the variables of one lesson (or the playground). */
  reset(key: string) {
    this.worker?.postMessage({ type: 'reset', key } satisfies ToWorker)
  }

  /** Ends whatever is running, even a program stuck in a loop. Python restarts on the next Run, with a clean slate. */
  stop() {
    this.failAll(new RunStopped())
    this.discardWorker()
  }
}

export const pyRunner = new PyRunner()

export function usePyStatus(): PyStatus {
  return useSyncExternalStore(pyRunner.subscribe, pyRunner.getStatus)
}
