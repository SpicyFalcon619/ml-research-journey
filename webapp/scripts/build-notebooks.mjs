#!/usr/bin/env node
// Turns every lesson that cannot run in the browser (anything that imports PyTorch) into a Jupyter
// notebook, so the site's "Open in Colab" button has something to open. Colab reads notebooks straight
// from GitHub, so the output goes to webapp/public/notebooks/ and is committed with the lessons.
// Re-run after editing one of those lessons: `npm run build-notebooks`.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..')
const outRoot = join(__dirname, '..', 'public', 'notebooks')
const SITE = 'https://spicyfalcon619.github.io/ml-research-journey/'

rmSync(outRoot, { recursive: true, force: true })

const EXCLUDED = new Set(['webapp', 'Test'])
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.isFile() && extname(entry.name) === '.py' ? [full] : []
  })

const BANNER = /^#\s*={10,}\s*$/
const TOPIC = /^#{2,}\s*(.+?)\s*#{2,}$/

// Same split as the Guided view: column-0 comments are the explanation, everything else is code.
function toCells(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const cells = []
  let docTitle = ''
  let i = 0

  // The title docstring at the top.
  if (lines[0]?.startsWith('"""')) {
    const end = lines.findIndex((l, n) => n > 0 && l.includes('"""'))
    docTitle = lines.slice(1, end).join(' ').trim() || lines[0].replace(/"""/g, '').trim()
    i = end + 1
  }

  let code = []
  let prose = []
  const flushCode = () => {
    while (code.length && !code[0].trim()) code.shift()
    while (code.length && !code[code.length - 1].trim()) code.pop()
    if (code.length) cells.push({ type: 'code', text: code.join('\n') })
    code = []
  }
  const flushProse = () => {
    if (prose.length) cells.push({ type: 'markdown', text: prose.join('\n').trim() })
    prose = []
  }

  while (i < lines.length) {
    const line = lines[i]
    if (BANNER.test(line)) {
      // A fenced card: WHAT YOU WILL LEARN or YOUR TURN.
      const body = []
      i++
      while (i < lines.length && !BANNER.test(lines[i])) body.push(lines[i++].replace(/^#\s?/, ''))
      i++
      flushCode()
      flushProse()
      const [first, ...rest] = body
      const heading = (first ?? '').trim().replace(/\s{2,}.*/, '')
      const title = heading === heading.toUpperCase() ? heading.charAt(0) + heading.slice(1).toLowerCase() : heading
      const text = rest.map((l) => l.replace(/^\s{1,3}(-|\d+\.)\s/, '$1 ')).join('\n').trim()
      cells.push({ type: 'markdown', text: `## ${title}\n\n${text}` })
      continue
    }
    const topic = line.match(TOPIC)
    if (topic) {
      flushCode()
      flushProse()
      cells.push({ type: 'markdown', text: `## ${topic[1].replace(/^Topic\s+\d+:\s*/, '')}` })
      i++
      continue
    }
    if (/^#( |$)/.test(line) && !/^#\s{3,}/.test(line) && line.trim() !== '#') {
      // Column-0 comment: explanation. A blank "#" line ends a paragraph.
      flushCode()
      prose.push(line.replace(/^#\s?/, ''))
      i++
      continue
    }
    if (line.trim() === '#' && prose.length) {
      prose.push('')
      i++
      continue
    }
    if (/^#\s{3,}/.test(line) && prose.length) {
      // An indented comment right after prose is a diagram or list: keep it with the prose.
      prose.push('    ' + line.replace(/^#\s?/, ''))
      i++
      continue
    }
    flushProse()
    code.push(line)
    i++
  }
  flushCode()
  flushProse()
  return { docTitle, cells }
}

function notebookFor(relPath, source) {
  const { docTitle, cells } = toCells(source)
  const lessonUrl = SITE
  const header = [
    `# ${docTitle || relPath}`,
    '',
    `This notebook is generated from a lesson in the [Field Guide](${lessonUrl}). The code is the same as the lesson. Run the cells in order with Shift+Enter.`,
    '',
    'PyTorch and a GPU are already available in Colab (Runtime, then Change runtime type, then pick a GPU if you want one).',
  ].join('\n')
  const all = [{ type: 'markdown', text: header }, ...cells]
  return {
    cells: all.map((cell, index) => {
      const lines = cell.text.split('\n')
      const id = createHash('sha1').update(`${relPath}:${index}`).digest('hex').slice(0, 8)
      const body = lines.map((l, n) => (n < lines.length - 1 ? `${l}\n` : l))
      return cell.type === 'code'
        ? { cell_type: 'code', execution_count: null, id, metadata: {}, outputs: [], source: body }
        : { cell_type: 'markdown', id, metadata: {}, source: body }
    }),
    metadata: {
      colab: { provenance: [] },
      kernelspec: { display_name: 'Python 3', language: 'python', name: 'python3' },
      language_info: { name: 'python' },
    },
    nbformat: 4,
    nbformat_minor: 5,
  }
}

let count = 0
for (const entry of readdirSync(repoRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name.startsWith('.') || EXCLUDED.has(entry.name)) continue
  for (const file of walk(join(repoRoot, entry.name))) {
    const source = readFileSync(file, 'utf8')
    if (!/^\s*(import torch|from torch)/m.test(source)) continue
    const relPath = relative(repoRoot, file).split('\\').join('/')
    const target = join(outRoot, relPath.replace(/\.py$/, '.ipynb'))
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, JSON.stringify(notebookFor(relPath, source), null, 1) + '\n')
    console.log(`notebook  ${relPath}`)
    count++
  }
}
console.log(`\nWrote ${count} notebooks to ${relative(repoRoot, outRoot)}`)
