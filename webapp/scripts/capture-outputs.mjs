#!/usr/bin/env node
// Runs every lesson .py file once and caches its stdout/stderr so the site can
// show "real" output without executing anything in the browser. Re-run this
// whenever files are added or edited: `npm run capture-outputs`.
import { spawnSync } from 'node:child_process'
import {
  readFileSync,
  writeFileSync,
  mkdtempSync,
  rmSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
} from 'node:fs'
import { join, dirname, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..')
const contentDirs = ['NumPy_Basics', 'Pandas_Basics', 'Classical_ML', 'python tutorial']
const outputPath = join(__dirname, '..', 'src', 'lib', 'output-cache.json')

function walk(dir) {
  let results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) results = results.concat(walk(full))
    else if (entry.isFile() && extname(entry.name) === '.py') results.push(full)
  }
  return results
}

function findPython() {
  for (const cmd of ['python', 'python3']) {
    const res = spawnSync(cmd, ['--version'])
    if (!res.error) return cmd
  }
  throw new Error('No Python interpreter found on PATH (tried "python" and "python3").')
}

const pythonCmd = findPython()
console.log(`Using interpreter: ${pythonCmd}\n`)

// Files that call input() can't be run headlessly with arbitrary text, so instead
// of a single run we replay a few realistic, hand-picked input sequences and cache
// each one's real captured stdout — the site then shows these as pickable examples.
const INTERACTIVE_SCENARIOS = {
  'python tutorial/Section 4/4.1_if_statements.py': [
    { label: 'Negative number', inputs: ['-5'] },
    { label: 'Zero', inputs: ['0'] },
    { label: 'One', inputs: ['1'] },
    { label: 'Bigger number', inputs: ['7'] },
  ],
  'python tutorial/Section 4/4.7_match_statements.py': [
    { label: 'Bad request · origin point', inputs: ['400', '0', '0'] },
    { label: 'Not found · Y-axis point', inputs: ['404', '0', '5'] },
    { label: "I'm a teapot · diagonal point", inputs: ['418', '2', '2'] },
    { label: 'Unknown status · X-axis point', inputs: ['999', '3', '0'] },
  ],
  'python tutorial/Section 4/4.9_More_on_Defining_Functions/4.9.1_default_argument_values.py': [
    { label: 'Answer "yes"', inputs: ['yes'] },
    { label: 'Answer "no"', inputs: ['no'] },
  ],
  'python tutorial/Section 8/8.3_handling_exceptions.py': [
    { label: 'Valid number right away', inputs: ['42'] },
    { label: 'Invalid, then valid', inputs: ['abc', '42'] },
  ],
}

// Isolated scratch cwd so side effects (e.g. a lesson writing "dummy.txt") never
// touch the real repo. Pandas_Basics lessons load a CSV via a repo-root-relative
// path, so mirror just that one file into the scratch dir.
const scratchDir = mkdtempSync(join(os.tmpdir(), 'mlfg-capture-'))
mkdirSync(join(scratchDir, 'Pandas_Basics'), { recursive: true })
copyFileSync(join(repoRoot, 'Pandas_Basics', 'mock_data.csv'), join(scratchDir, 'Pandas_Basics', 'mock_data.csv'))

const cache = {}
const counts = { ok: 0, empty: 0, error: 0, interactive: 0, timeout: 0 }

for (const dir of contentDirs) {
  const files = walk(join(repoRoot, dir))
  for (const file of files) {
    const relPath = relative(repoRoot, file).split('\\').join('/')
    const source = readFileSync(file, 'utf8')
    const capturedAt = new Date().toISOString()

    if (/\binput\s*\(/.test(source)) {
      const scenarioDefs = INTERACTIVE_SCENARIOS[relPath] ?? []
      const scenarios = scenarioDefs.map((scenario) => {
        const result = spawnSync(pythonCmd, [file], {
          cwd: scratchDir,
          encoding: 'utf8',
          timeout: 15000,
          input: scenario.inputs.join('\n') + '\n',
          env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
        })
        return {
          label: scenario.label,
          inputs: scenario.inputs,
          stdout: (result.stdout ?? '').replace(/\r\n/g, '\n'),
        }
      })
      cache[relPath] = {
        status: 'interactive',
        stdout: '',
        stderr: '',
        durationMs: 0,
        capturedAt,
        scenarios,
      }
      counts.interactive++
      console.log(`interactive  ${relPath} (${scenarios.length} scenario${scenarios.length === 1 ? '' : 's'})`)
      continue
    }

    const start = Date.now()
    const result = spawnSync(pythonCmd, [file], {
      cwd: scratchDir,
      encoding: 'utf8',
      timeout: 15000,
      input: '',
      // Windows defaults piped stdout to the system codepage (e.g. cp1252), which
      // breaks on non-ASCII text (names, emoji, etc.) that prints fine in a real terminal.
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    })
    const durationMs = Date.now() - start
    const timedOut = Boolean(result.signal) || result.error?.code === 'ETIMEDOUT'
    const normalize = (s) => (s ?? '').replace(/\r\n/g, '\n')
    result.stdout = normalize(result.stdout)
    result.stderr = normalize(result.stderr)

    if (timedOut) {
      cache[relPath] = {
        status: 'timeout',
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        durationMs,
        capturedAt,
      }
      counts.timeout++
      console.log(`TIMEOUT      ${relPath}`)
    } else if (result.error || result.status !== 0) {
      cache[relPath] = {
        status: 'error',
        stdout: result.stdout ?? '',
        stderr: (result.stderr ?? '') || String(result.error ?? ''),
        durationMs,
        capturedAt,
      }
      counts.error++
      console.log(`ERROR        ${relPath}`)
    } else if (!result.stdout || !result.stdout.trim()) {
      cache[relPath] = { status: 'empty', stdout: '', stderr: result.stderr ?? '', durationMs, capturedAt }
      counts.empty++
      console.log(`empty        ${relPath}`)
    } else {
      cache[relPath] = { status: 'ok', stdout: result.stdout, stderr: result.stderr ?? '', durationMs, capturedAt }
      counts.ok++
      console.log(`ok           ${relPath}  (${durationMs}ms)`)
    }
  }
}

rmSync(scratchDir, { recursive: true, force: true })
writeFileSync(outputPath, JSON.stringify(cache, null, 2) + '\n')

console.log(
  `\nCaptured ${counts.ok} ok, ${counts.empty} empty, ${counts.error} error, ${counts.interactive} interactive, ${counts.timeout} timeout -> ${relative(repoRoot, outputPath)}`,
)
