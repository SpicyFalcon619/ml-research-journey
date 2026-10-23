import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, Check, Copy, History, Plus, RotateCcw, Settings as SettingsIcon, Square, Trash2, X } from 'lucide-react'
import { getSnippetById } from '@/lib/content'
import { buildMessages, CONTINUE_PROMPT, FOLLOW_UPS, GENERAL_ACTIONS, LESSON_ACTIONS, MAX_QUESTION_CHARS } from '@/lib/assistantPrompts'
import { ACTIVE_PROVIDERS, LlmError, MODELS, modelOrder, PROVIDERS, streamChat } from '@/lib/llm'
import { timeAgo } from '@/lib/userData'
import { useAssistant } from '@/hooks/useAssistant'
import { useLibrary } from '@/hooks/useLibrary'
import { useChats } from '@/hooks/useChats'
import { useConfirm } from '@/hooks/useConfirm'
import { Dropdown } from '@/components/ui/Dropdown'
import { RichText } from '@/components/ai/RichText'
import { cn } from '@/lib/cn'
import type { Msg } from '@/lib/chats'
import type { Snippet } from '@/types'

const iconButton =
  'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[var(--color-ink-faint)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-ink)]'
const textButton =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-ink-dim)] transition-colors hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50'

// Settings has one thing to choose: the model. There is nothing to enter, because the site uses its own key.
function Settings({ onDone }: { onDone: () => void }) {
  const { model, setModel } = useAssistant()
  return (
    <div className="flex flex-col gap-5 p-5">
      <div>
        <div className="mb-1.5 text-xs font-medium text-[var(--color-ink-dim)]">Model</div>
        <Dropdown ariaLabel="Model" value={model} onChange={setModel} options={MODELS.map((m) => ({ value: m.id, label: m.label, description: m.note }))} />
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-faint)]">
          If the chosen model reaches its free limit, another one answers instead, so you can keep going. Everyone using the site shares one free
          daily limit.
        </p>
      </div>
      <div className="flex justify-end border-t border-[var(--color-border)] pt-4">
        <button type="button" onClick={onDone} className={textButton}>
          Back to chat
        </button>
      </div>
    </div>
  )
}

// Shown when the site was built without a key (for instance a local copy with no .env.local), so there is nothing to ask.
function Unavailable() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <h3 className="text-base font-semibold text-[var(--color-ink)]">The assistant is switched off</h3>
      <p className="text-sm leading-relaxed text-[var(--color-ink-dim)]">It isn't set up on this copy of the site, so there's nothing to ask right now.</p>
      {import.meta.env.DEV && (
        <p className="text-xs leading-relaxed text-[var(--color-ink-faint)]">
          For the site's owner: put a key in <span className="font-mono">webapp/.env.local</span> as <span className="font-mono">VITE_GROQ_KEY=...</span> or <span className="font-mono">VITE_GEMINI_KEY=...</span> and restart
          the dev server. On GitHub they come from the <span className="font-mono">GROQ_API_KEY</span> and <span className="font-mono">GEMINI_API_KEY</span> secrets.
        </p>
      )}
    </div>
  )
}

type View = 'chat' | 'history' | 'settings'

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" role="status" aria-label="Thinking">
      {[0, 1, 2].map((n) => (
        <span key={n} className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-ink-faint)]" style={{ animationDelay: `${n * 160}ms` }} />
      ))}
    </span>
  )
}

