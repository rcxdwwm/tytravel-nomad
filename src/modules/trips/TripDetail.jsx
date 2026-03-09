// ============================================================
// TripDetail.jsx — Hub central d'un voyage
// ============================================================
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTrips from './hooks/useTrips'
import TripForm from './TripForm'
import {
  formatDateShort, daysBetween, daysUntil,
  isTripOngoing, isTripFuture, isTripPast,
} from '../../utils/dateUtils'
import { useApp } from '../../context/AppContext'

const TRIP_ICONS = {
  leisure:'🌴', business:'💼', family:'👨‍👩‍👧', adventure:'🧗',
  citytrip:'🏙️', beach:'🏖️', mountain:'🏔️', cruise:'🚢', default:'✈️',
}

// ── 4 modules du voyage ───────────────────────────────────────
const MODULES = [
  {
    key: 'itineraire',
    label: 'Itinéraire',
    icon: '🗓️',
    desc: 'Jour par jour',
    color: '#3b82f6',
  },
  {
    key: 'reservations',
    label: 'Réservations',
    icon: '🎫',
    desc: 'Vols, hôtel, voiture…',
    color: '#d97c1a',
  },
  {
    key: 'budget',
    label: 'Budget',
    icon: '💶',
    desc: 'Dépenses & prévisions',
    color: '#10b981',
  },
  {
    key: 'checklist',
    label: 'Checklist',
    icon: '✅',
    desc: 'Pré-départ',
    color: '#8b5cf6',
  },
]

// ── Badge statut ─────────────────────────────────────────────
const StatusBadge = ({ ongoing, future, past }) => {
  if (ongoing) return (
    <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.3rem .75rem', borderRadius:20, background:'#16532233', color:'#4ade80', border:'1px solid #16a34a55', display:'inline-flex', alignItems:'center', gap:'.35rem' }}>
      <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'pulse 1.8s ease infinite' }} />
      EN COURS
    </span>
  )
  if (future) return (
    <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.3rem .75rem', borderRadius:20, background:'#1e3a5f33', color:'#60a5fa', border:'1px solid #1d4ed855' }}>
      PLANIFIÉ
    </span>
  )
  return (
    <span style={{ fontSize:'.7rem', fontWeight:700, padding:'.3rem .75rem', borderRadius:20, background:'#6b728022', color:'#9ca3af', border:'1px solid #4b556333' }}>
      TERMINÉ
    </span>
  )
}

