// ============================================================
// Checklist.jsx — Checklist pré-départ
// ============================================================
import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useChecklist from './hooks/useChecklist'
import useTrips from '../trips/hooks/useTrips'
import { CHECKLIST_TEMPLATES } from '../../utils/constants'

// ── Catégories d'items ───────────────────────────────────────
const CATEGORIES = [
  { value: 'documents',   label: 'Documents',   icon: '📄', color: '#3b82f6' },
  { value: 'finance',     label: 'Finances',    icon: '💳', color: '#10b981' },
  { value: 'electronics', label: 'Électronique',icon: '🔌', color: '#8b5cf6' },
  { value: 'luggage',     label: 'Bagages',     icon: '🧳', color: '#d97c1a' },
  { value: 'health',      label: 'Santé',       icon: '💊', color: '#ef4444' },
  { value: 'work',        label: 'Travail',     icon: '💼', color: '#6366f1' },
  { value: 'misc',        label: 'Divers',      icon: '📦', color: '#9ca3af' },
]

const getCat = (v) => CATEGORIES.find(c => c.value === v) || CATEGORIES[6]

// ── Formulaire ajout item ────────────────────────────────────
const AddItemForm = ({ onAdd, onCancel }) => {
  const [label,    setLabel]    = useState('')
  const [category, setCategory] = useState('misc')
  const [error,    setError]    = useState('')

  const save = () => {
    if (!label.trim()) { setError('Libellé obligatoire'); return }
    onAdd(label.trim(), category)
  }

  return (
    <div style={{ background: 'var(--color-bg-input)', border: '1px solid var(--color-primary)', borderRadius: 14, padding: '1rem', marginBottom: '1rem', animation: 'fadeUp .25s ease both' }}>
      <p style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 .7rem' }}>➕ Nouvel élément</p>

      {/* Catégorie */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginBottom: '.7rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)} style={{
            display: 'flex', alignItems: 'center', gap: '.25rem',
            padding: '.28rem .6rem', borderRadius: 20, cursor: 'pointer',
            fontSize: '.7rem', fontWeight: 600,
            background: category === c.value ? `${c.color}22` : 'var(--color-bg-card)',
            border: `1px solid ${category === c.value ? c.color : 'var(--color-border)'}`,
            color: category === c.value ? c.color : 'var(--color-text-muted)',
          }}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Libellé */}
      <div style={{ display: 'flex', gap: '.5rem' }}>
        <input
          value={label}
          onChange={e => { setLabel(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && save()}
          placeholder="Ex: Passeport valide, chargeur…"
          autoFocus
          style={{ flex: 1, background: 'var(--color-bg-card)', border: `1px solid ${error ? '#f87171' : 'var(--color-border)'}`, borderRadius: 10, padding: '.55rem .8rem', fontSize: '.85rem', color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = error ? '#f87171' : 'var(--color-border)'}
        />
        <button onClick={save} style={{ padding: '.55rem 1rem', borderRadius: 10, border: 'none', background: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '.85rem' }}>OK</button>
        <button onClick={onCancel} style={{ padding: '.55rem .8rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.85rem' }}>✕</button>
      </div>
      {error && <p style={{ fontSize: '.72rem', color: '#f87171', margin: '.25rem 0 0' }}>{error}</p>}
    </div>
  )
}

// ── Item checklist ───────────────────────────────────────────
const CheckItem = ({ item, onToggle, onDelete }) => {
  const cat = getCat(item.category)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '.75rem',
      padding: '.6rem .85rem',
      background: item.checked ? 'var(--color-bg-input)' : 'var(--color-bg-card)',
      border: `1px solid ${item.checked ? 'var(--color-border)' : 'var(--color-border)'}`,
      borderRadius: 12, marginBottom: '.4rem',
      opacity: item.checked ? .65 : 1,
      transition: 'all .2s',
      cursor: 'pointer',
    }}
      onClick={() => onToggle(item.id)}
    >
      {/* Checkbox */}
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        border: `2px solid ${item.checked ? '#10b981' : cat.color}`,
        background: item.checked ? '#10b981' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
        {item.checked && <span style={{ color: '#fff', fontSize: '.75rem', fontWeight: 700 }}>✓</span>}
      </div>

      {/* Icône catégorie */}
      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{cat.icon}</span>

      {/* Label */}
      <p style={{ flex: 1, fontSize: '.88rem', color: 'var(--color-text)', margin: 0, textDecoration: item.checked ? 'line-through' : 'none', lineHeight: 1.3 }}>
        {item.label}
      </p>

      {/* Supprimer */}
      <button onClick={e => { e.stopPropagation(); onDelete(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', fontSize: '.78rem', padding: '.2rem', borderRadius: 6, opacity: .6, flexShrink: 0 }}>✕</button>
    </div>
  )
}

// ============================================================
// Checklist
// ============================================================
const Checklist = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { getTripById } = useTrips()
  const { items, progress, loadTemplate, toggleItem, addItem, deleteItem, resetChecklist } = useChecklist(id)

  const trip = getTripById(id)

  const [showAddForm,    setShowAddForm]    = useState(false)
  const [showTemplates,  setShowTemplates]  = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [activeCategory,   setActiveCategory]   = useState('all')

  // Groupement par catégorie
  const grouped = useMemo(() => {
    const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)
    const map = {}
    filtered.forEach(item => {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    })
    return map
  }, [items, activeCategory])

  const checkedCount  = items.filter(i => i.checked).length
  const pendingCount  = items.length - checkedCount
  const isComplete    = items.length > 0 && checkedCount === items.length

  // Catégories présentes dans la liste
  const usedCategories = useMemo(() =>
    CATEGORIES.filter(c => items.some(i => i.category === c.value)),
    [items]
  )

  const handleAdd = (label, category) => {
    addItem(label, category)
    setShowAddForm(false)
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
          <p style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', margin: '0 0 .15rem' }}>✅ CHECKLIST</p>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Pré-départ
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '.5rem' }}>
          <button onClick={() => setShowTemplates(v => !v)} style={{ padding: '.55rem .9rem', borderRadius: 12, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.8rem', fontWeight: 500 }}>
            📋 Template
          </button>
          <button onClick={() => { setShowAddForm(v => !v) }} style={{ display: 'flex', alignItems: 'center', gap: '.3rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 12, padding: '.55rem .9rem', fontSize: '.82rem', fontWeight: 600, cursor: 'pointer' }}>
            + Item
          </button>
        </div>
      </div>

      {/* Templates */}
      {showTemplates && (
        <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1rem', marginBottom: '1rem', animation: 'fadeUp .25s ease both' }}>
          <p style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 .65rem' }}>📋 Charger un template</p>
          <p style={{ fontSize: '.75rem', color: 'var(--color-text-muted)', margin: '0 0 .7rem' }}>⚠️ Remplace la liste actuelle</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
            {Object.entries(CHECKLIST_TEMPLATES).map(([key, tpl]) => (
              <button key={key} onClick={() => { loadTemplate(key); setShowTemplates(false) }}
                style={{ padding: '.5rem 1rem', borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-bg-input)', color: 'var(--color-text)', cursor: 'pointer', fontSize: '.82rem', fontWeight: 500, transition: 'border-color .15s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#8b5cf6'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
              >
                {tpl.name} <span style={{ color: 'var(--color-text-muted)', fontSize: '.72rem' }}>({tpl.items.length} items)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire ajout */}
      {showAddForm && <AddItemForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />}

      {/* Barre de progression */}
      {items.length > 0 && (
        <div style={{ background: isComplete ? 'linear-gradient(135deg, var(--color-bg-card), #10b98111)' : 'var(--color-bg-card)', border: `1px solid ${isComplete ? '#10b981' : 'var(--color-border)'}`, borderRadius: 16, padding: '1rem', marginBottom: '1rem', animation: 'fadeUp .35s .05s ease both' }}>

          {isComplete ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', margin: '0 0 .35rem' }}>🎉</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: '1rem', color: '#10b981', margin: '0 0 .15rem' }}>Tout est prêt !</p>
              <p style={{ fontSize: '.78rem', color: 'var(--color-text-muted)', margin: 0 }}>Tous les {items.length} éléments sont cochés. Bon voyage !</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
                <div>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#8b5cf6' }}>{progress}%</span>
                  <span style={{ fontSize: '.8rem', color: 'var(--color-text-muted)', marginLeft: '.4rem' }}>
                    {checkedCount}/{items.length} éléments
                  </span>
                </div>
                <span style={{ fontSize: '.78rem', color: 'var(--color-text-muted)' }}>
                  {pendingCount} restant{pendingCount > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--color-bg-input)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)', borderRadius: 4, transition: 'width .4s ease' }} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Filtres catégorie */}
      {usedCategories.length > 1 && (
        <div style={{ display: 'flex', gap: '.35rem', overflowX: 'auto', paddingBottom: '.4rem', marginBottom: '.85rem', animation: 'fadeUp .35s .1s ease both' }}>
          <button onClick={() => setActiveCategory('all')} style={{ flexShrink: 0, padding: '.35rem .8rem', borderRadius: 20, border: '1px solid', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', background: activeCategory === 'all' ? '#8b5cf6' : 'var(--color-bg-card)', borderColor: activeCategory === 'all' ? '#8b5cf6' : 'var(--color-border)', color: activeCategory === 'all' ? '#fff' : 'var(--color-text-muted)' }}>
            Tout ({items.length})
          </button>
          {usedCategories.map(c => (
            <button key={c.value} onClick={() => setActiveCategory(c.value)} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '.3rem', padding: '.35rem .8rem', borderRadius: 20, border: '1px solid', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', background: activeCategory === c.value ? `${c.color}22` : 'var(--color-bg-card)', borderColor: activeCategory === c.value ? c.color : 'var(--color-border)', color: activeCategory === c.value ? c.color : 'var(--color-text-muted)' }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Liste vide */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--color-bg-card)', border: '1px dashed var(--color-border)', borderRadius: 16, animation: 'fadeUp .35s .1s ease both' }}>
          <p style={{ fontSize: '2.5rem', margin: '0 0 .75rem' }}>✅</p>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: 'var(--color-text)', margin: '0 0 .4rem' }}>Checklist vide</p>
          <p style={{ fontSize: '.82rem', color: 'var(--color-text-muted)', margin: '0 0 1.2rem' }}>Chargez un template ou ajoutez vos propres éléments</p>
          <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'center' }}>
            <button onClick={() => setShowTemplates(true)} style={{ padding: '.6rem 1.1rem', borderRadius: 12, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.85rem', fontWeight: 500 }}>
              📋 Template
            </button>
            <button onClick={() => setShowAddForm(true)} style={{ padding: '.6rem 1.1rem', borderRadius: 12, border: 'none', background: '#8b5cf6', color: '#fff', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}>
              + Ajouter
            </button>
          </div>
        </div>
      )}

      {/* Items groupés par catégorie */}
      {Object.entries(grouped).map(([catValue, catItems]) => {
        const cat = getCat(catValue)
        return (
          <div key={catValue} style={{ marginBottom: '1rem', animation: 'fadeUp .35s .15s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', marginBottom: '.5rem' }}>
              <span>{cat.icon}</span>
              <p style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--color-text-muted)', margin: 0 }}>{cat.label}</p>
              <span style={{ fontSize: '.68rem', color: 'var(--color-text-muted)', opacity: .6 }}>
                ({catItems.filter(i => i.checked).length}/{catItems.length})
              </span>
            </div>
            {catItems.map(item => (
              <CheckItem key={item.id} item={item} onToggle={toggleItem} onDelete={deleteItem} />
            ))}
          </div>
        )
      })}

      {/* Reset */}
      {items.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center', animation: 'fadeUp .35s .2s ease both' }}>
          <button onClick={() => setShowResetConfirm(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '.78rem', textDecoration: 'underline' }}>
            Réinitialiser toutes les cases
          </button>
        </div>
      )}

      {/* Confirm reset */}
      {showResetConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowResetConfirm(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 20, padding: '1.5rem', maxWidth: 300, width: '100%', animation: 'fadeUp .25s ease both' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: 'var(--color-text)', margin: '0 0 .5rem' }}>Tout décocher ?</p>
            <p style={{ fontSize: '.82rem', color: 'var(--color-text-muted)', margin: '0 0 1.2rem' }}>Les éléments seront conservés mais toutes les cases seront décochées.</p>
            <div style={{ display: 'flex', gap: '.6rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowResetConfirm(false)} style={{ padding: '.5rem 1rem', borderRadius: 10, border: '1px solid var(--color-border)', background: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '.85rem' }}>Annuler</button>
              <button onClick={() => { resetChecklist(); setShowResetConfirm(false) }} style={{ padding: '.5rem 1rem', borderRadius: 10, border: 'none', background: '#8b5cf6', color: '#fff', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600 }}>Réinitialiser</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checklist

