import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Search, Activity, User } from 'lucide-react'
import { cn } from '../../utils/cn.js'

const ITEMS = [
  { label: 'Home',       to: '/dashboard',   icon: LayoutDashboard },
  { label: 'Trips',      to: '/trips',        icon: Map },
  { label: 'Cities',     to: '/cities',       icon: Search },
  { label: 'Activities', to: '/activities',   icon: Activity },
  { label: 'Profile',    to: '/profile',      icon: User },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-50 safe-area-pb">
      <div className="flex items-center">
        {ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 py-3 text-[10px] font-medium transition-colors duration-150',
                isActive ? 'text-primary-600' : 'text-surface-400 hover:text-surface-700',
              )
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
