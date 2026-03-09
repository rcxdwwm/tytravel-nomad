// ============================================================
// useBudget.js — CRUD dépenses + calculs budget
// ============================================================
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useApp } from '../../../context/AppContext'

const useBudget = (tripId) => {
  const { budgets, setBudgets, getTripById, showToast } = useApp()
  const trip     = getTripById(tripId)
  const expenses = budgets[tripId] || []

  const totalBudget = trip?.budget || 0
  const totalSpent  = useMemo(() => expenses.reduce((s, e) => s + (e.amount || 0), 0), [expenses])
  const remaining   = totalBudget - totalSpent

  const addExpense = useCallback((data) => {
    const e = { ...data, id: uuidv4(), createdAt: new Date().toISOString() }
    setBudgets((p) => ({ ...p, [tripId]: [...(p[tripId] || []), e] }))
    showToast('Dépense ajoutée')
  }, [tripId, setBudgets, showToast])

  const updateExpense = useCallback((expId, updates) => {
    setBudgets((p) => ({
      ...p,
      [tripId]: (p[tripId] || []).map((e) => e.id === expId ? { ...e, ...updates } : e),
    }))
    showToast('Dépense mise à jour')
  }, [tripId, setBudgets, showToast])

  const deleteExpense = useCallback((expId) => {
    setBudgets((p) => ({
      ...p,
      [tripId]: (p[tripId] || []).filter((e) => e.id !== expId),
    }))
  }, [tripId, setBudgets])

  return { expenses, totalBudget, totalSpent, remaining, addExpense, updateExpense, deleteExpense }
}

export default useBudget
