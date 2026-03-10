// Header — Logo TyTravel Nomad + toggle thème + export données
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { exportAllData } from '../../services/storageService'

const Header = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'var(--color-bg)',
      borderBottom: '1px solid var(--color-border)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '0 1rem',
        height: 54,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.55rem' }}>
          <img
            src="/tytravel-nomad/icon-192.png"
            alt="TyTravel Nomad"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              objectFit: 'contain',
              flexShrink: 0,
            }}
          />
          
          <span style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: '1.05rem',
            letterSpacing: '-.01em',
            lineHeight: 1,
          }}>
            <span style={{ color: 'var(--color-text)' }}>Ty</span>
            <span style={{ color: 'var(--color-primary)' }}>Travel</span>
            <span style={{ color: 'var(--color-text)' }}> </span>
            <span style={{ color: 'var(--color-primary)' }}>Nomad</span>
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.25rem' }}>
          <button
            onClick={exportAllData}
            title="Exporter les données"
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-input)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
          >📤</button>

          <button
            onClick={toggleTheme}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: '1px solid var(--color-border)',
              background: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', transition: 'background .15s, border-color .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-input)'; e.currentTarget.style.borderColor = 'var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--color-border)' }}
          >{isDark ? '☀️' : '🌙'}</button>
        </div>
      </div>
    </header>
  )
}

export default Header
