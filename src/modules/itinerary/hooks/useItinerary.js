// ============================================================
// useItinerary.js — CRUD activités par jour et par voyage
// ============================================================
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '../../../context/AppContext'

const useItinerary = (tripId) => {
  const { itineraries, setItineraries, showToast } = useApp()
  const days = itineraries[tripId] || []

  const save = useCallback((newDays) => {
    setItineraries((prev) => ({ ...prev, [tripId]: newDays }))
  }, [tripId, setItineraries])

  /** Initialise les jours depuis un tableau de dates */
  const initDays = useCallback((newDays) => {
    save(newDays)
  }, [save])

  /** Ajoute une activité à un jour */
  const addActivity = useCallback((dayDate, activity) => {
    const newDays = days.map((d) =>
      d.date === dayDate
        ? { ...d, activities: [...(d.activities || []), { ...activity, id: uuidv4() }] }
        : d
    )
    save(newDays)
    showToast('Activité ajoutée')
  }, [days, save, showToast])

  /** Met à jour une activité existante */
  const updateActivity = useCallback((dayDate, activityId, updates) => {
    const newDays = days.map((d) =>
      d.date === dayDate
        ? { ...d, activities: (d.activities || []).map((a) => a.id === activityId ? { ...a, ...updates } : a) }
        : d
    )
    save(newDays)
    showToast('Activité modifiée')
  }, [days, save, showToast])

  /** Supprime une activité */
  const deleteActivity = useCallback((dayDate, activityId) => {
    const newDays = days.map((d) =>
      d.date === dayDate
        ? { ...d, activities: (d.activities || []).filter((a) => a.id !== activityId) }
        : d
    )
    save(newDays)
  }, [days, save])

  return { days, initDays, addActivity, updateActivity, deleteActivity, save }
}

export default useItinerary
