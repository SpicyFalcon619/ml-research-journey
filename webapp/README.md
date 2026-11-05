# Field Guide

A learning site for the lessons in this repo: Python, NumPy, Pandas, scikit-learn and PyTorch, explained for beginners and drawn as one rail map (every track a coloured line, every lesson a stop). It reads the `.py` files directly from the sibling folders, so nothing is duplicated: adding or editing a lesson file is all that's needed for it to show up.

Live at: https://SpicyFalcon619.github.io/ml-research-journey/

Product and design records: [`../PRODUCT.md`](../PRODUCT.md) (who it is for and why) and [`../DESIGN.md`](../DESIGN.md) (the visual system).

## Running locally

```bash
npm install
npm run dev
```

If the page ever goes blank in `npm run dev` after dependencies or files changed, restart the dev server and hard-refresh the tab. In a built site, the app catches a failed page load and shows a "reload" message instead of a blank screen.

## Where lessons live

Every top-level folder except `webapp/` and `Test/` is read automatically (`Test/` is scratch space, on purpose):

- `python tutorial/`, `NumPy_Basics/`, `Pandas_Basics/`, `Classical_ML/`, `Deep_Learning_PyTorch/`

Nothing in `webapp/` needs editing when a `.py` file is added or changed. The path rail, map, track pages and search are built from the file's path, name and content.

- **Title:** the leading docstring, e.g. `"""Pandas Reference: Handling missing data"""` gives "Handling missing data". Without one, the file name is prettified.
- **Order:** the numbers in file and folder names (`4.1_...`, `4.9_.../`, `10_...`) set the order, and a folder sorts among its sibling files by its own number.
- **Sections:** a line like `### Topic 5: Decision Trees ###` starts a section. It feeds the outline, the topic jumps and search.
- **Search tags** come from names plus an API keyword map in `src/lib/content.ts` (`API_KEYWORD_TAGS`); add a line there for a commonly searched API.

## Writing a lesson so it works in the Guided view

Lesson pages have four views: **Guided** (the explanations as readable text, with the code in short pieces), **Full code**, **Bare code** (every comment removed, title docstring kept) and **Original** (the lesson as first written). Guided is built from the `.py` file itself (`src/lib/lesson.ts`), so the explanation lives in the file's comments. A lesson gets the Guided view when it contains a "WHAT YOU WILL LEARN" card.

- Fence a card with `# ====...` lines. First line `# WHAT YOU WILL LEARN` (bullets as `#   - item`) or `# YOUR TURN  (hint text)` (numbered `#   1. item`).
- `### Topic 1: Title ###` starts a section.
- Comment lines at column 0 become prose; indented comments and trailing `# ...` comments stay inside the code, so keep short notes there.
- In prose: `#   - item` and `#   1. item` make lists; indented lines or lines with 3+ spaces in a row stay monospaced (diagrams, tables); a double space inside a line keeps that paragraph's line breaks; `# --- Title -----` is a sub-heading; `# NOTE:`, `# WARNING:` and `# TIP:` become callouts; `` `backticks` `` and `name(...)` calls are shown as code.
- Never write the text `input(` in a comment unless the file really calls it: the capture script treats any mention as an interactive lesson.
- Do not run an auto-formatter (Black, Ruff format) over a lesson. It rewrites single quotes to double quotes, which silently breaks lessons that teach "both kinds of quote make the same string". Check what a comment claims against what the code actually prints.
- **The Original view:** before rewriting a lesson, copy the old file into `src/originals/` using the same folder layout (`src/originals/NumPy_Basics/2_creating_arrays.py`). It is deliberately outside the content folders, so it is not listed as a lesson. A lesson with no file there has no Original tab.

## After adding or editing a lesson: capture its output

The site never runs Python in the browser. Every "Run" shows real, pre-captured output from `src/lib/output-cache.json`, which is **not** regenerated automatically:

```bash
npm run capture-outputs
```

This runs every lesson with a real Python interpreter (`python` or `python3` on the PATH) in an isolated scratch folder and rewrites the whole cache. Re-run it after any change to a lesson's code, even if you already know the output; the site reads only the cache. Then commit the updated JSON with the lesson. The script prints one line per file:

- `ok`: ran and printed something
- `empty`: ran fine and printed nothing
- `error`: a non-zero exit, which is a real bug in the lesson
- `timeout`: still running after 15 seconds (expected only for an intentional infinite loop)
- `interactive`: the file calls `input()`

**A file that calls `input()`** needs example inputs, because the script cannot type for it. Add 2 to 4 realistic cases (for example negative, zero and positive for an `if`) to `INTERACTIVE_SCENARIOS` near the top of `scripts/capture-outputs.mjs`, keyed by the path from the repo root:

```js
'Classical_ML/6_new_file.py': [
  { label: 'Short human-readable label', inputs: ['first input', 'second input'] },
],
```

Without an entry the site shows a "copy this into your own terminal" note instead of real output.

## How search works

`src/lib/search.ts` builds an index over every lesson: titles, section headings, the plain-words explanations, the exercises and the code. Every word you type must appear in the same lesson or section; plurals, synonyms (`dict` finds dictionaries) and one-letter typos are handled, and phrases rank higher. Results show the sentence that matched. If you add a commonly searched alias, add it to `SYNONYMS` in that file.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds this app and publishes it to GitHub Pages (also copying `ml-research-roadmap.html` into the output so it keeps serving at its existing URL). No manual deploy step. The AI assistant's keys come from the repository's Actions secrets (`GROQ_API_KEY`, `GEMINI_API_KEY`); with neither, the assistant is simply switched off.

## Things not to do

- Don't hand-edit `src/lib/output-cache.json`: it is generated by `npm run capture-outputs`.
- Don't add per-file entries to a router, sidebar or manifest. There isn't one, and it would drift from the automatic ingestion.
- Don't write "expected output" by hand: every output shown is real, captured stdout.
- Don't touch `Test/`. `Pandas_Basics/mock_data.csv` is mirrored into the capture script's scratch folder because some lessons load it by a path from the repo root.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Shiki (syntax highlighting, themed per site theme), cmdk (search box), Fuse.js (the "did you mean" fallback), Framer Motion. Type: Barlow and Barlow Condensed, Geist Mono for code.
