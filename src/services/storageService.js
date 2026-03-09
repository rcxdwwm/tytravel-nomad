// ============================================================
// storageService.js — Export / Import de toutes les données
// ============================================================
import { STORAGE_KEYS, APP_VERSION } from '../utils/constants'

/** Exporte toutes les données en fichier JSON téléchargeable */
export const exportAllData = () => {
  const data = {
    _meta: { app: 'TyTravel-nomad', version: APP_VERSION, exportedAt: new Date().toISOString() },
  }
  Object.values(STORAGE_KEYS).forEach((key) => {
    try {
      const raw = localStorage.getItem(key)
      data[key] = raw ? JSON.parse(raw) : null
    } catch {}
  })

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `tytravel-nomad-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/** Importe des données depuis un fichier JSON */
export const importAllData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        Object.values(STORAGE_KEYS).forEach((key) => {
          if (data[key] !== undefined && data[key] !== null) {
            localStorage.setItem(key, JSON.stringify(data[key]))
          }
        })
        resolve(true)
      } catch (err) {
        reject(new Error('Fichier invalide'))
      }
    }
    reader.onerror = () => reject(new Error('Erreur lecture fichier'))
    reader.readAsText(file)
  })
}

/** Efface toutes les données de l'app */
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
