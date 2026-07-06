import { useMemo, useState } from 'react'
import { useTheme } from '@/hooks/useTheme'
import type { ThemeId } from '@/lib/theme'

// One accent per column, cycled, tuned separately per site theme so every hue
// stays clearly distinct against that theme's own code-surface background
// (a shared palette read as near-identical pale colors against Aurora's navy).
const CSV_PALETTE: Record<ThemeId, string[]> = {
  dark: ['#a5a9ff', '#5be3c9', '#ffb673', '#ff8fc4', '#7ec2ff', '#c6f27a'],
  vesper: ['#ffc799', '#99ffe4', '#8ab4ff', '#c9a6ff', '#ff9fb0', '#e3e08a'],
  light: ['#4b69c6', '#3a7a20', '#aa3731', '#9c5d27', '#7a3e9d', '#1f7690'],
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Minimal RFC4180-ish line parser: handles quoted fields so a comma or a
// literal `"` inside `"..."` doesn't split a cell apart (e.g. a CSV name
// column like `"Kelly, Mr. James"`). Doesn't handle quoted fields spanning
// multiple lines — not needed for this site's flat sample datasets.
function parseCsvLine(line: string): string[] {
  const cells: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cur += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      cells.push(cur.trim())
      cur = ''
    } else {
      cur += ch
    }
  }
  cells.push(cur.trim())
  return cells
}

function parseCsv(code: string): string[][] {
  return code
    .split('\n')
    .map((line) => line.replace(/\r$/, ''))
    .filter((line) => line.length > 0)
    .map(parseCsvLine)
}

export function CsvTable({ code }: { code: string }) {
  const [siteTheme] = useTheme()
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const rows = useMemo(() => parseCsv(code), [code])
  const palette = CSV_PALETTE[siteTheme]

  if (rows.length === 0) return null
  const [header, ...body] = rows

  return (
    <div className="csv-table-scroll">
      <table className="csv-table">
        <thead>
          <tr>
            {header.map((cell, i) => {
              const color = palette[i % palette.length]
              return (
                <th key={i} style={{ color, borderBottomColor: color, background: rgba(color, 0.14) }}>
                  {cell}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} onMouseEnter={() => setHoveredRow(r)} onMouseLeave={() => setHoveredRow(null)}>
              {row.map((cell, i) => {
                const color = palette[i % palette.length]
                return (
                  <td key={i} style={{ background: rgba(color, hoveredRow === r ? 0.16 : 0.06) }}>
                    {cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="csv-table-footnote">
        {body.length} row{body.length === 1 ? '' : 's'} · {header.length} column{header.length === 1 ? '' : 's'}
      </div>
    </div>
  )
}
