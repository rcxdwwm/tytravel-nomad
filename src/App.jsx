// ============================================================
// App.jsx — Routing principal de l'application
// ============================================================
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { ThemeProvider }   from './context/ThemeContext'
import { AppProvider }     from './context/AppContext'
import AppLayout           from './components/layout/AppLayout'

import Dashboard   from './modules/dashboard/Dashboard'
import TripsList   from './modules/trips/TripsList'
import TripDetail  from './modules/trips/TripDetail'
import Itinerary   from './modules/itinerary/Itinerary'
import Bookings    from './modules/bookings/Bookings'
import Budget      from './modules/budget/Budget'
import Checklist   from './modules/checklist/Checklist'
import Archive     from './modules/archive/Archive'
import Links       from './modules/links/Links'
import Settings    from './modules/settings/Settings'

import { ROUTES } from './utils/constants'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter basename="/tytravel-nomad">
          <Routes>
            <Route element={<AppLayout />}>

              {/* ── Dashboard ── */}
              <Route index                      element={<Dashboard />} />

              {/* ── Voyages ── */}
              <Route path="voyages"             element={<TripsList />} />
              <Route path="voyages/:id"         element={<TripDetail />} />
              <Route path="voyages/:id/itineraire"   element={<Itinerary />} />
              <Route path="voyages/:id/reservations" element={<Bookings />} />
              <Route path="voyages/:id/budget"       element={<Budget />} />
              <Route path="voyages/:id/checklist"    element={<Checklist />} />

              {/* ── Autres modules ── */}
              <Route path="liens"               element={<Links />} />
              <Route path="archives"            element={<Archive />} />
              <Route path="parametres"          element={<Settings />} />

              {/* ── Fallback ── */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
