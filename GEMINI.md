# ML Research — Field Guide maintenance context

This repo is a personal ML learning journal. `webapp/` is a Vite + React site
("Field Guide") that auto-parses every `.py` lesson file in this repo and makes
it browsable/searchable with real, pre-captured code output. This file tells
you exactly what to do whenever a lesson file is added or completed, so the
site stays in sync without any manual sidebar/router/content editing.

## Content folders (the only places lesson files live)

- `python tutorial/`
- `NumPy_Basics/`
- `Pandas_Basics/`
- `Classical_ML/`

The webapp reads these four folders directly via `import.meta.glob` in
`webapp/src/lib/content.ts` — **nothing in `webapp/` needs to be edited** when
a new `.py` file is added or an existing one is changed. Sidebar grouping,
search indexing, and routing are 100% automatic from the file's path/name/content.

## What each new/edited file's metadata comes from

- **Title**: parsed from a leading docstring, e.g. `"""Pandas Reference: Handling missing data"""`
  → title becomes "Handling missing data". If there's no docstring, the
  filename is prettified instead (numeric prefix stripped, `_`/`.` → spaces,
  title-cased) — so a docstring is nice-to-have, not required.
- **Sub-topics within one file**: mark them with a line like
  `### Topic 5: Decision Trees ###` (2+ `#` on each side). Each marker becomes
  a jump-to-line search hit. Not required for short single-concept files.
- **Ordering**: leading numeric prefix in the filename (`4_`, `4.9.6_`) controls
  sort order within its folder — keep using that convention for new files.
- **Search tags**: automatic, derived from folder/file names plus an API
  keyword map in `content.ts` (e.g. `train_test_split`, `DecisionTreeClassifier`
  → "train test split", `LinearRegression` → "linear regression sklearn"). If
  you add a new commonly-searched API, add a line to `API_KEYWORD_TAGS` in
  `webapp/src/lib/content.ts`; not required for the file to show up, only for
  extra search recall.

## The one required step after adding/editing a lesson file: capture its output

The site never executes Python in the browser — every "Run" button shows real,
pre-captured stdout from `webapp/src/lib/output-cache.json`. That cache is
**not** regenerated automatically; you must run the capture script yourself
after any `.py` file is added or its code changes:

```bash
cd webapp
npm run capture-outputs
```

This runs `webapp/scripts/capture-outputs.mjs`, which executes every lesson
file with a real Python interpreter (`python`/`python3` on PATH) in an isolated
scratch directory and writes fresh `{status, stdout, stderr, durationMs,
capturedAt}` entries into `output-cache.json` for every file — safe to re-run
anytime, it always regenerates the whole cache from scratch.

Do this **every time**, even for a file whose output you already know by
running it manually — the site reads only from `output-cache.json`, so a
file with no entry (or a stale one) will not show the right "Run" output.

### If the new file calls `input()`

The capture script can't feed arbitrary text to `input()` calls, so it needs a
few hand-picked example input sequences registered *before* you run it. Add an
entry to `INTERACTIVE_SCENARIOS` near the top of
`webapp/scripts/capture-outputs.mjs`, keyed by the file's path relative to the
repo root (forward slashes, e.g. `"Classical_ML/6_new_file.py"`):

```js
const INTERACTIVE_SCENARIOS = {
  'Classical_ML/6_new_file.py': [
    { label: 'Short human-readable label', inputs: ['first input()', 'second input()'] },
    { label: 'Another realistic case', inputs: ['...'] },
  ],
  // ...existing entries...
}
```

Then run `npm run capture-outputs` as above. Without an entry there, a file
that calls `input()` just gets `status: "interactive"` with zero scenarios,
and the site shows a "copy this into your own terminal" note instead of real
output — always add at least 2-4 realistic scenarios covering the interesting
branches (e.g. a negative/zero/positive case for an `if`, or a bad-then-good
input for an exception-handling example).

### Reading capture results

After running the script, it prints one line per file: `ok` (has stdout),
`empty` (ran fine, printed nothing), `error` (non-zero exit / exception),
`timeout` (still running after 15s — e.g. an infinite loop exercise, this is
expected for some intentionally-unfinished practice files, not a bug to fix),
or `interactive` (has an `input()` scenario list). Skim this output — if a
brand-new file shows `error` unexpectedly, that's a real bug in the lesson
code, not a capture-script problem.

## Committing and deploying

Once `output-cache.json` is updated:

1. `git add` the new/edited `.py` file(s) **and** `webapp/src/lib/output-cache.json`
   (and `webapp/scripts/capture-outputs.mjs` if you added interactive scenarios).
2. Commit and push to `master`.
3. Pushing to `master` alone triggers `.github/workflows/deploy.yml`, which
   builds the webapp and publishes it to GitHub Pages automatically — no
   manual deploy step, no other files need touching.

Always confirm with the user before pushing — don't push autonomously.

## Things to never do here

- Don't hand-edit `webapp/src/lib/output-cache.json` — it's a generated
  artifact, always produced by `npm run capture-outputs`.
- Don't add per-file entries to the router, sidebar, or any manifest — there
  isn't one; it would be redundant with the automatic glob-based ingestion
  and would drift out of sync.
- Don't invent fabricated "expected output" for a file — the whole point of
  this system is that every shown output is real, captured stdout from
  actually running the code.
- Don't touch `Test/` or `mock_data.csv` conventions — `Test/` is excluded
  from ingestion on purpose (scratch space), and `Pandas_Basics/mock_data.csv`
  is mirrored into the capture script's scratch dir because some lessons load
  it via a repo-root-relative path.

See `webapp/README.md` for the human-facing version of this same workflow.
