// Talks to Groq's OpenAI-compatible chat endpoint straight from the browser. Groq allows
// cross-origin calls, so no server of ours is involved: the key lives in this browser's
// storage and goes only to api.groq.com.

export const GROQ_KEY_STORAGE = 'mlfg-groq-key'
export const MODEL_STORAGE = 'mlfg-groq-model'
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

export interface GroqModel {
  id: string
  label: string
  note: string
}

// The chat models on Groq's free plan. The free plan allows about 8K tokens a minute, so
// prompts are kept short (see assistantPrompts.ts) whichever model is chosen.
export const MODELS: GroqModel[] = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', note: 'The strongest here: best answers' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', note: 'Faster, a little less careful' },
  { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', note: 'An alternative to compare with' },
]
export const DEFAULT_MODEL = MODELS[0].id

/**
 * The key the site uses, baked in at build time (VITE_GROQ_KEY) so it works for visitors without any setup. It is
 * visible to anyone who reads the page's JavaScript, so it should be a free-plan key. It is never
 * committed: the deploy workflow reads it from a repository secret.
 */
export const BUILT_IN_KEY = ((import.meta.env.VITE_GROQ_KEY as string | undefined) ?? '').trim()

/** The chosen model first, then the others. Each model has its own free limit, so when one is used up the next can still answer. */
export const modelOrder = (chosen: string): GroqModel[] => [...MODELS.filter((m) => m.id === chosen), ...MODELS.filter((m) => m.id !== chosen)]

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Visitors are never asked for a key: the site uses only the one built into it. Earlier versions let
 * people paste their own, so any key left in a browser from then is deleted.
 */
export function purgeStoredKey() {
  try {
    window.localStorage.removeItem(GROQ_KEY_STORAGE)
  } catch {
    // Nothing to remove.
  }
}

export function getStoredModel(): string {
  const stored = read(MODEL_STORAGE)
  return MODELS.some((m) => m.id === stored) ? (stored as string) : DEFAULT_MODEL
}

export function saveModel(id: string) {
  try {
    window.localStorage.setItem(MODEL_STORAGE, id)
  } catch {
    // Not remembered; the default applies next time.
  }
}

export type ChatRole = 'system' | 'user' | 'assistant'
export interface ChatMessage {
  role: ChatRole
  content: string
}

export type GroqErrorKind = 'auth' | 'rate' | 'network' | 'other'
export class GroqError extends Error {
  kind: GroqErrorKind
  constructor(message: string, kind: GroqErrorKind) {
    super(message)
    this.kind = kind
  }
}

async function failure(response: Response): Promise<GroqError> {
  let detail = ''
  try {
    const body = (await response.json()) as { error?: { message?: string } }
    detail = body.error?.message ?? ''
  } catch {
    // No readable body.
  }
  if (response.status === 401) return new GroqError('Groq did not accept this key. Check it in Settings.', 'auth')
  if (response.status === 429) {
    const wait = response.headers.get('retry-after')
    return new GroqError(`The free plan's limit was reached${wait ? `. Try again in about ${wait} seconds` : '. Wait a minute and try again'}.`, 'rate')
  }
  if (response.status === 404 || response.status === 400) {
    return new GroqError(detail || 'Groq could not use this model or request. Try another model in Settings.', 'other')
  }
  return new GroqError(detail || `Groq returned an error (${response.status}).`, 'other')
}

interface StreamOptions {
  apiKey: string
  model: string
  messages: ChatMessage[]
  signal?: AbortSignal
  onToken: (text: string) => void
}

// Streams the reply token by token (server-sent events) so the answer appears as it is written.
/**
 * Some models (Qwen, DeepSeek) write their reasoning into the answer between <think> tags. This drops
 * those blocks as the text streams in. A tag can arrive split across two chunks, so the end of the
 * buffer is held back while it could still turn out to be the start of a tag.
 */
export function createThinkFilter(emit: (text: string) => void) {
  const OPEN = '<think>'
  const CLOSE = '</think>'
  let buffer = ''
  let inside = false
  // How many characters at the end of `text` could be the beginning of `tag`.
  const partial = (text: string, tag: string) => {
    for (let n = Math.min(tag.length - 1, text.length); n > 0; n--) if (tag.startsWith(text.slice(-n))) return n
    return 0
  }
  return {
    push(text: string) {
      buffer += text
      for (;;) {
        if (inside) {
          const end = buffer.indexOf(CLOSE)
          if (end === -1) {
            buffer = buffer.slice(buffer.length - partial(buffer, CLOSE))
            return
          }
          buffer = buffer.slice(end + CLOSE.length).replace(/^\s+/, '')
          inside = false
        } else {
          const start = buffer.indexOf(OPEN)
          if (start === -1) {
            const hold = partial(buffer, OPEN)
            if (buffer.length > hold) emit(buffer.slice(0, buffer.length - hold))
            buffer = buffer.slice(buffer.length - hold)
            return
          }
          if (start > 0) emit(buffer.slice(0, start))
          buffer = buffer.slice(start + OPEN.length)
          inside = true
        }
      }
    },
    /** Call when the stream ends: anything held back was not a tag after all. */
    flush() {
      if (!inside && buffer) emit(buffer)
      buffer = ''
    },
  }
}

/** Resolves with the reason the model stopped: 'length' means the answer was cut off. */
export async function streamChat({ apiKey, model, messages, signal, onToken }: StreamOptions): Promise<string | undefined> {
  let response: Response
  try {
    response = await fetch(ENDPOINT, {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: 0.4,
        max_completion_tokens: 1600,
        // The gpt-oss models "think" before answering; a low setting keeps replies quick and cheap.
        ...(model.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
      }),
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new GroqError("Couldn't reach Groq. Check your connection and try again.", 'network')
  }
  if (!response.ok) throw await failure(response)
  if (!response.body) throw new GroqError('Groq sent an empty reply.', 'other')

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let finish: string | undefined
  const filter = createThinkFilter(onToken)
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') {
        filter.flush()
        return finish
      }
      try {
        const chunk = JSON.parse(payload) as { choices?: { delta?: { content?: string }; finish_reason?: string | null }[]; error?: { message?: string } }
        if (chunk.error?.message) throw new GroqError(chunk.error.message, 'other')
        const text = chunk.choices?.[0]?.delta?.content
        if (text) filter.push(text)
        finish = chunk.choices?.[0]?.finish_reason ?? finish
      } catch (error) {
        if (error instanceof GroqError) throw error
        // A partial or non-JSON line: skip it.
      }
    }
  }
  filter.flush()
  return finish
}
