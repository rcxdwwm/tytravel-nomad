// ============================================================
// Budget.jsx — Budget et dépenses d'un voyage
// ============================================================
import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useBudget from './hooks/useBudget'
import useTrips from '../trips/hooks/useTrips'
import { BUDGET_CATEGORIES } from '../../utils/constants'
import { formatDateShort, todayISO } from '../../utils/dateUtils'
import { useApp } from '../../context/AppContext'

const getCat = (v) => BUDGET_CATEGORIES.find(c => c.value === v) || { label: 'Divers', icon: '📦', value: 'misc' }

// ── Barre de progression colorée ────────────────────────────
const ProgressBar = ({ pct, color = 'var(--color-primary)', warn = false }) => (
  <div style={{ height: 6, background: 'var(--color-bg-input)', borderRadius: 3, overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      width: `${Math.min(100, pct)}%`,
      background: warn && pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : color,
      borderRadius: 3,
      transition: 'width .5s ease',
    }} />
  </div>
)

// ── Formulaire dépense ───────────────────────────────────────
const ExpenseForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState(initial || {
    label: '', amount: '', category: 'food', date: todayISO(), note: '',
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }

  const save = () => {
    const e = {}
    if (!form.label.trim())           e.label  = 'Libellé obligatoire'
    if (!form.amount || form.amount <= 0) e.amount = 'Montant invalide'
    if (Object.keys(e).length) { setErrors(e); return }
    onSave({ ...form, amount: parseFloat(form.amount) })
  }

  const inp = (hasErr) => ({
    width: '100%', background: 'var(--color-bg-input)',
    border: `1px solid ${hasErr ? '#f87171' : 'var(--color-border)'}`,
    borderRadius: 10, padding: '.55rem .8rem',
    fontSize: '.85rem', color: 'var(--color-text)',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  })

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onCancel}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 600, background: 'var(--color-bg-card)', borderRadius: '22px 22px 0 0', border: '1px solid var(--color-border)', borderBottom: 'none', animation: 'slideUp .3s cubic-bezier(.32,.72,0,1) both', maxHeight: '88dvh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <div style={{ padding: '.9rem 1.25rem .7rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--color-border)', margin: '0 auto .75rem' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text)', margin: 0 }}>
              {initial ? '✏️ Modifier la dépense' : '💸 Nouvelle dépense'}
            </h3>
            <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>

          {/* Catégorie */}
          <div style={{ marginBottom: '.9rem' }}>
            <p style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 .4rem' }}>Catégorie</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.35rem' }}>
              {BUDGET_CATEGORIES.map(c => (
                <button key={c.value} onClick={() => set('category', c.value)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.2rem',
                  padding: '.5rem .3rem', borderRadius: 10, cursor: 'pointer',
                  background: form.category === c.value ? 'var(--color-primary)' : 'var(--color-bg-input)',
                  border: `1px solid ${form.category === c.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                  <span style={{ fontSize: '.62rem', fontWeight: 600, color: form.category === c.value ? '#fff' : 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Libellé */}
          <div style={{ marginBottom: '.7rem' }}>
            <p style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 .35rem' }}>Libellé *</p>
            <input value={form.label} onChange={e => set('label', e.target.value)} placeholder="Ex: Restaurant La Barceloneta…" style={inp(!!errors.label)} onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = errors.label ? '#f87171' : 'var(--color-border)'} />
            {errors.label && <p style={{ fontSize: '.7rem', color: '#f87171', margin: '.2rem 0 0' }}>{errors.label}</p>}
          </div>

          {/* Montant + Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem', marginBottom: '.7rem' }}>
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 .35rem' }}>Montant (€) *</p>
              <input type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" style={inp(!!errors.amount)} onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = errors.amount ? '#f87171' : 'var(--color-border)'} />
              {errors.amount && <p style={{ fontSize: '.7rem', color: '#f87171', margin: '.2rem 0 0' }}>{errors.amount}</p>}
            </div>
            <div>
              <p style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 .35rem' }}>Date</p>
              <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={inp(false)} onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
            </div>
          </div>

          {/* Note */}
          <div>
            <p style={{ fontSize: '.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.04em', margin: '0 0 .35rem' }}>Note</p>
            <textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="Détails, partage entre voyageurs…" rows={2} style={{ ...inp(false), resize: 'none', lineHeight: 1.5 }} onFocus={e => e.target.style.borderColor = 'var(--color-primary)'} onBlur={e => e.target.style.borderColor = 'var(--color-border)'} />
          </div>
        </div>

        <div style={{ padding: '.9rem 1.25rem', borderTop: '1px solid var(--color-border)', flexShrink: 0, display: 'flex', gap: '.6rem' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '.65rem', borderRadius: 12, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.88rem' }}>Annuler</button>
          <button onClick={save} style={{ flex: 2, padding: '.65rem', borderRadius: 12, border: 'none', background: '#10b981', color: '#fff', cursor: 'pointer', fontSize: '.92rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(16,185,129,.3)' }}>
            {initial ? 'Enregistrer' : '💸 Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ligne dépense ────────────────────────────────────────────
const ExpenseRow = ({ expense, onEdit, onDelete }) => {
  const cat = getCat(expense.category)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.7rem .85rem', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 12, marginBottom: '.45rem', transition: 'border-color .15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--color-bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '.88rem', color: 'var(--color-text)', margin: '0 0 .1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{expense.label}</p>
        <p style={{ fontSize: '.72rem', color: 'var(--color-text-muted)', margin: 0 }}>{cat.label} · {formatDateShort(expense.date)}</p>
      </div>
      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: '.95rem', color: '#10b981', flexShrink: 0 }}>
        {expense.amount.toFixed(2)} €
      </span>
      <div style={{ display: 'flex', gap: '.25rem', flexShrink: 0 }}>
        <button onClick={() => onEdit(expense)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '.8rem', padding: '.25rem', borderRadius: 6 }}>✏️</button>
        <button onClick={() => onDelete(expense.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '.8rem', padding: '.25rem', borderRadius: 6 }}>🗑️</button>
      </div>
    </div>
  )
}

// ============================================================
// Budget
// ============================================================
const Budget = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { } = useTrips()
  const { getTripById } = useApp()
  const { expenses, totalBudget, totalSpent, remaining, addExpense, updateExpense, deleteExpense } = useBudget(id)

  const trip = getTripById(id)

  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  // Dépenses par catégorie
  const byCategory = useMemo(() => {
    const map = {}
    expenses.forEach(e => {
      if (!map[e.category]) map[e.category] = 0
      map[e.category] += e.amount
    })
    return map
  }, [expenses])

  // Top catégories triées par montant
  const topCategories = useMemo(() =>
    BUDGET_CATEGORIES
      .filter(c => byCategory[c.value] > 0)
      .map(c => ({ ...c, total: byCategory[c.value] }))
      .sort((a, b) => b.total - a.total),
    [byCategory]
  )

  // Filtrage
  const filtered = useMemo(() => {
    const list = activeFilter === 'all' ? expenses : expenses.filter(e => e.category === activeFilter)
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [expenses, activeFilter])

  const budgetPct  = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  const isOverBudget = totalBudget > 0 && totalSpent > totalBudget

  const handleSave = (data) => {
    if (editTarget) updateExpense(editTarget.id, data)
    else addExpense(data)
    setShowForm(false)
    setEditTarget(null)
  }

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Retour */}
      <button onClick={() => navigate(`/voyages/${id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: '.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '.82rem', fontWeight: 500, padding: '0 0 1rem', marginLeft: '-.25rem' }}>
        ← {trip?.name || 'Voyage'}
      </button>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', animation: 'fadeUp .35s ease both' }}>
        <div>
          <p style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', margin: '0 0 .15rem' }}>💶 BUDGET</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            {trip?.name}
          </h1>
        </div>
        <button onClick={() => { setEditTarget(null); setShowForm(true) }} style={{ display: 'flex', alignItems: 'center', gap: '.35rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '.6rem 1rem', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,.3)' }}>
          <span>+</span> Dépense
        </button>
      </div>

      {/* Résumé budget */}
      <div style={{ background: isOverBudget ? 'linear-gradient(135deg, var(--color-bg-card), #ef444411)' : 'var(--color-bg-card)', border: `1px solid ${isOverBudget ? '#ef4444' : 'var(--color-border)'}`, borderRadius: 18, padding: '1.1rem', marginBottom: '1rem', animation: 'fadeUp .35s .05s ease both' }}>

        {/* Chiffres clés */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '.5rem', marginBottom: '1rem' }}>
          {[
            { label: 'Dépensé', value: `${totalSpent.toFixed(2)} €`, color: '#10b981' },
            { label: 'Budget prévu', value: totalBudget > 0 ? `${totalBudget} €` : '—', color: 'var(--color-primary)' },
            { label: remaining >= 0 ? 'Restant' : 'Dépassement', value: `${Math.abs(remaining).toFixed(2)} €`, color: remaining >= 0 ? 'var(--color-accent)' : '#ef4444' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '.6rem .3rem', background: 'var(--color-bg-input)', borderRadius: 12 }}>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.1rem', fontWeight: 800, color: s.color, margin: '0 0 .15rem', lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: '.65rem', textTransform: 'uppercase', letterSpacing: '.04em', color: 'var(--color-text-muted)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Barre de progression globale */}
        {totalBudget > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.35rem' }}>
              <span style={{ fontSize: '.75rem', color: 'var(--color-text-muted)' }}>
                {isOverBudget ? '⚠️ Budget dépassé !' : `${budgetPct}% du budget utilisé`}
              </span>
              <span style={{ fontSize: '.75rem', fontWeight: 700, color: budgetPct > 90 ? '#ef4444' : 'var(--color-text)' }}>{budgetPct}%</span>
            </div>
            <ProgressBar pct={budgetPct} warn />
          </div>
        )}

        {totalBudget === 0 && expenses.length === 0 && (
          <p style={{ fontSize: '.8rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: 0 }}>
            Commencez à saisir vos dépenses 👇
          </p>
        )}
      </div>

      {/* Répartition par catégorie */}
      {topCategories.length > 0 && (
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1rem', marginBottom: '1rem', animation: 'fadeUp .35s .1s ease both' }}>
          <p style={{ fontSize: '.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--color-text-muted)', margin: '0 0 .75rem' }}>📊 Répartition</p>
          {topCategories.map(c => (
            <div key={c.value} style={{ marginBottom: '.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
                <span style={{ fontSize: '.82rem', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                  {c.icon} {c.label}
                </span>
                <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#10b981' }}>{c.total.toFixed(2)} €
                  <span style={{ fontSize: '.7rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '.3rem' }}>
                    ({totalSpent > 0 ? Math.round(c.total / totalSpent * 100) : 0}%)
                  </span>
                </span>
              </div>
              <ProgressBar pct={totalSpent > 0 ? (c.total / totalSpent) * 100 : 0} color="#10b981" />
            </div>
          ))}
        </div>
      )}

      {/* Filtres catégorie */}
      {expenses.length > 0 && (
        <div style={{ display: 'flex', gap: '.35rem', overflowX: 'auto', paddingBottom: '.4rem', marginBottom: '.85rem', animation: 'fadeUp .35s .15s ease both' }}>
          <button onClick={() => setActiveFilter('all')} style={{ flexShrink: 0, padding: '.35rem .8rem', borderRadius: 20, border: '1px solid', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', background: activeFilter === 'all' ? 'var(--color-primary)' : 'var(--color-bg-card)', borderColor: activeFilter === 'all' ? 'var(--color-primary)' : 'var(--color-border)', color: activeFilter === 'all' ? '#fff' : 'var(--color-text-muted)' }}>
            Toutes ({expenses.length})
          </button>
          {topCategories.map(c => (
            <button key={c.value} onClick={() => setActiveFilter(c.value)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.35rem .8rem', borderRadius: 20, border: '1px solid', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', background: activeFilter === c.value ? '#10b98122' : 'var(--color-bg-card)', borderColor: activeFilter === c.value ? '#10b981' : 'var(--color-border)', color: activeFilter === c.value ? '#10b981' : 'var(--color-text-muted)' }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Liste dépenses */}
      <div style={{ animation: 'fadeUp .35s .2s ease both' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--color-bg-card)', border: '1px dashed var(--color-border)', borderRadius: 14 }}>
            <p style={{ fontSize: '2rem', margin: '0 0 .5rem' }}>💶</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: 'var(--color-text)', margin: '0 0 .35rem' }}>Aucune dépense</p>
            <p style={{ fontSize: '.8rem', color: 'var(--color-text-muted)', margin: '0 0 1rem' }}>Notez vos dépenses au fil du voyage</p>
            <button onClick={() => { setEditTarget(null); setShowForm(true) }} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '.6rem 1.2rem', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}>
              + Ajouter une dépense
            </button>
          </div>
        ) : (
          filtered.map(e => (
            <ExpenseRow key={e.id} expense={e} onEdit={(exp) => { setEditTarget(exp); setShowForm(true) }} onDelete={deleteExpense} />
          ))
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <ExpenseForm initial={editTarget} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null) }} />
      )}
    </div>
  )
}

export default Budget
