// ============================================================
// TripsList.jsx — Liste de tous les voyages
// ============================================================
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useTrips from './hooks/useTrips'
import TripForm from './TripForm'
import { formatDateShort, daysBetween, isTripOngoing, isTripFuture, isTripPast, daysUntil } from '../../utils/dateUtils'
import { TRIP_STATUS, TRIP_TYPES } from '../../utils/constants'

const TRIP_ICONS = {
  leisure:'🌴', business:'💼', family:'👨‍👩‍👧', adventure:'🧗',
  citytrip:'🏙️', beach:'🏖️', mountain:'🏔️', cruise:'🚢', default:'✈️',
}

const FILTERS = [
  { value: 'all',       label: 'Tous' },
  { value: 'ongoing',   label: '🛫 En cours' },
  { value: 'upcoming',  label: '📅 À venir' },
  { value: 'past',      label: '✅ Passés' },
]

// ── Carte voyage dans la liste ───────────────────────────────
const TripRow = ({ trip, onDelete, navigate }) => {
  const icon     = TRIP_ICONS[trip.type] || TRIP_ICONS.default
  const ongoing  = isTripOngoing(trip.startDate, trip.endDate)
  const future   = isTripFuture(trip.startDate)
  const past     = isTripPast(trip.endDate)
  const duration = daysBetween(trip.startDate, trip.endDate)
  const days     = future ? daysUntil(trip.startDate) : null

  const [showMenu, setShowMenu] = useState(false)

  const statusColor = ongoing ? '#4ade80' : future ? '#60a5fa' : '#9ca3af'
  const statusLabel = ongoing ? 'En cours' : future ? 'Planifié' : 'Terminé'

  return (
    <div style={{
      position:'relative',
      background:'var(--color-bg-card)',
      border:'1px solid var(--color-border)',
      borderRadius:16,
      padding:'.9rem 1rem',
      marginBottom:'.6rem',
      display:'flex', alignItems:'center', gap:'.85rem',
      cursor:'pointer',
      transition:'border-color .2s, box-shadow .15s',
    }}
      onClick={() => navigate(`/voyages/${trip.id}`)}
      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,.15)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.boxShadow='none' }}
    >
      {/* Icône */}
      <div style={{
        width:46, height:46, borderRadius:13, flexShrink:0,
        background:'var(--color-bg-input)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.6rem',
      }}>{icon}</div>

      {/* Infos */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.2rem' }}>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.95rem', color:'var(--color-text)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {trip.name}
          </p>
          <span style={{ fontSize:'.62rem', fontWeight:700, padding:'.15rem .5rem', borderRadius:20, background:`${statusColor}22`, color:statusColor, border:`1px solid ${statusColor}44`, flexShrink:0 }}>
            {statusLabel}
          </span>
        </div>
        <p style={{ fontSize:'.8rem', fontWeight:600, color:'var(--color-primary)', margin:'0 0 .15rem' }}>
          {trip.destination}{trip.country ? `, ${trip.country}` : ''}
        </p>
        <p style={{ fontSize:'.72rem', color:'var(--color-text-muted)', margin:0 }}>
          {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
          <span style={{ opacity:.7 }}> · {duration} nuit{duration > 1 ? 's' : ''}</span>
          {trip.people > 1 && <span style={{ opacity:.7 }}> · {trip.people} pers.</span>}
        </p>
      </div>

      {/* Compte à rebours */}
      {days !== null && days >= 0 && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, marginRight:'1.8rem' }}>
          <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.4rem', fontWeight:800, color:'var(--color-primary)', lineHeight:1 }}>{days}</span>
          <span style={{ fontSize:'.6rem', textTransform:'uppercase', letterSpacing:'.05em', color:'var(--color-text-muted)' }}>j</span>
        </div>
      )}

      {/* Budget si renseigné */}
      {trip.budget > 0 && !days && !ongoing && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', flexShrink:0, marginRight:'1.8rem' }}>
          <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--color-accent)' }}>{trip.budget} €</span>
          <span style={{ fontSize:'.6rem', color:'var(--color-text-muted)' }}>budget</span>
        </div>
      )}

      {/* Menu actions */}
      <button
        style={{ position:'absolute', right:'0.75rem', top:'0.75rem', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'1.1rem', padding:'.25rem', borderRadius:8, zIndex:2 }}
        onClick={e => { e.stopPropagation(); setShowMenu(v => !v) }}
      >⋯</button>

      {showMenu && (
        <div
          style={{
            position:'absolute', right:'.75rem', top:'2.2rem', zIndex:10,
            background:'var(--color-bg-card)', border:'1px solid var(--color-border)',
            borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,.25)',
            minWidth:140, overflow:'hidden',
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { setShowMenu(false); navigate(`/voyages/${trip.id}`) }} style={menuItemStyle}>
            📋 Voir le détail
          </button>
          <button onClick={() => { setShowMenu(false); onDelete(trip.id) }} style={{ ...menuItemStyle, color:'#f87171' }}>
            🗑️ Supprimer
          </button>
        </div>
      )}
    </div>
  )
}

const menuItemStyle = {
  display:'block', width:'100%', textAlign:'left', padding:'.65rem 1rem',
  background:'none', border:'none', cursor:'pointer', fontSize:'.82rem',
  color:'var(--color-text)', transition:'background .15s',
}

