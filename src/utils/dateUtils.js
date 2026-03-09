// ============================================================
// dateUtils.js — Helpers dates (format français)
// ============================================================
import { format, formatDistance, isAfter, isBefore, isToday, differenceInDays, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

/** Formate une date ISO → "lun. 5 janv. 2025" */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'EEE d MMM yyyy', { locale: fr })
}

/** Formate une date ISO → "5 janv. 2025" */
export const formatDateShort = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'd MMM yyyy', { locale: fr })
}

/** Formate une date ISO → "5 jan." */
export const formatDateMini = (dateStr) => {
  if (!dateStr) return '—'
  return format(parseISO(dateStr), 'd MMM', { locale: fr })
}

/** Formate une heure ISO ou "HH:mm" → "08h30" */
export const formatTime = (timeStr) => {
  if (!timeStr) return '—'
  return timeStr.replace(':', 'h')
}

/** Retourne "dans 3 jours", "il y a 2 semaines", etc. */
export const fromNow = (dateStr) => {
  if (!dateStr) return ''
  return formatDistance(parseISO(dateStr), new Date(), { locale: fr, addSuffix: true })
}

/** Nombre de jours entre deux dates ISO */
export const daysBetween = (startStr, endStr) => {
  if (!startStr || !endStr) return 0
  return differenceInDays(parseISO(endStr), parseISO(startStr))
}

/** Compte à rebours en jours jusqu'à une date */
export const daysUntil = (dateStr) => {
  if (!dateStr) return null
  return differenceInDays(parseISO(dateStr), new Date())
}

/** Vérifie si un voyage est en cours */
export const isTripOngoing = (startStr, endStr) => {
  if (!startStr || !endStr) return false
  const now = new Date()
  return isAfter(now, parseISO(startStr)) && isBefore(now, parseISO(endStr))
}

/** Vérifie si un voyage est passé */
export const isTripPast = (endStr) => {
  if (!endStr) return false
  return isBefore(parseISO(endStr), new Date())
}

/** Vérifie si un voyage est à venir */
export const isTripFuture = (startStr) => {
  if (!startStr) return false
  return isAfter(parseISO(startStr), new Date())
}

/** Date du jour en ISO (YYYY-MM-DD) */
export const todayISO = () => format(new Date(), 'yyyy-MM-dd')

/** Génère la liste des dates entre deux dates ISO */
export const getDateRange = (startStr, endStr) => {
  if (!startStr || !endStr) return []
  const dates = []
  let current = parseISO(startStr)
  const end = parseISO(endStr)
  while (!isAfter(current, end)) {
    dates.push(format(current, 'yyyy-MM-dd'))
    current = new Date(current.getTime() + 86400000)
  }
  return dates
}