// ── Tuile module ─────────────────────────────────────────────
const ModuleTile = ({ mod, tripId, navigate, badge }) => (
  <button
    onClick={() => navigate(`/voyages/${tripId}/${mod.key}`)}
    style={{
      display:'flex', flexDirection:'column', gap:'.5rem',
      background:'var(--color-bg-card)',
      border:'1px solid var(--color-border)',
      borderRadius:16, padding:'1rem',
      cursor:'pointer', textAlign:'left',
      transition:'border-color .2s, transform .15s, box-shadow .15s',
      position:'relative', overflow:'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor=mod.color; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 6px 20px ${mod.color}22` }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none' }}
  >
    {/* Accent coloré en haut */}
    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:mod.color, borderRadius:'16px 16px 0 0' }} />

    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
      <div style={{ width:40, height:40, borderRadius:12, background:`${mod.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>
        {mod.icon}
      </div>
      {badge != null && badge > 0 && (
        <span style={{ fontSize:'.65rem', fontWeight:700, padding:'.2rem .5rem', borderRadius:20, background:`${mod.color}22`, color:mod.color, border:`1px solid ${mod.color}44` }}>
          {badge}
        </span>
      )}
      <span style={{ fontSize:'1rem', color:'var(--color-text-muted)', opacity:.4 }}>›</span>
    </div>
    <div>
      <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.92rem', color:'var(--color-text)', margin:'0 0 .1rem' }}>{mod.label}</p>
      <p style={{ fontSize:'.73rem', color:'var(--color-text-muted)', margin:0 }}>{mod.desc}</p>
    </div>
  </button>
)

// ── Stat rapide ───────────────────────────────────────────────
const QuickStat = ({ icon, value, label }) => (
  <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', padding:'.7rem .3rem', background:'var(--color-bg-input)', borderRadius:12 }}>
    <span style={{ fontSize:'1rem' }}>{icon}</span>
    <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'var(--color-text)', lineHeight:1 }}>{value}</span>
    <span style={{ fontSize:'.62rem', color:'var(--color-text-muted)', textAlign:'center', lineHeight:1.2 }}>{label}</span>
  </div>
)

// ============================================================
// TripDetail
// ============================================================
const TripDetail = () => {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const { deleteTrip, getTripById } = useTrips()
  const { bookings, budgets, checklists } = useApp()

  const trip = getTripById(id)

  const [showEdit,    setShowEdit]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!trip) return (
    <div style={{ textAlign:'center', padding:'3rem 1rem' }}>
      <p style={{ fontSize:'2rem', marginBottom:'.75rem' }}>🔍</p>
      <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--color-text)', marginBottom:'.5rem' }}>Voyage introuvable</p>
      <button onClick={() => navigate('/voyages')} style={{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.6rem 1.2rem', cursor:'pointer', fontWeight:600 }}>
        ← Retour aux voyages
      </button>
    </div>
  )

  const ongoing  = isTripOngoing(trip.startDate, trip.endDate)
  const future   = isTripFuture(trip.startDate)
  const past     = isTripPast(trip.endDate)
  const icon     = TRIP_ICONS[trip.type] || TRIP_ICONS.default
  const duration = daysBetween(trip.startDate, trip.endDate)
  const countdown = future ? daysUntil(trip.startDate) : null

  // Badges de contenu
  const bookingCount  = (bookings[id] || []).length
  const expenseCount  = (budgets[id]   || []).length
  const checkProgress = (() => {
    const items = checklists[id] || []
    if (!items.length) return null
    return Math.round(items.filter(i => i.checked).length / items.length * 100)
  })()

  // Progression si en cours
  const progressPct = (() => {
    if (!ongoing) return null
    const total   = daysBetween(trip.startDate, trip.endDate) || 1
    const elapsed = daysBetween(trip.startDate, new Date().toISOString().slice(0, 10))
    return Math.min(100, Math.round((elapsed / total) * 100))
  })()

  const handleDelete = () => {
    deleteTrip(id)
    navigate('/voyages')
  }

  return (
    <div>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%{box-shadow:0 0 0 0 #4ade8055} 70%{box-shadow:0 0 0 8px #4ade8000} 100%{box-shadow:0 0 0 0 #4ade8000} }
      `}</style>

      {/* ── Bouton retour ── */}
      <button
        onClick={() => navigate('/voyages')}
        style={{ display:'inline-flex', alignItems:'center', gap:'.4rem', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'.82rem', fontWeight:500, padding:'0 0 1rem', marginLeft:'-.25rem' }}
      >
        ← Mes voyages
      </button>

      {/* ── Carte hero ── */}
      <div style={{
        background:'linear-gradient(135deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-primary) 10%, var(--color-bg-card)) 100%)',
        border:'1px solid var(--color-primary)',
        borderRadius:20, padding:'1.25rem',
        marginBottom:'1.1rem',
        animation:'fadeUp .35s ease both',
        position:'relative', overflow:'hidden',
      }}>
        {/* Décor fond */}
        <div style={{ position:'absolute', right:-20, top:-20, fontSize:'6rem', opacity:.06, lineHeight:1, pointerEvents:'none' }}>{icon}</div>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'.9rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem' }}>
            <div style={{ width:52, height:52, borderRadius:15, background:'var(--color-bg-input)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>
              {icon}
            </div>
            <div>
              <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'1.25rem', color:'var(--color-text)', margin:'0 0 .25rem', lineHeight:1.2 }}>
                {trip.name}
              </h1>
              <p style={{ fontSize:'.85rem', fontWeight:600, color:'var(--color-primary)', margin:0 }}>
                📍 {trip.destination}{trip.country ? `, ${trip.country}` : ''}
              </p>
            </div>
          </div>
          <StatusBadge ongoing={ongoing} future={future} past={past} />
        </div>

        {/* Dates */}
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.9rem', fontSize:'.8rem', color:'var(--color-text-muted)' }}>
          <span>📅 {formatDateShort(trip.startDate)}</span>
          <span style={{ opacity:.5 }}>→</span>
          <span>{formatDateShort(trip.endDate)}</span>
          <span style={{ marginLeft:'.25rem', padding:'.15rem .55rem', background:'var(--color-bg-input)', borderRadius:20, fontSize:'.72rem' }}>
            {duration} nuit{duration > 1 ? 's' : ''}
          </span>
          {trip.people > 1 && (
            <span style={{ padding:'.15rem .55rem', background:'var(--color-bg-input)', borderRadius:20, fontSize:'.72rem' }}>
              👥 {trip.people}
            </span>
          )}
        </div>

        {/* Compte à rebours ou progression */}
        {countdown !== null && countdown >= 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.7rem .9rem', background:'var(--color-bg-input)', borderRadius:12, marginBottom:'.9rem' }}>
            <div style={{ textAlign:'center' }}>
              <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'2rem', fontWeight:800, color:'var(--color-primary)', margin:0, lineHeight:1 }}>{countdown}</p>
              <p style={{ fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.06em', color:'var(--color-text-muted)', margin:0 }}>jour{countdown > 1 ? 's' : ''} avant</p>
            </div>
            <div style={{ flex:1, height:1, background:'var(--color-border)' }} />
            <span style={{ fontSize:'.82rem' }}>🛫 Le départ approche !</span>
          </div>
        )}

        {progressPct !== null && (
          <div style={{ marginBottom:'.9rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'.35rem' }}>
              <span style={{ fontSize:'.75rem', color:'var(--color-text-muted)' }}>Progression du voyage</span>
              <span style={{ fontSize:'.75rem', fontWeight:700, color:'var(--color-primary)' }}>{progressPct}%</span>
            </div>
            <div style={{ height:6, background:'var(--color-bg-input)', borderRadius:3, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${progressPct}%`, background:'linear-gradient(90deg, var(--color-primary), var(--color-accent))', borderRadius:3, transition:'width .6s ease' }} />
            </div>
          </div>
        )}

        {/* Stats rapides */}
        <div style={{ display:'flex', gap:'.5rem' }}>
          {trip.budget > 0 && (
            <QuickStat icon="💶" value={`${trip.budget} €`} label="Budget prévu" />
          )}
          <QuickStat icon="🗓️" value={duration} label={`nuit${duration > 1 ? 's' : ''}`} />
          {bookingCount > 0 && <QuickStat icon="🎫" value={bookingCount} label="réserv." />}
          {checkProgress !== null && <QuickStat icon="✅" value={`${checkProgress}%`} label="checklist" />}
        </div>

        {/* Notes si renseignées */}
        {trip.notes && (
          <div style={{ marginTop:'.9rem', padding:'.7rem .9rem', background:'var(--color-bg-input)', borderRadius:10, fontSize:'.78rem', color:'var(--color-text-muted)', lineHeight:1.5, borderLeft:'3px solid var(--color-primary)' }}>
            {trip.notes}
          </div>
        )}
      </div>

      {/* ── Grille des 4 modules ── */}
      <p style={{ fontSize:'.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--color-text-muted)', margin:'0 0 .7rem', animation:'fadeUp .35s .1s ease both' }}>
        📂 Modules du voyage
      </p>
      <div style={{
        display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.7rem',
        marginBottom:'1.5rem', animation:'fadeUp .35s .15s ease both',
      }}>
        <ModuleTile mod={MODULES[0]} tripId={id} navigate={navigate} />
        <ModuleTile mod={MODULES[1]} tripId={id} navigate={navigate} badge={bookingCount} />
        <ModuleTile mod={MODULES[2]} tripId={id} navigate={navigate} badge={expenseCount} />
        <ModuleTile mod={MODULES[3]} tripId={id} navigate={navigate} badge={checkProgress !== null ? `${checkProgress}%` : null} />
      </div>

      {/* ── Actions ── */}
      <div style={{ display:'flex', gap:'.6rem', animation:'fadeUp .35s .2s ease both' }}>
        <button
          onClick={() => setShowEdit(true)}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem', padding:'.65rem', borderRadius:12, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.85rem', fontWeight:500, transition:'border-color .2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
          onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.4rem', padding:'.65rem', borderRadius:12, border:'1px solid #dc262633', background:'#dc262611', color:'#f87171', cursor:'pointer', fontSize:'.85rem', fontWeight:500, transition:'border-color .2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor='#dc2626'}
          onMouseLeave={e => e.currentTarget.style.borderColor='#dc262633'}
        >
          🗑️ Supprimer
        </button>
      </div>

      {/* ── Formulaire d'édition ── */}
      {showEdit && (
        <TripForm
          trip={trip}
          onSave={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      )}

      {/* ── Confirmation suppression ── */}
      {showConfirm && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={() => setShowConfirm(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />
          <div style={{ position:'relative', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:20, padding:'1.5rem', maxWidth:320, width:'100%', animation:'fadeUp .3s ease both' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:'0 0 .5rem' }}>
              Supprimer « {trip.name} » ?
            </p>
            <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.25rem' }}>
              Toutes les données liées (itinéraire, réservations, budget, checklist) seront définitivement supprimées.
            </p>
            <div style={{ display:'flex', gap:'.6rem', justifyContent:'flex-end' }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding:'.55rem 1.1rem', borderRadius:10, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.85rem' }}>
                Annuler
              </button>
              <button onClick={handleDelete} style={{ padding:'.55rem 1.1rem', borderRadius:10, border:'none', background:'#dc2626', color:'#fff', cursor:'pointer', fontSize:'.85rem', fontWeight:600 }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripDetail
