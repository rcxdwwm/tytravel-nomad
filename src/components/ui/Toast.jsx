import React from 'react'
const T = { success: 'bg-green-900 text-green-100 border-green-700', error: 'bg-red-900 text-red-100 border-red-700', info: 'bg-[var(--color-bg-card)] text-[var(--color-text)] border-[var(--color-border)]' }
const Toast = ({ message, type = 'success' }) => (
  <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-sm font-medium shadow-xl animate-slide-up ${T[type]}`}>{message}</div>
)
export default Toast
