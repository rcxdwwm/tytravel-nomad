// ============================================================
// useModal.js — Gestion ouverture/fermeture de modales
// ============================================================
import { useState, useCallback } from 'react'

function useModal(initialOpen = false) {
  const [isOpen, setIsOpen]   = useState(initialOpen)
  const [payload, setPayload] = useState(null)

  const open  = useCallback((data = null) => { setPayload(data); setIsOpen(true)  }, [])
  const close = useCallback(()            => { setIsOpen(false); setPayload(null) }, [])
  const toggle= useCallback(()            => setIsOpen((v) => !v),                  [])

  return { isOpen, payload, open, close, toggle }
}

export default useModal
