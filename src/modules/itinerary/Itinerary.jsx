// ============================================================
// Itinerary.jsx — Timeline jour par jour d'un voyage
// ============================================================
import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useItinerary from './hooks/useItinerary'
import useTrips from '../trips/hooks/useTrips'
import { getDateRange, formatDate, formatDateMini, formatTime } from '../../utils/dateUtils'
import { useApp } from '../../context/AppContext'

// ── Types d'activités ────────────────────────────────────────
const ACTIVITY_TYPES = [
  { value: 'transport', label: 'Transport',  icon: '🚗', color: '#3b82f6' },
  { value: 'flight',    label: 'Vol',        icon: '✈️', color: '#6366f1' },
  { value: 'hotel',     label: 'Hôtel',      icon: '🏨', color: '#d97c1a' },
  { value: 'visit',     label: 'Visite',     icon: '🏛️', color: '#10b981' },
  { value: 'food',      label: 'Repas',      icon: '🍽️', color: '#f59e0b' },
  { value: 'activity',  label: 'Activité',   icon: '🎯', color: '#8b5cf6' },
  { value: 'shopping',  label: 'Shopping',   icon: '🛍️', color: '#ec4899' },
  { value: 'rest',      label: 'Repos',      icon: '😴', color: '#6b7280' },
  { value: 'other',     label: 'Autre',      icon: '📌', color: '#9ca3af' },
]

const getType = (v) => ACTIVITY_TYPES.find(t => t.value === v) || ACTIVITY_TYPES[8]