export function AssistantPanel() {
  const { open, pending, available, model, closeAssistant, consumePending } = useAssistant()
  const { done, recent } = useLibrary()
  const { chats, active, messages, startChat, updateMessages, patchMessage, newChat, openChat, deleteChat, clearAll, makeId } = useChats()
  const { pathname } = useLocation()
  const confirm = useConfirm()
  const reduceMotion = useReducedMotion()
  const lessonId = pathname.startsWith('/s/') ? decodeURIComponent(pathname.slice(3)) : undefined
  const lesson = lessonId ? getSnippetById(lessonId) : undefined

  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [view, setView] = useState<View>('chat')
  const [useLesson, setUseLesson] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  const activeLesson = useLesson ? lesson : undefined
  const hasKey = available

  // A new lesson gets its own context back, even if it was switched off for the last one.
  useEffect(() => setUseLesson(true), [lessonId])

  // `history` replaces the messages from the question onward (used to retry or regenerate);
  // `asked` is what the model is sent when it differs from what the chat shows (such as "Continue").
  const send = useCallback(
    async (text: string, options: { history?: Msg[]; asked?: string } = {}) => {
      const content = text.trim().slice(0, MAX_QUESTION_CHARS)
      if (!content || busy || !available) return
      const base = options.history ?? messages
      const chatId = active?.id ?? startChat(content)
      const prior = base.filter((m) => !m.error && m.content).map(({ role, content: c }) => ({ role, content: c }))
      const userId = makeId()
      const replyId = makeId()
      updateMessages(chatId, (list) => [...(options.history ?? list), { id: userId, role: 'user', content }, { id: replyId, role: 'assistant', content: '' }])
      setDraft('')
      if (inputRef.current) inputRef.current.style.height = 'auto'
      setBusy(true)
      setView('chat')
      const controller = new AbortController()
      abortRef.current = controller
      const recentLessons = recent
        .slice(0, 3)
        .map((entry) => getSnippetById(entry.id))
        .filter((snippet): snippet is Snippet => !!snippet)
      const request = buildMessages([...prior, { role: 'user', content: options.asked ?? content }], activeLesson, done, recentLessons)
      let received = false
      try {
        // Each model has its own free limit, so if the chosen one is used up or unavailable the next one answers.
        const order = modelOrder(model)
        let finish: string | undefined
        for (let i = 0; i < order.length; i++) {
          try {
            finish = await streamChat({
              model: order[i],
              signal: controller.signal,
              messages: request,
              onToken: (token) => {
                received = true
                patchMessage(chatId, replyId, (m) => ({ content: m.content + token }))
              },
            })
            if (i > 0) patchMessage(chatId, replyId, { note: `Answered by ${order[i].label}, because ${order[0].label} was at its free limit or unavailable.` })
            break
          } catch (error) {
            // A rejected key counts too: if one provider's key is wrong, the other provider can still answer.
            const retryable = error instanceof LlmError && (error.kind === 'rate' || error.kind === 'other' || error.kind === 'auth')
            if (retryable && !received && i < order.length - 1) continue
            throw error
          }
        }
        if (finish === 'length') patchMessage(chatId, replyId, { truncated: true })
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          const kind = error instanceof LlmError ? error.kind : 'other'
          const message = kind === 'auth' ? "The assistant's key isn't working right now. Please try again later." : (error as Error).message
          patchMessage(chatId, replyId, { error: message, errorKind: kind })
        }
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [available, model, messages, busy, active, activeLesson, done, recent, startChat, updateMessages, patchMessage, makeId],
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
    const timer = window.setTimeout(() => inputRef.current?.focus(), 120)
    return () => {
      window.clearTimeout(timer)
      returnFocusRef.current?.focus?.()
    }
  }, [open])

  // Follow the answer as it is written, and start at the latest message when a chat is opened.
  useEffect(() => {
    if (busy) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [active?.id, view, open])

  // Stops a reply that is still arriving when the panel goes away.
  useEffect(() => () => abortRef.current?.abort(), [])

  const stop = () => abortRef.current?.abort()
  // Switching or deleting a chat while an answer is arriving would write it into the wrong chat.
  const guard = (action: () => void) => {
    abortRef.current?.abort()
    action()
  }
  const retry = (index: number) => {
    const question = messages[index - 1]
    if (!question || busy) return
    void send(question.content, { history: messages.slice(0, index - 1) })
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

  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  const motionProps = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0.12 } } }
    : mobile
      ? { initial: { opacity: 0, y: 56 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 56, transition: { duration: 0.18, ease: 'easeIn' as const } } }
      : { initial: { opacity: 0, x: 32, scale: 0.985 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 32, scale: 0.985, transition: { duration: 0.17, ease: 'easeIn' as const } } }

  const actions = activeLesson ? LESSON_ACTIONS : GENERAL_ACTIONS
  const showSetup = !hasKey || view === 'settings'
  const lastIndex = messages.length - 1
  const last = messages[lastIndex]
  const showFollowUps = !busy && last?.role === 'assistant' && !!last.content && !last.error
  const sortedChats = [...chats].sort((a, b) => b.updatedAt - a.updatedAt)
  const modelLabel = MODELS.find((m) => m.id === model)?.label ?? model

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="assistant"
          role="dialog"
          aria-label="Ask AI"
          onKeyDown={onPanelKey}
          {...motionProps}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex flex-col border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-glass)] lg:inset-auto lg:top-4 lg:right-4 lg:bottom-4 lg:w-[27rem] lg:rounded-2xl lg:border"
        >
          <header className="flex items-center justify-between gap-2 border-b border-[var(--color-border)] px-4 py-2.5">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">{view === 'history' && hasKey ? 'Conversations' : 'Ask AI'}</h2>
              <p className="truncate font-mono text-[11px] text-[var(--color-ink-faint)]">{hasKey ? modelLabel : 'Not connected yet'}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {hasKey && (
                <button type="button" onClick={() => guard(() => { newChat(); setView('chat') })} aria-label="Start a new chat" title="New chat" className={iconButton}>
                  <Plus className="h-4 w-4" />
                </button>
              )}
              {hasKey && chats.length > 0 && (
                <button type="button" onClick={() => setView((v) => (v === 'history' ? 'chat' : 'history'))} aria-label="Past conversations" aria-pressed={view === 'history'} title="Past conversations" className={cn(iconButton, view === 'history' && 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]')}>
                  <History className="h-4 w-4" />
                </button>
              )}
              {hasKey && (
                <button type="button" onClick={() => setView((v) => (v === 'settings' ? 'chat' : 'settings'))} aria-label="Settings" aria-pressed={view === 'settings'} title="Model" className={cn(iconButton, view === 'settings' && 'bg-[var(--color-surface-hover)] text-[var(--color-ink)]')}>
                  <SettingsIcon className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={closeAssistant} aria-label="Close" className={iconButton}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {showSetup ? (
            <div className="min-h-0 flex-1 overflow-y-auto">
              {hasKey ? <Settings onDone={() => setView('chat')} /> : <Unavailable />}
            </div>
          ) : view === 'history' ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <button type="button" onClick={() => guard(() => { newChat(); setView('chat') })} className={cn(textButton, 'mb-3')}>
                <Plus className="h-3.5 w-3.5" /> New chat
              </button>
              {sortedChats.length === 0 ? (
                <p className="text-sm text-[var(--color-ink-faint)]">No saved conversations yet.</p>
              ) : (
                <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                  {sortedChats.map((chat) => (
                    <li key={chat.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => guard(() => { openChat(chat.id); setView('chat') })}
                        aria-current={chat.id === active?.id}
                        className="min-w-0 flex-1 cursor-pointer py-2.5 pr-2 text-left"
                      >
                        <span className={cn('block truncate text-sm', chat.id === active?.id ? 'font-medium text-[var(--color-ink)]' : 'text-[var(--color-ink-dim)]')}>{chat.title}</span>
                        <span className="block text-xs text-[var(--color-ink-faint)]">
                          {chat.messages.length} {chat.messages.length === 1 ? 'message' : 'messages'} · {timeAgo(chat.updatedAt)}
                        </span>
                      </button>
                      <button type="button" onClick={() => guard(() => deleteChat(chat.id))} aria-label={`Delete the conversation "${chat.title}"`} title="Delete" className={iconButton}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-faint)]">
                Saved in this browser only, so they survive a refresh but don't follow you to another device. The latest {15} are kept.
              </p>
              {sortedChats.length > 0 && (
                <button
                  type="button"
                  onClick={async () => {
                    const yes = await confirm({
                      title: 'Delete all conversations?',
                      message: 'They are saved only in this browser, so they cannot be brought back.',
                      confirmLabel: 'Delete all',
                      danger: true,
                    })
                    if (yes) guard(() => { clearAll(); setView('chat') })
                  }}
                  className="mt-2 cursor-pointer text-xs text-[var(--color-ink-faint)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:text-[var(--color-ink)]"
                >
                  Delete all conversations
                </button>
              )}
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="animate-fade-up">
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
                      Answers come from an AI model and can be wrong. Check anything important against the lesson's real output. Your questions go to {ACTIVE_PROVIDERS.map((id) => PROVIDERS[id].label).join(' or ')}.{ACTIVE_PROVIDERS.includes('gemini') ? " Google may use free-tier questions to improve its products, so keep anything private out of them." : ''}
                      The free plan has a daily limit that everyone using the site shares, so this is for light use. Conversations are saved in this browser.
                    </p>
                  </div>
                ) : (
                  <ol className="flex flex-col gap-5">
                    {messages.map((message, index) => (
                      <li key={message.id} className="animate-fade-up">
                        {message.role === 'user' ? (
                          <div className="ml-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm whitespace-pre-wrap text-[var(--color-ink)]">{message.content}</div>
                        ) : (
                          <div>
                            {message.content ? (
                              <RichText text={message.content} onNavigate={() => { if (window.matchMedia('(max-width: 1023px)').matches) closeAssistant() }} />
                            ) : !message.error ? (
                              <TypingDots />
                            ) : null}
                            {message.error && (
                              <div className="mt-2 rounded-lg border border-[var(--color-ember)]/40 px-3 py-2 text-sm text-[var(--color-ember)]" role="alert">
                                {message.error}
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <button type="button" onClick={() => retry(index)} disabled={busy} className={textButton}>
                                    <RotateCcw className="h-3.5 w-3.5" /> Try again
                                  </button>
                                </div>
                              </div>
                            )}
                            {message.note && <p className="mt-1.5 text-[11px] text-[var(--color-ink-faint)]">{message.note}</p>}
                            {message.content && !(busy && index === lastIndex) && !message.error && (
                              <div className="mt-1 flex items-center gap-3">
                                <CopyReply text={message.content} />
                                {index === lastIndex && (
                                  <button type="button" onClick={() => retry(index)} disabled={busy} className="flex cursor-pointer items-center gap-1 text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)] disabled:opacity-50">
                                    <RotateCcw className="h-3 w-3" /> Regenerate
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {showFollowUps && (
                  <div className="mt-4 flex flex-wrap gap-2 animate-fade-up">
                    {last.truncated && (
                      <button type="button" onClick={() => void send('Continue', { asked: CONTINUE_PROMPT })} className={cn(textButton, 'border-[var(--color-accent)] text-[var(--color-ink)]')}>
                        Continue the answer
                      </button>
                    )}
                    {FOLLOW_UPS.map((action) => (
                      <button key={action.id} type="button" onClick={() => void send(action.prompt)} className={textButton}>
                        {action.label}
                      </button>
                    ))}
                  </div>
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
        </motion.div>
      )}
    </AnimatePresence>
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
      className="flex cursor-pointer items-center gap-1 text-[11px] text-[var(--color-ink-faint)] hover:text-[var(--color-ink)]"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? 'Copied' : 'Copy answer'}
    </button>
  )
}
