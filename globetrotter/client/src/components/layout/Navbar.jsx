import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Plus,
  Search,
  X,
  User as UserIcon,
  LogOut,
  Settings,
  Globe,
  Compass,
  MapPin,
  Calendar,
  ChevronDown,
  Plane,
  Building2,
  CheckCheck,
  Trash2,
  PlaneTakeoff,
  CircleCheck,
  Map,
  AlertCircle,
} from 'lucide-react'
import { toggleMobileMenu, selectSidebarCollapsed } from '../../store/slices/uiSlice.js'
import { logout, selectCurrentUser } from '../../store/slices/authSlice.js'
import { selectTrips } from '../../store/slices/tripsSlice.js'
import {
  selectNotifications,
  selectUnreadCount,
  markRead,
  markAllRead,
  dismiss,
} from '../../store/slices/notificationsSlice.js'
import { selectCities } from '../../store/slices/citiesSlice.js'
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
  const trips = useSelector(selectTrips)
  const cities = useSelector(selectCities)
  const notifications = useSelector(selectNotifications)
  const unreadCount = useSelector(selectUnreadCount)
  const title = getPageTitle(location.pathname)

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const notifRef = useRef(null)
  const userRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Escape closes the inline search dropdown
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSearchFocused(false)
        setSearchQuery('')
        searchInputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // ── Live Search Results ─────────────────────────────────────
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q || q.length < 2) return { trips: [], cities: [] }

    const matchedTrips = (Array.isArray(trips) ? trips : [])
      .filter(
        (t) =>
          t.name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          (Array.isArray(t.tags) && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      )
      .slice(0, 4)

    const matchedCities = (Array.isArray(cities) ? cities : [])
      .filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.country?.toLowerCase().includes(q) ||
          c.region?.toLowerCase().includes(q)
      )
      .slice(0, 3)

    return { trips: matchedTrips, cities: matchedCities }
  }, [searchQuery, trips, cities])

  const hasResults =
    searchResults.trips.length > 0 || searchResults.cities.length > 0

  const showDropdown = searchFocused && searchQuery.trim().length >= 2

  // Navigate on result click
  const handleResultClick = (path) => {
    setSearchFocused(false)
    setSearchQuery('')
    navigate(path)
  }

  // Handle inline search submit (Enter key)
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (!q) return
      setSearchFocused(false)
      navigate(`/trips?search=${encodeURIComponent(q)}`)
      setSearchQuery('')
      searchInputRef.current?.blur()
    },
    [searchQuery, navigate]
  )

  const handleOpenCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const displayName = user?.name || 'Traveler'
  const displayEmail = user?.email || ''
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
        <button
          type="button"
          onClick={() => dispatch(toggleMobileMenu())}
          className="md:hidden p-2 -ml-1.5 rounded-xl text-surface-700 hover:text-surface-900 hover:bg-surface-100 transition-colors focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex md:hidden items-center shrink-0">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-xs">
            <Globe className="w-4.5 h-4.5" />
          </div>
        </Link>

        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-surface-950 tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* ── Center: Live Search Bar with Dropdown ── */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6 relative" ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit} className="w-full relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-600 transition-colors pointer-events-none" />

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search trips, cities..."
            autoComplete="off"
            className="w-full pl-10 pr-24 py-2 bg-surface-50 hover:bg-surface-100/80 focus:bg-white text-surface-900 placeholder:text-surface-400 border border-surface-200 focus:border-primary-400 rounded-xl text-xs outline-none transition-all duration-150 shadow-2xs focus:shadow-sm focus:ring-2 focus:ring-primary-500/15"
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                searchInputRef.current?.focus()
              }}
              className="absolute right-14 top-1/2 -translate-y-1/2 p-0.5 text-surface-400 hover:text-surface-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* ⌘K badge → opens command palette */}
          <button
            type="button"
            onClick={handleOpenCommandPalette}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-surface-400 bg-white border border-surface-200 rounded-md shadow-2xs hover:border-primary-300 hover:text-primary-600 transition-colors cursor-pointer"
            title="Open command palette (⌘K)"
          >
            <span>⌘</span>K
          </button>
        </form>

        {/* ── Live Search Dropdown ── */}
        {showDropdown && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-surface-200 rounded-2xl shadow-card-xl z-50 overflow-hidden animate-slide-down">
            {hasResults ? (
              <div>
                {/* Trips Results */}
                {searchResults.trips.length > 0 && (
                  <div>
                    <div className="px-3.5 pt-3 pb-1.5 flex items-center gap-2">
                      <Plane className="w-3 h-3 text-primary-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
                        Your Trips
                      </span>
                    </div>
                    {searchResults.trips.map((trip) => (
                      <button
                        key={trip.id}
                        type="button"
                        onClick={() => handleResultClick(`/trips/${trip.id}`)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-primary-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                          <Plane className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-surface-900 truncate">
                            {trip.name}
                          </p>
                          <p className="text-[10px] text-surface-500 truncate">
                            {trip.startDate} → {trip.endDate}
                            {trip.status && (
                              <span className="ml-2 capitalize font-medium text-primary-600">
                                · {trip.status}
                              </span>
                            )}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cities Results */}
                {searchResults.cities.length > 0 && (
                  <div className={searchResults.trips.length > 0 ? 'border-t border-surface-100' : ''}>
                    <div className="px-3.5 pt-3 pb-1.5 flex items-center gap-2">
                      <Building2 className="w-3 h-3 text-accent-500" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
                        Cities
                      </span>
                    </div>
                    {searchResults.cities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleResultClick(`/cities`)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-accent-50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-surface-900 truncate">
                            {city.name}
                          </p>
                          <p className="text-[10px] text-surface-500 truncate">
                            {city.country}
                            {city.region && ` · ${city.region}`}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer: press Enter to search all */}
                <div className="border-t border-surface-100 px-3.5 py-2 flex items-center justify-between bg-surface-50/60">
                  <span className="text-[10px] text-surface-400">Press Enter to search all trips</span>
                  <kbd className="text-[10px] text-surface-400 bg-white border border-surface-200 rounded px-1.5 py-0.5 font-mono">↵</kbd>
                </div>
              </div>
            ) : (
              /* No results */
              <div className="px-4 py-6 text-center">
                <Search className="w-6 h-6 text-surface-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-surface-500">
                  No results for "{searchQuery}"
                </p>
                <p className="text-[10px] text-surface-400 mt-0.5">
                  Press Enter to search all trips
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Plan Trip CTA & User Profile ── */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Mobile Search Icon → opens command palette */}
        <button
          type="button"
          onClick={handleOpenCommandPalette}
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

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative p-2.5 rounded-full text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-colors cursor-pointer focus:outline-hidden"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent-500 text-white text-[9px] font-extrabold rounded-full ring-2 ring-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white border border-surface-200 rounded-2xl shadow-card-xl z-50 overflow-hidden animate-slide-down">
              {/* Header */}
              <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5 text-surface-500" />
                  <span className="font-bold text-sm text-surface-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-bold">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => dispatch(markAllRead())}
                    className="flex items-center gap-1 text-[10px] font-semibold text-primary-600 hover:text-primary-800 transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="divide-y divide-surface-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell className="w-8 h-8 text-surface-200 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-surface-400">All caught up!</p>
                    <p className="text-[10px] text-surface-300 mt-0.5">No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const IconMap = {
                      plane:    PlaneTakeoff,
                      calendar: Calendar,
                      map:      Map,
                      check:    CircleCheck,
                      plus:     Plus,
                    }
                    const colorMap = {
                      upcoming:  { bg: 'bg-primary-100', text: 'text-primary-600' },
                      reminder:  { bg: 'bg-blue-100',    text: 'text-blue-600'    },
                      ongoing:   { bg: 'bg-emerald-100', text: 'text-emerald-600' },
                      completed: { bg: 'bg-violet-100',  text: 'text-violet-600'  },
                      new:       { bg: 'bg-amber-100',   text: 'text-amber-600'   },
                    }
                    const Icon   = IconMap[n.icon] || AlertCircle
                    const colors = colorMap[n.type] || colorMap.reminder
                    const isRead = !!n.readAt

                    return (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 group transition-colors ${
                          isRead ? 'bg-white hover:bg-surface-50' : 'bg-primary-50/40 hover:bg-primary-50/70'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <Link
                          to={n.link}
                          className="flex-1 min-w-0"
                          onClick={() => {
                            dispatch(markRead(n.id))
                            setNotificationsOpen(false)
                          }}
                        >
                          <p className={`text-xs leading-snug truncate ${
                            isRead ? 'font-medium text-surface-700' : 'font-bold text-surface-900'
                          }`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-surface-500 mt-0.5 line-clamp-2">{n.body}</p>
                          <span className="text-[9px] text-surface-400 mt-1 inline-block">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </Link>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {!isRead && (
                            <button
                              type="button"
                              onClick={() => dispatch(markRead(n.id))}
                              className="opacity-0 group-hover:opacity-100 text-[9px] font-semibold text-primary-600 hover:text-primary-800 transition-all"
                              title="Mark as read"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => dispatch(dismiss(n.id))}
                            className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-danger-500 transition-all"
                            title="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {!isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1" />
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-surface-100 bg-surface-50/60 flex items-center justify-between">
                  <span className="text-[10px] text-surface-400">
                    {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  </span>
                  <Link
                    to="/trips"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] font-semibold text-primary-600 hover:text-primary-700"
                  >
                    View All Trips &rarr;
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative" ref={userRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-3 pl-1.5 pr-3 sm:pr-4 py-1.5 rounded-full bg-surface-100/80 hover:bg-surface-200/80 border border-surface-200/90 transition-all cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-full bg-white text-surface-900 border border-surface-200/80 flex items-center justify-center text-xs font-extrabold shadow-2xs shrink-0">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-surface-900 leading-tight">{displayName}</span>
              <span className="text-[11px] text-surface-500 font-medium leading-tight">{displayEmail}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-surface-400 ml-0.5" />
          </button>

          {userMenuOpen && (
            <div className="dropdown right-0 mt-2 w-56 py-1.5 shadow-card-xl animate-slide-down border border-surface-200 z-50">
              <div className="px-4 py-3 border-b border-surface-100 bg-surface-50/50">
                <p className="text-xs font-bold text-surface-900 truncate">{displayName}</p>
                <p className="text-[11px] text-surface-500 truncate">{displayEmail}</p>
              </div>

              <div className="py-1">
                <Link to="/profile" className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900" onClick={() => setUserMenuOpen(false)}>
                  <UserIcon className="w-3.5 h-3.5 text-surface-400" />
                  <span>My Profile</span>
                </Link>
                <Link to="/profile" className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900" onClick={() => setUserMenuOpen(false)}>
                  <Settings className="w-3.5 h-3.5 text-surface-400" />
                  <span>Account Settings</span>
                </Link>
                <Link to="/trips" className="dropdown-item flex items-center gap-2.5 text-xs text-surface-700 hover:text-surface-900" onClick={() => setUserMenuOpen(false)}>
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
