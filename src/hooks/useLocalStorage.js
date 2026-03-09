// ============================================================
// useLocalStorage.js — Hook générique de persistence
// ============================================================
import { useState, useEffect, useCallback } from 'react'

/**
 * Gère un état synchronisé avec localStorage.
 * @param {string} key   - Clé de stockage
 * @param {*}      initialValue - Valeur par défaut
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`useLocalStorage: erreur lecture "${key}"`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.warn(`useLocalStorage: erreur écriture "${key}"`, error)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`useLocalStorage: erreur suppression "${key}"`, error)
    }
  }, [key, initialValue])

  // Synchronisation entre onglets
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === key && e.newValue) {
        try { setStoredValue(JSON.parse(e.newValue)) } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
