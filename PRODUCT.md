# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, one site.

- **Friends of the owner who are beginners** learning Python, then data science and machine learning. They arrive from a shared link, usually on a laptop or phone, with no idea where to start. Their job: follow the lessons in order, understand each one, try the exercises, and come back tomorrow knowing where they stopped.
- **The owner (a UIU student working toward an AI Engineer career)** returning when they forget something. Their job: find a specific concept fast, see the code and its real output, and mark what they have covered.

## Product Purpose

The Field Guide is a learning journey made public: every lesson from the owner's repo (Python, NumPy, Pandas, scikit-learn, PyTorch) explained for a beginner, shown beside the real output the code produced, searchable, and arranged along a roadmap with the owner's own progress path. Success: a friend who opens it for the first time knows what to do next within seconds, finishes a lesson, and returns to the lesson after it; the owner can find any concept in under ten seconds.

## Positioning

Not a course platform and not documentation. It is one learner's actual notebook, cleaned up so a friend can follow it: every lesson ships its real captured output, the original first-draft code is kept beside the improved version, and the order is the order the owner really learned in. A generic course site could not truthfully copy that provenance.

## Operating Context

- Static site on GitHub Pages (hash routes), built from the `.py` files in the repo; there is no backend. Progress, favourites, preferences and AI chats live in the visitor's browser (localStorage) only.
- Lesson output is pre-captured by a script, never executed in the browser.
- The owner maintains it by committing `.py` lessons and running the capture script.
- The "Ask AI" assistant calls Groq or Gemini with a key baked in at build time.

## Capabilities and Constraints

- 85 lessons in five tracks: Python Tutorial, NumPy Basics, Pandas Basics, Classical ML, PyTorch. More are added as the owner learns.
- Each guided lesson has views: Guided (prose + code chunks), Full code, Bare code (comments stripped), Original (first version). The Run output panel is resizable.
- Features that must survive: search and command palette, roadmap and progress tracking (done, saved, streak, recently opened), Ask AI, the screenshot capture tool, per-device preferences, export/import of data.
- Seven themes are fixed brand commitments and must keep working on every surface: Aurora (default dark), Vesper, Quiet Light, Midnight, Paper, Terminal, Expedition, plus System.
- Tooling constraint: Vite, React, TypeScript, Tailwind v4, Shiki; no new backend; must keep deploying through the existing GitHub Actions pipeline.

## Brand Commitments

- Voice: the owner's journey, shared. First person and honest about being a learner ("how I learned it"), written so a stranger can follow. Not a neutral textbook, not a private diary.
- The seven themes (above) are kept as-is.
- No decorative emojis anywhere in the interface (owner's standing rule). Use line icons, typographic marks, or numbers.

## Evidence on Hand

- 85 real lessons with captured output; the live site; the owner's roadmap (`ROADMAP.md`, parsed by the site) with basecamps and checklist steps.
- Absent, and not to be invented: testimonials, learner counts, completion rates, course pricing, certificates.

## Product Principles

1. **Always answer "what next?"** A first-time friend and a returning learner should both see their next lesson before anything else.
2. **Lessons are the product.** Reading, running and trying a lesson comes before browsing chrome, dashboards or stats.
3. **Real beats claimed.** Show the actual output, the actual progress, the actual first-draft code; never decorative numbers.
4. **Findable in seconds.** Any concept reachable by search or a short path; the structure of the roadmap is visible, not hidden in menus.
5. **Honest about being one learner's path.** Warm and first-person, without pretending to be an institution.

## Accessibility & Inclusion

- Keep text contrast readable in every theme, support keyboard use, and respect reduced-motion. Beginners may be on small phones and slow connections: the site must work at 390px wide and stay light.