// ── Lien maps universel (iOS + Android) ─────────────────────
const mapUrl = (place) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`

// ── Formulaire d'activité ────────────────────────────────────
const ActivityForm = ({ onSave, onCancel, initial = null }) => {
  const [form, setForm] = useState(initial || { type:'visit', time:'', title:'', place:'', note:'' })
  const [err,  setErr]  = useState({})

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErr(e => ({ ...e, [k]: null })) }

  const save = () => {
    if (!form.title.trim()) { setErr({ title: 'Titre obligatoire' }); return }
    onSave(form)
  }

  const inp = (hasErr) => ({
    width:'100%', background:'var(--color-bg-input)',
    border:`1px solid ${hasErr ? '#f87171' : 'var(--color-border)'}`,
    borderRadius:10, padding:'.55rem .8rem',
    fontSize:'.85rem', color:'var(--color-text)',
    outline:'none', boxSizing:'border-box', fontFamily:'inherit',
  })

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={onCancel}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:600, background:'var(--color-bg-card)', borderRadius:'22px 22px 0 0', border:'1px solid var(--color-border)', borderBottom:'none', animation:'slideUp .3s cubic-bezier(.32,.72,0,1) both' }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <div style={{ padding:'.9rem 1.25rem .7rem', borderBottom:'1px solid var(--color-border)' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'var(--color-border)', margin:'0 auto .75rem' }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:0 }}>
              {initial ? '✏️ Modifier' : '➕ Nouvelle activité'}
            </h3>
            <button onClick={onCancel} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'1.2rem' }}>✕</button>
          </div>
        </div>

        <div style={{ padding:'1rem 1.25rem', overflowY:'auto', maxHeight:'65dvh' }}>
          {/* Type */}
          <div style={{ marginBottom:'.85rem' }}>
            <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .4rem' }}>Type</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem' }}>
              {ACTIVITY_TYPES.map(t => (
                <button key={t.value} onClick={() => set('type', t.value)} style={{
                  display:'flex', alignItems:'center', gap:'.3rem',
                  padding:'.35rem .7rem', borderRadius:20,
                  border:`1px solid ${form.type === t.value ? t.color : 'var(--color-border)'}`,
                  background: form.type === t.value ? `${t.color}22` : 'var(--color-bg-input)',
                  color: form.type === t.value ? t.color : 'var(--color-text-muted)',
                  fontSize:'.75rem', fontWeight:600, cursor:'pointer',
                }}>
                  <span>{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Heure + Titre */}
          <div style={{ display:'grid', gridTemplateColumns:'100px 1fr', gap:'.65rem', marginBottom:'.65rem' }}>
            <div>
              <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .35rem' }}>Heure</p>
              <input type="time" value={form.time} onChange={e => set('time', e.target.value)} style={inp(false)} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor='var(--color-border)'} />
            </div>
            <div>
              <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .35rem' }}>Titre *</p>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Visite du Sagrada Familia…" style={inp(!!err.title)} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor = err.title ? '#f87171' : 'var(--color-border)'} />
              {err.title && <p style={{ fontSize:'.7rem', color:'#f87171', margin:'.2rem 0 0' }}>{err.title}</p>}
            </div>
          </div>

          {/* Lieu */}
          <div style={{ marginBottom:'.65rem' }}>
            <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .35rem' }}>Lieu / Adresse</p>
            <input value={form.place} onChange={e => set('place', e.target.value)} placeholder="Adresse, nom du lieu…" style={inp(false)} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor='var(--color-border)'} />
          </div>

          {/* Note */}
          <div style={{ marginBottom:'.5rem' }}>
            <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em', margin:'0 0 .35rem' }}>Note</p>
            <textarea value={form.note} onChange={e => set('note', e.target.value)} placeholder="Infos pratiques, rappels…" rows={2} style={{ ...inp(false), resize:'none', lineHeight:1.5 }} onFocus={e => e.target.style.borderColor='var(--color-primary)'} onBlur={e => e.target.style.borderColor='var(--color-border)'} />
          </div>
        </div>

        <div style={{ padding:'.9rem 1.25rem', paddingBottom:'calc(.9rem + env(safe-area-inset-bottom, 34px))', borderTop:'1px solid var(--color-border)', display:'flex', gap:'.6rem' }}>
          <button onClick={onCancel} style={{ flex:1, padding:'.65rem', borderRadius:12, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.88rem' }}>Annuler</button>
          <button onClick={save} style={{ flex:2, padding:'.65rem', borderRadius:12, border:'none', background:'var(--color-primary)', color:'#fff', cursor:'pointer', fontSize:'.92rem', fontWeight:700, boxShadow:'0 4px 14px rgba(217,124,26,.3)' }}>
            {initial ? 'Enregistrer' : '➕ Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ligne d'activité ─────────────────────────────────────────
const ActivityRow = ({ activity, onEdit, onDelete }) => {
  const t = getType(activity.type)
  const [open, setOpen] = useState(false)
  const isImported = !!activity.fromBookingId

  return (
    <div style={{ display:'flex', gap:'.7rem', marginBottom:'.5rem' }}>
      {/* Ligne de temps */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, width:32 }}>
        <div style={{ width:30, height:30, borderRadius:'50%', background:`${t.color}22`, border:`2px solid ${t.color}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem', flexShrink:0 }}>{t.icon}</div>
        <div style={{ flex:1, width:2, background:'var(--color-border)', marginTop:4 }} />
      </div>

      {/* Contenu */}
      <div
        style={{ flex:1, background:'var(--color-bg-card)', border:`1px solid ${isImported ? t.color + '44' : 'var(--color-border)'}`, borderRadius:12, padding:'.65rem .8rem', marginBottom:'.2rem', cursor:'pointer', transition:'border-color .15s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = t.color}
        onMouseLeave={e => e.currentTarget.style.borderColor = isImported ? t.color + '44' : 'var(--color-border)'}
        onClick={() => setOpen(v => !v)}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.5rem', flex:1, minWidth:0 }}>
            {activity.time && (
              <span style={{ fontSize:'.7rem', fontWeight:700, color:t.color, background:`${t.color}18`, padding:'.15rem .5rem', borderRadius:20, flexShrink:0 }}>
                {formatTime(activity.time)}
              </span>
            )}
            <p style={{ fontWeight:600, fontSize:'.88rem', color:'var(--color-text)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {activity.title}
            </p>
            {isImported && (
              <span style={{ fontSize:'.6rem', fontWeight:700, padding:'.1rem .4rem', borderRadius:20, background:`${t.color}22`, color:t.color, flexShrink:0 }}>
                importé
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:'.3rem', marginLeft:'.5rem', flexShrink:0 }} onClick={e => e.stopPropagation()}>
            <button onClick={() => onEdit(activity)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'.8rem', padding:'.2rem .4rem', borderRadius:6 }}>✏️</button>
            <button onClick={() => onDelete(activity.id)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171', fontSize:'.8rem', padding:'.2rem .4rem', borderRadius:6 }}>🗑️</button>
          </div>
        </div>

        {/* Détails dépliables */}
        {open && (activity.place || activity.note) && (
          <div style={{ marginTop:'.5rem', paddingTop:'.5rem', borderTop:'1px solid var(--color-border)', overflow:'hidden' }}>
            {activity.place && (
              <div style={{ marginBottom:'.35rem' }}>
                <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:'0 0 .3rem', lineHeight:1.4, wordBreak:'break-word', whiteSpace:'normal', overflowWrap:'anywhere' }}>
                  📍 {activity.place}
                </p>
                <a
                  href={mapUrl(activity.place)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ display:'inline-flex', alignItems:'center', gap:'.25rem', fontSize:'.7rem', fontWeight:600, color:'var(--color-primary)', textDecoration:'none', padding:'.2rem .6rem', borderRadius:20, border:'1px solid #d97c1a44', background:'#d97c1a11' }}
                >
                  🗺️ Ouvrir dans Maps
                </a>
              </div>
            )}
            {activity.note && (
              <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:0, fontStyle:'italic', wordBreak:'break-word', whiteSpace:'normal' }}>
                💬 {activity.note}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Carte d'un jour ──────────────────────────────────────────
const DayCard = ({ date, dayNum, activities, onAddActivity, onEditActivity, onDeleteActivity, isToday }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      background: isToday ? 'linear-gradient(135deg, var(--color-bg-card), color-mix(in srgb, var(--color-primary) 6%, var(--color-bg-card)))' : 'var(--color-bg-card)',
      border: `1px solid ${isToday ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius:16, marginBottom:'.85rem', overflow:'hidden',
    }}>
      {/* Header du jour */}
      <div
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'.8rem 1rem', cursor:'pointer', borderBottom: collapsed ? 'none' : '1px solid var(--color-border)' }}
        onClick={() => setCollapsed(v => !v)}
      >
        <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
          <div style={{ width:38, height:38, borderRadius:12, background: isToday ? 'var(--color-primary)' : 'var(--color-bg-input)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:'.65rem', fontWeight:700, color: isToday ? '#fff' : 'var(--color-text-muted)', lineHeight:1, textTransform:'uppercase' }}>J</span>
            <span style={{ fontSize:'1rem', fontWeight:800, color: isToday ? '#fff' : 'var(--color-text)', lineHeight:1 }}>{dayNum}</span>
          </div>
          <div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.92rem', color:'var(--color-text)', margin:0 }}>
              {formatDate(date)}
              {isToday && <span style={{ marginLeft:'.5rem', fontSize:'.65rem', fontWeight:700, padding:'.15rem .5rem', borderRadius:20, background:'var(--color-primary)', color:'#fff' }}>Aujourd'hui</span>}
            </p>
            <p style={{ fontSize:'.72rem', color:'var(--color-text-muted)', margin:0 }}>
              {activities.length === 0 ? 'Aucune activité' : `${activities.length} activité${activities.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <span style={{ color:'var(--color-text-muted)', fontSize:'.9rem', transition:'transform .2s', transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
      </div>

      {!collapsed && (
        <div style={{ padding:'.8rem 1rem' }}>
          {[...activities]
            .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
            .map(act => (
              <ActivityRow
                key={act.id}
                activity={act}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
              />
            ))
          }
          <button
            onClick={() => onAddActivity(date)}
            style={{ display:'flex', alignItems:'center', gap:'.4rem', width:'100%', padding:'.5rem .7rem', border:'1px dashed var(--color-border)', borderRadius:10, background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.8rem', fontWeight:500, transition:'border-color .15s, color .15s', marginTop: activities.length > 0 ? '.3rem' : 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.color='var(--color-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.color='var(--color-text-muted)' }}
          >
            <span>+</span> Ajouter une activité
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================
// Itinerary
// ============================================================
const Itinerary = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { }       = useTrips()
  const { getTripById, bookings } = useApp()
  const { days, addActivity, updateActivity, deleteActivity, initDays, save } = useItinerary(id)

  const trip = getTripById(id)
  const tripBookings = bookings[id] || []

  const [formDay,    setFormDay]    = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const todayStr = new Date().toISOString().slice(0, 10)

  const allDays = useMemo(() => {
    if (!trip) return []
    if (days.length > 0) return days
    const dates = getDateRange(trip.startDate, trip.endDate)
    return dates.map(d => ({ date: d, activities: [] }))
  }, [trip, days])

  React.useEffect(() => {
    if (trip && days.length === 0 && allDays.length > 0) {
      initDays(allDays)
    }
  }, [trip, days.length, allDays])

  const totalActivities = allDays.reduce((s, d) => s + d.activities.length, 0)

  // ── Hôtels disponibles à importer ───────────────────────────
  const hotelBookings = tripBookings.filter(b => b.type === 'hotel' && b.checkIn)

  // IDs de réservations déjà importées dans l'itinéraire
  const alreadyImported = useMemo(() => {
    const ids = new Set()
    allDays.forEach(d => (d.activities || []).forEach(a => {
      if (a.fromBookingId) ids.add(a.fromBookingId)
    }))
    return ids
  }, [allDays])

  const pendingHotels = hotelBookings.filter(b => !alreadyImported.has(b.id))

  const handleImportHotels = () => {
    if (!pendingHotels.length) return

    const newDays = allDays.map(day => {
      const toAdd = []

      pendingHotels.forEach(hotel => {
        // Check-in sur le jour d'arrivée
        if (hotel.checkIn === day.date) {
          toAdd.push({
            id:            `import-${hotel.id}-in`,
            fromBookingId: hotel.id,
            type:          'hotel',
            title:         `Check-in — ${hotel.name}`,
            time:          hotel.checkInTime || '',
            place:         hotel.address || '',
            note:          hotel.confirmation ? `Réf: ${hotel.confirmation}` : '',
          })
        }
        // Check-out sur le jour de départ
        if (hotel.checkOut === day.date) {
          toAdd.push({
            id:            `import-${hotel.id}-out`,
            fromBookingId: `${hotel.id}-out`,
            type:          'hotel',
            title:         `Check-out — ${hotel.name}`,
            time:          hotel.checkOutTime || '',
            place:         hotel.address || '',
            note:          hotel.confirmation ? `Réf: ${hotel.confirmation}` : '',
          })
        }
      })

      if (!toAdd.length) return day
      return { ...day, activities: [...(day.activities || []), ...toAdd] }
    })

    save(newDays)
  }

  const handleAddActivity    = (date)             => { setEditTarget(null); setFormDay(date) }
  const handleEditActivity   = (dayDate, activity) => { setFormDay(dayDate); setEditTarget({ dayDate, activity }) }
  const handleDeleteActivity = (dayDate, actId)    => deleteActivity(dayDate, actId)

  const handleSaveActivity = (formData) => {
    if (editTarget) updateActivity(editTarget.dayDate, editTarget.activity.id, formData)
    else            addActivity(formDay, formData)
    setFormDay(null)
    setEditTarget(null)
  }

  if (!trip) return (
    <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
      <p style={{ fontSize:'2rem' }}>🔍</p>
      <button onClick={() => navigate('/voyages')} style={{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.6rem 1.2rem', cursor:'pointer', fontWeight:600 }}>
        ← Retour
      </button>
    </div>
  )

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Retour */}
      <button onClick={() => navigate(`/voyages/${id}`)}
        style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:12, padding:'.5rem .9rem', cursor:'pointer', color:'var(--color-text)', fontSize:'.88rem', fontWeight:600, marginBottom:'1rem', transition:'border-color .15s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
      >
        ← {trip?.name || 'Voyage'}
      </button>

      {/* En-tête */}
      <div style={{ marginBottom:'1rem', animation:'fadeUp .35s ease both' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'.75rem' }}>
          <div>
            <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .15rem' }}>🗓️ ITINÉRAIRE</p>
            <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.4rem', fontWeight:800, color:'var(--color-text)', margin:'0 0 .25rem' }}>
              {trip.destination}
            </h1>
            <p style={{ fontSize:'.8rem', color:'var(--color-text-muted)', margin:0 }}>
              {allDays.length} jour{allDays.length > 1 ? 's' : ''} · {totalActivities} activité{totalActivities !== 1 ? 's' : ''} planifiée{totalActivities !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Bouton import hôtels — visible uniquement si hôtels en attente */}
          {pendingHotels.length > 0 && (
            <button
              onClick={handleImportHotels}
              style={{ display:'flex', alignItems:'center', gap:'.4rem', flexShrink:0, padding:'.5rem .85rem', borderRadius:12, border:'1px solid #d97c1a55', background:'#d97c1a15', color:'#d97c1a', cursor:'pointer', fontSize:'.78rem', fontWeight:700, transition:'border-color .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='#d97c1a'}
              onMouseLeave={e => e.currentTarget.style.borderColor='#d97c1a55'}
            >
              🏨 Importer {pendingHotels.length} hébergement{pendingHotels.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Info si tous déjà importés */}
        {hotelBookings.length > 0 && pendingHotels.length === 0 && (
          <p style={{ fontSize:'.72rem', color:'#d97c1a', margin:'.5rem 0 0', display:'flex', alignItems:'center', gap:'.3rem' }}>
            ✅ Tous les hébergements sont dans l'itinéraire
          </p>
        )}
      </div>

      {/* Jours */}
      <div style={{ animation:'fadeUp .35s .1s ease both' }}>
        {allDays.map((day, i) => (
          <DayCard
            key={day.date}
            date={day.date}
            dayNum={i + 1}
            activities={day.activities || []}
            isToday={day.date === todayStr}
            onAddActivity={handleAddActivity}
            onEditActivity={(act) => handleEditActivity(day.date, act)}
            onDeleteActivity={(actId) => handleDeleteActivity(day.date, actId)}
          />
        ))}
      </div>

      {/* Formulaire activité */}
      {formDay && (
        <ActivityForm
          initial={editTarget?.activity || null}
          onSave={handleSaveActivity}
          onCancel={() => { setFormDay(null); setEditTarget(null) }}
        />
      )}
    </div>
  )
}

export default Itinerary