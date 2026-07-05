export function GradientMesh() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--color-bg)]">
      <div
        className="gradient-mesh absolute -left-1/4 -top-1/4 h-[70vh] w-[70vh] rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
      />
      <div
        className="gradient-mesh absolute -bottom-1/4 -right-1/4 h-[65vh] w-[65vh] rounded-full opacity-30 blur-[130px]"
        style={{ background: 'radial-gradient(circle, var(--color-ember) 0%, transparent 70%)', animationDelay: '-12s' }}
      />
      <div
        className="gradient-mesh absolute left-1/3 top-1/2 h-[50vh] w-[50vh] rounded-full opacity-20 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #4c4fb0 0%, transparent 70%)', animationDelay: '-20s' }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
    </div>
  )
}
