// ProgressBar.jsx — Barre de progression animée
// Props: value (0-100), color, label, showPercent
import React from 'react'
const ProgressBar = ({ value = 0, color = 'var(--color-primary)', label, showPercent = false }) => (
  <div>
    {(label || showPercent) && (
      <div className="flex justify-between mb-1">
        {label && <span className="text-xs text-[var(--color-text-muted)]">{label}</span>}
        {showPercent && <span className="text-xs font-medium text-[var(--color-text)]">{value}%</span>}
      </div>
    )}
    <div className="w-full h-2 bg-[var(--color-bg-input)] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
      />
    </div>
  </div>
)
export default ProgressBar
