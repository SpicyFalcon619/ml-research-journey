import { GlassPanel } from './GlassPanel'

export function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <GlassPanel className="p-4 text-center">
      <div className="text-2xl font-semibold text-[var(--color-ink)]">{value.toLocaleString()}</div>
      <div className="mt-1 text-xs text-[var(--color-ink-faint)]">{label}</div>
    </GlassPanel>
  )
}
