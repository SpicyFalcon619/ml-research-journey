import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { KEYS, localDay } from '@/lib/userData'

export interface RecentEntry {
  id: string
  at: number
}

export interface Prefs {
  /** Show the "Continue where you left off" card on the home page. */
  showContinue: boolean
  /** Remember which lessons were opened and what was searched. */
  keepHistory: boolean
}

const DEFAULT_PREFS: Prefs = { showContinue: true, keepHistory: true }

interface LibraryValue {
  favorites: string[]
  done: string[]
  recent: RecentEntry[]
  recentSearches: string[]
  /** Days (YYYY-MM-DD) on which a lesson was opened or finished. */
  activityDays: string[]
  prefs: Prefs
  /** The lesson whose "continue" card was dismissed; it returns once a different lesson is opened. */
  dismissedResume: string | null
  isFavorite: (id: string) => boolean
  isDone: (id: string) => boolean
  toggleFavorite: (id: string) => void
  toggleDone: (id: string) => void
  recordVisit: (id: string) => void
  addSearch: (query: string) => void
  dismissResume: (id: string) => void
  setPrefs: (changes: Partial<Prefs>) => void
  clearFavorites: () => void
  clearDone: () => void
  clearRecent: () => void
  clearSearches: () => void
  clearActivity: () => void
}

const MAX_RECENT = 8
const MAX_SEARCHES = 6
const MAX_ACTIVITY_DAYS = 800

function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    const parsed: unknown = JSON.parse(raw)
    return isValid(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable or full; the library just won't persist this visit.
  }
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isRecentArray = (value: unknown): value is RecentEntry[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as RecentEntry).id === 'string' &&
      typeof (item as RecentEntry).at === 'number',
  )

const isPrefs = (value: unknown): value is Prefs =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Prefs).showContinue === 'boolean' &&
  typeof (value as Prefs).keepHistory === 'boolean'

const isStringOrNull = (value: unknown): value is string | null => value === null || typeof value === 'string'

const LibraryContext = createContext<LibraryValue | null>(null)

// Personal, per-browser state: starred and finished lessons, your recently opened list, your
// activity days and your preferences. Kept in localStorage only: no account, and
// nothing leaves the device. The Progress page shows all of it and can clear or move it.
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => readJson(KEYS.favorites, [], isStringArray))
  const [done, setDone] = useState<string[]>(() => readJson(KEYS.done, [], isStringArray))
  const [recent, setRecent] = useState<RecentEntry[]>(() => readJson(KEYS.recent, [], isRecentArray))
  const [recentSearches, setRecentSearches] = useState<string[]>(() => readJson(KEYS.searches, [], isStringArray))
  const [activityDays, setActivityDays] = useState<string[]>(() => readJson(KEYS.activity, [], isStringArray))
  const [prefs, setPrefsState] = useState<Prefs>(() => readJson(KEYS.prefs, DEFAULT_PREFS, isPrefs))
  const [dismissedResume, setDismissedResume] = useState<string | null>(() => readJson(KEYS.dismissed, null, isStringOrNull))

  // Opened lessons used to be tracked under this key; it no longer is, so tidy up what's left.
  useEffect(() => {
    try {
      window.localStorage.removeItem('mlfg-visited')
    } catch {
      // Storage unavailable: nothing to tidy.
    }
  }, [])

  useEffect(() => writeJson(KEYS.favorites, favorites), [favorites])
  useEffect(() => writeJson(KEYS.done, done), [done])
  useEffect(() => writeJson(KEYS.recent, recent), [recent])
  useEffect(() => writeJson(KEYS.searches, recentSearches), [recentSearches])
  useEffect(() => writeJson(KEYS.activity, activityDays), [activityDays])
  useEffect(() => writeJson(KEYS.prefs, prefs), [prefs])
  useEffect(() => writeJson(KEYS.dismissed, dismissedResume), [dismissedResume])

  const logToday = useCallback(() => {
    const today = localDay()
    setActivityDays((prev) => (prev.includes(today) ? prev : [...prev, today].slice(-MAX_ACTIVITY_DAYS)))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]))
  }, [])

  const toggleDone = useCallback(
    (id: string) => {
      setDone((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      logToday()
    },
    [logToday],
  )

  const recordVisit = useCallback(
    (id: string) => {
      if (!prefs.keepHistory) return
      setRecent((prev) => [{ id, at: Date.now() }, ...prev.filter((entry) => entry.id !== id)].slice(0, MAX_RECENT))
      logToday()
    },
    [prefs.keepHistory, logToday],
  )

  const addSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (!trimmed || !prefs.keepHistory) return
      setRecentSearches((prev) =>
        [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_SEARCHES),
      )
    },
    [prefs.keepHistory],
  )

  const setPrefs = useCallback((changes: Partial<Prefs>) => setPrefsState((prev) => ({ ...prev, ...changes })), [])

  const value = useMemo<LibraryValue>(
    () => ({
      favorites,
      done,
      recent,
      recentSearches,
      activityDays,
      prefs,
      dismissedResume,
      isFavorite: (id) => favorites.includes(id),
      isDone: (id) => done.includes(id),
      toggleFavorite,
      toggleDone,
      recordVisit,
      addSearch,
      dismissResume: setDismissedResume,
      setPrefs,
      clearFavorites: () => setFavorites([]),
      clearDone: () => setDone([]),
      clearRecent: () => {
        setRecent([])
        setDismissedResume(null)
      },
      clearSearches: () => setRecentSearches([]),
      clearActivity: () => setActivityDays([]),
    }),
    [favorites, done, recent, recentSearches, activityDays, prefs, dismissedResume, toggleFavorite, toggleDone, recordVisit, addSearch, setPrefs],
  )

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within a LibraryProvider')
  return ctx
}
