// PageHeader — Titre de page + bouton retour + action optionnelle
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const PageHeader = ({ title, subtitle, action, backTo }) => {
  const navigate = useNavigate()
  return (
    <div className="flex items-start justify-between mb-5 gap-3">
      <div className="flex items-center gap-2">
        {backTo && (
          <button onClick={() => navigate(backTo)} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-input)] text-[var(--color-text-muted)]">
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="font-display font-bold text-xl text-[var(--color-text)]">{title}</h1>
          {subtitle && <p className="text-sm text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
export default PageHeader
