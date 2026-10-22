import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, Check, Copy, Eye, EyeOff, Link2, RotateCcw, Settings, Square, Trash2, X } from 'lucide-react'
import { getSnippetById } from '@/lib/content'
import { buildMessages, GENERAL_ACTIONS, LESSON_ACTIONS } from '@/lib/assistantPrompts'
import { GroqError, looksLikeKey, MODELS, setupLink, streamChat, type GroqErrorKind } from '@/lib/groq'
import { useAssistant } from '@/hooks/useAssistant'
import { useLibrary } from '@/hooks/useLibrary'
import { Dropdown } from '@/components/ui/Dropdown'
import { RichText } from '@/components/ai/RichText'
import { cn } from '@/lib/cn'

interface Msg {
  id: number
  role: 'user' | 'assistant'
  content: string
  error?: string
  errorKind?: GroqErrorKind
}

const iconButton =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]'
const textButton =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50'

function KeyForm({ onDone, existing }: { onDone: () => void; existing: boolean }) {
  const { apiKey, setApiKey, clearApiKey, model, setModel } = useAssistant()
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const valid = looksLikeKey(value)
  const showWarning = value.trim() !== '' && !valid

  return (
    <div className="flex flex-col gap-5 p-5">
      {!existing && (
        <div>
          <h3 className="text-base font-semibold text-[var(--color-ink)]">Connect Groq</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-dim)]">
            The assistant runs on Groq's free plan. Make a key at{' '}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-[var(--color-ink)] underline decoration-[var(--color-border-strong)] underline-offset-4">
              console.groq.com/keys
            </a>
            , paste it below, and ask away.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="groq-key" className="mb-1.5 block text-xs font-medium text-[var(--color-ink-dim)]">
          {existing ? 'Replace the key' : 'Groq API key'}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              id="groq-key"
              type={visible ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="gsk_..."
              autoComplete="off"
              spellCheck={false}
              className="h-9 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] pr-9 pl-3 font-mono text-xs text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
            />
            <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? 'Hide key' : 'Show key'} className="absolute top-1/2 right-1.5 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]">
              {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
          <button
            type="button"
            disabled={!valid}
            onClick={() => {
              setApiKey(value)
              setValue('')
              onDone()
            }}
            className="h-9 cursor-pointer rounded-lg bg-[var(--color-accent)] px-4 text-sm font-medium text-[var(--color-accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
        {showWarning && <p className="mt-1.5 text-xs text-[var(--color-ember)]">Groq keys start with gsk_ and are about 56 characters long.</p>}
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-faint)]">
          Kept in this browser only and sent only to Groq. It is never put in the site's code, in an export, or on GitHub.
        </p>
      </div>

      {existing && (
        <>
          <div>
            <div className="mb-1.5 text-xs font-medium text-[var(--color-ink-dim)]">Model</div>
            <Dropdown
              ariaLabel="Model"
              value={model}
              onChange={setModel}
              options={MODELS.map((m) => ({ value: m.id, label: m.label, description: m.note }))}
            />
          </div>
          <div>
            <div className="mb-1.5 text-xs font-medium text-[var(--color-ink-dim)]">Set up another device</div>
            <p className="mb-2 text-xs leading-relaxed text-[var(--color-ink-faint)]">
              This copies a link that saves your key in whoever opens it, so a friend or your phone is ready in one click. Anyone with the
              link can use your free quota, so send it only to people you trust.
            </p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard?.writeText(setupLink(apiKey)).then(() => {
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 1800)
                })
              }}
              className={textButton}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />} {copied ? 'Link copied' : 'Copy setup link'}
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Remove the saved Groq key from this browser?')) {
                  clearApiKey()
                  onDone()
                }
              }}
              className="cursor-pointer text-xs text-[var(--color-ink-faint)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]"
            >
              Remove my key
            </button>
            <button type="button" onClick={onDone} className={textButton}>
              Back to chat
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export function AssistantPanel() {
  const { open, pending, apiKey, model, closeAssistant, consumePending } = useAssistant()
  const { done } = useLibrary()
  const { pathname } = useLocation()
  const lessonId = pathname.startsWith('/s/') ? decodeURIComponent(pathname.slice(3)) : undefined
  const lesson = lessonId ? getSnippetById(lessonId) : undefined

  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [settings, setSettings] = useState(false)
  const [useLesson, setUseLesson] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const idRef = useRef(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const activeLesson = useLesson ? lesson : undefined
  const hasKey = apiKey !== ''

  // A new lesson gets its own context back, even if it was switched off for the last one.
  useEffect(() => setUseLesson(true), [lessonId])

  const send = useCallback(
    async (text: string) => {
      const content = text.trim()
      if (!content || busy || !apiKey) return
      const history = messages.filter((m) => !m.error && m.content).map(({ role, content: c }) => ({ role, content: c }))
      const userId = ++idRef.current
      const replyId = ++idRef.current
      setMessages((prev) => [...prev, { id: userId, role: 'user', content }, { id: replyId, role: 'assistant', content: '' }])
      setDraft('')
      setBusy(true)
      setSettings(false)
      const controller = new AbortController()
      abortRef.current = controller
      try {
        await streamChat({
          apiKey,
          model,
          signal: controller.signal,
          messages: buildMessages([...history, { role: 'user', content }], activeLesson, done),
          onToken: (token) => setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, content: m.content + token } : m))),
        })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          const kind = error instanceof GroqError ? error.kind : 'other'
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, error: (error as Error).message, errorKind: kind } : m)))
        }
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [apiKey, model, messages, busy, activeLesson, done],
  )

  // A question handed over by an "Ask about this" button is sent once the panel is ready.
  const sendRef = useRef(send)
  sendRef.current = send
  useEffect(() => {
    if (open && pending && hasKey && !busy) {
      consumePending()
      void sendRef.current(pending)
    }
  }, [open, pending, hasKey, busy, consumePending])

  // Focus the field when it opens, and hand focus back to where it came from when it closes.
  useEffect(() => {
    if (!open) return
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const timer = window.setTimeout(() => (inputRef.current ?? document.getElementById('groq-key'))?.focus(), 60)
    return () => {
      window.clearTimeout(timer)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (busy) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  // Stops a reply that is still arriving when the panel is closed.
  useEffect(() => () => abortRef.current?.abort(), [])

  const stop = () => abortRef.current?.abort()
  const clear = () => {
    abortRef.current?.abort()
    setMessages([])
  }
  const retry = (index: number) => {
    const question = messages[index - 1]
    if (!question) return
    setMessages((prev) => prev.slice(0, index - 1))
    window.setTimeout(() => void sendRef.current(question.content), 0)
  }

  const onPanelKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      closeAssistant()
    }
  }
  const onInputKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void send(draft)
    }
  }

  if (!open) return null
  const actions = activeLesson ? LESSON_ACTIONS : GENERAL_ACTIONS
  const showSetup = !hasKey || settings

  return (
    <div
      role="dialog"
      aria-label="Ask AI"
      onKeyDown={onPanelKey}
      className="fixed inset-0 z-[70] flex flex-col border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-glass)] lg:inset-auto lg:top-4 lg:right-4 lg:bottom-4 lg:w-[27rem] lg:rounded-2xl lg:border"
    >
      <header className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--color-ink)]">Ask AI</h2>
          <p className="truncate font-mono text-[11px] text-[var(--color-ink-faint)]">{hasKey ? MODELS.find((m) => m.id === model)?.label ?? model : 'Not connected yet'}</p>
        </div>
        <div className="flex items-center gap-0.5">
          {hasKey && messages.length > 0 && (
            <button type="button" onClick={clear} aria-label="Clear the conversation" title="Clear the conversation" className={iconButton}>
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {hasKey && (
            <button type="button" onClick={() => setSettings((v) => !v)} aria-label="Settings" aria-pressed={settings} title="Key, model and setup link" className={cn(iconButton, settings && 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]')}>
              <Settings className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={closeAssistant} aria-label="Close" className={iconButton}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {showSetup ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <KeyForm existing={hasKey} onDone={() => setSettings(false)} />
        </div>
      ) : (
        <>
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 ? (
              <div>
                <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">
                  {activeLesson ? (
                    <>
                      Ask anything about <span className="font-medium text-[var(--color-ink)]">{activeLesson.title}</span>, or pick a starter.
                    </>
                  ) : (
                    'Ask about any concept in the guide, paste code you are stuck on, or pick a starter.'
                  )}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {actions.map((action) => (
                    <button key={action.id} type="button" onClick={() => void send(action.prompt)} className={textButton}>
                      {action.label}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-relaxed text-[var(--color-ink-faint)]">
                  Answers come from an AI model and can be wrong. Check anything important against the lesson's real output. Your questions go to Groq.
                  The free plan has a daily limit, so this is for light use.
                </p>
              </div>
            ) : (
              <ol className="flex flex-col gap-5">
                {messages.map((message, index) => (
                  <li key={message.id}>
                    {message.role === 'user' ? (
                      <div className="ml-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm whitespace-pre-wrap text-[var(--color-ink)]">{message.content}</div>
                    ) : (
                      <div>
                        {message.content ? (
                          <RichText text={message.content} />
                        ) : !message.error ? (
                          <p className="text-sm text-[var(--color-ink-faint)]" role="status">
                            Thinking...
                          </p>
                        ) : null}
                        {message.error && (
                          <div className="mt-2 rounded-lg border border-[var(--color-ember)]/40 px-3 py-2 text-sm text-[var(--color-ember)]" role="alert">
                            {message.error}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {message.errorKind === 'auth' ? (
                                <button type="button" onClick={() => setSettings(true)} className={textButton}>
                                  Open settings
                                </button>
                              ) : (
                                <button type="button" onClick={() => retry(index)} className={textButton}>
                                  <RotateCcw className="h-3.5 w-3.5" /> Try again
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                        {message.content && !busy && !message.error && <CopyReply text={message.content} />}
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <footer className="border-t border-[var(--color-border)] p-3">
            {lesson && (
              <div className="mb-2 flex items-center justify-between gap-2 text-xs text-[var(--color-ink-faint)]">
                <span className="min-w-0 truncate">
                  {useLesson ? 'Using this lesson: ' : 'Not using the lesson. '}
                  {useLesson && <span className="text-[var(--color-ink-dim)]">{lesson.title}</span>}
                </span>
                <button type="button" onClick={() => setUseLesson((v) => !v)} className="shrink-0 cursor-pointer underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
                  {useLesson ? 'Leave out' : 'Use it'}
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`
                }}
                onKeyDown={onInputKey}
                rows={1}
                placeholder={activeLesson ? 'Ask about this lesson' : 'Ask a question'}
                aria-label="Your question"
                className="max-h-36 min-h-9 flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-accent)]"
              />
              {busy ? (
                <button type="button" onClick={stop} aria-label="Stop" className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border-strong)] text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]">
                  <Square className="h-3.5 w-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => void send(draft)}
                  disabled={!draft.trim()}
                  aria-label="Send"
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[var(--color-accent)] text-[var(--color-accent-ink)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--color-ink-faint)]">
              Enter to send, Shift+Enter for a new line.{' '}
              <Link to="/me" onClick={closeAssistant} className="underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]">
                Your data
              </Link>
            </p>
          </footer>
        </>
      )}
    </div>
  )
}

function CopyReply({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1400)
        })
      }}
      className="mt-1 flex cursor-pointer items-center gap-1 text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? 'Copied' : 'Copy answer'}
    </button>
  )
}
