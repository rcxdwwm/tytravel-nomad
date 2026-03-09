// EmptyState.jsx — État vide avec icône et CTA
// Props: icon, title, description, action (JSX bouton)
import React from 'react'
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
    {Icon && <div className="w-16 h-16 rounded-2xl bg-[var(--color-bg-input)] flex items-center justify-center mb-2">
      <Icon className="w-8 h-8 text-[var(--color-text-muted)]" />
    </div>}
    <h3 className="font-display font-semibold text-[var(--color-text)]">{title}</h3>
    {description && <p className="text-sm text-[var(--color-text-muted)] max-w-xs">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)
export default EmptyState
