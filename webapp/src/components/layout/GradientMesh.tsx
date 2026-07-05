export function GradientMesh() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--color-bg)]">
      <div
        className="gradient-mesh absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full blur-[120px]"
        style={{
          background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)',
          opacity: 'var(--mesh-opacity-1)',
        }}
      />
      <div
        className="gradient-mesh absolute -bottom-1/4 -right-1/4 h-[65vh] w-[65vh] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, var(--color-ember) 0%, transparent 70%)',
          opacity: 'var(--mesh-opacity-2)',
          animationDelay: '-12s',
        }}
      />
      <div
        className="gradient-mesh absolute left-1/3 top-1/2 h-[50vh] w-[50vh] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, var(--color-mesh-3) 0%, transparent 70%)',
          opacity: 'var(--mesh-opacity-3)',
          animationDelay: '-20s',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-mesh-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-mesh-grid) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}
