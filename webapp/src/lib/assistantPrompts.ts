import type { Snippet } from '@/types'
import { getOutput } from '@/lib/outputs'
import { navGroups } from '@/lib/roadmap'
import { nextUpLesson, overallProgress } from '@/lib/progress'
import type { ChatMessage } from '@/lib/groq'

// The free plan allows roughly 8K tokens a minute, so what is sent is capped: about 1.5K
// tokens of code, a little output, and only the most recent turns of the conversation.
const MAX_CODE_CHARS = 6000
const MAX_OUTPUT_CHARS = 1500
const MAX_HISTORY_MESSAGES = 8
const MAX_HISTORY_CHARS = 9000

const SYSTEM = `You are the study assistant inside "Field Guide", a personal reference of working code from someone's machine learning journey: Python basics, NumPy, Pandas, scikit-learn and PyTorch. Each lesson is a real, runnable file.
Answer accurately and in plain language, the way a patient tutor would. Keep answers short unless asked for more, and use small code blocks when code helps. If you are not sure, say so instead of guessing. Only refer to the lesson below when the question is about it. Do not make up facts about the learner.`

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\n... (cut off to keep this short)` : text
}

function lessonContext(snippet: Snippet): string {
  const output = getOutput(snippet.path)
  const printed = output && output.status !== 'empty' ? output.stdout || output.stderr : ''
  return [
    `The learner is looking at this lesson: "${snippet.title}" (${snippet.filename}) in the track "${snippet.categoryLabel}".`,
    `Code:\n\`\`\`\n${clip(snippet.code, MAX_CODE_CHARS)}\n\`\`\``,
    printed ? `Output it produced:\n\`\`\`\n${clip(printed, MAX_OUTPUT_CHARS)}\n\`\`\`` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function progressContext(done: string[]): string {
  const overall = overallProgress(done)
  const next = nextUpLesson(done)
  const tracks = navGroups.flatMap((g) => g.categories.map((c) => c.label)).join(', ')
  return `Guide tracks, in order: ${tracks}. The learner has finished ${overall.done} of ${overall.total} lessons.${next ? ` The next lesson on the trail is "${next.title}" (${next.categoryLabel}).` : ''}`
}

export function buildMessages(history: ChatMessage[], lesson: Snippet | undefined, done: string[]): ChatMessage[] {
  const system = [SYSTEM, progressContext(done), lesson ? lessonContext(lesson) : ''].filter(Boolean).join('\n\n')
  // Newest messages first until the budget is used, then restore the order.
  const kept: ChatMessage[] = []
  let used = 0
  for (const message of [...history].reverse().slice(0, MAX_HISTORY_MESSAGES)) {
    used += message.content.length
    if (used > MAX_HISTORY_CHARS && kept.length > 0) break
    kept.unshift(message)
  }
  return [{ role: 'system', content: system }, ...kept]
}

export interface QuickAction {
  id: string
  label: string
  prompt: string
}

export const LESSON_ACTIONS: QuickAction[] = [
  { id: 'explain', label: 'Explain this lesson', prompt: 'Explain this lesson step by step: what each part of the code does and why it is written that way.' },
  { id: 'output', label: 'Explain the output', prompt: 'Explain the output this code produced and how each part of it comes from the code.' },
  { id: 'quiz', label: 'Quiz me', prompt: 'Ask me 3 short questions about this lesson, numbered, without the answers. I will reply and you can check them.' },
  { id: 'simple', label: 'Make it simpler', prompt: 'Explain the main idea of this lesson as if I am new to programming, with one everyday analogy.' },
  { id: 'mistakes', label: 'Common mistakes', prompt: 'What are the common mistakes and gotchas with the ideas and code in this lesson?' },
  { id: 'next', label: 'What next?', prompt: 'Based on this lesson, what should I practise or learn next? Give two or three concrete suggestions.' },
]

export const GENERAL_ACTIONS: QuickAction[] = [
  { id: 'next', label: 'What should I learn next?', prompt: 'Given my progress, what should I learn next, and why? Keep it short.' },
  { id: 'plan', label: 'A one-week study plan', prompt: 'Make me a realistic one-week study plan for the rest of this guide, day by day, based on my progress.' },
  { id: 'concept', label: 'Explain a concept', prompt: 'I want to understand a concept. Ask me which one, and then explain it simply with a small example.' },
  { id: 'debug', label: 'Help with my code', prompt: 'I will paste some code and an error. Ask me for them, then help me find the problem.' },
]
