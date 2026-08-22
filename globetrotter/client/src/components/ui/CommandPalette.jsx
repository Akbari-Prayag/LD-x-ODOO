import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Command } from 'cmdk'
import {
  Search,
  MapPin,
  Calendar,
  Plus,
  User,
  ShieldCheck,
  Compass,
  ArrowRight,
  X,
} from 'lucide-react'
import { selectAllTrips } from '../../store/slices/tripsSlice.js'
import { selectCurrentUser } from '../../store/slices/authSlice.js'

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate()
  const trips = useSelector(selectAllTrips) || []
  const user = useSelector(selectCurrentUser)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (isOpen) {
          onClose?.()
        } else {
          // Open
          window.dispatchEvent(new CustomEvent('open-command-palette'))
        }
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelect = (callback) => {
    onClose?.()
    callback()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-xl bg-white dark:bg-surface-900 rounded-2xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Palette" className="w-full">
          <div className="flex items-center gap-3 px-4 border-b border-surface-100 dark:border-surface-800">
            <Search className="w-5 h-5 text-surface-400 flex-shrink-0" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search your trips..."
              className="w-full py-4 text-sm bg-transparent outline-none text-surface-900 dark:text-white placeholder:text-surface-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-xs text-surface-400">
              No results found for "{search}".
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="text-[11px] font-semibold text-surface-400 uppercase px-2 py-1">
              <Command.Item
                onSelect={() => handleSelect(() => navigate('/trips/create'))}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-ocean-50 dark:hover:bg-ocean-950/40 hover:text-ocean-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-ocean-100 dark:bg-ocean-900/50 text-ocean-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span>Plan a New Trip</span>
                </div>
                <span className="text-xs text-surface-400 font-mono">⌘N</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSelect(() => navigate('/cities'))}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-sage-50 dark:hover:bg-sage-950/40 hover:text-sage-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sage-100 dark:bg-sage-900/50 text-sage-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <span>Explore Destination Catalog</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-surface-400" />
              </Command.Item>
            </Command.Group>

            {/* User Trips */}
            {trips.length > 0 && (
              <Command.Group heading="Your Trips" className="text-[11px] font-semibold text-surface-400 uppercase px-2 py-1 mt-2">
                {trips.map((trip) => (
                  <Command.Item
                    key={trip.id || trip._id}
                    value={`${trip.name} ${trip.status}`}
                    onSelect={() => handleSelect(() => navigate(`/trips/${trip.id || trip._id}`))}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-ocean-600" />
                      </div>
                      <span className="truncate">{trip.name}</span>
                    </div>
                    <span className="text-xs text-surface-400 capitalize px-2 py-0.5 bg-surface-100 dark:bg-surface-800 rounded-md">
                      {trip.status}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation & Admin */}
            <Command.Group heading="Settings & Account" className="text-[11px] font-semibold text-surface-400 uppercase px-2 py-1 mt-2">
              <Command.Item
                onSelect={() => handleSelect(() => navigate('/profile'))}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-surface-500" />
                  <span>Profile & Preferences</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-surface-400" />
              </Command.Item>

              {user?.role === 'admin' && (
                <Command.Item
                  onSelect={() => handleSelect(() => navigate('/admin'))}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-surface-800 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-accent-500" />
                    <span>Admin Control Center</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-surface-400" />
                </Command.Item>
              )}
            </Command.Group>
          </Command.List>

          <div className="p-2 border-t border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50 flex items-center justify-between text-[11px] text-surface-400 px-4">
            <span>Navigation: ↑ ↓ to select</span>
            <span>ESC to close</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
