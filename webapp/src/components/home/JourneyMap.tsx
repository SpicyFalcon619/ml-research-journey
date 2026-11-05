import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { layoutJourney, lineColor, trackBlurb, tracks, type Stop } from '@/lib/journey'
import { placeTag, TAG_HEIGHT, TAG_TOP_OFFSET } from '@/lib/journeyTag'

const MARK_WIDTH = 24
import { allLessons } from '@/lib/progress'
import { useLibrary } from '@/hooks/useLibrary'
import { TickRail } from '@/components/snippet/TickRail'
import { cn } from '@/lib/cn'

// Measures an element's width so the map can re-lay itself out: more, shorter rows on a phone.
function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(960)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(Math.round(el.getBoundingClientRect().width) || 960)
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width) || 960))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, width]
}

// A station name board: the lesson title without a trailing bracketed note, kept short.
const stationName = (title: string) => {
  const clean = title.replace(/\s*\(.*\)\s*$/, '')
  return clean.length > 34 ? `${clean.slice(0, 33).trimEnd()}…` : clean
}

const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export function JourneyMap({ focusId, returning }: { focusId: string; returning: boolean }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const { isDone } = useLibrary()
  const navigate = useNavigate()
  const layout = useMemo(() => layoutJourney(width), [width])
  const focusStop = layout.stops.find((s) => s.snippet.id === focusId)

  // The stop the keyboard is on (roving tabindex), the one under the pointer, and the one a
  // first tap on a touch screen has picked so its name can be read before it is opened.
  const [active, setActive] = useState<number>(focusStop?.n ?? 0)
  const [hover, setHover] = useState<Stop | null>(null)
  const [selected, setSelected] = useState<Stop | null>(null)
  // A line is isolated while its legend row is hovered or focused, or after a click pins it.
  const [peek, setPeek] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const isolated = peek ?? pinned

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(null)
        setSelected(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const moveTo = (n: number) => {
    const next = Math.min(Math.max(n, 0), layout.stops.length - 1)
    setActive(next)
    setHover(layout.stops[next])
    requestAnimationFrame(() => ref.current?.querySelector<SVGGElement>(`[data-stop="${next}"]`)?.focus())
  }

  const dim = (trackIndex: number) => (isolated !== null && isolated !== trackIndex ? 0.16 : 1)
  const tagText = returning ? 'KEEP READING' : 'START HERE'
  // The tag is sized from the real rendered text, because each theme sets the sign face differently
  // (Expedition's serif is much wider than the condensed sans). Both wordings are measured.
  const fullRef = useRef<SVGTextElement>(null)
  const shortRef = useRef<SVGTextElement>(null)
  const [measured, setMeasured] = useState({ full: 0, short: 0 })
  useLayoutEffect(() => {
    const measure = () => {
      const full = fullRef.current
      const short = shortRef.current
      if (full && short) {
        const next = { full: Math.ceil(full.getComputedTextLength()) + 18, short: Math.ceil(short.getComputedTextLength()) + 18 }
        setMeasured((prev) => (prev.full === next.full && prev.short === next.short ? prev : next))
      }
    }
    measure()
    document.fonts?.ready.then(measure)
    // A theme change swaps the faces without any resize, so watch the theme attribute too.
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [tagText, focusStop?.snippet.title, layout.width])
  // Real widths of the line names, measured like the tag, because the faces differ per theme.
  const labelRefs = useRef<Record<string, SVGGElement | null>>({})
  const [labelWidths, setLabelWidths] = useState<Record<string, number>>({})
  useLayoutEffect(() => {
    const measure = () => {
      const next: Record<string, number> = {}
      for (const [slug, group] of Object.entries(labelRefs.current)) {
        if (!group) continue
        next[slug] = Math.ceil(Math.max(...[...group.querySelectorAll('text')].map((t) => t.getComputedTextLength())))
      }
      setLabelWidths((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
    }
    measure()
    document.fonts?.ready.then(measure)
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [layout.width])
  const fullText = focusStop ? `${tagText}: ${focusStop.snippet.title}` : tagText
  const fullWidth = measured.full || (fullText.length * 8.4 + 18)
  const shortWidth = measured.short || (tagText.length * 8.4 + 18)

  // Where each line's name hangs (under its first stop), so the tag can steer clear of them.
  const labels = tracks.flatMap((track) => {
    const first = layout.stops.find((s) => s.trackIndex === track.index)
    if (!first) return []
    const anchorEnd = first.x > layout.width * 0.7
    const x = first.x + (anchorEnd ? 4 : -4)
    // On a narrow screen two lines can start close together on one row. Keep this name
    // from running into the one that ends against the right-hand side.
    const rival = tracks
      .map((other) => layout.stops.find((s) => s.trackIndex === other.index))
      .find((s) => s && s !== first && s.row === first.row && s.x > first.x && s.x > layout.width * 0.7)
    const rivalName = rival ? stationName(rival.snippet.title) : ''
    const rivalLeft = rival ? rival.x + 4 - rivalName.length * 7.4 : Infinity
    const room = anchorEnd ? Infinity : rivalLeft - x - 10
    const maxChars = Math.max(Math.floor(room / 7.4), 8)
    const name = stationName(first.snippet.title)
    const shown = name.length > maxChars ? `${name.slice(0, maxChars - 1).trimEnd()}…` : name
    const width = labelWidths[track.slug] ?? Math.max(track.label.replace(/ Tutorial$/, '').length * 11, shown.length * 7.6)
    const left = anchorEnd ? x - width : x
    return [{ track, first, x, anchorEnd, shown, left, right: left + width, top: first.y + 16, bottom: first.y + 56 }]
  })

  // The tag goes in the strip above its stop, steering clear of the line names that hang there.
  const placement = focusStop
    ? placeTag({
        stopX: focusStop.x,
        stopY: focusStop.y,
        fullWidth,
        shortWidth,
        markWidth: MARK_WIDTH,
        layoutWidth: layout.width,
        edge: 40,
        labels: labels.map((l) => ({ id: l.track.slug, left: l.left, right: l.right, top: l.top, bottom: l.bottom })),
      })
    : null
  const tagX = placement?.x ?? 0
  const tagVariant = placement?.variant ?? 'full'
  const tagWidth = tagVariant === 'full' ? fullWidth : tagVariant === 'short' ? shortWidth : MARK_WIDTH
  const hiddenLabels = placement?.hidden ?? []
  const tagBottomY = focusStop ? focusStop.y - TAG_TOP_OFFSET + TAG_HEIGHT : 0
  // When the tag cannot sit right over its stop, a thin connector runs along its foot and down to the stop.
  const reach = Boolean(focusStop) && ((focusStop?.x ?? 0) < tagX + 10 || (focusStop?.x ?? 0) > tagX + tagWidth - 10)
  const board = selected ?? hover
  // One arrow per line: its best spot that is not under the floating tag, so the two never overlap.
  const spanLeft = focusStop ? Math.min(tagX, focusStop.x) : 0
  const spanRight = focusStop ? Math.max(tagX + tagWidth, focusStop.x) : 0
  const underTag = (cue: { x: number; y: number }) =>
    Boolean(focusStop) && Math.abs(cue.y - (focusStop?.y ?? 0)) < 1 && cue.x > spanLeft - 12 && cue.x < spanRight + 12
  const cues = tracks.flatMap((track) => {
    const choice = layout.cues.find((cue) => cue.trackIndex === track.index && !underTag(cue))
    return choice ? [choice] : []
  })

  return (
    <section aria-label="The journey map" className="flex flex-col">
      <div ref={ref} className="relative order-2 sm:order-1" role="group" aria-label="Map of every lesson in learning order. Use the arrow keys to move along the line, Enter to open a stop.">
        <svg width="100%" height={layout.height} viewBox={`0 0 ${layout.width} ${layout.height}`} className="block overflow-visible">
          {/* Lines. The part you have already ridden is solid; the part ahead is quieter. */}
          {layout.segments.map((seg) => (
            <path
              key={seg.toN}
              d={seg.d}
              fill="none"
              stroke={lineColor(seg.trackIndex)}
              strokeWidth={8}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={dim(seg.trackIndex) * (isDone(layout.stops[seg.toN].snippet.id) ? 1 : 0.55)}
              style={{ transition: 'opacity 160ms ease-out' }}
            />
          ))}

          {/* The two ends of the line, as bumpers, and one arrowhead per line, in its colour, so the direction is clear. */}
          {[layout.start, layout.end].map((cap, i) => (
            <rect key={i} x={cap.x + cap.dir * 17 - 2} y={cap.y - 11} width={4} height={22} rx={1} fill="var(--color-ink)" opacity={0.75} />
          ))}
          {cues.map((cue, i) => (
            <path
              key={i}
              d={`M ${cue.x - cue.dir * 6} ${cue.y - 29} L ${cue.x + cue.dir * 7} ${cue.y - 21} L ${cue.x - cue.dir * 6} ${cue.y - 13} Z`}
              fill={lineColor(cue.trackIndex ?? 0)}
              opacity={isolated === null || isolated === cue.trackIndex ? 1 : 0.2}
            />
          ))}

          {/* Line names, and the first stop's name, under the first stop of each line. */}
          {labels.map(({ track, first, x, anchorEnd, shown }) => {
            const up = false
            return (
              <g
                key={track.slug}
                ref={(el) => {
                  labelRefs.current[track.slug] = el
                }}
                opacity={hiddenLabels.includes(track.slug) ? 0 : dim(track.index)}
                style={{ transition: 'opacity 160ms ease-out' }}
              >
                <text
                  x={x}
                  y={first.y + (up ? -36 : 30)}
                  textAnchor={anchorEnd ? 'end' : 'start'}
                  fill={lineColor(track.index)}
                  style={{ font: '700 14px var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  {track.label.replace(/ Tutorial$/, '')}
                </text>
                <text x={x} y={first.y + (up ? -18 : 48)} textAnchor={anchorEnd ? 'end' : 'start'} fill="var(--color-ink-dim)" style={{ font: '500 14px var(--font-sans)' }}>
                  {shown}
                </text>
              </g>
            )
          })}

          {/* Stops. */}
          {layout.stops.map((stop) => {
            const finished = isDone(stop.snippet.id)
            const isFocus = stop.snippet.id === focusId
            const color = lineColor(stop.trackIndex)
            const radius = stop.interchange ? 9 : isFocus ? 8 : 6
            const open = () => navigate(`/s/${stop.snippet.id}`)
            return (
              <g
                key={stop.snippet.id}
                data-stop={stop.n}
                role="link"
                tabIndex={stop.n === active ? 0 : -1}
                aria-label={`${stop.snippet.title}, stop ${stop.n + 1} of ${allLessons.length}${finished ? ', done' : ''}`}
                onClick={() => {
                  if (isTouch() && selected?.n !== stop.n) setSelected(stop)
                  else open()
                }}
                onKeyDown={(e) => {
                  // Arrow keys walk the line, one stop at a time.
                  const target =
                    e.key === 'ArrowRight' || e.key === 'ArrowDown'
                      ? stop.n + 1
                      : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                        ? stop.n - 1
                        : e.key === 'Home'
                          ? 0
                          : e.key === 'End'
                            ? layout.stops.length - 1
                            : null
                  if (e.key === 'Enter') {
                    open()
                  } else if (target !== null) {
                    e.preventDefault()
                    moveTo(target)
                  }
                }}
                onMouseEnter={() => setHover(stop)}
                onMouseLeave={() => setHover((h) => (h?.n === stop.n ? null : h))}
                onFocus={() => {
                  setActive(stop.n)
                  setHover(stop)
                }}
                onBlur={() => setHover(null)}
                opacity={dim(stop.trackIndex)}
                className="cursor-pointer outline-none [&:focus-visible>circle:last-of-type]:stroke-[var(--color-ink)]"
                style={{ transition: 'opacity 160ms ease-out' }}
              >
                <circle cx={stop.x} cy={stop.y} r={17} fill="transparent" />
                {isFocus && <circle cx={stop.x} cy={stop.y} r={radius + 5} fill="none" stroke={color} strokeWidth={2} className="journey-pulse" />}
                <circle
                  cx={stop.x}
                  cy={stop.y}
                  r={radius}
                  fill={finished ? color : 'var(--color-bg)'}
                  stroke={stop.interchange || isFocus ? 'var(--color-ink)' : color}
                  strokeWidth={stop.interchange || isFocus ? 3.5 : 3}
                />
              </g>
            )
          })}

          {/* The tag over the stop you should read next. */}
          {focusStop && (
            <g aria-hidden style={{ pointerEvents: 'none' }}>
              {/* Off-screen measurers for the two wordings; the visible tag picks one. */}
              <text ref={fullRef} visibility="hidden" style={{ font: '700 13px var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {fullText}
              </text>
              <text ref={shortRef} visibility="hidden" style={{ font: '700 13px var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {tagText}
              </text>
              <path
                d={
                  reach
                    ? `M ${focusStop.x < tagX ? tagX + 6 : tagX + tagWidth - 6} ${tagBottomY} L ${focusStop.x < tagX ? tagX + 6 : tagX + tagWidth - 6} ${tagBottomY + 5} L ${focusStop.x} ${tagBottomY + 5} L ${focusStop.x} ${focusStop.y - 12}`
                    : `M ${focusStop.x} ${tagBottomY} L ${focusStop.x} ${focusStop.y - 12}`
                }
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={2}
              />
              <rect x={tagX} y={focusStop.y - TAG_TOP_OFFSET} width={tagWidth} height={TAG_HEIGHT} rx={2} fill="var(--color-ink)" />
              {tagVariant === 'mark' ? (
                <path
                  d={`M ${tagX + 9} ${focusStop.y - TAG_TOP_OFFSET + 5.5} L ${tagX + 16} ${focusStop.y - TAG_TOP_OFFSET + 11} L ${tagX + 9} ${focusStop.y - TAG_TOP_OFFSET + 16.5} Z`}
                  fill="var(--color-bg)"
                />
              ) : (
                <text x={tagX + 9} y={focusStop.y - TAG_TOP_OFFSET + 15.5} fill="var(--color-bg)" style={{ font: '700 13px var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {tagVariant === 'full' ? fullText : tagText}
                </text>
              )}
            </g>
          )}
        </svg>

        {board && board.snippet.id !== focusId && (
          <div
            className={cn(
              'absolute z-10 flex -translate-x-1/2 -translate-y-full items-center gap-3 rounded-[3px] border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)] px-2.5 py-1 text-sm whitespace-nowrap text-[var(--color-ink)] shadow-[var(--shadow-glass)]',
              selected ? 'pointer-events-auto' : 'pointer-events-none',
            )}
            style={{ left: Math.min(Math.max(board.x, 90), layout.width - 90), top: board.y - 14 }}
          >
            {board.snippet.title}
            {selected && (
              <Link to={`/s/${board.snippet.id}`} className="plate !px-2 !py-1 !text-sm">
                Open
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="order-1 mt-6 mb-1 sm:order-2 sm:mt-5 sm:mb-0">
        <TickRail currentId={focusId} />
        <p className="mt-1.5 text-sm text-[var(--color-ink-faint)]">Your place in all {allLessons.length} stops</p>
      </div>

      {/* The legend: one cell per line. Hover or focus one to read that line on its own, or press it to pin it. */}
      <ul className="order-3 mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--color-border)] pt-4 sm:grid-cols-5" onMouseLeave={() => setPeek(null)}>
        {tracks.map((track) => {
          const doneCount = track.lessons.filter((s) => isDone(s.id)).length
          return (
            <li key={track.slug}>
              <div
                className={cn('flex flex-col justify-between rounded-[3px] px-1 py-1 transition-colors', isolated === track.index && 'bg-[var(--color-surface)]')}
                onMouseEnter={() => setPeek(track.index)}
                onFocus={() => setPeek(track.index)}
                onBlur={() => setPeek(null)}
              >
                <button
                  onClick={() => setPinned((p) => (p === track.index ? null : track.index))}
                  aria-pressed={pinned === track.index}
                  aria-label={`${pinned === track.index ? 'Show all lines' : 'Show only'} ${track.label}`}
                  className="flex h-6 w-full cursor-pointer items-center"
                >
                  <span className="h-2 w-full rounded-full" style={{ background: lineColor(track.index) }} />
                </button>
                <Link to={`/c/${track.slug}`} className="group mt-1 flex min-h-9 items-baseline justify-between gap-2">
                  <span className="text-xl leading-tight font-bold text-[var(--color-ink)] group-hover:underline group-hover:underline-offset-4" style={{ fontFamily: 'var(--font-display)' }}>
                    {track.label.replace(/ Tutorial$/, '')}
                  </span>
                  <span className="shrink-0 text-sm text-[var(--color-ink-dim)] tabular-nums">
                    {doneCount}/{track.lessons.length}
                  </span>
                </Link>
                <p className="hidden pb-1 text-[13px] leading-snug text-[var(--color-ink-faint)] sm:block">{trackBlurb[track.slug]}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
