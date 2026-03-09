// Header — Logo TyTravel + toggle thème + export données
import React from 'react'
import { useTheme } from '../../context/ThemeContext'
import { SunIcon, MoonIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { exportAllData } from '../../services/storageService'
const Header = () => {
  const { isDark, toggleTheme } = useTheme()
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/90 backdrop-blur border-b border-[var(--color-border)]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="font-display font-bold text-[var(--color-text)]">TyTravel-nomad</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={exportAllData} className="p-2 rounded-xl hover:bg-[var(--color-bg-input)] text-[var(--color-text-muted)] transition-colors" title="Exporter">
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-[var(--color-bg-input)] text-[var(--color-text-muted)] transition-colors">
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
export default Header
