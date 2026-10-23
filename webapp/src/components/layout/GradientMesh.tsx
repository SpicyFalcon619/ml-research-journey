export function GradientMesh() {
  // What is drawn here is decided by the theme: see `.mesh-grid` and `.mesh-overlay` in index.css.
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[var(--color-bg)]">
        <div className="mesh-grid absolute inset-0" />
      </div>
      <div aria-hidden className="mesh-overlay" />
    </>
  )
}
