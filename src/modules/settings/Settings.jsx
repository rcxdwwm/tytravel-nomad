// ============================================================
// Settings.jsx — Paramètres de l'application
// ============================================================
import React, { useState, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { exportAllData, importAllData, clearAllData } from '../../services/storageService'
import { APP_VERSION } from '../../utils/constants'
import { useApp } from '../../context/AppContext'

const SettingRow = ({ icon, label, desc, children, danger }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', padding:'.85rem 0', borderBottom:'1px solid var(--color-border)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:'.75rem', flex:1, minWidth:0 }}>
      <div style={{ width:36, height:36, borderRadius:11, background: danger ? '#ef444418' : 'var(--color-bg-input)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{icon}</div>
      <div style={{ minWidth:0 }}>
        <p style={{ fontSize:'.88rem', fontWeight:600, color: danger ? '#f87171' : 'var(--color-text)', margin:'0 0 .1rem' }}>{label}</p>
        {desc && <p style={{ fontSize:'.72rem', color:'var(--color-text-muted)', margin:0, lineHeight:1.3 }}>{desc}</p>}
      </div>
    </div>
    <div style={{ flexShrink:0 }}>{children}</div>
  </div>
)

const Toggle = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)}
    style={{ width:44, height:24, borderRadius:12, border:'none', cursor:'pointer', background: checked ? 'var(--color-primary)' : 'var(--color-bg-input)', position:'relative', transition:'background .2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:3, left: checked ? 23 : 3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,.25)' }} />
  </button>
)

