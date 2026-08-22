import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Plus,
  Search,
  User as UserIcon,
  LogOut,
  Settings,
  Globe,
  Compass,
  MapPin,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { toggleMobileMenu, selectSidebarCollapsed } from '../../store/slices/uiSlice.js'
import { logout, selectCurrentUser } from '../../store/slices/authSlice.js'
import { cn } from '../../utils/cn.js'
import toast from 'react-hot-toast'

// Clean page titles matching mock
const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/trips':      'My Trips',
  '/cities':     'Discover Cities',
  '/activities': 'Explore Activities',
  '/profile':    'Profile & Settings',
  '/admin':      'Admin Dashboard',
}

function getPageTitle(pathname) {
  const key = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k))
  return PAGE_TITLES[key] || 'GlobeTrotter'
}

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(selectCurrentUser)
  const collapsed = useSelector(selectSidebarCollapsed)
  const title = getPageTitle(location.pathname)

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const notifRef = useRef(null)
  const userRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleOpenSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  // Display Name and Email from authenticated user
  const displayName = user?.name || 'Prayag Patel'
  const displayEmail = user?.email || 'prayag@email.com'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-40 h-20',
        'bg-white/95 backdrop-blur-md',
        'border-b border-surface-200/90',
        'transition-all duration-300 ease-in-out',
        'flex items-center justify-between px-4 sm:px-8',
        collapsed ? 'md:left-[72px]' : 'md:left-[260px]',
        'left-0'
      )}
    >
      {/* ── Left: Mobile Toggle & Bold Clean Title ── */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden p-2 -ml-1.5 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Small Brand Icon on Mobile */}
        <Link to="/dashboard" className="flex md:hidden items-center shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Globe className="w-4.5 h-4.5" />
          </div>
        </Link>

        {/* Clean, Bold Main Title */}
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-surface-950 tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* ── Center: Search Bar (Desktop & Tablet) ── */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={handleOpenSearch}
          className="w-full flex items-center justify-between gap-3 px-4 py-2 bg-surface-50 hover:bg-surface-100/90 text-surface-500 hover:text-surface-700 border border-surface-200 rounded-xl text-xs transition-all duration-150 shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="w-4 h-4 text-surface-400 group-hover:text-primary-600 transition-colors" />
            <span className="truncate">Search trips, cities, activities...</span>
          </div>
          <kbd className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-surface-400 bg-white border border-surface-200 rounded-md shadow-2xs">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* ── Right: Plan Trip CTA & User Profile Pill ── */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={handleOpenSearch}
          className="lg:hidden p-2 rounded-xl text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-colors"
          aria-label="Search"
        >
          <Search className="w-4.5 h-4.5" />
        </button>

        {/* Prominent "+ Plan Trip" Action Button */}
        <Link to="/trips/create">
          <button
            type="button"
            className="btn btn-primary px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm shadow-primary-500/25 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Plan Trip</span>
          </button>
        </Link>

        {/* Notifications Icon Button */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2.5 rounded-full text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer focus:outline-hidden"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="dropdown right-0 mt-2 w-80 p-0 shadow-card-xl animate-slide-down border border-surface-200 z-50">
              <div className="p-3.5 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-surface-900">Notifications</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-primary-100 text-primary-700 text-[10px] font-bold">2 New</span>
                </div>
                <span className="text-[10px] text-surface-400">GlobeTrotter</span>
              </div>

              <div className="divide-y divide-surface-100 max-h-72 overflow-y-auto">
                <Link
                  to="/trips/1"
                  onClick={() => setNotificationsOpen(false)}
                  className="p-3 flex items-start gap-3 hover:bg-surface-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-surface-900 leading-snug">
                      Upcoming: Golden Triangle Adventure
                    </h5>
                    <p className="text-[11px] text-surface-500 mt-0.5">
                      Your North India trip starts in 14 days.
                    </p>
                    <span className="text-[9px] text-surface-400 mt-1 inline-block">2 hours ago</span>
                  </div>
                </Link>

                <Link
                  to="/cities"
                  onClick={() => setNotificationsOpen(false)}
                  className="p-3 flex items-start gap-3 hover:bg-surface-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-surface-900 leading-snug">
                      Popular: Goa Coastal Retreat
                    </h5>
                    <p className="text-[11px] text-surface-500 mt-0.5">
                      Explore top beach activities in Goa.
                    </p>
                    <span className="text-[9px] text-surface-400 mt-1 inline-block">Yesterday</span>
                  </div>
                </Link>
              </div>

              <div className="p-2 border-t border-surface-100 text-center bg-surface-50/50">
                <Link
                  to="/trips"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                >
                  View All Trips &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ── Mock Profile Pill: Avatar on Left + Name & Email on Right ── */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-1.5 pr-3 sm:pr-4 py-1.5 rounded-full bg-surface-100/80 hover:bg-surface-200/80 border border-surface-200/90 transition-all cursor-pointer focus:outline-hidden"
          >
            {/* White Circular Avatar Badge */}
            <div className="w-8 h-8 rounded-full bg-white text-surface-900 border border-surface-200/80 flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
              {initials}
            </div>

            {/* Name & Email Layout (Mock Spec) */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-surface-900 leading-tight">
                {displayName}
              </span>
              <span className="text-[11px] text-surface-500 font-medium leading-tight">
                {displayEmail}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-surface-400 ml-0.5" />
          </button>

          {/* Profile Popover Menu */}
          {userMenuOpen && (
            <div className="dropdown right-0 mt-2 w-56 py-1.5 shadow-card-xl animate-slide-down border border-surface-200 z-50">
              <div className="px-4 py-3 border-b border-surface-100 bg-surface-50/50">
                <p className="text-xs font-bold text-surface-900 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] text-surface-500 truncate">{displayEmail}</p>
                <span className="mt-1.5 inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-100">
                  {user?.role === 'admin' ? 'Administrator' : 'Traveler Account'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <UserIcon className="w-3.5 h-3.5 text-surface-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/profile"
                  className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Settings className="w-3.5 h-3.5 text-surface-400" />
                  <span>Account Settings</span>
                </Link>

                <Link
                  to="/trips"
                  className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <Compass className="w-3.5 h-3.5 text-surface-400" />
                  <span>My Itineraries</span>
                </Link>
              </div>

              <div className="divider my-1 border-surface-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="dropdown-item w-full text-left flex items-center gap-2.5 text-xs text-danger-600 hover:bg-danger-50 hover:text-danger-700 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
