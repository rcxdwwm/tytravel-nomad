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
        padding: '1.25rem 1rem 5.5rem', // padding bottom = hauteur BottomNav + marge
      }}>
        <Outlet />
      </main>
      <BottomNav />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}

export default AppLayout

