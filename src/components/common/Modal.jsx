// Modal.jsx — Modale générique avec overlay
// Props: isOpen, onClose, title, children, size (sm/md/lg)
import React, { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])
  if (!isOpen) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizes[size]} bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-3xl shadow-xl animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
          <h2 className="font-display font-semibold text-lg text-[var(--color-text)]">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-bg-input)] text-[var(--color-text-muted)]">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
export default Modal
