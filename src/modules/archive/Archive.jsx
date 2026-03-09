// ============================================================
// Archive.jsx — Voyages terminés
// ============================================================
import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useTrips from '../trips/hooks/useTrips'
import { formatDateShort, daysBetween, isTripPast } from '../../utils/dateUtils'
import { useApp } from '../../context/AppContext'

const TRIP_ICONS = {
  leisure:'🌴', business:'💼', family:'👨‍👩‍👧', adventure:'🧗',
  citytrip:'🏙️', beach:'🏖️', mountain:'🏔️', cruise:'🚢', default:'✈️',
}

const RATINGS = [1, 2, 3, 4, 5]

// ── Étoiles notation ─────────────────────────────────────────
const StarRating = ({ value, onChange, readonly = false }) => (
  <div style={{ display:'flex', gap:'.15rem' }}>
    {RATINGS.map(r => (
      <button key={r} onClick={() => !readonly && onChange(r)}
        style={{ background:'none', border:'none', cursor: readonly ? 'default' : 'pointer', fontSize: readonly ? '.9rem' : '1.1rem', padding:'.1rem', lineHeight:1, opacity: r <= (value||0) ? 1 : .25, transition:'opacity .15s, transform .1s' }}
        onMouseEnter={e => !readonly && (e.currentTarget.style.transform='scale(1.2)')}
        onMouseLeave={e => !readonly && (e.currentTarget.style.transform='scale(1)')}
      >⭐</button>
    ))}
  </div>
)

// ── Modale mémo post-voyage ───────────────────────────────────
const MemoModal = ({ trip, onSave, onClose }) => {
  const [rating, setRating] = useState(trip.rating || 0)
  const [memo,   setMemo]   = useState(trip.memo   || '')

  return (
    <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative', width:'100%', maxWidth:400, background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:22, padding:'1.4rem', animation:'fadeUp .3s ease both' }} onClick={e => e.stopPropagation()}>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

        <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:'0 0 .25rem' }}>
          {TRIP_ICONS[trip.type]||'✈️'} {trip.name}
        </h3>
        <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 1rem' }}>{trip.destination}</p>

        {/* Note */}
        <div style={{ marginBottom:'1rem' }}>
          <p style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--color-text-muted)', margin:'0 0 .5rem' }}>Note du voyage</p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        {/* Mémo */}
        <div style={{ marginBottom:'1.2rem' }}>
          <p style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', color:'var(--color-text-muted)', margin:'0 0 .4rem' }}>Mémo souvenir</p>
          <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={4}
            placeholder="Ce qui vous a marqué, conseils pour y retourner, adresses à retenir…"
            style={{ width:'100%', background:'var(--color-bg-input)', border:'1px solid var(--color-border)', borderRadius:10, padding:'.6rem .85rem', fontSize:'.85rem', color:'var(--color-text)', outline:'none', resize:'none', lineHeight:1.5, boxSizing:'border-box', fontFamily:'inherit' }}
            onFocus={e => e.target.style.borderColor='var(--color-primary)'}
            onBlur={e => e.target.style.borderColor='var(--color-border)'}
          />
        </div>

        <div style={{ display:'flex', gap:'.6rem' }}>
          <button onClick={onClose} style={{ flex:1, padding:'.6rem', borderRadius:11, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.88rem' }}>Annuler</button>
          <button onClick={() => onSave({ rating, memo })} style={{ flex:2, padding:'.6rem', borderRadius:11, border:'none', background:'var(--color-primary)', color:'#fff', cursor:'pointer', fontSize:'.88rem', fontWeight:700 }}>Enregistrer</button>
        </div>
      </div>
    </div>
  )
}

