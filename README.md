# ✈️ TyTravel

Application de gestion de voyages — React + Vite + Tailwind CSS  
By **TyWebCreation** — Déployée sur GitHub Pages

---

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

## 🏗️ Build & déploiement GitHub Pages

```bash
npm run build
# Puis pousser le dossier dist/ sur la branche gh-pages
```

---

## 📁 Structure du projet

```
src/
├── assets/              # Icônes, images statiques
├── components/
│   ├── common/          # Button, Card, Modal, Badge, Input, EmptyState…
│   ├── layout/          # AppLayout, Header, BottomNav, PageHeader
│   └── ui/              # Toast, StatusBadge, CountdownBadge…
├── context/
│   ├── AppContext.jsx    # État global (voyages, réservations, budget…)
│   └── ThemeContext.jsx  # Dark / Light mode
├── hooks/
│   ├── useLocalStorage.js
│   └── useModal.js
├── modules/
│   ├── dashboard/       # Page d'accueil / Hub
│   ├── trips/           # Liste et détail voyages (CRUD)
│   ├── itinerary/       # Timeline jour par jour
│   ├── bookings/        # Réservations vol/hôtel/voiture/assurance
│   ├── budget/          # Budget prévisionnel + dépenses réelles
│   ├── checklist/       # Checklist pré-départ avec templates
│   ├── archive/         # Voyages terminés + stats
│   ├── links/           # Liens rapides sites de réservation
│   └── settings/        # Paramètres + export/import données
├── services/
│   └── storageService.js # Export/Import JSON global
├── styles/
│   ├── variables.css     # Palette couleurs (héritée Life Manager)
│   └── index.css         # Styles globaux + Tailwind
└── utils/
    ├── constants.js      # STORAGE_KEYS, ROUTES, BOOKING_LINKS, templates…
    ├── dateUtils.js      # Helpers dates (format, calculs, comparaisons)
    └── formatUtils.js    # formatCurrency, truncate, validation…
```

---

## 🎨 Design

Palette sombre héritée de **Life Manager** :
- Fond : `#0d0a07` → `#1a1208` (dark) / `#f5ede0` (light)
- Primaire : ambre/orange `#d97c1a`
- Accent : or `#d4a853`
- Police display : Plus Jakarta Sans
- Police texte : DM Sans

---

## 🗄️ Données

Toutes les données sont stockées localement via **localStorage**.  
Aucune donnée n'est transmise à un serveur.

Clés de stockage :
| Clé | Contenu |
|-----|---------|
| `tytravel-trips` | Liste des voyages |
| `tytravel-itinerary` | Itinéraires par voyage (objet indexé par tripId) |
| `tytravel-bookings` | Réservations par voyage |
| `tytravel-budget` | Dépenses par voyage |
| `tytravel-checklist` | Items checklist par voyage |
| `tytravel-theme` | Préférence dark/light |

---

## 📦 Dépendances principales

| Package | Usage |
|---------|-------|
| react + react-dom | Framework UI |
| react-router-dom | Routing SPA |
| @heroicons/react | Icônes |
| date-fns | Manipulation dates (fr) |
| uuid | Génération d'IDs uniques |
| tailwindcss | Styles utilitaires |

---

## 🔄 Ajouter un nouveau module

1. Créer le dossier `src/modules/monModule/` avec `index.js`, composant principal, `hooks/`, `services/`
2. Ajouter la route dans `App.jsx`
3. Ajouter l'entrée de navigation dans `BottomNav.jsx` (si page principale)
4. Ajouter la clé localStorage dans `utils/constants.js → STORAGE_KEYS`
5. Initialiser l'état dans `AppContext.jsx`

---

*TyWebCreation — Ploemeur, Bretagne 🌊*
