import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { layoutJourney, lineColor, trackBlurb, tracks, type Stop } from '@/lib/journey'
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
  // (Expedition's serif is much wider than the condensed sans).
  const tagRef = useRef<SVGTextElement>(null)
  const [measured, setMeasured] = useState(0)
  useLayoutEffect(() => {
    const measure = () => {
      const text = tagRef.current
      if (text) setMeasured(Math.ceil(text.getComputedTextLength()) + 18)
    }
    measure()
    document.fonts?.ready.then(measure)
    // A theme change swaps the faces without any resize, so watch the theme attribute too.
    const observer = new MutationObserver(measure)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [tagText, focusStop?.snippet.title, layout.width])
  const tagWidth = measured || (focusStop ? (tagText.length + 2 + focusStop.snippet.title.length) * 8.4 + 18 : 0)
  const tagX = focusStop ? Math.min(Math.max(focusStop.x - tagWidth / 2, 8), layout.width - tagWidth - 8) : 0
  const board = selected ?? hover

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

          {/* The two ends of the line, as bumpers, and an arrowhead on each row so the direction is clear. */}
          {[layout.start, layout.end].map((cap, i) => (
            <rect key={i} x={cap.x + cap.dir * 17 - 2} y={cap.y - 11} width={4} height={22} rx={1} fill="var(--color-ink)" opacity={0.75} />
          ))}
          {layout.cues.map((cue, i) => (
            <path
              key={i}
              d={`M ${cue.x - cue.dir * 6} ${cue.y - 29} L ${cue.x + cue.dir * 7} ${cue.y - 21} L ${cue.x - cue.dir * 6} ${cue.y - 13} Z`}
              fill={lineColor(cue.trackIndex ?? 0)}
              opacity={isolated === null || isolated === cue.trackIndex ? 1 : 0.2}
            />
          ))}

          {/* Line names, and the first stop's name, under the first stop of each line. */}
          {tracks.map((track) => {
            const first = layout.stops.find((s) => s.trackIndex === track.index)
            if (!first) return null
            const anchorEnd = first.x > layout.width * 0.7
            const x = first.x + (anchorEnd ? 4 : -4)
            return (
              <g key={track.slug} opacity={dim(track.index)} style={{ transition: 'opacity 160ms ease-out' }}>
                <text
                  x={x}
                  y={first.y + 30}
                  textAnchor={anchorEnd ? 'end' : 'start'}
                  fill={lineColor(track.index)}
                  style={{ font: '700 14px var(--font-display)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  {track.label.replace(/ Tutorial$/, '')}
                </text>
                <text x={x} y={first.y + 48} textAnchor={anchorEnd ? 'end' : 'start'} fill="var(--color-ink-dim)" style={{ font: '500 14px var(--font-sans)' }}>
                  {stationName(first.snippet.title)}
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
              <rect x={tagX} y={focusStop.y - 44} width={tagWidth} height={22} rx={2} fill="var(--color-ink)" />
              <text ref={tagRef} x={tagX + 9} y={focusStop.y - 28.5} fill="var(--color-bg)" style={{ font: '700 13px var(--font-display)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {tagText}: {focusStop.snippet.title}
              </text>
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
