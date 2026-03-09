// ============================================================
// Button.jsx — Bouton réutilisable (variants: primary, secondary, danger, ghost)
// ============================================================
// Props: variant, size, disabled, loading, onClick, children, icon
import React from 'react'

const VARIANTS = {
  primary:   'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white',
  secondary: 'bg-[var(--color-bg-input)] hover:bg-[var(--color-border)] text-[var(--color-text)] border border-[var(--color-border)]',
  danger:    'bg-red-700 hover:bg-red-800 text-white',
  ghost:     'hover:bg-[var(--color-bg-input)] text-[var(--color-text-muted)]',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  icon: Icon,
  className = '',
  ...rest
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center gap-2 font-medium rounded-xl
      transition-all duration-200 active:scale-95
      disabled:opacity-50 disabled:cursor-not-allowed
      ${VARIANTS[variant]} ${SIZES[size]} ${className}
    `}
    {...rest}
  >
    {loading && <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
    {!loading && Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
)

export default Button
