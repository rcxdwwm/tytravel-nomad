import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import Toast from '../ui/Toast'
import { useApp } from '../../context/AppContext'
const AppLayout = () => {
  const { toast } = useApp()
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      <Header />
      <main className="page-container"><Outlet /></main>
      <BottomNav />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  )
}
export default AppLayout
