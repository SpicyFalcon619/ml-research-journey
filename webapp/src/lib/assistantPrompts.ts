import type { Snippet } from '@/types'
import { getOutput } from '@/lib/outputs'
import { siteMap } from '@/lib/siteIndex'
import { getAdjacent } from '@/lib/roadmap'
import { nextUpLesson, overallProgress, trackProgress } from '@/lib/progress'
import type { ChatMessage } from '@/lib/llm'

// The free plan allows roughly 8K tokens a minute, so what is sent is capped: about 1.5K
// tokens of code, a little output, and only the most recent turns of the conversation.
const MAX_CODE_CHARS = 4500
const MAX_OUTPUT_CHARS = 1500
const MAX_HISTORY_MESSAGES = 8
const MAX_HISTORY_CHARS = 9000

const SYSTEM = `You are the study assistant inside "Field Guide", a personal reference of working code from someone's machine learning journey: Python basics, NumPy, Pandas, scikit-learn and PyTorch. Each lesson is a real, runnable file.
Answer accurately and in plain language, the way a patient tutor would. If you are not sure, say so instead of guessing. Only refer to the lesson below when the question is about it. Do not make up facts about the learner.

How to answer: lead with the direct answer in a sentence or two, then explain why it works, then show a small runnable example when code helps, and finish with one practical tip or a common pitfall when there is a useful one. Be thorough where the question needs it and brief where it doesn't; use a short heading only for long answers. When someone asks what to do or learn next, start from their real progress below: say briefly what they have already finished, then recommend the next step, preferring to carry on from the lesson they opened last. When you point someone to a lesson in this guide, write its exact title from the list below in **bold** (it becomes a link), and only name lessons that are in that list.

About the site, which is everything you know about it:
- It is a personal project: its owner keeps their own working code from learning machine learning here, in the order they learned it, and has made it public. It is not a course, a book or a company product, and it has no instructor, exercises or certificates.
- Every lesson shows the code beside the real output it produced when it was run. Lessons can be searched (Ctrl+K), browsed on the Explore page, marked done or saved, and shown as an image with "Capture". "Your progress" shows progress, which is kept in the visitor's own browser. There is also a separate roadmap page.
- The lessons are plain Python (.py) files, not notebooks. A lesson is code with comments and its real output; there are no written chapters, exercises or quizzes. The Python Tutorial track works through the official Python tutorial's examples, and the PyTorch track is still in progress.
- Progress, saved lessons and settings live only in the visitor's own browser, not on a server or in the repository. "Your progress" can export them to a file and import that file in another browser or on another device.
- The code is public at the GitHub repository SpicyFalcon619/ml-research-journey. That repository has no license file, so do not call it open source or say it can be reused without restrictions; say it is public and that reuse is a question for its owner.
- If someone asks whether they should use the site, be honest and balanced rather than promotional: it suits people who learn from working code and want a reference beside a course, and it is not a full course with explanations, exercises or an instructor. Say what it does not have, and ask what they want to achieve if that changes the answer.
- You do not know the owner's name or anything else about them. If asked who made the site or who it is for, say it is a personal learning reference by its owner (see the repository above), useful to anyone who likes learning from working code, and that you can't say more. Never invent names, credentials or facts about the site or its author.`

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}\n... (cut off to keep this short)` : text
}

function numbered(code: string): string {
  return code
    .split('\n')
    .map((line, index) => `${index + 1} ${line}`)
    .join('\n')
}

function lessonContext(snippet: Snippet): string {
  const output = getOutput(snippet.path)
  const printed = output && output.status !== 'empty' ? output.stdout || output.stderr : ''
  return [
    `The learner is looking at this lesson: "${snippet.title}" (${snippet.filename}) in the track "${snippet.categoryLabel}".`,
    // Numbered, so the model can say "line 12" and the learner can find it in the lesson.
    `Code (each line starts with its line number; refer to lines as "line N"):\n\`\`\`\n${clip(numbered(snippet.code), MAX_CODE_CHARS)}\n\`\`\``,
    printed ? `Output it produced:\n\`\`\`\n${clip(printed, MAX_OUTPUT_CHARS)}\n\`\`\`` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

