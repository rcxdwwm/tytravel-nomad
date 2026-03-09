// ============================================================
// useChecklist.js — CRUD items checklist par voyage
// ============================================================
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '../../../context/AppContext'
import { CHECKLIST_TEMPLATES } from '../../../utils/constants'

const useChecklist = (tripId) => {
  const { checklists, setChecklists, showToast } = useApp()
  const items = checklists[tripId] || []

  const progress = useMemo(() =>
    !items.length ? 0 : Math.round(items.filter(i => i.checked).length / items.length * 100),
    [items]
  )

  const save = useCallback((newItems) => {
    setChecklists(p => ({ ...p, [tripId]: newItems }))
  }, [tripId, setChecklists])

  const loadTemplate = useCallback((key) => {
    const tpl = CHECKLIST_TEMPLATES[key]
    if (!tpl) return
    save(tpl.items.map(item => ({ ...item, id: uuidv4(), checked: false })))
    showToast(`Template "${tpl.name}" chargé`)
  }, [save, showToast])

  const toggleItem = useCallback((id) => {
    save(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }, [items, save])

  const addItem = useCallback((label, category = 'misc') => {
    save([...items, { id: uuidv4(), label, category, checked: false }])
  }, [items, save])

  const deleteItem = useCallback((id) => {
    save(items.filter(i => i.id !== id))
  }, [items, save])

  /** Décoche tous les items sans les supprimer */
  const resetChecklist = useCallback(() => {
    save(items.map(i => ({ ...i, checked: false })))
    showToast('Checklist réinitialisée')
  }, [items, save, showToast])

  return { items, progress, loadTemplate, toggleItem, addItem, deleteItem, resetChecklist }
}

export default useChecklist
