// useTrips — CRUD voyages + filtres ongoing/upcoming/past
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '../../../context/AppContext'
import { isTripOngoing, isTripFuture, isTripPast } from '../../../utils/dateUtils'
const useTrips = () => {
  const { trips, setTrips, showToast } = useApp()
  const addTrip = useCallback((data) => {
    const t = { ...data, id: uuidv4(), createdAt: new Date().toISOString() }
    setTrips((prev) => [t, ...prev]); showToast('Voyage créé !'); return t
  }, [setTrips, showToast])
  const updateTrip = useCallback((id, upd) => {
    setTrips((prev) => prev.map((t) => t.id === id ? { ...t, ...upd } : t)); showToast('Mis à jour')
  }, [setTrips, showToast])
  const deleteTrip = useCallback((id) => {
    setTrips((prev) => prev.filter((t) => t.id !== id)); showToast('Supprimé')
  }, [setTrips, showToast])
  return { trips, addTrip, updateTrip, deleteTrip,
    ongoingTrips: trips.filter((t) => isTripOngoing(t.startDate, t.endDate)),
    upcomingTrips: trips.filter((t) => isTripFuture(t.startDate)),
    pastTrips: trips.filter((t) => isTripPast(t.endDate)) }
}
export default useTrips
