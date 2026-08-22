import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Bell, Plus, Search } from 'lucide-react'
import { toggleMobileMenu } from '../../store/slices/uiSlice.js'
import { selectCurrentUser } from '../../store/slices/authSlice.js'

// Map path prefixes to page titles
const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/trips':      'My Trips',
  '/cities':     'Discover Cities',
  '/activities': 'Explore Activities',
  '/profile':    'Profile & Settings',
  '/admin':      'Admin Panel',
}

function getPageTitle(pathname) {
  // Match longest prefix
  const key = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find(k => pathname.startsWith(k))
  return PAGE_TITLES[key] ?? 'GlobeTrotter'
}

export default function Navbar() {
  const dispatch  = useDispatch()
  const location  = useLocation()
  const user      = useSelector(selectCurrentUser)
  const title     = getPageTitle(location.pathname)

  return (
    <header className="fixed top-0 right-0 left-0 md:left-auto bg-white/95 backdrop-blur-sm border-b border-surface-200 h-16 flex items-center px-4 md:px-6 z-40 gap-3">
      {/* Hamburger (mobile) */}
      <button
        onClick={() => dispatch(toggleMobileMenu())}
        className="md:hidden p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-display font-semibold text-surface-900 flex-1 truncate">
        {title}
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Quick create button */}
        <Link
          to="/trips/create"
          className="btn btn-primary btn-sm hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </Link>

        {/* Notifications (placeholder) */}
        <button className="relative p-2 rounded-xl text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
        </button>

        {/* User avatar */}
        <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <span className="hidden md:block text-sm font-medium text-surface-700 truncate max-w-[120px]">
            {user?.name ?? 'User'}
          </span>
        </Link>
      </div>
    </header>
  )
}
