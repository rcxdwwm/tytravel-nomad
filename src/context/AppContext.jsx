// ============================================================
// AppContext.jsx — État global : voyages actifs, notifications
// ============================================================
import { createContext, useContext, useState, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

const AppContext = createContext()

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp doit être utilisé dans AppProvider')
  return ctx
}

export const AppProvider = ({ children }) => {
  const [trips, setTrips]         = useLocalStorage(STORAGE_KEYS.TRIPS,     [])
  const [bookings, setBookings]   = useLocalStorage(STORAGE_KEYS.BOOKINGS,  {})
  const [budgets, setBudgets]     = useLocalStorage(STORAGE_KEYS.BUDGET,    {})
  const [checklists, setChecklists] = useLocalStorage(STORAGE_KEYS.CHECKLIST, {})
  const [itineraries, setItineraries] = useLocalStorage(STORAGE_KEYS.ITINERARY, {})
  const [toast, setToast]         = useState(null)

  /** Affiche une notification temporaire */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  /** Retourne un voyage par son id */
  const getTripById = useCallback((id) => trips.find((t) => t.id === id), [trips])

  return (
    <AppContext.Provider value={{
      trips, setTrips, getTripById,
      bookings, setBookings,
      budgets, setBudgets,
      checklists, setChecklists,
      itineraries, setItineraries,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext
