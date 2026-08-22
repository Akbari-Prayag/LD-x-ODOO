import { Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar     from '../components/layout/Sidebar.jsx'
import Navbar      from '../components/layout/Navbar.jsx'
import BottomNav   from '../components/layout/BottomNav.jsx'
import MobileOverlay from '../components/layout/MobileOverlay.jsx'
import {
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectMobileMenu,
} from '../store/slices/uiSlice.js'

export default function AppLayout() {
  const sidebarOpen      = useSelector(selectSidebarOpen)
  const sidebarCollapsed = useSelector(selectSidebarCollapsed)
  const mobileMenuOpen   = useSelector(selectMobileMenu)

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile overlay backdrop */}
      {mobileMenuOpen && <MobileOverlay />}

      {/* Main content */}
      <div
        className={[
          'min-h-screen transition-all duration-300',
          'pt-16',                                    // navbar height
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
