# Field Guide

A searchable personal reference site for the Python/NumPy/Pandas/scikit-learn snippets in this repo. It reads the `.py` files directly from the sibling folders (`../NumPy_Basics`, `../Pandas_Basics`, `../Classical_ML`, `../python tutorial`) — nothing is duplicated here, so adding or editing a lesson file elsewhere in the repo is all that's needed for it to show up.

Live at: https://SpicyFalcon619.github.io/ml-research-journey/

## Running locally

```bash
npm install
npm run dev
```

## Adding or updating a lesson

- **Sidebar, search, categorization** — fully automatic. Just save the `.py` file in one of the four content folders; the dev server picks it up immediately, and it's included in every build.
- **The "Run" button's output** — pre-captured, not executed live in the browser. After adding or editing a file, refresh it:
  ```bash
  npm run capture-outputs
  ```
  This actually runs every lesson with Python and caches real stdout/stderr into `src/lib/output-cache.json`. Safe to re-run anytime; commit the updated JSON afterward.
- **A file that calls `input()`** — the capture script can't feed it arbitrary text, so add a few example input sequences to `INTERACTIVE_SCENARIOS` in `scripts/capture-outputs.mjs`, then re-run the script. Without an entry there, the site just shows a "copy this into your own terminal" note for that file.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds this app and publishes it to GitHub Pages (also copying `ml-research-roadmap.html` into the output so it keeps serving at its existing URL). No manual deploy step.

## Stack

Vite + React + TypeScript, Tailwind CSS v4, Shiki (syntax highlighting, themed per site theme), Fuse.js + cmdk (search/command palette), Framer Motion.
