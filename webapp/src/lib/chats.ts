import type { LlmErrorKind } from '@/lib/llm'

// Conversations with the assistant, kept in this browser's local storage so they survive a
// refresh. They hold only what was typed and answered: never any key. Old chats are
// dropped to stay well inside the browser's storage limit.

export const CHATS_KEY = 'mlfg-ai-chats'

export interface Msg {
  id: number
  role: 'user' | 'assistant'
  content: string
  error?: string
  errorKind?: LlmErrorKind
  /** Set when a different model than the chosen one answered because of a rate limit. */
  note?: string
  /** True when the model hit its length limit and the answer stops short. */
  truncated?: boolean
}

export interface Chat {
  id: string
  title: string
  updatedAt: number
  messages: Msg[]
}

export interface ChatStore {
  active: string | null
  chats: Chat[]
}

const MAX_CHATS = 15
const MAX_MESSAGES = 40
const MAX_BYTES = 400_000

export const EMPTY_STORE: ChatStore = { active: null, chats: [] }

const isMsg = (value: unknown): value is Msg => {
  const m = value as Msg
  return typeof m === 'object' && m !== null && typeof m.id === 'number' && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
}

function parse(raw: string | null): ChatStore {
  if (!raw) return EMPTY_STORE
  try {
    const data = JSON.parse(raw) as Partial<ChatStore>
    if (!data || !Array.isArray(data.chats)) return EMPTY_STORE
    const chats: Chat[] = data.chats
      .filter((c): c is Chat => typeof c === 'object' && c !== null && typeof c.id === 'string' && typeof c.title === 'string' && typeof c.updatedAt === 'number' && Array.isArray(c.messages))
      .map((c) => ({
        id: c.id,
        title: c.title.slice(0, 80),
        updatedAt: c.updatedAt,
        // An answer that was still arriving when the page closed is shown as interrupted, with a retry.
        messages: c.messages.filter(isMsg).map((m) =>
          m.role === 'assistant' && !m.content && !m.error ? { ...m, error: 'This answer was interrupted when the page closed.', errorKind: 'other' as const } : m,
        ),
      }))
    const active = typeof data.active === 'string' && chats.some((c) => c.id === data.active) ? data.active : null
    return { active, chats }
  } catch {
    return EMPTY_STORE
  }
}

export function loadChats(): ChatStore {
  try {
    return parse(window.localStorage.getItem(CHATS_KEY))
  } catch {
    return EMPTY_STORE
  }
}

export function saveChats(store: ChatStore) {
  // Newest first; drop the oldest until it fits.
  let chats = [...store.chats].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CHATS)
  chats = chats.map((c) => ({ ...c, messages: c.messages.slice(-MAX_MESSAGES) }))
  let json = JSON.stringify({ active: store.active, chats })
  while (json.length > MAX_BYTES && chats.length > 1) {
    chats = chats.slice(0, -1)
    json = JSON.stringify({ active: chats.some((c) => c.id === store.active) ? store.active : null, chats })
  }
  try {
    window.localStorage.setItem(CHATS_KEY, json)
  } catch {
    // Storage full or unavailable: the conversation still works, it just won't survive a refresh.
  }
}

export function titleFor(text: string): string {
  const flat = text.replace(/```[\s\S]*?```/g, ' code ').replace(/\s+/g, ' ').trim()
  return flat.length > 48 ? `${flat.slice(0, 47)}...` : flat || 'New chat'
}

export function newChatId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}
