// ============================================================
// TripForm.jsx — Formulaire création / édition d'un voyage
// ============================================================
import React, { useState } from 'react'
import useTrips from './hooks/useTrips'
import { TRIP_TYPES } from '../../utils/constants'
import { todayISO } from '../../utils/dateUtils'
import { isEndAfterStart } from '../../utils/formatUtils'

const TRIP_ICONS = {
  leisure:'🌴', business:'💼', family:'👨‍👩‍👧', adventure:'🧗',
  citytrip:'🏙️', beach:'🏖️', mountain:'🏔️', cruise:'🚢',
}

const INITIAL = {
  name: '', destination: '', country: '', type: 'leisure',
  startDate: '', endDate: '', people: 1, budget: '', notes: '',
}

// ── Champ de saisie ───────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div style={{ marginBottom: '.9rem' }}>
    <label style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'var(--color-text-muted)', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.04em' }}>
      {label}
    </label>
    {children}
    {error && <p style={{ fontSize:'.72rem', color:'#f87171', marginTop:'.25rem' }}>{error}</p>}
  </div>
)

const inputStyle = (hasError = false) => ({
  width:'100%', background:'var(--color-bg-input)',
  border:`1px solid ${hasError ? '#f87171' : 'var(--color-border)'}`,
  borderRadius:10, padding:'.6rem .85rem',
  fontSize:'.88rem', color:'var(--color-text)',
  outline:'none', boxSizing:'border-box',
  transition:'border-color .2s',
  fontFamily:'inherit',
})

