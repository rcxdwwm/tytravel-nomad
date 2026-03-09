// ============================================================
// useBookings.js — CRUD réservations par voyage et par type
// ============================================================
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '../../../context/AppContext'

const useBookings = (tripId) => {
  const { bookings, setBookings, showToast } = useApp()
  const tripBookings = bookings[tripId] || []

  const addBooking = useCallback((data) => {
    const b = { ...data, id: uuidv4(), createdAt: new Date().toISOString() }
    setBookings((p) => ({ ...p, [tripId]: [...(p[tripId] || []), b] }))
    showToast('Réservation ajoutée')
  }, [tripId, setBookings, showToast])

  const updateBooking = useCallback((bookingId, updates) => {
    setBookings((p) => ({
      ...p,
      [tripId]: (p[tripId] || []).map((b) => b.id === bookingId ? { ...b, ...updates } : b),
    }))
    showToast('Réservation mise à jour')
  }, [tripId, setBookings, showToast])

  const deleteBooking = useCallback((bookingId) => {
    setBookings((p) => ({
      ...p,
      [tripId]: (p[tripId] || []).filter((b) => b.id !== bookingId),
    }))
  }, [tripId, setBookings])

  const getByType = useCallback((type) =>
    tripBookings.filter((b) => b.type === type),
    [tripBookings]
  )

  return { tripBookings, addBooking, updateBooking, deleteBooking, getByType }
}

export default useBookings