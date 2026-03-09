// BottomNav — Navigation principale mobile (5 onglets)
import React from 'react'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../utils/constants'

const NAV = [
  { to: ROUTES.HOME,     label: 'Accueil',  icon: '🏠' },
  { to: ROUTES.TRIPS,    label: 'Voyages',  icon: '✈️' },
  { to: ROUTES.LINKS,    label: 'Liens',    icon: '🔗' },
  { to: ROUTES.ARCHIVE,  label: 'Archives', icon: '📦' },
  { to: ROUTES.SETTINGS, label: 'Réglages', icon: '⚙️' },
]

const BottomNav = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-card)]/95 backdrop-blur border-t border-[var(--color-border)]">
    <div className="max-w-2xl mx-auto flex">
      {NAV.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
          `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors
           ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}`
        }>
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
)
export default BottomNav
