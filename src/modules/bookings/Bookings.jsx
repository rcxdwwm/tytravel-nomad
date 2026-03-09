// ============================================================
// Bookings.jsx — Toutes les réservations d'un voyage
// ============================================================
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useBookings from './hooks/useBookings'
import useTrips from '../trips/hooks/useTrips'
import { BOOKING_LINKS, BOOKING_TYPE_LABELS } from '../../utils/constants'
import { formatDateShort } from '../../utils/dateUtils'

// ── Config des onglets ───────────────────────────────────────
const TABS = [
  { value: 'flight',    label: 'Vol',         icon: '✈️', color: '#6366f1' },
  { value: 'hotel',     label: 'Hébergement', icon: '🏨', color: '#d97c1a' },
  { value: 'car',       label: 'Voiture',     icon: '🚗', color: '#10b981' },
  { value: 'train',     label: 'Train',       icon: '🚄', color: '#3b82f6' },
  { value: 'insurance', label: 'Assurance',   icon: '🛡️', color: '#8b5cf6' },
  { value: 'activity',  label: 'Activité',    icon: '🎯', color: '#f59e0b' },
  { value: 'ferry',     label: 'Ferry',       icon: '⛴️', color: '#0ea5e9' },
]

// ── Champs par type de réservation ───────────────────────────
const FIELDS_BY_TYPE = {
  flight: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: ABC123', required:true },
    { key:'company',      label:'Compagnie',          placeholder:'Air France, EasyJet…' },
    { key:'flightNumber', label:'N° de vol',          placeholder:'AF1234' },
    { key:'departure',    label:'Départ (ville/aéroport)', placeholder:'CDG – Paris Charles de Gaulle' },
    { key:'arrival',      label:'Arrivée (ville/aéroport)', placeholder:'BCN – Barcelone El Prat' },
    { key:'departDate',   label:'Date départ',        type:'date' },
    { key:'departTime',   label:'Heure départ',       type:'time' },
    { key:'arrivalTime',  label:'Heure arrivée',      type:'time' },
    { key:'baggage',      label:'Bagages inclus',     placeholder:'1 cabine + 1 soute 23kg' },
    { key:'seat',         label:'Siège(s)',           placeholder:'12A, 12B' },
    { key:'link',         label:'Lien de gestion',   placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  hotel: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: BK-987654', required:true },
    { key:'name',         label:'Nom de l\'établissement', placeholder:'Hôtel Barcelone Center', required:true },
    { key:'address',      label:'Adresse',           placeholder:'Carrer de Mallorca 1, Barcelone' },
    { key:'checkIn',      label:'Check-in',          type:'date' },
    { key:'checkInTime',  label:'Heure check-in',    type:'time' },
    { key:'checkOut',     label:'Check-out',         type:'date' },
    { key:'checkOutTime', label:'Heure check-out',   type:'time' },
    { key:'phone',        label:'Téléphone',         placeholder:'+34 93 000 00 00' },
    { key:'link',         label:'Lien de gestion',   placeholder:'https://booking.com/…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  car: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: RC-456789', required:true },
    { key:'company',      label:'Loueur',             placeholder:'Europcar, Hertz…' },
    { key:'pickupPlace',  label:'Lieu de prise en charge', placeholder:'Aéroport T2' },
    { key:'pickupDate',   label:'Date de prise',     type:'date' },
    { key:'pickupTime',   label:'Heure de prise',    type:'time' },
    { key:'returnPlace',  label:'Lieu de restitution', placeholder:'Même agence' },
    { key:'returnDate',   label:'Date de retour',    type:'date' },
    { key:'carType',      label:'Catégorie / Véhicule', placeholder:'Citadine, SUV…' },
    { key:'link',         label:'Lien de gestion',   placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  train: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: TGV-789', required:true },
    { key:'company',      label:'Compagnie',          placeholder:'SNCF, Renfe, Trainline…' },
    { key:'departure',    label:'Gare de départ',    placeholder:'Paris Gare de Lyon' },
    { key:'arrival',      label:'Gare d\'arrivée',   placeholder:'Barcelone Sants' },
    { key:'departDate',   label:'Date départ',        type:'date' },
    { key:'departTime',   label:'Heure départ',       type:'time' },
    { key:'arrivalTime',  label:'Heure arrivée',      type:'time' },
    { key:'seat',         label:'Voiture / Siège',   placeholder:'Voiture 5, siège 23' },
    { key:'link',         label:'Lien de gestion',   placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  insurance: [
    { key:'confirmation', label:'N° de police',      placeholder:'Ex: POL-2025-XXXX', required:true },
    { key:'company',      label:'Assureur',           placeholder:'AXA, Allianz…' },
    { key:'startDate',    label:'Début de validité', type:'date' },
    { key:'endDate',      label:'Fin de validité',   type:'date' },
    { key:'emergency',    label:'N° urgence 24h/24', placeholder:'+33 1 00 00 00 00' },
    { key:'coverage',     label:'Garanties',         placeholder:'Annulation, rapatriement, bagages…' },
    { key:'link',         label:'Lien / Documents',  placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  activity: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: ACT-123' },
    { key:'name',         label:'Nom de l\'activité', placeholder:'Visite guidée Sagrada Familia', required:true },
    { key:'provider',     label:'Prestataire',       placeholder:'GetYourGuide, Airbnb Exp…' },
    { key:'date',         label:'Date',              type:'date' },
    { key:'time',         label:'Heure',             type:'time' },
    { key:'address',      label:'Lieu / Adresse',    placeholder:'Carrer de Mallorca 401' },
    { key:'duration',     label:'Durée',             placeholder:'2h30' },
    { key:'price',        label:'Prix (€)',          type:'number', placeholder:'0' },
    { key:'link',         label:'Lien',              placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
  ferry: [
    { key:'confirmation', label:'N° de réservation', placeholder:'Ex: FER-789', required:true },
    { key:'company',      label:'Compagnie',          placeholder:'Corsica Ferries…' },
    { key:'departure',    label:'Port de départ',    placeholder:'Marseille' },
    { key:'arrival',      label:'Port d\'arrivée',   placeholder:'Ajaccio' },
    { key:'departDate',   label:'Date départ',        type:'date' },
    { key:'departTime',   label:'Heure départ',       type:'time' },
    { key:'arrivalTime',  label:'Heure arrivée',      type:'time' },
    { key:'cabin',        label:'Cabine / Places',   placeholder:'Cabine 2 pers., pont 7' },
    { key:'link',         label:'Lien de gestion',   placeholder:'https://…' },
    { key:'note',         label:'Notes',             multiline:true },
  ],
}

// ── Formulaire réservation ───────────────────────────────────
const BookingForm = ({ type, initial, onSave, onCancel }) => {
  const tab    = TABS.find(t => t.value === type)
  const fields = FIELDS_BY_TYPE[type] || []

  const [form, setForm] = useState(() => {
    const base = { type }
    fields.forEach(f => { base[f.key] = initial?.[f.key] || '' })
    return initial ? { ...initial } : base
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }

  const save = () => {
    const e = {}
    fields.filter(f => f.required).forEach(f => { if (!form[f.key]?.trim()) e[f.key] = 'Champ obligatoire' })
    if (Object.keys(e).length) { setErrors(e); return }
    onSave(form)
  }

  const inp = (hasErr, multiline) => ({
    width:'100%', background:'var(--color-bg-input)',
    border:`1px solid ${hasErr ? '#f87171' : 'var(--color-border)'}`,
    borderRadius:10, padding:'.55rem .8rem',
    fontSize:'.85rem', color:'var(--color-text)',
    outline:'none', boxSizing:'border-box', fontFamily:'inherit',
    ...(multiline ? { resize:'none', lineHeight:1.5 } : {}),
  })

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={onCancel}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:600, background:'var(--color-bg-card)', borderRadius:'22px 22px 0 0', border:'1px solid var(--color-border)', borderBottom:'none', animation:'slideUp .3s cubic-bezier(.32,.72,0,1) both', maxHeight:'90dvh', display:'flex', flexDirection:'column' }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <div style={{ padding:'.9rem 1.25rem .7rem', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'var(--color-border)', margin:'0 auto .75rem' }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:0 }}>
              {tab?.icon} {initial ? 'Modifier' : 'Nouvelle réservation'} — {tab?.label}
            </h3>
            <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'1.2rem' }}>✕</button>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'1rem 1.25rem' }}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom:'.75rem' }}>
              <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .35rem' }}>
                {f.label}{f.required ? ' *' : ''}
              </p>
              {f.multiline ? (
                <textarea value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} rows={2} style={inp(!!errors[f.key], true)} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor = errors[f.key] ? '#f87171' : 'var(--color-border)'} />
              ) : (
                <input type={f.type || 'text'} value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} style={inp(!!errors[f.key])} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor = errors[f.key] ? '#f87171' : 'var(--color-border)'} />
              )}
              {errors[f.key] && <p style={{ fontSize:'.7rem', color:'#f87171', margin:'.2rem 0 0' }}>{errors[f.key]}</p>}
            </div>
          ))}
        </div>

        <div style={{ padding:'.9rem 1.25rem', borderTop:'1px solid var(--color-border)', flexShrink:0, display:'flex', gap:'.6rem' }}>
          <button onClick={onCancel} style={{ flex:1, padding:'.65rem', borderRadius:12, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.88rem' }}>Annuler</button>
          <button onClick={save} style={{ flex:2, padding:'.65rem', borderRadius:12, border:'none', background: tab?.color || 'var(--color-primary)', color:'#fff', cursor:'pointer', fontSize:'.92rem', fontWeight:700 }}>
            {initial ? 'Enregistrer' : `➕ Ajouter`}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Carte réservation ────────────────────────────────────────
const BookingCard = ({ booking, onEdit, onDelete }) => {
  const tab   = TABS.find(t => t.value === booking.type) || TABS[0]
  const title = booking.name || booking.company || booking.confirmation || '—'
  const sub   = [booking.departure, booking.arrival, booking.address, booking.pickupPlace].filter(Boolean).join(' → ')

  return (
    <div style={{
      background:'var(--color-bg-card)', border:'1px solid var(--color-border)',
      borderRadius:14, padding:'.85rem', marginBottom:'.55rem',
      borderLeft:`3px solid ${tab.color}`,
      transition:'box-shadow .15s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow=`0 4px 14px ${tab.color}22`}
      onMouseLeave={e => e.currentTarget.style.boxShadow='none'}
    >
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.5rem' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.9rem', color:'var(--color-text)', margin:'0 0 .2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {title}
          </p>
          {sub && <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:'0 0 .25rem' }}>{sub}</p>}
          {booking.confirmation && (
            <span style={{ fontSize:'.68rem', fontFamily:'monospace', background:'var(--color-bg-input)', padding:'.15rem .5rem', borderRadius:6, color:tab.color, border:`1px solid ${tab.color}44` }}>
              #{booking.confirmation}
            </span>
          )}
          {/* Dates clés selon le type */}
          {(booking.departDate || booking.checkIn || booking.pickupDate || booking.startDate || booking.date) && (
            <p style={{ fontSize:'.72rem', color:'var(--color-text-muted)', margin:'.35rem 0 0' }}>
              📅 {formatDateShort(booking.departDate || booking.checkIn || booking.pickupDate || booking.startDate || booking.date)}
              {(booking.departTime || booking.checkInTime || booking.pickupTime) && ` · ${booking.departTime || booking.checkInTime || booking.pickupTime}`}
            </p>
          )}
          {/* Lien externe */}
          {booking.link && (
            <a href={booking.link} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ display:'inline-flex', alignItems:'center', gap:'.25rem', marginTop:'.35rem', fontSize:'.72rem', color:tab.color, textDecoration:'none' }}>
              🔗 Gérer la réservation
            </a>
          )}
        </div>
        {/* Actions */}
        <div style={{ display:'flex', gap:'.3rem', flexShrink:0 }}>
          <button onClick={() => onEdit(booking)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'.8rem', padding:'.3rem', borderRadius:8 }}>✏️</button>
          <button onClick={() => onDelete(booking.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', fontSize:'.8rem', padding:'.3rem', borderRadius:8 }}>🗑️</button>
        </div>
      </div>
    </div>
  )
}

// ── Section liens rapides ────────────────────────────────────
const QuickLinks = ({ type }) => {
  const linksMap = { flight:'flights', hotel:'hotels', car:'cars', train:'trains' }
  const key   = linksMap[type]
  const links = key ? BOOKING_LINKS[key] : null
  if (!links) return null

  return (
    <div style={{ marginBottom:'1rem', padding:'.8rem', background:'var(--color-bg-input)', borderRadius:12, border:'1px solid var(--color-border)' }}>
      <p style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--color-text-muted)', margin:'0 0 .6rem' }}>
        🔗 Sites de réservation
      </p>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'.4rem' }}>
        {links.map(l => (
          <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer"
            style={{ display:'inline-flex', alignItems:'center', gap:'.3rem', padding:'.35rem .75rem', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:20, fontSize:'.75rem', fontWeight:500, color:'var(--color-text)', textDecoration:'none', transition:'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
          >
            {l.icon} {l.name}
          </a>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Bookings
// ============================================================
const Bookings = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { getTripById } = useTrips()
  const { tripBookings, addBooking, updateBooking, deleteBooking, getByType } = useBookings(id)

  const trip = getTripById(id)

  const [activeTab,  setActiveTab]  = useState('flight')
  const [showForm,   setShowForm]   = useState(false)
  const [editTarget, setEditTarget] = useState(null)

  const currentTab = TABS.find(t => t.value === activeTab)
  const bookingsForTab = getByType(activeTab)

  const handleSave = (data) => {
    if (editTarget) updateBooking(editTarget.id, data)
    else addBooking({ ...data, type: activeTab })
    setShowForm(false)
    setEditTarget(null)
  }

  const handleEdit = (booking) => { setEditTarget(booking); setShowForm(true) }
  const handleDelete = (bookingId) => deleteBooking(bookingId)

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Retour */}
      <button onClick={() => navigate(`/voyages/${id}`)} style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'.82rem', fontWeight:500, padding:'0 0 1rem', marginLeft:'-.25rem' }}>
        ← {trip?.name || 'Voyage'}
      </button>

      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', animation:'fadeUp .35s ease both' }}>
        <div>
          <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .15rem' }}>🎫 RÉSERVATIONS</p>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.4rem', fontWeight:800, color:'var(--color-text)', margin:0 }}>
            {tripBookings.length} réservation{tripBookings.length !== 1 ? 's' : ''}
          </h1>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true) }}
          style={{ display:'flex', alignItems:'center', gap:'.35rem', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.6rem 1rem', fontSize:'.85rem', fontWeight:600, cursor:'pointer', boxShadow:'0 4px 12px rgba(217,124,26,.3)' }}
        >
          <span>+</span> Ajouter
        </button>
      </div>

      {/* Onglets */}
      <div style={{ display:'flex', gap:'.35rem', overflowX:'auto', paddingBottom:'.4rem', marginBottom:'1rem', animation:'fadeUp .35s .05s ease both' }}>
        {TABS.map(t => {
          const count = getByType(t.value).length
          const active = activeTab === t.value
          return (
            <button key={t.value} onClick={() => setActiveTab(t.value)} style={{
              flexShrink:0, display:'flex', alignItems:'center', gap:'.3rem',
              padding:'.4rem .85rem', borderRadius:20, border:'1px solid',
              fontSize:'.78rem', fontWeight:600, cursor:'pointer', transition:'all .15s',
              background: active ? `${t.color}22` : 'var(--color-bg-card)',
              borderColor: active ? t.color : 'var(--color-border)',
              color: active ? t.color : 'var(--color-text-muted)',
            }}>
              {t.icon} {t.label}
              {count > 0 && <span style={{ fontSize:'.65rem', fontWeight:700, padding:'.1rem .4rem', borderRadius:20, background: active ? t.color : 'var(--color-bg-input)', color: active ? '#fff' : 'var(--color-text-muted)' }}>{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Liens rapides */}
      <QuickLinks type={activeTab} />

      {/* Liste */}
      <div style={{ animation:'fadeUp .35s .1s ease both' }}>
        {bookingsForTab.length === 0 ? (
          <div style={{ textAlign:'center', padding:'2rem 1rem', background:'var(--color-bg-card)', border:'1px dashed var(--color-border)', borderRadius:14 }}>
            <p style={{ fontSize:'2rem', margin:'0 0 .5rem' }}>{currentTab?.icon}</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--color-text)', margin:'0 0 .35rem' }}>
              Aucune réservation {currentTab?.label}
            </p>
            <p style={{ fontSize:'.8rem', color:'var(--color-text-muted)', margin:'0 0 1rem' }}>
              Ajoutez votre première réservation
            </p>
            <button onClick={() => { setEditTarget(null); setShowForm(true) }} style={{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.6rem 1.2rem', fontSize:'.85rem', fontWeight:600, cursor:'pointer' }}>
              + Ajouter
            </button>
          </div>
        ) : (
          bookingsForTab.map(b => (
            <BookingCard key={b.id} booking={b} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <BookingForm
          type={activeTab}
          initial={editTarget}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}
    </div>
  )
}

export default Bookings
