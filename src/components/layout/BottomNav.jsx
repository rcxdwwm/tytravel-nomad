// BottomNav — Navigation principale mobile
import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',           label: 'Accueil',  icon: '🏠' },
  { to: '/voyages',    label: 'Voyages',  icon: '✈️' },
  { to: '/liens',      label: 'Liens',    icon: '🔗' },
  { to: '/archives',   label: 'Archives', icon: '📦' },
  { to: '/parametres', label: 'Infos',    icon: '⚙️' },
]

const BottomNav = () => (
  <>
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
      background: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      paddingBottom: 'env(safe-area-inset-bottom, 34px)',
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
      }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '10px 4px 10px',
              textDecoration: 'none',
              fontSize: '0.68rem',
              fontWeight: 600,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color .15s',
              letterSpacing: '.01em',
              position: 'relative',
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: 2,
                    borderRadius: '0 0 3px 3px',
                    background: 'var(--color-primary)',
                  }} />
                )}
                <span style={{
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  filter: isActive ? 'none' : 'grayscale(30%)',
                  transition: 'transform .15s',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}>
                  {icon}
                </span>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>

    {/* Remplit la zone home indicator iPhone avec la même couleur */}
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'env(safe-area-inset-bottom, 0px)',
      background: 'var(--color-bg-card)',
      zIndex: 39,
    }} />
  </>
)

export default BottomNav
