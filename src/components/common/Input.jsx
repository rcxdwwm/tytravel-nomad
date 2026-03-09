// Input.jsx — Champ texte stylisté
// Props: label, error, icon, ...inputProps
import React from 'react'
const Input = ({ label, error, icon: Icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-[var(--color-text-muted)]">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />}
      <input
        className={`w-full bg-[var(--color-bg-input)] border ${error ? 'border-red-500' : 'border-[var(--color-border)]'}
          rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-light)]
          focus:outline-none focus:border-[var(--color-primary)] transition-colors
          ${Icon ? 'pl-9' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
)
export default Input
