// ============================================================
// Links.jsx — Liens rapides vers sites de réservation
// ============================================================
import React, { useState } from 'react'
import { BOOKING_LINKS } from '../../utils/constants'

const SECTIONS = [
  { key:'flights', label:'Vols',       icon:'✈️', color:'#6366f1' },
  { key:'hotels',  label:'Hébergement',icon:'🏨', color:'#d97c1a' },
  { key:'cars',    label:'Voitures',   icon:'🚗', color:'#10b981' },
  { key:'trains',  label:'Trains',     icon:'🚄', color:'#3b82f6' },
]

// Liens personnalisés — stockés dans un state local simple
const CUSTOM_INIT = []

// ── Carte lien ───────────────────────────────────────────────
const LinkCard = ({ icon, name, url, color, onDelete }) => (
  <a href={url} target="_blank" rel="noopener noreferrer"
    style={{ display:'flex', alignItems:'center', gap:'.75rem', padding:'.75rem .9rem', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:14, textDecoration:'none', transition:'border-color .15s, box-shadow .15s', position:'relative' }}
    onMouseEnter={e => { e.currentTarget.style.borderColor=color; e.currentTarget.style.boxShadow=`0 4px 12px ${color}22` }}
    onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border)'; e.currentTarget.style.boxShadow='none' }}
  >
    <div style={{ width:38, height:38, borderRadius:11, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>{icon}</div>
    <div style={{ flex:1, minWidth:0 }}>
      <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'.88rem', color:'var(--color-text)', margin:'0 0 .1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{name}</p>
      <p style={{ fontSize:'.68rem', color:'var(--color-text-muted)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{url.replace(/^https?:\/\/(www\.)?/, '')}</p>
    </div>
    <span style={{ fontSize:'.8rem', color:`${color}99`, flexShrink:0 }}>↗</span>
    {onDelete && (
      <button onClick={e => { e.preventDefault(); e.stopPropagation(); onDelete() }}
        style={{ position:'absolute', top:'.4rem', right:'.4rem', background:'none', border:'none', cursor:'pointer', color:'#f87171', fontSize:'.72rem', padding:'.2rem', lineHeight:1, borderRadius:5 }}>✕</button>
    )}
  </a>
)

// ── Formulaire lien personnalisé ─────────────────────────────
const AddLinkForm = ({ onAdd, onCancel }) => {
  const [form, setForm]   = useState({ name:'', url:'', icon:'🔗' })
  const [errors, setErrors] = useState({})

  const QUICK_ICONS = ['🔗','🌐','🗺️','🏕️','🚢','🎭','🍽️','🛒','🏥','📞','🏦','🎫']

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:null})) }

  const save = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nom obligatoire'
    if (!form.url.trim())  e.url  = 'URL obligatoire'
    else if (!/^https?:\/\//.test(form.url)) e.url = 'URL invalide (doit commencer par http:// ou https://)'
    if (Object.keys(e).length) { setErrors(e); return }
    onAdd(form)
  }

  const inp = (hasErr) => ({
    width:'100%', background:'var(--color-bg-input)', border:`1px solid ${hasErr ? '#f87171':'var(--color-border)'}`,
    borderRadius:10, padding:'.55rem .8rem', fontSize:'.85rem', color:'var(--color-text)',
    outline:'none', boxSizing:'border-box', fontFamily:'inherit',
  })

  return (
    <div style={{ background:'var(--color-bg-input)', border:'1px solid var(--color-primary)', borderRadius:16, padding:'1rem', marginBottom:'1rem', animation:'fadeUp .25s ease both' }}>
      <p style={{ fontSize:'.8rem', fontWeight:700, color:'var(--color-text)', margin:'0 0 .8rem' }}>🔗 Nouveau lien personnalisé</p>

      {/* Icône */}
      <div style={{ marginBottom:'.7rem' }}>
        <p style={{ fontSize:'.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', color:'var(--color-text-muted)', margin:'0 0 .4rem' }}>Icône</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'.3rem' }}>
          {QUICK_ICONS.map(ic => (
            <button key={ic} onClick={() => set('icon', ic)} style={{
              width:36, height:36, borderRadius:9, cursor:'pointer', fontSize:'1.1rem',
              background: form.icon === ic ? 'var(--color-primary)' : 'var(--color-bg-card)',
              border:`1px solid ${form.icon === ic ? 'var(--color-primary)' : 'var(--color-border)'}`,
            }}>{ic}</button>
          ))}
        </div>
      </div>

      {/* Nom */}
      <div style={{ marginBottom:'.6rem' }}>
        <p style={{ fontSize:'.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', color:'var(--color-text-muted)', margin:'0 0 .35rem' }}>Nom *</p>
        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Météo Monde…" style={inp(!!errors.name)}
          onFocus={e => e.target.style.borderColor='var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = errors.name ? '#f87171' : 'var(--color-border)'} />
        {errors.name && <p style={{ fontSize:'.7rem', color:'#f87171', margin:'.2rem 0 0' }}>{errors.name}</p>}
      </div>

      {/* URL */}
      <div style={{ marginBottom:'.85rem' }}>
        <p style={{ fontSize:'.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.04em', color:'var(--color-text-muted)', margin:'0 0 .35rem' }}>URL *</p>
        <input value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://…" style={inp(!!errors.url)}
          onFocus={e => e.target.style.borderColor='var(--color-primary)'}
          onBlur={e => e.target.style.borderColor = errors.url ? '#f87171' : 'var(--color-border)'} />
        {errors.url && <p style={{ fontSize:'.7rem', color:'#f87171', margin:'.2rem 0 0' }}>{errors.url}</p>}
      </div>

      <div style={{ display:'flex', gap:'.5rem' }}>
        <button onClick={onCancel} style={{ flex:1, padding:'.6rem', borderRadius:11, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.85rem' }}>Annuler</button>
        <button onClick={save} style={{ flex:2, padding:'.6rem', borderRadius:11, border:'none', background:'var(--color-primary)', color:'#fff', cursor:'pointer', fontSize:'.88rem', fontWeight:700 }}>Ajouter</button>
      </div>
    </div>
  )
}

// ============================================================
// Links
// ============================================================
const Links = () => {
  const [customLinks, setCustomLinks] = useState(CUSTOM_INIT)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = (link) => {
    setCustomLinks(prev => [...prev, { ...link, id: Date.now().toString() }])
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setCustomLinks(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* En-tête */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem', animation:'fadeUp .35s ease both' }}>
        <div>
          <p style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .15rem' }}>🔗 LIENS RAPIDES</p>
          <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'var(--color-text)', margin:0 }}>
            Sites utiles
          </h1>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{ display:'flex', alignItems:'center', gap:'.35rem', background:'var(--color-primary)', color:'#fff', border:'none', borderRadius:12, padding:'.55rem .9rem', fontSize:'.82rem', fontWeight:600, cursor:'pointer' }}>
          + Ajouter
        </button>
      </div>

      {/* Formulaire */}
      {showForm && <AddLinkForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />}

      {/* Liens personnalisés */}
      {customLinks.length > 0 && (
        <div style={{ marginBottom:'1.4rem', animation:'fadeUp .35s .05s ease both' }}>
          <p style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--color-text-muted)', margin:'0 0 .65rem', display:'flex', alignItems:'center', gap:'.4rem' }}>
            ⭐ Mes liens
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {customLinks.map(l => (
              <LinkCard key={l.id} {...l} color='var(--color-primary)' onDelete={() => handleDelete(l.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Sections prédéfinies */}
      {SECTIONS.map((section, si) => (
        <div key={section.key} style={{ marginBottom:'1.4rem', animation:`fadeUp .35s ${.1 + si * .05}s ease both` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'.45rem', marginBottom:'.65rem' }}>
            <div style={{ width:28, height:28, borderRadius:8, background:`${section.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem' }}>{section.icon}</div>
            <p style={{ fontSize:'.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--color-text-muted)', margin:0 }}>{section.label}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {(BOOKING_LINKS[section.key] || []).map(link => (
              <LinkCard key={link.name} {...link} color={section.color} />
            ))}
          </div>
        </div>
      ))}

      {/* Autres ressources utiles */}
      <div style={{ marginBottom:'1.4rem', animation:'fadeUp .35s .35s ease both' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'.45rem', marginBottom:'.65rem' }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'#f59e0b22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.95rem' }}>🌐</div>
          <p style={{ fontSize:'.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--color-text-muted)', margin:0 }}>Ressources pratiques</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
          {[
            { icon:'🌤️', name:'Météo (Weather.com)',     url:'https://weather.com',              color:'#0ea5e9' },
            { icon:'💱', name:'Convertisseur de devises', url:'https://www.xe.com/fr/',           color:'#10b981' },
            { icon:'🗺️', name:'Google Maps',              url:'https://maps.google.com',          color:'#4285f4' },
            { icon:'🌍', name:'Tripadvisor',              url:'https://www.tripadvisor.fr',        color:'#34e0a1' },
            { icon:'📋', name:'Visa & formalités (TiMatic)',url:'https://www.iata.org/timatic',   color:'#8b5cf6' },
            { icon:'🏥', name:'Santé — Conseils aux voyageurs', url:'https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/', color:'#ef4444' },
          ].map(l => (
            <LinkCard key={l.name} {...l} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Links
