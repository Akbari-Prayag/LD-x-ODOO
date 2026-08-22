import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar     from '../components/layout/Sidebar.jsx'
import Navbar      from '../components/layout/Navbar.jsx'
import BottomNav   from '../components/layout/BottomNav.jsx'
import MobileOverlay from '../components/layout/MobileOverlay.jsx'
import CommandPalette from '../components/ui/CommandPalette.jsx'
import {
  selectSidebarCollapsed,
  selectMobileMenu,
} from '../store/slices/uiSlice.js'

export default function AppLayout() {
  const sidebarCollapsed = useSelector(selectSidebarCollapsed)
  const mobileMenuOpen   = useSelector(selectMobileMenu)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  useEffect(() => {
    const handleOpenPalette = () => setCommandPaletteOpen(true)
    window.addEventListener('open-command-palette', handleOpenPalette)
    return () => window.removeEventListener('open-command-palette', handleOpenPalette)
  }, [])

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && <MobileOverlay />}

      {/* Main content */}
      <div
        className={[
          'min-h-screen transition-all duration-300',
          'pt-20',                                    // navbar height
          sidebarCollapsed
            ? 'md:pl-[72px]'
            : 'md:pl-[260px]',
          // Mobile: no left padding, bottom padding for bottom nav
          'max-md:pl-0 max-md:pb-20',
        ].join(' ')}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page content */}
        <main className="px-4 py-6 md:px-6 md:py-8 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