// ============================================================
// TripsList
// ============================================================
const TripsList = () => {
  const navigate = useNavigate()
  const { trips, deleteTrip } = useTrips()

  const [filter,    setFilter]    = useState('all')
  const [search,    setSearch]    = useState('')
  const [showForm,  setShowForm]  = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const filtered = useMemo(() => {
    let list = trips
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.destination?.toLowerCase().includes(q) ||
        t.country?.toLowerCase().includes(q)
      )
    }
    switch (filter) {
      case 'ongoing':  return list.filter(t => isTripOngoing(t.startDate, t.endDate))
      case 'upcoming': return list.filter(t => isTripFuture(t.startDate))
      case 'past':     return list.filter(t => isTripPast(t.endDate))
      default:         return list.sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
    }
  }, [trips, filter, search])

  const handleDelete = (id) => setConfirmId(id)
  const confirmDelete = () => { deleteTrip(confirmId); setConfirmId(null) }

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem', animation:'fadeUp .35s ease both' }}>
        <div>
          <p style={{ fontSize:'.8rem', color:'var(--color-text-muted)', margin:'0 0 .15rem' }}>✈️ MES VOYAGES</p>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'var(--color-text)', margin:0 }}>
            {trips.length} voyage{trips.length !== 1 ? 's' : ''}
          </h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={{
            display:'flex', alignItems:'center', gap:'.4rem',
            background:'var(--color-primary)', color:'#fff', border:'none',
            borderRadius:12, padding:'.6rem 1rem',
            fontSize:'.85rem', fontWeight:600, cursor:'pointer',
            boxShadow:'0 4px 14px rgba(217,124,26,.35)',
            transition:'transform .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
        >
          <span style={{ fontSize:'1.1rem' }}>+</span> Nouveau
        </button>
      </div>

      {/* Barre de recherche */}
      <div style={{ position:'relative', marginBottom:'.75rem', animation:'fadeUp .35s .05s ease both' }}>
        <span style={{ position:'absolute', left:'.85rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem', pointerEvents:'none' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un voyage, destination…"
          style={{
            width:'100%', background:'var(--color-bg-input)', border:'1px solid var(--color-border)',
            borderRadius:12, padding:'.65rem .9rem .65rem 2.4rem',
            fontSize:'.85rem', color:'var(--color-text)',
            outline:'none', boxSizing:'border-box',
            transition:'border-color .2s',
          }}
          onFocus={e => e.target.style.borderColor='var(--color-primary)'}
          onBlur={e => e.target.style.borderColor='var(--color-border)'}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ position:'absolute', right:'.75rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--color-text-muted)', fontSize:'1rem' }}>✕</button>
        )}
      </div>

      {/* Filtres */}
      <div style={{ display:'flex', gap:'.4rem', marginBottom:'1.1rem', overflowX:'auto', paddingBottom:'.2rem', animation:'fadeUp .35s .1s ease both' }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            style={{
              flexShrink:0, padding:'.4rem .9rem', borderRadius:20, border:'1px solid',
              fontSize:'.78rem', fontWeight:600, cursor:'pointer',
              transition:'all .15s',
              background: filter === f.value ? 'var(--color-primary)' : 'var(--color-bg-card)',
              borderColor: filter === f.value ? 'var(--color-primary)' : 'var(--color-border)',
              color: filter === f.value ? '#fff' : 'var(--color-text-muted)',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          padding:'2.5rem 1rem',
          background:'var(--color-bg-card)', border:'1px dashed var(--color-border)',
          borderRadius:18, animation:'fadeUp .35s .15s ease both',
        }}>
          <span style={{ fontSize:'2.5rem', marginBottom:'.75rem' }}>
            {trips.length === 0 ? '🗺️' : '🔍'}
          </span>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--color-text)', margin:'0 0 .4rem' }}>
            {trips.length === 0 ? 'Aucun voyage pour le moment' : 'Aucun résultat'}
          </p>
          <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.2rem' }}>
            {trips.length === 0
              ? 'Créez votre premier voyage pour commencer'
              : 'Essayez avec d\'autres termes de recherche'}
          </p>
          {trips.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              style={{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.65rem 1.5rem', fontSize:'.88rem', fontWeight:600, cursor:'pointer' }}
            >Créer un voyage</button>
          )}
        </div>
      ) : (
        <div style={{ animation:'fadeUp .35s .15s ease both' }}>
          {filtered.map(t => (
            <TripRow key={t.id} trip={t} onDelete={handleDelete} navigate={navigate} />
          ))}
        </div>
      )}

      {/* Modale formulaire */}
      {showForm && (
        <TripForm
          onSave={() => setShowForm(false)}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Confirm suppression */}
      {confirmId && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={() => setConfirmId(null)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.6)', backdropFilter:'blur(4px)' }} />
          <div style={{ position:'relative', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:20, padding:'1.5rem', maxWidth:320, width:'100%', animation:'fadeUp .3s ease both' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:'0 0 .5rem' }}>Supprimer ce voyage ?</p>
            <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.25rem' }}>
              Cette action est irréversible. Toutes les données liées (itinéraire, réservations, budget) seront supprimées.
            </p>
            <div style={{ display:'flex', gap:'.6rem', justifyContent:'flex-end' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding:'.55rem 1.1rem', borderRadius:10, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.85rem', fontWeight:500 }}>Annuler</button>
              <button onClick={confirmDelete} style={{ padding:'.55rem 1.1rem', borderRadius:10, border:'none', background:'#dc2626', color:'#fff', cursor:'pointer', fontSize:'.85rem', fontWeight:600 }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TripsList
