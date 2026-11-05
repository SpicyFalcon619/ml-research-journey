# Field Guide

A learning site for the lessons in this repo: Python, NumPy, Pandas, scikit-learn and PyTorch, explained for beginners and drawn as one rail map (every track a coloured line, every lesson a stop). It reads the `.py` files directly from the sibling folders (`../python tutorial`, `../NumPy_Basics`, `../Pandas_Basics`, `../Classical_ML`, `../Deep_Learning_PyTorch`). Nothing is duplicated, so adding or editing a lesson file is all that's needed for it to show up.

Live at: https://SpicyFalcon619.github.io/ml-research-journey/

Product and design records: [`../PRODUCT.md`](../PRODUCT.md) (who it is for and why) and [`../DESIGN.md`](../DESIGN.md) (the visual system).

## Running locally

```bash
npm install
npm run dev
```

If the page ever goes blank in `npm run dev` after dependencies or files changed, restart the dev server and hard-refresh the tab. In a built site, the app catches a failed page load and shows a "reload" message instead of a blank screen.

## Adding or updating a lesson

- **Path, map, track pages, search** are fully automatic. Save the `.py` file in one of the content folders; the dev server picks it up, and it's included in every build. Lessons are ordered by the numbers in their file and folder names (`4.1_...`, `4.9_.../`, `10_...`).
- **Writing the lesson** so it shows in the Guided view: see the "Writing a lesson so it works in the Guided view" section of [`../GEMINI.md`](../GEMINI.md) (a "What you will learn" card, `### Topic N: Title ###` sections, prose in column-0 comments, a "Your turn" card).
- **The "Run" output** is pre-captured, never executed in the browser. After adding or editing a file:
  ```bash
  npm run capture-outputs
  ```
  This runs every lesson with Python and caches real stdout/stderr into `src/lib/output-cache.json`. Safe to re-run anytime; commit the updated JSON afterward.
- **A file that calls `input()`** needs example inputs in `INTERACTIVE_SCENARIOS` in `scripts/capture-outputs.mjs`; without them the site shows a "copy this into your own terminal" note.
- **The Original view** shows a lesson's first version. Before rewriting a lesson, copy the old file into `src/originals/` using the same folder layout.

## How search works

`src/lib/search.ts` builds an index over every lesson: titles, section headings, the plain-words explanations, the exercises and the code. Every word you type must appear in the same lesson or section; plurals, synonyms (`dict` finds dictionaries) and one-letter typos are handled, and phrases rank higher. Results show the sentence that matched. If you add a commonly searched alias, add it to `SYNONYMS` in that file.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds this app and publishes it to GitHub Pages (also copying `ml-research-roadmap.html` into the output so it keeps serving at its existing URL). No manual deploy step.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Shiki (syntax highlighting, themed per site theme), cmdk (search box), Fuse.js (the "did you mean" fallback), Framer Motion. Type: Barlow and Barlow Condensed, Geist Mono for code.
