---
name: Field Guide
description: One learner's real path through Python, data science and machine learning, drawn as a rail map where every track is a coloured line and every lesson a stop.
colors:
  aurora-bg: "#08080d"
  aurora-bg-elevated: "#0e0e17"
  aurora-ink: "#edeef2"
  aurora-ink-dim: "#9a9aa8"
  aurora-ink-faint: "#8a8a94"
  aurora-accent: "#8b8ff7"
  aurora-accent-soft: "#b7b9fb"
  aurora-accent-ink: "#0a0a10"
  aurora-ember: "#f2a65a"
  aurora-code-bg: "#1b1e28"
  vesper-accent: "#ffc799"
  quiet-light-accent: "#705697"
  midnight-accent: "#5ccfe6"
  paper-accent: "#b4532a"
  terminal-accent: "#4ade80"
  expedition-accent: "#d2a14e"
  line-1-fallback: "#8b8ff7"
  line-2-fallback: "#e57fb0"
  line-3-fallback: "#f2a65a"
  line-4-fallback: "#5fd0a5"
  line-5-fallback: "#6fb3ff"
typography:
  display:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.005em"
  title:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9688rem"
    fontWeight: 600
    lineHeight: 1.5
  body:
    fontFamily: "Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  label-plate:
    fontFamily: "Barlow Condensed, Barlow, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.07em"
  code:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.625
rounded:
  xs: "1px"
  sm: "2px"
  md: "3px"
  lg: "4px"
  xl: "5px"
  2xl: "6px"
  3xl: "8px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.25rem"
  xl: "4rem"
components:
  plate:
    backgroundColor: "{colors.aurora-accent}"
    textColor: "{colors.aurora-accent-ink}"
    typography: "{typography.label-plate}"
    rounded: "{rounded.md}"
    padding: "0.55rem 1rem"
  line-stripe:
    height: "4px"
  guide-card:
    backgroundColor: "{colors.aurora-bg-elevated}"
    textColor: "{colors.aurora-ink}"
    rounded: "{rounded.lg}"
    padding: "1.1rem 1.3rem"
  code-panel:
    backgroundColor: "{colors.aurora-code-bg}"
    rounded: "{rounded.lg}"
  topic-stop:
    backgroundColor: "{colors.aurora-bg}"
    textColor: "{colors.aurora-ink}"
    rounded: "999px"
    size: "1.9rem"
---

# Design System: Field Guide

## Overview

**Creative North Star: "The Rail Map"**

The whole guide is one transit diagram. Every track (Python, NumPy, Pandas, Classical ML, PyTorch) is a coloured line, every lesson is a stop, and the learner can always see where they are. Surfaces are quiet and dark-first; the colour is carried by the lines, not by the chrome. Signage is the reference material: condensed station-board headings, square plates, thick-ringed stops, a single five-colour stripe.

Density is calm and reading-led. Lesson prose sits in a 44rem measure beside short code chunks and their real captured output. The seven themes (Aurora default, Vesper, Quiet Light, Midnight, Paper, Terminal, Expedition) are fixed palettes the learner chooses between; the Metro world is layered on top of whichever is active and never replaces it.

The system rejects the centred-hero, feature-column, card-grid and doc-site-tree defaults. Page-level composition belongs to each surface; this file records only what is reused.

**Key Characteristics:**
- Five line colours derived per theme from that theme's own accent; no separate line palette to maintain.
- Condensed sign face for headings and labels, humanist sans for reading, mono for code only.
- Square sign plates: the whole radius scale is capped at 8px, 3-4px typical.
- One primary action per page, the plate.
- One signature: the 4px five-colour stripe under the top bar.
- Seven themes, each with its own quiet background texture (switchable off).

## Colors

A theme-driven palette: near-neutral grounds, one accent per theme, and five line colours rotated out of that accent.