// ============================================================
// TripForm
// ============================================================
const TripForm = ({ trip = null, onSave, onCancel }) => {
  const { addTrip, updateTrip } = useTrips()
  const isEdit = !!trip

  const [form,   setForm]   = useState(trip || INITIAL)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())        e.name        = 'Le nom est obligatoire'
    if (!form.destination.trim()) e.destination = 'La destination est obligatoire'
    if (!form.startDate)          e.startDate   = 'La date de départ est obligatoire'
    if (!form.endDate)            e.endDate     = 'La date de retour est obligatoire'
    if (form.startDate && form.endDate && !isEndAfterStart(form.startDate, form.endDate))
      e.endDate = 'La date de retour doit être après le départ'
    return e
  }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSaving(true)
    const data = { ...form, people: Number(form.people) || 1, budget: Number(form.budget) || 0 }
    if (isEdit) updateTrip(trip.id, data)
    else addTrip(data)
    onSave()
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'0' }}
      onClick={onCancel}
    >
      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />

      {/* Panneau */}
      <div
        style={{
          position:'relative', width:'100%', maxWidth:600,
          background:'var(--color-bg-card)',
          borderRadius:'24px 24px 0 0',
          border:'1px solid var(--color-border)',
          borderBottom:'none',
          maxHeight:'92dvh',
          display:'flex', flexDirection:'column',
          animation:'slideUp .35s cubic-bezier(.32,.72,0,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideUp { from { opacity:0; transform:translateY(60px); } to { opacity:1; transform:translateY(0); } }
          input:focus, select:focus, textarea:focus { border-color: var(--color-primary) !important; }
        `}</style>

        {/* Handle + header */}
        <div style={{ padding:'1rem 1.25rem .75rem', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:'var(--color-border)', margin:'0 auto .9rem' }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.15rem', color:'var(--color-text)', margin:0 }}>
              {isEdit ? '✏️ Modifier le voyage' : '✈️ Nouveau voyage'}
            </h2>
            <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'1.2rem', padding:'.25rem', lineHeight:1 }}>✕</button>
          </div>
        </div>

        {/* Corps scrollable */}
        <div style={{ flex:1, overflowY:'auto', padding:'1.1rem 1.25rem' }}>

          {/* Sélecteur de type avec icônes */}
          <Field label="Type de voyage">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'.4rem' }}>
              {TRIP_TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => set('type', t.value)}
                  style={{
                    display:'flex', flexDirection:'column', alignItems:'center', gap:'.25rem',
                    padding:'.55rem .3rem',
                    background: form.type === t.value ? 'var(--color-primary)' : 'var(--color-bg-input)',
                    border: `1px solid ${form.type === t.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    borderRadius:10, cursor:'pointer',
                    transition:'all .15s',
                  }}
                >
                  <span style={{ fontSize:'1.3rem' }}>{TRIP_ICONS[t.value] || '✈️'}</span>
                  <span style={{ fontSize:'.62rem', fontWeight:600, color: form.type === t.value ? '#fff' : 'var(--color-text-muted)' }}>{t.label}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Nom du voyage */}
          <Field label="Nom du voyage *" error={errors.name}>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ex: Vacances à Barcelone, Road trip USA…"
              style={inputStyle(!!errors.name)}
              onFocus={e => e.target.style.borderColor='var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = errors.name ? '#f87171' : 'var(--color-border)'}
            />
          </Field>

          {/* Destination + Pays sur la même ligne */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.7rem' }}>
            <Field label="Destination *" error={errors.destination}>
              <input
                value={form.destination}
                onChange={e => set('destination', e.target.value)}
                placeholder="Ville, région…"
                style={inputStyle(!!errors.destination)}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = errors.destination ? '#f87171' : 'var(--color-border)'}
              />
            </Field>
            <Field label="Pays">
              <input
                value={form.country}
                onChange={e => set('country', e.target.value)}
                placeholder="France, Espagne…"
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}
              />
            </Field>
          </div>

          {/* Dates sur la même ligne */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.7rem' }}>
            <Field label="Départ *" error={errors.startDate}>
              <input
                type="date"
                value={form.startDate}
                min={todayISO()}
                onChange={e => set('startDate', e.target.value)}
                style={inputStyle(!!errors.startDate)}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = errors.startDate ? '#f87171' : 'var(--color-border)'}
              />
            </Field>
            <Field label="Retour *" error={errors.endDate}>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate || todayISO()}
                onChange={e => set('endDate', e.target.value)}
                style={inputStyle(!!errors.endDate)}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = errors.endDate ? '#f87171' : 'var(--color-border)'}
              />
            </Field>
          </div>

          {/* Personnes + Budget sur la même ligne */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.7rem' }}>
            <Field label="Voyageurs">
              <input
                type="number"
                value={form.people}
                min={1}
                max={20}
                onChange={e => set('people', e.target.value)}
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}
              />
            </Field>
            <Field label="Budget (€)">
              <input
                type="number"
                value={form.budget}
                min={0}
                placeholder="0"
                onChange={e => set('budget', e.target.value)}
                style={inputStyle()}
                onFocus={e => e.target.style.borderColor='var(--color-primary)'}
                onBlur={e => e.target.style.borderColor='var(--color-border)'}
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Idées, remarques, choses à ne pas oublier…"
              rows={3}
              style={{ ...inputStyle(), resize:'none', lineHeight:1.5 }}
              onFocus={e => e.target.style.borderColor='var(--color-primary)'}
              onBlur={e => e.target.style.borderColor='var(--color-border)'}
            />
          </Field>
        </div>

        {/* Footer actions */}
        <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid var(--color-border)', flexShrink:0, display:'flex', gap:'.7rem' }}>
          <button
            onClick={onCancel}
            style={{ flex:1, padding:'.7rem', borderRadius:12, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.88rem', fontWeight:500 }}
          >Annuler</button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex:2, padding:'.7rem', borderRadius:12, border:'none',
              background:'var(--color-primary)', color:'#fff',
              cursor:'pointer', fontSize:'.92rem', fontWeight:700,
              opacity: saving ? .6 : 1,
              boxShadow:'0 4px 14px rgba(217,124,26,.35)',
              transition:'opacity .15s, transform .15s',
            }}
            onMouseEnter={e => !saving && (e.currentTarget.style.transform='translateY(-1px)')}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
          >
            {saving ? '…' : isEdit ? 'Enregistrer' : '✈️ Créer le voyage'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TripForm
