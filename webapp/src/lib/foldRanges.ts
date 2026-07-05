export interface FoldRange {
  /** 1-indexed line of the compound-statement header, e.g. "def foo():" */
  start: number
  /** 1-indexed line of the last line inside that indented block */
  end: number
}

function indentWidth(line: string): number {
  const match = line.match(/^[ \t]*/)
  if (!match) return 0
  return match[0].replace(/\t/g, '    ').length
}

/**
 * Indentation-based fold detection for Python: any line ending in `:` (a
 * compound statement — def/class/if/for/while/try/with/else/...) followed by
 * more-indented lines is foldable, matching how editors fold Python source
 * without needing a full parser.
 */
export function computeFoldRanges(code: string): FoldRange[] {
  const lines = code.split('\n')
  const ranges: FoldRange[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    if (!/:\s*(#.*)?$/.test(line)) continue

    const headerIndent = indentWidth(line)
    let end = i
    let sawContent = false
    let j = i + 1

    while (j < lines.length) {
      const next = lines[j]
      if (next.trim() === '') {
        j++
        continue
      }
      if (indentWidth(next) > headerIndent) {
        end = j
        sawContent = true
        j++
      } else {
        break
      }
    }

    if (sawContent && end > i) {
      ranges.push({ start: i + 1, end: end + 1 })
    }
  }

  return ranges
}
