import { motion } from 'framer-motion'
import { User, Lock, Settings, Bookmark, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export const PROFILE_TABS = [
  { id: 'info', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security & Password', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'saved', label: 'Saved Destinations', icon: Bookmark },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
]

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto p-2 rounded-2xl bg-[#16255b]/30 border border-white/10 backdrop-blur-md">
      {PROFILE_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-150 whitespace-nowrap text-left z-10 focus:outline-none',
              isActive
                ? tab.isDanger
                  ? 'text-red-400 font-bold'
                  : 'text-white font-bold'
                : tab.isDanger
                ? 'text-red-400/70 hover:text-red-300 hover:bg-red-950/20'
                : 'text-[#89c7e2]/75 hover:text-white hover:bg-white/[0.04]'
            )}
          >
            {/* Sliding Pill Background Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-profile-tab"
                className={cn(
                  'absolute inset-0 rounded-xl -z-10 shadow-md',
                  tab.isDanger
                    ? 'bg-red-950/40 border border-red-800/60'
                    : 'bg-[#3b72de] border border-[#5c9fdf]/40'
                )}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              />
            )}

            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