### Primary
- **Aurora Indigo** (#8b8ff7): the default theme's accent. Carries the plate, focus ring, selection, link emphasis and line 1. Each other theme swaps in its own accent: Vesper Peach (#ffc799), Quiet Light Violet (#705697), Midnight Cyan (#5ccfe6), Paper Terracotta (#b4532a), Terminal Phosphor (#4ade80), Expedition Gold (#d2a14e). Always read it as `--color-accent`, never hard-code.

### Secondary
- **Line 2 to Line 5** (oklch relative colour of the active accent, hue +72, +144, +216, +288 degrees; same lightness and chroma): the other four tracks. Browsers without relative colour syntax fall back to fixed values (#e57fb0, #f2a65a, #5fd0a5, #6fb3ff, recorded in the frontmatter as line fallbacks). Track index modulo five picks the line.

### Tertiary
- **Ember** (#f2a65a in Aurora; per-theme counterpoint): a rare warm second voice for warnings and highlights. Not a line colour.

### Neutral
- **Aurora Night** (#08080d): page ground; `--color-bg`. Elevated panels use #0e0e17.
- **Aurora Ink** (#edeef2), **Ink Dim** (#9a9aa8), **Ink Faint** (#8a8a94): three text tiers. Faint is for metadata only; in light themes the tiers are darkened so they stay legible.
- **Hairline** (white at 9% alpha, strong at 16%): borders and dividers. Surfaces are white at 4.5% alpha over the ground.
- **Code Slate** (#1b1e28): code panels follow the theme but use their own `--color-code-*` pairing, matching the syntax theme.

### Named Rules
**The Derived Line Rule.** Line colours are always computed from the active theme's accent. Never introduce a sixth colour or a hand-picked line palette for a new theme; set `--color-accent` and the lines follow.

**The Plate Is The Only Loud Thing Rule.** Accent fill appears on one plate per view. Lines and stops carry colour elsewhere; accent is otherwise used as ring, link tint and a 7% callout wash.

## Typography

**Display Font:** Barlow Condensed (with Barlow, system sans)
**Body Font:** Barlow (with system sans)
**Label/Mono Font:** Geist Mono (JetBrains Mono under Expedition), code and output only

**Character:** A condensed transit-sign face over a friendly, readable sans. Expedition alone swaps h1-h3 to Fraunces (weight 500) as its roadmap serif.

### Hierarchy
- **Display** (700, 3rem to 4.5rem, 0.95): the home headline.
- **Headline** (700, 1.5rem to 1.75rem, 1.15): lesson topic titles and page headings, in the sign face.
- **Title** (600, 0.97rem to 1.25rem): card titles, sidebar group names.
- **Body** (400, 1.0625rem base; lesson prose 0.97rem at 1.75, max 44rem): reading text.
- **Label** (Barlow Condensed 700, 0.07em to 0.1em tracking, uppercase): plate text and map line names only, set as functional signage on the map, not as section lead-ins.
- **Code** (Geist Mono 400, 13px default, user-adjustable via `--code-font-size`, ligatures off): all code and output.

### Named Rules
**The Sign Face Rule.** Condensed type is for names of things (stops, lines, plates), never for paragraphs.

**The No Ligatures Rule.** Mono text renders exact characters; ligatures and contextual alternates are disabled everywhere.

## Layout

Home content centres in a 5xl (64rem) column; a path rail (Sidebar) lists the journey on laptop widths and becomes a drawer on phones. Lesson prose caps at 44rem. The map is a serpentine SVG that spans the column; a tick rail (one thin tick per lesson across all 80) shows position at any width. Rhythm uses a rem scale of roughly 0.5, 1, 1.5, 2.25 and 4 with generous vertical space between sections (2rem to 4rem) separated by hairline rules rather than boxes. Side-by-side layouts require both width and height (the `wide` variant: min 48rem wide and 34rem tall) so a phone held sideways stays single-column. Below 40rem, the lesson line and topic stops tighten toward the edge.

## Elevation & Depth

Predominantly flat and tonal: depth comes from translucent surface tints, hairline borders and the page-colour solid bar. The only shadow tokens are a faint inset-highlight glass shadow (`--shadow-glass`) and the code-panel equivalent (`--shadow-code`), both soft and ambient. The plate lifts 1px on hover with a brightness bump; nothing else moves.

### Named Rules
**The Flat Plate Rule.** Plates, stops and cards never take drop shadows of their own. Depth is a tint and a border.

## Shapes

Square sign plates. The Tailwind radius scale is overridden globally to 1, 2, 3, 4, 5, 6 and 8px, so even "rounded-lg" yields 4px. Plates are 3px; cards and code panels 4px; inline code 0.3rem. Circles are reserved for stops and the lesson-topic numbers (999px). Map lines are 8px wide with round caps; the lesson's own line is a 4px bar. Stops are thick-ringed circles: ordinary stop radius 6 (3px ring), the current stop 8, interchanges 9 with an ink-coloured ring; a finished stop is filled in its line colour, an unfinished one is filled with the page ground. The next stop gets a pulsing outer ring (off under reduced motion).

## Components

### Plate (primary action)
- **Shape:** 3px corners; padding 0.55rem 1rem; inline-flex with 0.5rem gap and an arrow icon.
- **Primary:** accent fill, theme accent-ink text, Barlow Condensed 700 at 1.1rem, 0.07em tracking, uppercase.
- **Hover / Focus:** lifts 1px and brightens 8% over 150ms; returns on press. Keyboard focus uses a 2px accent outline offset 2px.
- Used once per page ("Start learning", "Keep reading", finish-lesson next).

### Quiet link
- Inline text button in Ink Dim, underlined with the strong hairline, offset 4px, brightening to Ink on hover. Secondary actions (find a concept, ask the AI) sit beside the plate in this style.

### Top bar and line stripe
- Page-ground bar at 85% with blur and a bottom hairline; brand mark, Explore / Progress / Roadmap links (active gets a surface-hover wash), a search field, theme and repository controls. The 4px five-colour `line-stripe` sits on its bottom edge. On lesson pages the bar scrolls away.

### Stops and map
- The serpentine journey map: lines in line colours, name labels in the sign face, a legend that isolates one line on hover, an ink tag on the next stop. Short end-cap bars mark terminals.

### Tick rail
- A strip of 1px-radius ticks, 10px tall, the current one 20px tall in ink; finished ticks take their line colour, unfinished ones a 16% ink tint.

### Sidebar path
- 13px lesson rows, small ringed dots on a left spine; the current row has an ink ring with a line-coloured glow. Group rows show done/total counts in tabular figures.

### Guided lesson
- Numbered topics hang on the lesson's own 4px line: each topic number is a 1.9rem ring (3.5px border in the stop colour) on the page ground. Prose sits at 44rem; "cards" (4px, surface tint, hairline) hold exercises, with a practice variant tinted 7% accent. Code chunks live in 4px code panels with a theme-matched code ground; output is a sticky bottom panel.

## Do's and Don'ts

### Do:
- **Do** set a new theme's colours and only `--color-accent` for lines; let `--line-1..5` derive.
- **Do** keep every radius at 8px or below; plates 3px, panels 4px.
- **Do** use one plate per page for the primary action.
- **Do** draw progress as stops: filled when done, ringed when next.
- **Do** keep mono for code and output; headings in the sign face.
- **Do** respect `prefers-reduced-motion`; the only ambient motion is the next-stop pulse and a 0.4s fade-up on entry.

### Don't:
- **Don't** add a card grid, centred hero or feature columns as the page frame.
- **Don't** hard-code line or accent colours in components; read the variables.
- **Don't** use ink-faint for anything a learner must read to act.
- **Don't** make themes share a single background texture; each theme draws its own and the Background setting must switch it off.
- **Don't** use rounded pills or soft large radii for controls.
