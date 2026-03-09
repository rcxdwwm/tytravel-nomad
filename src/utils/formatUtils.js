// ============================================================
// formatUtils.js — Formatage monnaie, distances, etc.
// ============================================================

/** Formate un montant en euros */
export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount == null) return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount)
}

/** Formate un nombre de km */
export const formatDistance = (km) => {
  if (km == null) return '—'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(km) + ' km'
}

/** Tronque un texte */
export const truncate = (str, max = 50) => {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

/** Initiales d'un nom de destination */
export const getInitials = (str = '') => {
  return str
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

// ============================================================
// validationUtils.js — Règles de validation
// ============================================================

/** Vérifie qu'une chaîne n'est pas vide */
export const isRequired = (val) => val !== undefined && val !== null && String(val).trim() !== ''

/** Vérifie qu'une date de fin est >= date de début */
export const isEndAfterStart = (start, end) => {
  if (!start || !end) return true
  return new Date(end) >= new Date(start)
}

/** Vérifie qu'un montant est positif */
export const isPositiveNumber = (val) => !isNaN(val) && Number(val) >= 0

/** Valide une URL basique */
export const isValidUrl = (url) => {
  try { new URL(url); return true } catch { return false }
}