function progressContext(done: string[], recent: Snippet[]): string {
  const overall = overallProgress(done)
  const next = nextUpLesson(done)
  const progress = trackProgress(done)
  const tracks = progress.map((t) => `${t.label} ${t.done}/${t.total}`).join(', ')
  const finished = progress.filter((t) => t.total > 0 && t.done === t.total).map((t) => t.label)
  const underway = progress.filter((t) => t.done > 0 && t.done < t.total).map((t) => t.label)
  const untouched = progress.filter((t) => t.done === 0).map((t) => t.label)
  // The lesson after the one they opened last, if they haven't done it: "carry on from where you were".
  const latest = recent[0]
  const carryOn = latest ? getAdjacent(latest.id).next : undefined
  return [
    `The learner's real progress, which you must use exactly as given: ${overall.done} of ${overall.total} lessons finished (${tracks}).`,
    overall.done > 0
      ? `Finished tracks: ${finished.join(', ') || 'none'}. Tracks in progress: ${underway.join(', ') || 'none'}. Tracks not started: ${untouched.join(', ') || 'none'}.`
      : 'They have not finished any lesson yet.',
    next ? `The first unfinished lesson on the trail is "${next.title}" (${next.categoryLabel}).` : 'They have finished every lesson.',
    recent.length ? `Lessons they opened most recently, newest first: ${recent.map((s) => `"${s.title}"`).join(', ')}.` : '',
    carryOn && !done.includes(carryOn.id) ? `The lesson that follows their latest one is "${carryOn.title}".` : '',
    'Never say they have not started or finished lessons when the numbers above say otherwise.',
  ]
    .filter(Boolean)
    .join(' ')
}

export function buildMessages(history: ChatMessage[], lesson: Snippet | undefined, done: string[], recent: Snippet[] = []): ChatMessage[] {
  const system = [SYSTEM, siteMap(), progressContext(done, recent), lesson ? lessonContext(lesson) : ''].filter(Boolean).join('\n\n')
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
  { id: 'related', label: 'Related lessons', prompt: 'Which other lessons in this guide relate to this one, and how? Name two or three, and say what I would gain from each.' },
  { id: 'next', label: 'What next?', prompt: 'Based on this lesson, what should I practise or learn next? Give two or three concrete suggestions.' },
]

export const GENERAL_ACTIONS: QuickAction[] = [
  { id: 'next', label: 'What should I learn next?', prompt: 'Given my progress, what should I learn next, and why? Keep it short.' },
  { id: 'plan', label: 'A one-week study plan', prompt: 'Make me a realistic one-week study plan for the rest of this guide, day by day, based on my progress.' },
  { id: 'find', label: 'Find a lesson', prompt: 'Help me find the right lesson in this guide. Ask what I want to learn, then point me to the best lessons for it, in the order to read them.' },
  { id: 'concept', label: 'Explain a concept', prompt: 'I want to understand a concept. Ask me which one, and then explain it simply with a small example.' },
  { id: 'debug', label: 'Help with my code', prompt: 'I will paste some code and an error. Ask me for them, then help me find the problem.' },
]

/** Short buttons shown under the latest answer. */
export const FOLLOW_UPS: QuickAction[] = [
  { id: 'example', label: 'Give an example', prompt: 'Give a short, concrete example of that I can run.' },
  { id: 'simpler', label: 'Explain more simply', prompt: 'Explain that again more simply, as if I am new to it.' },
  { id: 'deeper', label: 'Go deeper', prompt: 'Go deeper: explain the details and the edge cases.' },
  { id: 'quiz', label: 'Quiz me on this', prompt: 'Quiz me on that with 2 short questions, without the answers.' },
]

export const CONTINUE_PROMPT = 'Your last answer was cut off. Continue from exactly where it stopped, without repeating what you already wrote.'

/** A question about a piece of code the visitor highlighted on the page. */
export const askAboutSelection = (text: string): string =>
  `Explain this part of the code, and why it is written this way:\n\`\`\`\n${text.slice(0, 2500)}\n\`\`\``

// Longest question accepted, so one huge paste can't use up the free plan's token allowance.
export const MAX_QUESTION_CHARS = 6000
