// ============================================================
// Dashboard.jsx — Page d'accueil TyTravel
// ============================================================
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  daysUntil,
  daysBetween,
  isTripOngoing,
  isTripFuture,
  isTripPast,
  formatDateShort,
} from '../../utils/dateUtils'

// ── Icônes par type de voyage ─────────────────────────────
const TRIP_ICONS = {
  leisure:   '🌴',
  business:  '💼',
  family:    '👨‍👩‍👧',
  adventure: '🧗',
  citytrip:  '🏙️',
  beach:     '🏖️',
  mountain:  '🏔️',
  cruise:    '🚢',
  default:   '✈️',
}

// ── Compte à rebours ───────────────────────────────────────
const Countdown = ({ days }) => {
  if (days === null) return null
  if (days === 0) return (
    <div style={{ marginRight: '1rem', flexShrink: 0 }}>
      <span style={{
        fontSize: '.72rem', fontWeight: 700, padding: '.3rem .7rem',
        borderRadius: '20px', background: '#fef08a22', color: '#fde047',
        border: '1px solid #ca8a0455',
      }}>Aujourd'hui !</span>
    </div>
  )
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, marginRight:'1rem' }}>
      <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.7rem', fontWeight:800, color:'var(--color-primary)', lineHeight:1 }}>{days}</span>
      <span style={{ fontSize:'.65rem', textTransform:'uppercase', letterSpacing:'.06em', color:'var(--color-text-muted)' }}>jour{days > 1 ? 's' : ''}</span>
    </div>
  )
}

// ── Carte voyage ───────────────────────────────────────────
const TripCard = ({ trip, featured, navigate, delay = 0 }) => {
  const icon     = TRIP_ICONS[trip.type] || TRIP_ICONS.default
  const ongoing  = isTripOngoing(trip.startDate, trip.endDate)
  const days     = ongoing ? null : daysUntil(trip.startDate)
  const duration = daysBetween(trip.startDate, trip.endDate)

  const progressPct = useMemo(() => {
    if (!ongoing) return 0
    const total   = daysBetween(trip.startDate, trip.endDate) || 1
    const elapsed = daysBetween(trip.startDate, new Date().toISOString().slice(0, 10))
    return Math.min(100, Math.round((elapsed / total) * 100))
  }, [ongoing, trip.startDate, trip.endDate])

  return (
    <div
      onClick={() => navigate(`/voyages/${trip.id}`)}
      style={{
        position: 'relative',
        background: featured
          ? 'linear-gradient(135deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-primary) 8%, var(--color-bg-card)) 100%)'
          : 'var(--color-bg-card)',
        border: `1px solid ${featured ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: '18px',
        padding: '1rem',
        marginBottom: '.7rem',
        cursor: 'pointer',
        animation: `fadeUp .4s ${delay}ms ease both`,
        transition: 'transform .15s, box-shadow .2s, border-color .2s',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.2)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Statut */}
      <div style={{ marginBottom: '.6rem' }}>
        <span style={{
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.08em',
          padding: '.25rem .6rem', borderRadius: '20px',
          ...(ongoing
            ? { background: '#16532233', color: '#4ade80', border: '1px solid #16a34a55' }
            : { background: '#1e3a5f33', color: '#60a5fa', border: '1px solid #1d4ed855' }),
        }}>
          {ongoing ? '● EN COURS' : '○ PLANIFIÉ'}
        </span>
      </div>

      {/* Corps */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '.85rem' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: 'var(--color-bg-input)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem',
        }}>{icon}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1rem', color:'var(--color-text)', margin:'0 0 .15rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {trip.name}
          </p>
          <p style={{ fontSize:'.82rem', fontWeight:600, color:'var(--color-primary)', margin:'0 0 .15rem' }}>
            {trip.destination}{trip.country ? `, ${trip.country}` : ''}
          </p>
          <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:0 }}>
            {formatDateShort(trip.startDate)} → {formatDateShort(trip.endDate)}
            <span style={{ opacity:.7 }}> · {duration} nuit{duration > 1 ? 's' : ''}</span>
          </p>
        </div>

        {ongoing
          ? <div style={{ marginRight:'.8rem', flexShrink:0 }}>
              <span style={{ display:'block', width:12, height:12, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 0 3px #4ade8033', animation:'pulse 1.8s ease infinite' }} />
            </div>
          : <Countdown days={days} />
        }
      </div>

      {/* Barre progression si en cours */}
      {ongoing && (
        <div style={{ marginTop: '.8rem', display:'flex', alignItems:'center', gap:'.6rem' }}>
          <div style={{ flex:1, height:4, background:'var(--color-bg-input)', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${progressPct}%`, background:'linear-gradient(90deg, var(--color-primary), var(--color-accent))', borderRadius:2, transition:'width .6s ease' }} />
          </div>
          <span style={{ fontSize:'.68rem', color:'var(--color-text-muted)', whiteSpace:'nowrap' }}>{progressPct}%</span>
        </div>
      )}

      {/* Flèche */}
      <span style={{ position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', fontSize:'1.3rem', color:'var(--color-text-muted)', opacity:.4 }}>›</span>
    </div>
  )
}

