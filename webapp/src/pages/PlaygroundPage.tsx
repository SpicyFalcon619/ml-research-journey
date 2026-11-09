import { lazy, Suspense, useState } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { cn } from '@/lib/cn'

// The editor, the Python runner and Pyodide download only when this page is opened.
const LiveRunner = lazy(() => import('@/components/code/LiveRunner'))

const STORAGE_KEY = 'mlfg-playground-code'

const EXAMPLES: { id: string; label: string; code: string }[] = [
  {
    id: 'hello',
    label: 'Hello',
    code: `# Change anything, then press Run (or Ctrl+Enter).
name = "world"
print("Hello,", name)

for number in range(1, 6):
    print(number, "squared is", number ** 2)
`,
  },
  {
    id: 'numpy',
    label: 'NumPy',
    code: `import numpy as np

scores = np.array([72, 88, 95, 61, 79])
print("mean:", scores.mean())
print("above 75:", scores[scores > 75])
print("scaled to 0-1:", (scores - scores.min()) / (scores.max() - scores.min()))
`,
  },
  {
    id: 'pandas',
    label: 'pandas',
    code: `import pandas as pd

table = pd.DataFrame({
    "name": ["Asha", "Ben", "Chen", "Dee"],
    "age": [23, 31, 27, 35],
    "city": ["Dhaka", "Leeds", "Taipei", "Leeds"],
})
print(table)
print()
print(table.groupby("city")["age"].mean())
`,
  },
  {
    id: 'graph',
    label: 'A graph',
    code: `import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2 * np.pi, 100)
plt.plot(x, np.sin(x), label="sin")
plt.plot(x, np.cos(x), label="cos")
plt.legend()
plt.title("Two waves")
plt.show()
`,
  },
  {
    id: 'model',
    label: 'A model',
    code: `from sklearn.linear_model import LinearRegression
import numpy as np

years = np.array([[1], [2], [3], [4], [5]])
salary = np.array([40000, 50000, 60000, 70000, 80000])

model = LinearRegression().fit(years, salary)
print("slope:", model.coef_[0], " intercept:", model.intercept_)
print("prediction for 8 years:", model.predict([[8]])[0])
`,
  },
  {
    id: 'input',
    label: 'input()',
    code: `# input() needs typed text. Type one line per call in the Input box below, then Run.
name = input("What is your name? ")
age = int(input("How old are you? "))
print(f"{name} will be {age + 10} in ten years.")
`,
  },
]

function stored(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function PlaygroundPage() {
  useDocumentTitle('Sandbox')
  const [code, setCode] = useState(() => stored() ?? EXAMPLES[0].code)
  // Picking an example replaces the editor, so it is given a new identity to start fresh.
  const [version, setVersion] = useState(0)

  const remember = (next: string) => {
    setCode(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Not remembering the text is fine.
    }
  }

  const pick = (example: (typeof EXAMPLES)[number]) => {
    remember(example.code)
    setVersion((v) => v + 1)
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-6">
        <h1 className="text-5xl leading-none font-bold text-[var(--color-ink)] sm:text-6xl">Sandbox</h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-dim)]">
          Write your own Python and run it here. It runs in your browser, so nothing you type is sent anywhere. The first run
          downloads Python (about 13 MB, once); after that it is quick.
        </p>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2" role="group" aria-label="Start from an example">
        <span className="text-sm text-[var(--color-ink-faint)]">Start from</span>
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => pick(example)}
            className={cn(
              'min-h-6 cursor-pointer rounded-md border border-[var(--color-border)] px-2.5 py-0.5 text-sm text-[var(--color-ink-dim)] transition-colors',
              'hover:border-[var(--color-border-strong)] hover:text-[var(--color-ink)]',
            )}
          >
            {example.label}
          </button>
        ))}
      </div>

      <div className="guide-code code-font">
        <Suspense fallback={<p className="guide-part-none">Opening the editor...</p>}>
          <LiveRunner
            key={version}
            sessionKey="playground"
            filename="playground.py"
            initialCode={code}
            onCodeChange={remember}
            variant="page"
            label="Python playground editor"
          />
        </Suspense>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-faint)]">
        Included: the standard library, NumPy, pandas, matplotlib and scikit-learn. PyTorch cannot run in a browser; for the
        PyTorch lessons, use the Open in Colab button on each lesson. Press Stop to end a program that never finishes (Python
        restarts and forgets your variables).
      </p>
    </div>
  )
}
