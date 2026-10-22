/** Scroll a code line to the middle of the viewport and flash it briefly. */
export function jumpToLine(line: number) {
  const el = document.getElementById(`L${line}`)
  if (!el) return
  el.classList.remove('fold-hidden')
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('line-flash')
  window.setTimeout(() => el.classList.remove('line-flash'), 1800)
}
