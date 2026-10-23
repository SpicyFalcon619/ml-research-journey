// Talks to the chat models straight from the browser, through the OpenAI-style endpoints that both
// Groq and Google's Gemini offer. Both allow cross-origin calls, so no server of ours is involved:
// each provider's key is built into the site (see PROVIDERS) and goes only to that provider.

export const GROQ_KEY_STORAGE = 'mlfg-groq-key'
export const MODEL_STORAGE = 'mlfg-groq-model'

export type ProviderId = 'groq' | 'gemini'

interface Provider {
  label: string
  endpoint: string
  /** Baked in at build time, so the site works for visitors without any setup. */
  key: string
}

const clean = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

/**
 * The keys the site uses, from VITE_GROQ_KEY and VITE_GEMINI_KEY at build time. They are visible to anyone
 * who reads the page's JavaScript, so they should be free-plan keys. They are never committed: the deploy
 * workflow reads them from repository secrets. A provider with no key is simply left out.
 */
export const PROVIDERS: Record<ProviderId, Provider> = {
  groq: { label: 'Groq', endpoint: 'https://api.groq.com/openai/v1/chat/completions', key: clean(import.meta.env.VITE_GROQ_KEY) },
  gemini: {
    label: 'Google Gemini',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    key: clean(import.meta.env.VITE_GEMINI_KEY),
  },
}

export interface LlmModel {
  id: string
  label: string
  note: string
  provider: ProviderId
}

// The chat models on each provider's free plan, strongest first. Every model has its own free limit,
// and Groq's is small (about 8K tokens a minute), so prompts are kept short (see assistantPrompts.ts).
const ALL_MODELS: LlmModel[] = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B', note: 'Groq. The strongest open model here', provider: 'groq' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B', note: 'Groq. Faster, a little less careful', provider: 'groq' },
  { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B', note: 'Groq. An alternative to compare with', provider: 'groq' },
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', note: 'Google. Strong and quick, with its own free limit', provider: 'gemini' },
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite', note: 'Google. The fastest, good for quick questions', provider: 'gemini' },
]

/** Only the models whose provider has a key in this build. */
export const MODELS: LlmModel[] = ALL_MODELS.filter((m) => PROVIDERS[m.provider].key !== '')
export const DEFAULT_MODEL = MODELS[0]?.id ?? ''

/** The providers actually in use, for the notices that say where questions go. */
export const ACTIVE_PROVIDERS: ProviderId[] = (Object.keys(PROVIDERS) as ProviderId[]).filter((id) => PROVIDERS[id].key !== '')

/** The chosen model first, then the others. Each model has its own free limit, so when one is used up the next can still answer. */
export const modelOrder = (chosen: string): LlmModel[] => [...MODELS.filter((m) => m.id === chosen), ...MODELS.filter((m) => m.id !== chosen)]

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Visitors are never asked for a key: the site uses only the ones built into it. Earlier versions let
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

export type LlmErrorKind = 'auth' | 'rate' | 'network' | 'other'
export class LlmError extends Error {
  kind: LlmErrorKind
  constructor(message: string, kind: LlmErrorKind) {
    super(message)
    this.kind = kind
  }
}

async function failure(response: Response, who: string): Promise<LlmError> {
  let detail = ''
  try {
    const body = (await response.json()) as { error?: { message?: string } } | { error?: { message?: string } }[]
    detail = (Array.isArray(body) ? body[0] : body)?.error?.message ?? ''
  } catch {
    // No readable body.
  }
  // Google reports a bad or missing key as a 400 (or 403), Groq as a 401.
  const badKey = response.status === 401 || (response.status === 400 || response.status === 403) && /api key|authoriz|credential|permission/i.test(detail)
  if (badKey) return new LlmError(`${who} did not accept the site's key.`, 'auth')
  if (response.status === 429) {
    const wait = response.headers.get('retry-after')
    return new LlmError(`The free plan's limit was reached${wait ? `. Try again in about ${wait} seconds` : '. Wait a minute and try again'}.`, 'rate')
  }
  if (response.status === 404 || response.status === 400) {
    return new LlmError(detail || `${who} could not use this model or request. Try another model in Settings.`, 'other')
  }
  return new LlmError(detail || `${who} returned an error (${response.status}).`, 'other')
}

interface StreamOptions {
  model: LlmModel
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
export async function streamChat({ model, messages, signal, onToken }: StreamOptions): Promise<string | undefined> {
  const provider = PROVIDERS[model.provider]
  let response: Response
  try {
    response = await fetch(provider.endpoint, {
      method: 'POST',
      signal,
      headers: { Authorization: `Bearer ${provider.key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model.id,
        messages,
        stream: true,
        temperature: 0.4,
        // Groq takes max_completion_tokens; Google's compatibility layer takes max_tokens.
        ...(model.provider === 'groq' ? { max_completion_tokens: 1600 } : { max_tokens: 1600 }),
        // The gpt-oss models "think" before answering; a low setting keeps replies quick and cheap.
        ...(model.id.startsWith('openai/gpt-oss') ? { reasoning_effort: 'low' } : {}),
      }),
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new LlmError(`Couldn't reach ${provider.label}. Check your connection and try again.`, 'network')
  }
  if (!response.ok) throw await failure(response, provider.label)
  if (!response.body) throw new LlmError(`${provider.label} sent an empty reply.`, 'other')

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
        if (chunk.error?.message) throw new LlmError(chunk.error.message, 'other')
        const text = chunk.choices?.[0]?.delta?.content
        if (text) filter.push(text)
        finish = chunk.choices?.[0]?.finish_reason ?? finish
      } catch (error) {
        if (error instanceof LlmError) throw error
        // A partial or non-JSON line: skip it.
      }
    }
  }
  filter.flush()
  return finish
}
