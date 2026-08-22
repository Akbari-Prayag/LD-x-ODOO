import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Globe, LayoutDashboard, Map, Search, Activity,
  DollarSign, Calendar, User, ShieldCheck,
  ChevronLeft, ChevronRight, X, LogOut, Settings,
} from 'lucide-react'
import {
  toggleSidebarCollapse,
  toggleMobileMenu,
  setMobileMenu,
  selectSidebarCollapsed,
  selectMobileMenu,
} from '../../store/slices/uiSlice.js'
import { logout, selectCurrentUser } from '../../store/slices/authSlice.js'
import { cn } from '../../utils/cn.js'

const NAV_ITEMS = [
  { label: 'Dashboard',   to: '/dashboard',   icon: LayoutDashboard },
  { label: 'My Trips',    to: '/trips',        icon: Map },
  { label: 'Calendar',    to: '/calendar',     icon: Calendar },
  { label: 'Cities',      to: '/cities',       icon: Search },
  { label: 'Activities',  to: '/activities',   icon: Activity },
]

const BOTTOM_NAV = [
  { label: 'Profile',     to: '/profile',      icon: User },
  { label: 'Settings',    to: '/profile',      icon: Settings },
]

export default function Sidebar() {
  const dispatch    = useDispatch()
  const collapsed   = useSelector(selectSidebarCollapsed)
  const mobileOpen  = useSelector(selectMobileMenu)
  const user        = useSelector(selectCurrentUser)
  const location    = useLocation()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-surface-900 text-white z-50',
          'flex flex-col transition-all duration-300 overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          // Mobile: slide in/out
          'max-md:shadow-2xl',
          mobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
        )}
      >
        {/* ── Header / Logo ── */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Globe className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-display font-bold whitespace-nowrap">GlobeTrotter</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mx-auto">
              <Globe className="w-4.5 h-4.5 text-white" />
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden p-1 rounded-lg hover:bg-white/10 text-surface-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => dispatch(setMobileMenu(false))}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-600/25 text-white border border-primary-500/30'
                    : 'text-surface-400 hover:text-white hover:bg-white/8',
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Admin link (only for admins) */}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-accent-600/25 text-accent-300 border border-accent-500/30'
                    : 'text-surface-400 hover:text-white hover:bg-white/8',
                )
              }
              title={collapsed ? 'Admin' : undefined}
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Admin</span>}
            </NavLink>
          )}
        </nav>

        {/* ── User + bottom actions ── */}
        <div className="border-t border-white/10 p-3 space-y-1 flex-shrink-0">
          {/* Profile link */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive ? 'bg-white/10 text-white' : 'text-surface-400 hover:text-white hover:bg-white/8',
              )
            }
            title={collapsed ? 'Profile' : undefined}
          >
            <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-white text-sm font-medium truncate">{user?.name ?? 'User'}</p>
                <p className="text-surface-500 text-xs truncate">{user?.email ?? ''}</p>
              </div>
            )}
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
              'text-surface-400 hover:text-danger-400 hover:bg-danger-400/10 transition-all duration-150',
            )}
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={() => dispatch(toggleSidebarCollapse())}
            className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-xs text-surface-500 hover:text-white hover:bg-white/8 transition-all duration-150"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight className="w-4 h-4 mx-auto" />
              : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>
            }
          </button>
        </div>
      </aside>
    </>
  )
}