// ── Carte d'un voyage archivé ─────────────────────────────────
const ArchivedTripCard = ({ trip, budgetTotal, bookingCount, onEditMemo }) => {
  const icon     = TRIP_ICONS[trip.type] || TRIP_ICONS.default
  const duration = daysBetween(trip.startDate, trip.endDate)

  return (
    <div style={{
      background:'var(--color-bg-card)', border:'1px solid var(--color-border)',
      borderRadius:16, padding:'1rem', marginBottom:'.7rem',
      transition:'border-color .2s, box-shadow .15s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,.12)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.boxShadow='none' }}
    >
      <div style={{ display:'flex', gap:'.85rem', alignItems:'flex-start' }}>
        {/* Icône */}
        <div style={{ width:46, height:46, borderRadius:13, background:'var(--color-bg-input)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>{icon}</div>

        {/* Infos */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'.5rem', marginBottom:'.2rem' }}>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.95rem', color:'var(--color-text)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {trip.name}
            </p>
            {trip.rating > 0 && <StarRating value={trip.rating} readonly />}
          </div>
          <p style={{ fontSize:'.8rem', fontWeight:600, color:'var(--color-primary)', margin:'0 0 .2rem' }}>
            📍 {trip.destination}{trip.country ? `, ${trip.country}` : ''}
          </p>
          <p style={{ fontSize:'.72rem', color:'var(--color-text-muted)', margin:'0 0 .5rem' }}>
            {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
            <span style={{ opacity:.7 }}> · {duration} nuit{duration > 1 ? 's' : ''}</span>
            {trip.people > 1 && <span style={{ opacity:.7 }}> · {trip.people} pers.</span>}
          </p>

          {/* Stats */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.35rem', marginBottom: trip.memo ? '.6rem' : 0 }}>
            {budgetTotal > 0 && (
              <span style={{ fontSize:'.68rem', padding:'.2rem .55rem', borderRadius:20, background:'#10b98118', color:'#10b981', border:'1px solid #10b98133' }}>
                💶 {budgetTotal.toFixed(0)} €
              </span>
            )}
            {bookingCount > 0 && (
              <span style={{ fontSize:'.68rem', padding:'.2rem .55rem', borderRadius:20, background:'var(--color-bg-input)', color:'var(--color-text-muted)', border:'1px solid var(--color-border)' }}>
                🎫 {bookingCount} réserv.
              </span>
            )}
            {trip.budget > 0 && budgetTotal > 0 && (
              <span style={{ fontSize:'.68rem', padding:'.2rem .55rem', borderRadius:20, background: trip.budget < budgetTotal ? '#ef444418' : '#10b98118', color: trip.budget < budgetTotal ? '#ef4444' : '#10b981', border:`1px solid ${trip.budget < budgetTotal ? '#ef444433' : '#10b98133'}` }}>
                {trip.budget < budgetTotal ? '⚠️ Dépassé' : '✅ Dans le budget'}
              </span>
            )}
          </div>

          {/* Mémo */}
          {trip.memo && (
            <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .5rem', fontStyle:'italic', lineHeight:1.4, borderLeft:'2px solid var(--color-primary)', paddingLeft:'.6rem' }}>
              {trip.memo.length > 120 ? trip.memo.slice(0, 120) + '…' : trip.memo}
            </p>
          )}

          {/* Bouton mémo */}
          <button onClick={() => onEditMemo(trip)} style={{ background:'none', border:'1px solid var(--color-border)', borderRadius:8, padding:'.3rem .7rem', cursor:'pointer', fontSize:'.72rem', color:'var(--color-text-muted)', transition:'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
          >
            {trip.memo || trip.rating ? '✏️ Modifier le mémo' : '📝 Ajouter un mémo'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Archive
// ============================================================
const Archive = () => {
  const navigate = useNavigate()
  const { trips, updateTrip } = useTrips()
  const { budgets, bookings }  = useApp()

  const [search,    setSearch]    = useState('')
  const [memoTrip,  setMemoTrip]  = useState(null)
  const [sortBy,    setSortBy]    = useState('date-desc')

  const pastTrips = useMemo(() =>
    trips.filter(t => isTripPast(t.endDate)),
    [trips]
  )

  const filtered = useMemo(() => {
    let list = pastTrips
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.destination?.toLowerCase().includes(q) ||
        t.country?.toLowerCase().includes(q)
      )
    }
    switch (sortBy) {
      case 'date-asc':   return [...list].sort((a,b) => new Date(a.endDate) - new Date(b.endDate))
      case 'rating':     return [...list].sort((a,b) => (b.rating||0) - (a.rating||0))
      case 'duration':   return [...list].sort((a,b) => daysBetween(b.startDate,b.endDate) - daysBetween(a.startDate,a.endDate))
      default:           return [...list].sort((a,b) => new Date(b.endDate) - new Date(a.endDate))
    }
  }, [pastTrips, search, sortBy])

  // Stats globales
  const stats = useMemo(() => {
    const countries  = new Set(pastTrips.filter(t => t.country).map(t => t.country)).size
    const totalNuits = pastTrips.reduce((s,t) => s + daysBetween(t.startDate, t.endDate), 0)
    const totalSpent = pastTrips.reduce((s,t) => s + (budgets[t.id]||[]).reduce((a,e) => a + e.amount, 0), 0)
    const avgRating  = pastTrips.filter(t=>t.rating).length
      ? (pastTrips.reduce((s,t) => s+(t.rating||0),0) / pastTrips.filter(t=>t.rating).length).toFixed(1)
      : null
    return { countries, totalNuits, totalSpent, avgRating }
  }, [pastTrips, budgets])

  const handleSaveMemo = ({ rating, memo }) => {
    updateTrip(memoTrip.id, { rating, memo })
    setMemoTrip(null)
  }

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* En-tête */}
      <div style={{ marginBottom:'1.1rem', animation:'fadeUp .35s ease both' }}>
        <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .15rem' }}>📦 ARCHIVES</p>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'var(--color-text)', margin:0 }}>
          Mes voyages passés
        </h1>
      </div>

      {/* Stats globales */}
      {pastTrips.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'.45rem', marginBottom:'1.1rem', animation:'fadeUp .35s .05s ease both' }}>
          {[
            { icon:'✈️', value: pastTrips.length, label:'voyages' },
            { icon:'🌍', value: stats.countries,  label:'pays' },
            { icon:'🌙', value: stats.totalNuits,  label:'nuits' },
            { icon:'💶', value: stats.totalSpent > 0 ? `${(stats.totalSpent/1000).toFixed(1)}k€` : '—', label:'dépensé' },
          ].map(s => (
            <div key={s.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem', padding:'.65rem .3rem', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:13 }}>
              <span style={{ fontSize:'1rem' }}>{s.icon}</span>
              <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'var(--color-text)', lineHeight:1 }}>{s.value}</span>
              <span style={{ fontSize:'.62rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Recherche + tri */}
      <div style={{ display:'flex', gap:'.5rem', marginBottom:'.85rem', animation:'fadeUp .35s .1s ease both' }}>
        <div style={{ position:'relative', flex:1 }}>
          <span style={{ position:'absolute', left:'.8rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem', pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…"
            style={{ width:'100%', background:'var(--color-bg-input)', border:'1px solid var(--color-border)', borderRadius:11, padding:'.6rem .9rem .6rem 2.3rem', fontSize:'.85rem', color:'var(--color-text)', outline:'none', boxSizing:'border-box' }}
            onFocus={e => e.target.style.borderColor='var(--color-primary)'}
            onBlur={e => e.target.style.borderColor='var(--color-border)'}
          />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ background:'var(--color-bg-input)', border:'1px solid var(--color-border)', borderRadius:11, padding:'.6rem .8rem', fontSize:'.82rem', color:'var(--color-text)', outline:'none', cursor:'pointer' }}>
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="rating">Mieux noté</option>
          <option value="duration">Plus long</option>
        </select>
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2.5rem 1rem', background:'var(--color-bg-card)', border:'1px dashed var(--color-border)', borderRadius:16, animation:'fadeUp .35s .15s ease both' }}>
          <p style={{ fontSize:'2.5rem', margin:'0 0 .75rem' }}>{pastTrips.length === 0 ? '🗺️' : '🔍'}</p>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, color:'var(--color-text)', margin:'0 0 .4rem' }}>
            {pastTrips.length === 0 ? 'Aucun voyage terminé' : 'Aucun résultat'}
          </p>
          <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.2rem' }}>
            {pastTrips.length === 0
              ? 'Vos voyages terminés apparaîtront ici automatiquement'
              : 'Essayez avec d\'autres termes'}
          </p>
          {pastTrips.length === 0 && (
            <button onClick={() => navigate('/voyages')} style={{ background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.6rem 1.2rem', fontSize:'.85rem', fontWeight:600, cursor:'pointer' }}>
              ✈️ Voir mes voyages
            </button>
          )}
        </div>
      ) : (
        <div style={{ animation:'fadeUp .35s .15s ease both' }}>
          <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:'0 0 .7rem' }}>{filtered.length} voyage{filtered.length > 1 ? 's' : ''}</p>
          {filtered.map(trip => (
            <ArchivedTripCard
              key={trip.id}
              trip={trip}
              budgetTotal={(budgets[trip.id]||[]).reduce((s,e) => s+e.amount, 0)}
              bookingCount={(bookings[trip.id]||[]).length}
              onEditMemo={setMemoTrip}
            />
          ))}
        </div>
      )}

      {/* Modale mémo */}
      {memoTrip && (
        <MemoModal trip={memoTrip} onSave={handleSaveMemo} onClose={() => setMemoTrip(null)} />
      )}
    </div>
  )
}

export default Archive
