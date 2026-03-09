// Badge.jsx — Pastille statut colorée
// Props: type (success/warning/danger/info/neutral), children
import React from 'react'
const TYPES = {
  success: 'bg-green-900/40 text-green-300 border-green-700',
  warning: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  danger:  'bg-red-900/40 text-red-300 border-red-700',
  info:    'bg-blue-900/40 text-blue-300 border-blue-700',
  neutral: 'bg-[var(--color-bg-input)] text-[var(--color-text-muted)] border-[var(--color-border)]',
  primary: 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] border-[var(--color-primary)]/40',
}
const Badge = ({ type = 'neutral', children, className = '' }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${TYPES[type]} ${className}`}>
    {children}
  </span>
)
export default Badge