// ── Pastille stat ──────────────────────────────────────────
const StatPill = ({ icon, value, label, delay = 0 }) => (
  <div style={{
    flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'.15rem',
    background:'var(--color-bg-card)', border:'1px solid var(--color-border)',
    borderRadius:14, padding:'.7rem .4rem',
    animation: `fadeUp .4s ${delay}ms ease both`,
  }}>
    <span style={{ fontSize:'1.1rem' }}>{icon}</span>
    <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.25rem', fontWeight:700, color:'var(--color-text)', lineHeight:1 }}>{value}</span>
    <span style={{ fontSize:'.68rem', color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'.04em' }}>{label}</span>
  </div>
)

// ============================================================
// Dashboard
// ============================================================
const Dashboard = () => {
  const { trips }  = useApp()
  const navigate   = useNavigate()

  const ongoingTrips  = useMemo(() => trips.filter((t) => isTripOngoing(t.startDate, t.endDate)), [trips])
  const upcomingTrips = useMemo(() =>
    trips.filter((t) => isTripFuture(t.startDate)).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 3),
    [trips]
  )
  const pastCount   = useMemo(() => trips.filter((t) => isTripPast(t.endDate)).length, [trips])
  const countries   = useMemo(() => new Set(trips.filter((t) => t.country).map((t) => t.country)).size, [trips])

  const featuredTrip = ongoingTrips[0] || upcomingTrips[0] || null
  const otherTrips   = ongoingTrips[0] ? upcomingTrips.slice(0, 2) : upcomingTrips.slice(1, 3)

  return (
    <div>
      {/* ── CSS global injecté ── */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse  { 0% { box-shadow:0 0 0 0 #4ade8055; } 70% { box-shadow:0 0 0 10px #4ade8000; } 100% { box-shadow:0 0 0 0 #4ade8000; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', animation:'fadeUp .4s ease both' }}>
        <div>
          <p style={{ fontSize:'.85rem', color:'var(--color-text-muted)', margin:'0 0 .2rem' }}>Bonjour 👋</p>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.6rem', fontWeight:800, color:'var(--color-text)', margin:0, lineHeight:1.2 }}>
            {ongoingTrips.length > 0 ? 'Bon voyage !' : upcomingTrips.length > 0 ? 'Prêt à décoller ?' : 'Où part-on ?'}
          </h1>
        </div>
        <button
          onClick={() => navigate('/voyages')}
          title="Gérer les voyages"
          style={{
            width:44, height:44, borderRadius:14, background:'var(--color-primary)',
            color:'#fff', fontSize:'1.5rem', fontWeight:300, lineHeight:1,
            border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            flexShrink:0, boxShadow:'0 4px 14px rgba(217,124,26,.35)',
            transition:'transform .15s, background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >+</button>
      </div>

      {/* ── Stats ── */}
      {trips.length > 0 && (
        <div style={{ display:'flex', gap:'.6rem', marginBottom:'1.4rem' }}>
          <StatPill icon="✈️" value={trips.length} label="voyage(s)" delay={50} />
          <StatPill icon="🌍" value={countries}     label="pays"      delay={100} />
          <StatPill icon="📦" value={pastCount}     label="archivés"  delay={150} />
        </div>
      )}

      {/* ── Voyage mis en avant ── */}
      {featuredTrip ? (
        <section style={{ marginBottom:'1.5rem' }}>
          <p style={{ fontSize:'.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--color-text-muted)', margin:'0 0 .7rem' }}>
            {ongoingTrips.length > 0 ? '🛫 En cours' : '🗓️ Prochain voyage'}
          </p>
          <TripCard trip={featuredTrip} featured navigate={navigate} delay={0} />
        </section>
      ) : (
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
          padding:'2.5rem 1rem',
          background:'var(--color-bg-card)', border:'1px dashed var(--color-border)',
          borderRadius:18, marginBottom:'1.5rem',
          animation:'fadeUp .4s .1s ease both',
        }}>
          <span style={{ fontSize:'3rem', marginBottom:'.75rem' }}>🗺️</span>
          <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.05rem', fontWeight:700, color:'var(--color-text)', margin:'0 0 .4rem' }}>
            Aucun voyage planifié
          </p>
          <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.2rem' }}>
            Commencez par créer votre premier voyage
          </p>
          <button
            onClick={() => navigate('/voyages')}
            style={{
              background:'var(--color-primary)', color:'#fff', border:'none',
              borderRadius:12, padding:'.65rem 1.5rem',
              fontSize:'.88rem', fontWeight:600, cursor:'pointer',
              boxShadow:'0 4px 14px rgba(217,124,26,.35)',
              transition:'transform .15s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >Créer un voyage</button>
        </div>
      )}

      {/* ── Autres voyages à venir ── */}
      {otherTrips.length > 0 && (
        <section style={{ marginBottom:'1.5rem' }}>
          <p style={{ fontSize:'.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--color-text-muted)', margin:'0 0 .7rem' }}>
            📅 À venir
          </p>
          {otherTrips.map((t, i) => <TripCard key={t.id} trip={t} navigate={navigate} delay={i * 80} />)}
        </section>
      )}
    </div>
  )
}

export default Dashboard
