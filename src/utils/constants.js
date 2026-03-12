// ============================================================
// constants.js — Constantes globales TyTravel
// ============================================================

export const APP_NAME    = 'TyTravel-Nomad'
export const APP_VERSION = '1.0.0'

// ── Clés localStorage ───────────────────────────────────────
export const STORAGE_KEYS = {
  THEME:      'tytravel-nomad-theme',
  TRIPS:      'tytravel-nomad-trips',
  ITINERARY:  'tytravel-nomad-itinerary',
  BOOKINGS:   'tytravel-nomad-bookings',
  BUDGET:     'tytravel-nomad-budget',
  CHECKLIST:  'tytravel-nomad-checklist',
  CHECKLISTS_TEMPLATES: 'tytravel-nomad-checklist-templates',
  ARCHIVE:    'tytravel-nomad-archive',
  SETTINGS:   'tytravel-nomad-settings',
}

// ── Statuts d'un voyage ─────────────────────────────────────
export const TRIP_STATUS = {
  PLANNED:    'planned',
  ONGOING:    'ongoing',
  COMPLETED:  'completed',
  CANCELLED:  'cancelled',
}

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUS.PLANNED]:   'Planifié',
  [TRIP_STATUS.ONGOING]:   'En cours',
  [TRIP_STATUS.COMPLETED]: 'Terminé',
  [TRIP_STATUS.CANCELLED]: 'Annulé',
}

// ── Types de voyages ────────────────────────────────────────
export const TRIP_TYPES = [
  { value: 'leisure',   label: 'Loisirs' },
  { value: 'business',  label: 'Professionnel' },
  { value: 'family',    label: 'Famille' },
  { value: 'adventure', label: 'Aventure' },
  { value: 'citytrip',  label: 'City trip' },
  { value: 'beach',     label: 'Plage' },
  { value: 'mountain',  label: 'Montagne' },
  { value: 'cruise',    label: 'Croisière' },
]

// ── Types de réservations ────────────────────────────────────
export const BOOKING_TYPES = {
  FLIGHT:      'flight',
  HOTEL:       'hotel',
  CAR:         'car',
  INSURANCE:   'insurance',
  ACTIVITY:    'activity',
  TRAIN:       'train',
  FERRY:       'ferry',
}

export const BOOKING_TYPE_LABELS = {
  [BOOKING_TYPES.FLIGHT]:    'Vol',
  [BOOKING_TYPES.HOTEL]:     'Hébergement',
  [BOOKING_TYPES.CAR]:       'Voiture',
  [BOOKING_TYPES.INSURANCE]: 'Assurance',
  [BOOKING_TYPES.ACTIVITY]:  'Activité',
  [BOOKING_TYPES.TRAIN]:     'Train',
  [BOOKING_TYPES.FERRY]:     'Ferry',
}

// ── Liens rapides vers sites de réservation ──────────────────
export const BOOKING_LINKS = {
  flights: [
    { name: 'Skyscanner',  url: 'https://www.skyscanner.fr',         icon: '✈️' },
    { name: 'Kayak',       url: 'https://www.kayak.fr',              icon: '✈️' },
    { name: 'Google Vols', url: 'https://www.google.fr/flights',     icon: '✈️' },
    { name: 'Transavia',   url: 'https://www.transavia.com',         icon: '✈️' },
    { name: 'EasyJet',     url: 'https://www.easyjet.com/fr',        icon: '✈️' },
    { name: 'Ryanair',     url: 'https://www.ryanair.com/fr',        icon: '✈️' },
    { name: 'Volotea',     url: 'https://www.volotea.com/fr',        icon: '✈️' },

  ],
  hotels: [
    { name: 'Booking.com', url: 'https://www.booking.com',           icon: '🏨' },
    { name: 'Airbnb',      url: 'https://www.airbnb.fr',             icon: '🏠' },
    { name: 'Hotels.com',  url: 'https://fr.hotels.com',             icon: '🏨' },
    { name: 'Expedia',     url: 'https://www.expedia.fr',            icon: '🏨' },
  ],
  cars: [
    { name: 'Booking.com', url: 'https://www.booking.com',           icon: '🚗' },
    { name: 'Rentalcars',  url: 'https://www.rentalcars.com/fr',     icon: '🚗' },
    { name: 'BSP auto',    url: 'https://www.bsp-auto.com/fr',     icon: '🚗' },
    { name: 'Europcar',    url: 'https://www.europcar.com',          icon: '🚗' },
    { name: 'Hertz',       url: 'https://www.hertz.fr',              icon: '🚗' },
    { name: 'Avis',        url: 'https://www.avis.fr',               icon: '🚗' },
    { name: 'Sixt',        url: 'https://www.sixt.fr',               icon: '🚗' },
    { name: 'Enterprise',  url: 'https://www.enterprise.fr',         icon: '🚗' },
  ],
  trains: [
    { name: 'SNCF',        url: 'https://www.sncf-connect.com',      icon: '🚄' },
    { name: 'Trainline',   url: 'https://www.thetrainline.com/fr',   icon: '🚄' },
    { name: 'Renfe',       url: 'https://www.renfe.com',             icon: '🚄' },
  ],
}

