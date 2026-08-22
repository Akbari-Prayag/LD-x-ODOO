import { motion } from 'framer-motion'
import { User, Lock, Settings, Bookmark, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export const PROFILE_TABS = [
  { id: 'info', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security & 2FA', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'saved', label: 'Saved Places', icon: Bookmark },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, isDanger: true },
]

export default function ProfileSidebar({ activeTab, onTabChange }) {
  return (
    <nav className="flex lg:flex-col gap-1.5 overflow-x-auto p-1.5 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft">
      {PROFILE_TABS.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap text-left z-10',
              isActive
                ? tab.isDanger
                  ? 'text-danger-600 dark:text-danger-400 font-bold'
                  : 'text-ocean-700 dark:text-ocean-300 font-bold'
                : tab.isDanger
                ? 'text-danger-500/80 hover:bg-danger-50 dark:hover:bg-danger-950/30'
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800'
            )}
          >
            {/* Sliding Pill Background Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-profile-tab"
                className={cn(
                  'absolute inset-0 rounded-2xl -z-10 shadow-sm',
                  tab.isDanger
                    ? 'bg-danger-50 dark:bg-danger-950/50 border border-danger-200 dark:border-danger-800'
                    : 'bg-ocean-50 dark:bg-ocean-950/50 border border-ocean-200 dark:border-ocean-800'
                )}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
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
