import { motion } from 'framer-motion'
import { Users, Map, Globe, Activity, TrendingUp, Sparkles } from 'lucide-react'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'
import SkeletonBlock from '../../components/ui/SkeletonBlock.jsx'

export default function AdminStats({ stats, loading = false, prevStats = null }) {
  const {
    totalUsers = 0,
    totalTrips = 0,
    totalCities = 0,
    totalActivities = 0,
  } = stats || {}

  // Calculate deltas from previous poll
  const userDelta = prevStats ? totalUsers - prevStats.totalUsers : 0
  const tripDelta = prevStats ? totalTrips - prevStats.totalTrips : 0

  const items = [
    {
      id: 'users',
      title: 'Total Travelers',
      value: totalUsers,
      delta: userDelta,
      icon: Users,
      color: 'ocean',
      gradient: 'from-ocean-50/70 to-white dark:from-ocean-950/30 dark:to-surface-900',
      border: 'border-ocean-200/70 dark:border-ocean-800/40',
      iconBg: 'bg-ocean-100 dark:bg-ocean-900/60 text-ocean-600 dark:text-ocean-400',
    },
    {
      id: 'trips',
      title: 'Platform Itineraries',
      value: totalTrips,
      delta: tripDelta,
      icon: Map,
      color: 'sage',
      gradient: 'from-sage-50/70 to-white dark:from-sage-950/30 dark:to-surface-900',
      border: 'border-sage-200/70 dark:border-sage-800/40',
      iconBg: 'bg-sage-100 dark:bg-sage-900/60 text-sage-600 dark:text-sage-400',
    },
    {
      id: 'cities',
      title: 'Catalog Cities',
      value: totalCities,
      icon: Globe,
      color: 'sunset',
      gradient: 'from-sunset-50/70 to-white dark:from-sunset-950/30 dark:to-surface-900',
      border: 'border-sunset-200/70 dark:border-sunset-800/40',
      iconBg: 'bg-sunset-100 dark:bg-sunset-900/60 text-sunset-600 dark:text-sunset-400',
    },
    {
      id: 'activities',
      title: 'Curated Activities',
      value: totalActivities,
      icon: Activity,
      color: 'accent',
      gradient: 'from-accent-50/70 to-white dark:from-accent-950/30 dark:to-surface-900',
      border: 'border-accent-200/70 dark:border-accent-800/40',
      iconBg: 'bg-accent-100 dark:bg-accent-900/60 text-accent-600 dark:text-accent-400',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="p-5 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 space-y-3">
            <SkeletonBlock className="w-24 h-4" />
            <SkeletonBlock className="w-32 h-8" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className={`p-5 rounded-3xl bg-gradient-to-b border shadow-soft transition-all duration-200 ${item.gradient} ${item.border}`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                {item.title}
              </span>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${item.iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            {/* Main Value & Delta Badge */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white tracking-tight">
                <AnimatedNumber value={item.value} />
              </span>

              {item.delta > 0 && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-bounce-sm">
                  +{item.delta}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-surface-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-time platform ledger</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
