import { User, Lock, Settings, Heart, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export const PROFILE_TABS = [
  { id: 'info', label: 'Personal Info', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'preferences', label: 'Preferences', icon: Settings },
  { id: 'saved', label: 'Saved Places', icon: Heart },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle, danger: true },
]

export default function ProfileSidebar({ activeTab, onSelectTab }) {
  return (
    <div className="card p-2 border border-surface-200/90 rounded-2xl bg-white flex flex-row md:flex-col overflow-x-auto scrollbar-hide gap-1 flex-shrink-0 md:w-64">
      {PROFILE_TABS.map(({ id, label, icon: Icon, danger }) => {
        const isActive = activeTab === id
        return (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={cn(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap text-left w-full',
              isActive
                ? danger
                  ? 'bg-danger-50 text-danger-700 font-semibold border border-danger-200'
                  : 'bg-ocean-50 text-ocean-700 font-semibold border border-ocean-200/80 shadow-sm'
                : danger
                ? 'text-danger-600 hover:bg-danger-50/50'
                : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
            )}
          >
            <Icon
              className={cn(
                'w-4 h-4 flex-shrink-0',
                isActive
                  ? danger
                    ? 'text-danger-600'
                    : 'text-ocean-600'
                  : danger
                  ? 'text-danger-400'
                  : 'text-surface-400'
              )}
            />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