// ── Catégories de dépenses budget ───────────────────────────
export const BUDGET_CATEGORIES = [
  { value: 'flight',       label: 'Vol',           icon: '✈️' },
  { value: 'accommodation',label: 'Hébergement',   icon: '🏨' },
  { value: 'transport',    label: 'Transport',     icon: '🚗' },
  { value: 'food',         label: 'Restauration',  icon: '🍽️' },
  { value: 'activities',   label: 'Activités',     icon: '🎯' },
  { value: 'shopping',     label: 'Shopping',      icon: '🛍️' },
  { value: 'insurance',    label: 'Assurance',     icon: '🛡️' },
  { value: 'misc',         label: 'Divers',        icon: '📦' },
]

// ── Templates de checklists ──────────────────────────────────
export const CHECKLIST_TEMPLATES = {
  default: {
    name: 'Voyage standard',
    items: [
      { label: 'Passeport / CNI valide',         category: 'documents' },
      { label: 'Visa (si requis)',                category: 'documents' },
      { label: 'Billet(s) d\'avion imprimé(s)',  category: 'documents' },
      { label: 'Réservation hébergement',        category: 'documents' },
      { label: 'Assurance voyage',               category: 'documents' },
      { label: 'Carte de crédit internationale', category: 'finance' },
      { label: 'Devises locales',                category: 'finance' },
      { label: 'Chargeur universel / adaptateur',category: 'electronics' },
      { label: 'Téléphone + chargeur',           category: 'electronics' },
      { label: 'Écouteurs',                      category: 'electronics' },
      { label: 'Vêtements (selon météo)',        category: 'luggage' },
      { label: 'Trousse de médicaments',         category: 'health' },
      { label: 'Crème solaire',                  category: 'health' },
    ],
  },
  beach: {
    name: 'Vacances plage',
    items: [
      { label: 'Passeport / CNI',                category: 'documents' },
      { label: 'Maillot de bain',                category: 'luggage' },
      { label: 'Crème solaire SPF50+',           category: 'health' },
      { label: 'Lunettes de soleil',             category: 'luggage' },
      { label: 'Chapeau / casquette',            category: 'luggage' },
      { label: 'Tong / sandales',                category: 'luggage' },
      { label: 'Serviette de plage',             category: 'luggage' },
    ],
  },
  business: {
    name: 'Voyage pro',
    items: [
      { label: 'Passeport / CNI',                category: 'documents' },
      { label: 'Ordre de mission',               category: 'documents' },
      { label: 'Laptop + chargeur',              category: 'electronics' },
      { label: 'Adaptateur secteur',             category: 'electronics' },
      { label: 'Tenue professionnelle',          category: 'luggage' },
      { label: 'Cartes de visite',               category: 'work' },
      { label: 'Note de frais vierge',           category: 'finance' },
    ],
  },
}

// ── Routes de l'app ─────────────────────────────────────────
export const ROUTES = {
  HOME:      '/',
  TRIPS:     '/voyages',
  TRIP:      '/voyages/:id',
  ITINERARY: '/voyages/:id/itineraire',
  BOOKINGS:  '/voyages/:id/reservations',
  BUDGET:    '/voyages/:id/budget',
  CHECKLIST: '/voyages/:id/checklist',
  LINKS:     '/liens',
  ARCHIVE:   '/archives',
  SETTINGS:  '/parametres',
}
