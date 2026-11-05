// Runs real Python (Pyodide, Python compiled to WebAssembly) off the page's main thread, so a
// program stuck in a loop can be stopped by simply ending this worker.
import type { FromWorker, ToWorker } from '@/lib/pyProtocol'

const PYODIDE_VERSION = '314.0.7'
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`
const HOME = '/home/pyodide'

// A run that prints this much is almost certainly a runaway loop. It is stopped, so it cannot flood the page.
const MAX_OUTPUT_CHARS = 200_000

type PyCallable = (...args: unknown[]) => unknown

interface PyProxy {
  set(key: string, value: unknown): void
  toJs(): unknown
  destroy(): void
}

interface Pyodide {
  globals: { get(name: string): unknown }
  runPython(code: string): unknown
  loadPackagesFromImports(
    code: string,
    options?: { messageCallback?: (message: string) => void; errorCallback?: (message: string) => void },
  ): Promise<void>
  setStdout(options: { batched: (line: string) => void }): void
  setStderr(options: { batched: (line: string) => void }): void
  FS: { mkdirTree(path: string): void; writeFile(path: string, data: string): void }
}

const scope = self as unknown as {
  postMessage(message: FromWorker): void
  onmessage: ((event: MessageEvent<ToWorker>) => void) | null
}
const post = (message: FromWorker) => scope.postMessage(message)

// The small amount of Python that lives alongside the learner's code.
const HELPER = `
import base64, builtins, io, os, sys, traceback, warnings

os.environ["MPLBACKEND"] = "AGG"
warnings.filterwarnings("ignore", message=".*non-interactive.*")
warnings.filterwarnings("ignore", message=".*as float was deprecated.*")

_inputs = []

def _set_inputs(lines):
    global _inputs
    _inputs = [str(line) for line in lines]

def _input(prompt=""):
    print(prompt, end="")
    if not _inputs:
        raise EOFError("input() was called but there is no typed input left. Type one line per input() call in the Input box.")
    value = _inputs.pop(0)
    print(value)
    return value

builtins.input = _input

def _run(code, namespace, filename):
    ok = True
    try:
        exec(compile(code, filename, "exec"), namespace)
    except SystemExit:
        pass
    except BaseException as error:
        ok = False
        trace = error.__traceback__.tb_next if error.__traceback__ else None
        print("".join(traceback.format_exception(type(error), error, trace)), file=sys.stderr, end="")
    finally:
        sys.stdout.flush()
        sys.stderr.flush()
    return ok

def _figures():
    if "matplotlib.pyplot" not in sys.modules:
        return []
    import matplotlib.pyplot as plt
    images = []
    for number in plt.get_fignums():
        buffer = io.BytesIO()
        plt.figure(number).savefig(buffer, format="png", dpi=110, bbox_inches="tight")
        images.append(base64.b64encode(buffer.getvalue()).decode())
    plt.close("all")
    return images
`

let pyodide: Pyodide | null = null
let runInputs: PyCallable
let runCode: PyCallable
let collectFigures: PyCallable
let newDict: PyCallable
const namespaces = new Map<string, PyProxy>()

// Printed text goes to whichever run is going right now.
let current = { id: 0, silent: false, chars: 0, tripped: false }

function send(stream: 'out' | 'err', text: string) {
  if (current.silent && stream === 'out') return
  if (current.tripped) {
    // After the limit, only error text (the short traceback) still gets through.
    if (stream === 'err') post({ type: 'out', id: current.id, stream, text })
    return
  }
  current.chars += text.length
  if (current.chars > MAX_OUTPUT_CHARS) {
    current.tripped = true
    post({ type: 'out', id: current.id, stream: 'err', text: `\n[Stopped: the program printed more than ${MAX_OUTPUT_CHARS.toLocaleString()} characters.]\n` })
    // Raising here surfaces inside the learner's print() call and ends their program.
    throw new Error('Output limit reached')
  }
  post({ type: 'out', id: current.id, stream, text })
}

async function init(files: Record<string, string>) {
  post({ type: 'status', message: 'Loading Python (about 10 MB, only the first time)…' })
  const loader = (await import(/* @vite-ignore */ `${INDEX_URL}pyodide.mjs`)) as {
    loadPyodide(options: { indexURL: string }): Promise<Pyodide>
  }
  pyodide = await loader.loadPyodide({ indexURL: INDEX_URL })
  pyodide.setStdout({ batched: (line) => send('out', `${line}\n`) })
  pyodide.setStderr({ batched: (line) => send('err', `${line}\n`) })

  for (const [path, text] of Object.entries(files)) {
    const full = `${HOME}/${path}`
    pyodide.FS.mkdirTree(full.slice(0, full.lastIndexOf('/')))
    pyodide.FS.writeFile(full, text)
  }

  pyodide.runPython(HELPER)
  runInputs = pyodide.globals.get('_set_inputs') as PyCallable
  runCode = pyodide.globals.get('_run') as PyCallable
  collectFigures = pyodide.globals.get('_figures') as PyCallable
  newDict = pyodide.globals.get('dict') as PyCallable
  post({ type: 'ready' })
}

function namespaceFor(key: string, filename: string): PyProxy {
  let space = namespaces.get(key)
  if (!space) {
    space = newDict() as PyProxy
    space.set('__name__', '__main__')
    space.set('__file__', `${HOME}/${filename}`)
    namespaces.set(key, space)
  }
  return space
}

async function run(message: Extract<ToWorker, { type: 'run' }>) {
  if (!pyodide) throw new Error('Python has not started yet.')
  const started = performance.now()
  current = { id: message.id, silent: message.silent, chars: 0, tripped: false }

  await pyodide.loadPackagesFromImports(message.code, {
    messageCallback: (text) => post({ type: 'status', message: text }),
    errorCallback: (text) => post({ type: 'out', id: message.id, stream: 'err', text: `${text}\n` }),
  })
  post({ type: 'status', message: 'Running…' })

  runInputs(message.inputs)
  const ok = Boolean(runCode(message.code, namespaceFor(message.key, message.filename), message.filename.split('/').pop() ?? 'lesson.py'))
  const figures = collectFigures() as PyProxy
  const images = message.silent ? [] : (figures.toJs() as string[])
  figures.destroy()
  post({ type: 'done', id: message.id, ok, images, ms: Math.round(performance.now() - started) })
}

scope.onmessage = async (event) => {
  const message = event.data
  try {
    if (message.type === 'init') await init(message.files)
    else if (message.type === 'run') await run(message)
    else if (message.type === 'reset') {
      namespaces.get(message.key)?.destroy()
      namespaces.delete(message.key)
    }
  } catch (error) {
    // If Python itself could not be fetched, say so plainly rather than showing a browser error.
    const text =
      message.type === 'init'
        ? 'Python could not be loaded. Check your internet connection and try again.'
        : error instanceof Error
          ? error.message
          : String(error)
    post({ type: 'fatal', message: text })
  }
}
