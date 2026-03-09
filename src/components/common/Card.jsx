// ============================================================
// Card.jsx — Carte générique avec variants
// ============================================================
import React from 'react'

const Card = ({ children, className = '', onClick, hover = false }) => (
  <div
    onClick={onClick}
    className={`
      bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-4
      shadow-sm transition-all duration-200
      ${hover || onClick ? 'cursor-pointer hover:border-[var(--color-primary)] hover:shadow-md' : ''}
      ${className}
    `}
  >
    {children}
  </div>
)

Card.Header = ({ children, className = '' }) => (
  <div className={`mb-3 ${className}`}>{children}</div>
)

Card.Title = ({ children, className = '' }) => (
  <h3 className={`font-display font-semibold text-[var(--color-text)] ${className}`}>{children}</h3>
)

Card.Body = ({ children }) => <div>{children}</div>

export default Card
