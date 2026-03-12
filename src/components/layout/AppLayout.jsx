// AppLayout — Mise en page principale
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import Toast from '../ui/Toast'
import { useApp } from '../../context/AppContext'

const AppLayout = () => {
  const { toast } = useApp()
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-bg)' }}>
      <Header />
      <main style={{
        maxWidth: 600,
        margin: '0 auto',
        padding: '1.25rem 1rem',
        paddingBottom: 'calc(5.5rem + env(safe-area-inset-bottom, 34px))',
      }}>
        <Outlet />
      </main>
      <BottomNav />

      {/* Footer — couvre la home indicator iPhone */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 38,
        background: 'var(--color-bg-card)',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
        padding: '2px 0 6px',
        fontSize: '0.6rem',
        color: 'var(--color-text-muted)',
        letterSpacing: '.04em',
      }}>
        TyTravel Nomad © {new Date().getFullYear()} TyWebCreation
      </div>

    </div>
  )
}

export default AppLayout

