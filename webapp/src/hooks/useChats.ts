import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadChats, newChatId, saveChats, titleFor, type Chat, type ChatStore, type Msg } from '@/lib/chats'

// The assistant's conversations: which one is open, and every message in each. Changes are
// written to local storage a moment after they stop (answers arrive token by token), and
// straight away when the page is closed.
export function useChats() {
  const [store, setStore] = useState<ChatStore>(loadChats)
  const storeRef = useRef(store)
  storeRef.current = store

  useEffect(() => {
    const timer = window.setTimeout(() => saveChats(store), 500)
    return () => window.clearTimeout(timer)
  }, [store])

  useEffect(() => {
    const flush = () => saveChats(storeRef.current)
    window.addEventListener('pagehide', flush)
    return () => window.removeEventListener('pagehide', flush)
  }, [])

  const active = useMemo<Chat | undefined>(() => store.chats.find((c) => c.id === store.active), [store])

  /** Opens a fresh conversation and returns its id (used when the first question is sent). */
  const startChat = useCallback((firstQuestion: string): string => {
    const id = newChatId()
    setStore((prev) => ({ active: id, chats: [{ id, title: titleFor(firstQuestion), updatedAt: Date.now(), messages: [] }, ...prev.chats] }))
    return id
  }, [])

  const updateMessages = useCallback((chatId: string, change: (messages: Msg[]) => Msg[]) => {
    setStore((prev) => ({
      ...prev,
      chats: prev.chats.map((c) => (c.id === chatId ? { ...c, messages: change(c.messages), updatedAt: Date.now() } : c)),
    }))
  }, [])

  const patchMessage = useCallback(
    (chatId: string, messageId: number, patch: Partial<Msg> | ((m: Msg) => Partial<Msg>)) =>
      updateMessages(chatId, (messages) => messages.map((m) => (m.id === messageId ? { ...m, ...(typeof patch === 'function' ? patch(m) : patch) } : m))),
    [updateMessages],
  )

  const newChat = useCallback(() => setStore((prev) => ({ ...prev, active: null })), [])
  const openChat = useCallback((id: string) => setStore((prev) => ({ ...prev, active: id })), [])
  const deleteChat = useCallback(
    (id: string) => setStore((prev) => ({ active: prev.active === id ? null : prev.active, chats: prev.chats.filter((c) => c.id !== id) })),
    [],
  )
  const clearAll = useCallback(() => setStore({ active: null, chats: [] }), [])

  // Ids for new messages continue after the highest one already stored.
  const nextId = useRef(0)
  if (nextId.current === 0) nextId.current = store.chats.reduce((max, c) => c.messages.reduce((m, x) => Math.max(m, x.id), max), 0) + 1
  const makeId = useCallback(() => nextId.current++, [])

  return { chats: store.chats, active, messages: active?.messages ?? [], startChat, updateMessages, patchMessage, newChat, openChat, deleteChat, clearAll, makeId }
}