const Section = ({ title, children }) => (
  <div style={{ background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:16, padding:'0 1rem', marginBottom:'1rem' }}>
    <p style={{ fontSize:'.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--color-text-muted)', padding:'.85rem 0 .15rem', margin:0 }}>{title}</p>
    {children}
  </div>
)

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const { trips, bookings, budgets, checklists, itineraries, showToast } = useApp()
  const importRef = useRef(null)
  const [confirmClear, setConfirmClear] = useState(false)
  const [importStatus, setImportStatus] = useState(null)

  const stats = {
    trips:      trips.length,
    bookings:   Object.values(bookings).reduce((s,a)  => s + a.length, 0),
    expenses:   Object.values(budgets).reduce((s,a)   => s + a.length, 0),
    activities: Object.values(itineraries).reduce((s,days) => s + (days||[]).reduce((sd,d) => sd + (d.activities||[]).length, 0), 0),
    checkItems: Object.values(checklists).reduce((s,a) => s + a.length, 0),
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importAllData(file)
      setImportStatus('ok')
      showToast('Import réussi — rechargez la page')
      setTimeout(() => setImportStatus(null), 4000)
    } catch {
      setImportStatus('error')
      setTimeout(() => setImportStatus(null), 4000)
    }
    e.target.value = ''
  }

  const handleClear = () => {
    clearAllData()
    setConfirmClear(false)
    showToast('Données supprimées — rechargez la page')
  }

  return (
    <div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ marginBottom:'1.1rem', animation:'fadeUp .35s ease both' }}>
        <h1 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'1.5rem', fontWeight:800, color:'var(--color-text)', margin:0 }}>Réglages</h1>
      </div>

      {/* Apparence */}
      <Section title="Apparence">
        <SettingRow icon="🌙" label="Mode sombre" desc="Thème foncé pour les yeux">
          <Toggle checked={isDark} onChange={toggleTheme} />
        </SettingRow>
      </Section>

      {/* Mes données */}
      <Section title="Mes données">
        <div style={{ padding:'.65rem 0', borderBottom:'1px solid var(--color-border)' }}>
          <p style={{ fontSize:'.75rem', fontWeight:600, color:'var(--color-text-muted)', margin:'0 0 .6rem', textTransform:'uppercase', letterSpacing:'.04em' }}>Contenu stocké</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'.4rem' }}>
            {[
              { label:'Voyages',      value:stats.trips,      icon:'✈️' },
              { label:'Réservations', value:stats.bookings,   icon:'🎫' },
              { label:'Dépenses',     value:stats.expenses,   icon:'💶' },
              { label:'Activités',    value:stats.activities, icon:'🗓️' },
              { label:'Items check',  value:stats.checkItems, icon:'✅' },
            ].map(s => (
              <div key={s.label} style={{ display:'flex', alignItems:'center', gap:'.5rem', padding:'.45rem .6rem', background:'var(--color-bg-input)', borderRadius:10 }}>
                <span style={{ fontSize:'.9rem' }}>{s.icon}</span>
                <span style={{ fontSize:'.8rem', fontWeight:700, color:'var(--color-text)' }}>{s.value}</span>
                <span style={{ fontSize:'.72rem', color:'var(--color-text-muted)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
        <SettingRow icon="📤" label="Exporter les données" desc="Télécharger un fichier JSON de sauvegarde">
          <button onClick={exportAllData} style={{ background:'var(--color-bg-input)', border:'1px solid var(--color-border)', borderRadius:10, padding:'.45rem .9rem', cursor:'pointer', fontSize:'.8rem', fontWeight:600, color:'var(--color-text)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
          >Exporter</button>
        </SettingRow>
        <SettingRow icon="📥" label="Importer des données" desc="Restaurer depuis un fichier JSON">
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.3rem' }}>
            <button onClick={() => importRef.current?.click()} style={{ background:'var(--color-bg-input)', border:'1px solid var(--color-border)', borderRadius:10, padding:'.45rem .9rem', cursor:'pointer', fontSize:'.8rem', fontWeight:600, color:'var(--color-text)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border)'}
            >Importer</button>
            <input ref={importRef} type="file" accept=".json" onChange={handleImport} style={{ display:'none' }} />
            {importStatus === 'ok'    && <p style={{ fontSize:'.68rem', color:'#10b981', margin:0 }}>✅ Import réussi</p>}
            {importStatus === 'error' && <p style={{ fontSize:'.68rem', color:'#f87171', margin:0 }}>❌ Fichier invalide</p>}
          </div>
        </SettingRow>
      </Section>

      {/* Zone danger */}
      <Section title="Zone de danger">
        <SettingRow icon="🗑️" label="Effacer toutes les données" desc="Supprime définitivement voyages, réservations, budgets…" danger>
          <button onClick={() => setConfirmClear(true)} style={{ background:'#ef444418', border:'1px solid #ef444433', borderRadius:10, padding:'.45rem .9rem', cursor:'pointer', fontSize:'.8rem', fontWeight:600, color:'#f87171' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#ef4444'}
            onMouseLeave={e => e.currentTarget.style.borderColor='#ef444433'}
          >Effacer</button>
        </SettingRow>
      </Section>

      {/* Infos & statut */}
      <div style={{ background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:16, padding:'1.1rem 1rem', marginBottom:'1rem', animation:'fadeUp .35s .15s ease both' }}>
        <p style={{ fontSize:'.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--color-text-muted)', margin:'0 0 .9rem' }}>Infos &amp; paramètres</p>

        {/* Logo + version */}
        <div style={{ display:'flex', alignItems:'center', gap:'.85rem', marginBottom:'1rem', paddingBottom:'1rem', borderBottom:'1px solid var(--color-border)' }}>
          <img src="/tytravel-nomad/icon-192.png" alt="logo" style={{ width:48, height:48, borderRadius:12, objectFit:'contain', flexShrink:0 }} />
          <div>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:800, fontSize:'1rem', margin:'0 0 .15rem' }}>
              <span style={{ color:'var(--color-text)' }}>Ty</span>
              <span style={{ color:'var(--color-primary)' }}>Travel</span>
              <span style={{ color:'var(--color-text)' }}> </span>
              <span style={{ color:'var(--color-primary)' }}>Nomad</span>
            </p>
            <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:0 }}>Version {APP_VERSION}</p>
          </div>
        </div>

        {/* Statut expérimental */}
        <p style={{ fontSize:'.8rem', fontWeight:700, color:'var(--color-text)', margin:'0 0 .6rem' }}>Statut expérimental de l'application</p>

        {[
          "TyTravel Nomad est un prototype expérimental proposé gratuitement, sans inscription et sans aucune garantie de disponibilité ou de continuité. L'application peut être modifiée, suspendue ou retirée à tout moment.",
          "En cas d'arrêt définitif du service, TyWebCreation s'efforcera, dans la mesure du possible, de publier un préavis d'information directement dans l'application.",
          "Toutes les données sont stockées localement sur votre appareil. Aucune donnée personnelle n'est collectée, transmise ou exploitée à des fins commerciales. Il est recommandé d'exporter régulièrement vos données via le bouton 📤 en haut de l'écran.",
          "TyWebCreation décline toute responsabilité concernant les erreurs, omissions, pertes de données, dysfonctionnements ou conséquences liées à l'utilisation ou à l'arrêt de l'application.",
          "L'application est développée de manière indépendante, libre et non commerciale. Des mises à jour peuvent être proposées ponctuellement, sans obligation de fréquence ou de maintien.",
        ].map((txt, i) => (
          <p key={i} style={{ fontSize:'.78rem', color:'var(--color-text-muted)', margin:'0 0 .65rem', lineHeight:1.55 }}>{txt}</p>
        ))}

        {/* Copyright */}
        <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:'1rem 0 0', paddingTop:'.85rem', borderTop:'1px solid var(--color-border)' }}>
          © {new Date().getFullYear()}{' '}
          <a href="https://tywebcreation.fr" target="_blank" rel="noopener noreferrer"
            style={{ color:'var(--color-primary)', textDecoration:'none', fontWeight:600 }}>
            TyWebCreation.fr
          </a>
          {' '}— Tous droits réservés
        </p>
      </div>

      {/* Confirm clear */}
      {confirmClear && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }} onClick={() => setConfirmClear(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.65)', backdropFilter:'blur(4px)' }} />
          <div style={{ position:'relative', background:'var(--color-bg-card)', border:'1px solid var(--color-border)', borderRadius:22, padding:'1.5rem', maxWidth:320, width:'100%', animation:'fadeUp .3s ease both', textAlign:'center' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize:'2.5rem', margin:'0 0 .75rem' }}>⚠️</p>
            <p style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text)', margin:'0 0 .5rem' }}>Tout supprimer ?</p>
            <p style={{ fontSize:'.82rem', color:'var(--color-text-muted)', margin:'0 0 1.4rem', lineHeight:1.5 }}>
              Cette action est <strong style={{ color:'#f87171' }}>irréversible</strong>. Tous vos voyages, réservations, budgets et checklists seront effacés.
            </p>
            <p style={{ fontSize:'.75rem', color:'var(--color-text-muted)', margin:'0 0 1.2rem' }}>💡 Pensez à exporter vos données avant.</p>
            <div style={{ display:'flex', gap:'.6rem' }}>
              <button onClick={() => setConfirmClear(false)} style={{ flex:1, padding:'.65rem', borderRadius:12, border:'1px solid var(--color-border)', background:'none', color:'var(--color-text-muted)', cursor:'pointer', fontSize:'.88rem' }}>Annuler</button>
              <button onClick={handleClear} style={{ flex:1, padding:'.65rem', borderRadius:12, border:'none', background:'#ef4444', color:'#fff', cursor:'pointer', fontSize:'.88rem', fontWeight:700 }}>Effacer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
