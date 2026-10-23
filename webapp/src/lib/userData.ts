import { GROQ_KEY_STORAGE, MODEL_STORAGE } from '@/lib/llm'
import { CHATS_KEY } from '@/lib/chats'

// Everything a visitor can personalize lives in their own browser (localStorage). This
// module is the single list of those keys, plus the helpers that show, export, import
// and erase them. Nothing here is ever sent to a server.

export const KEYS = {
  favorites: 'mlfg-favorites',
  done: 'mlfg-done',
  recent: 'mlfg-recent',
  searches: 'mlfg-searches',
  activity: 'mlfg-activity',
  prefs: 'mlfg-prefs',
  dismissed: 'mlfg-dismissed-resume',
  theme: 'mlfg-theme',
  codeSize: 'mlfg-code-font-size',
  capture: 'mlfg-capture-style-v1',
  aiChats: CHATS_KEY,
  exploreOpen: 'mlfg-explore-open',
  background: 'mlfg-bg',
} as const

/** The roadmap page (same site, so same storage) saves one `roadmap-<id>` key per ticked step. */
export const ROADMAP_PREFIX = 'roadmap-'

/** Kept in this browser but deliberately left out of exports and imports: the Groq key is a secret. */
const SECRET_KEYS = [GROQ_KEY_STORAGE, MODEL_STORAGE]

const OWN_KEYS: string[] = Object.values(KEYS)
const MAX_VALUE_LENGTH = 200_000
const MAX_IMPORT_BYTES = 1_000_000

export function isOwnKey(key: string): boolean {
  return OWN_KEYS.includes(key) || (key.startsWith(ROADMAP_PREFIX) && key.length <= 80)
}

/** A copy of everything this site stores in the browser, as plain strings. */
export function storageSnapshot(): Record<string, string> {
  const snapshot: Record<string, string> = {}
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && isOwnKey(key)) snapshot[key] = window.localStorage.getItem(key) ?? ''
    }
  } catch {
    // Storage unavailable: an empty snapshot is the honest answer.
  }
  return snapshot
}

export function exportData(): string {
  return JSON.stringify(
    { app: 'ml-field-guide', version: 1, exportedAt: new Date().toISOString(), data: storageSnapshot() },
    null,
    2,
  )
}

export type ImportResult = { ok: true; entries: Record<string, string> } | { ok: false; error: string }

// An import file is untrusted input: only this site's own keys are accepted, only strings,
// and a size cap applies, so a wrong or malicious file can't write anything else.
export function parseImport(text: string): ImportResult {
  if (text.length > MAX_IMPORT_BYTES) return { ok: false, error: 'That file is too large to be a settings export.' }
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: "That file isn't valid JSON." }
  }
  const file = parsed as { app?: unknown; version?: unknown; data?: unknown }
  if (!file || file.app !== 'ml-field-guide' || typeof file.data !== 'object' || file.data === null) {
    return { ok: false, error: "That doesn't look like an export from this site." }
  }
  if (file.version !== 1) return { ok: false, error: 'That export is from a newer version of the site.' }
  const entries: Record<string, string> = {}
  for (const [key, value] of Object.entries(file.data as Record<string, unknown>)) {
    if (isOwnKey(key) && typeof value === 'string' && value.length <= MAX_VALUE_LENGTH) entries[key] = value
  }
  if (Object.keys(entries).length === 0) return { ok: false, error: 'That export has nothing to import.' }
  return { ok: true, entries }
}

export function writeEntries(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) window.localStorage.setItem(key, value)
}

export function eraseAll() {
  for (const key of [...Object.keys(storageSnapshot()), ...SECRET_KEYS]) window.localStorage.removeItem(key)
}

// ---- Dates, streaks and "x ago" -------------------------------------------------

/** Local calendar day as YYYY-MM-DD (not UTC, so "today" matches the visitor's clock). */
export function localDay(date: Date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const DAY_MS = 86_400_000
const dayNumber = (day: string) => Math.round(Date.parse(`${day}T00:00:00Z`) / DAY_MS)

/**
 * Consecutive days with activity. The current streak is still alive if the last
 * active day was today or yesterday, so it doesn't read zero first thing in the morning.
 */
export function computeStreak(days: string[], today: string): { current: number; longest: number } {
  const unique = [...new Set(days)].filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).map(dayNumber).sort((a, b) => a - b)
  if (unique.length === 0) return { current: 0, longest: 0 }
  let longest = 1
  let run = 1
  for (let i = 1; i < unique.length; i++) {
    run = unique[i] === unique[i - 1] + 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }
  const last = unique[unique.length - 1]
  const gap = dayNumber(today) - last
  if (gap > 1 || gap < 0) return { current: gap < 0 ? run : 0, longest }
  return { current: run, longest }
}

export function timeAgo(then: number, now: number = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - then) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
