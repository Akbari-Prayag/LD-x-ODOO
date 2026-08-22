import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'
import SkeletonBlock from '../../components/ui/SkeletonBlock.jsx'
import { cn } from '../../utils/cn.js'

export default function StatCard({
  title,
  value = 0,
  prefix = '',
  suffix = '',
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  colorScheme = 'ocean',
  loading = false,
  sparklineData = [12, 18, 14, 25, 22, 35],
}) {
  const [isHovered, setIsHovered] = useState(false)

  const colorStyles = {
    ocean: {
      bg: 'from-ocean-50/60 to-white dark:from-ocean-950/20 dark:to-surface-900',
      border: 'border-ocean-200/60 dark:border-ocean-800/40',
      iconBg: 'bg-ocean-100 dark:bg-ocean-900/50 text-ocean-600 dark:text-ocean-400',
      stroke: '#3b72de',
    },
    sage: {
      bg: 'from-sage-50/60 to-white dark:from-sage-950/20 dark:to-surface-900',
      border: 'border-sage-200/60 dark:border-sage-800/40',
      iconBg: 'bg-sage-100 dark:bg-sage-900/50 text-sage-600 dark:text-sage-400',
      stroke: '#5b8a83',
    },
    sunset: {
      bg: 'from-sunset-50/60 to-white dark:from-sunset-950/20 dark:to-surface-900',
      border: 'border-sunset-200/60 dark:border-sunset-800/40',
      iconBg: 'bg-sunset-100 dark:bg-sunset-900/50 text-sunset-600 dark:text-sunset-400',
      stroke: '#ee8c5e',
    },
    accent: {
      bg: 'from-accent-50/60 to-white dark:from-accent-950/20 dark:to-surface-900',
      border: 'border-accent-200/60 dark:border-accent-800/40',
      iconBg: 'bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400',
      stroke: '#f97316',
    },
  }

  const scheme = colorStyles[colorScheme] || colorStyles.ocean

  if (loading) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/80 dark:border-surface-800 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <SkeletonBlock className="w-20 h-4" />
          <SkeletonBlock variant="circle" className="w-10 h-10" />
        </div>
        <SkeletonBlock className="w-28 h-8 mb-2" />
        <SkeletonBlock className="w-16 h-3" />
      </div>
    )
  }

  // Calculate SVG points for sparkline
  const max = Math.max(...sparklineData, 1)
  const points = sparklineData
    .map((val, idx) => {
      const x = (idx / (sparklineData.length - 1)) * 100
      const y = 30 - (val / max) * 25
      return `${x},${y}`
    })
    .join(' ')

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative overflow-hidden p-5 rounded-2xl bg-gradient-to-b border shadow-soft transition-all duration-200',
        scheme.bg,
        scheme.border
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {title}
        </span>
        {Icon && (
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm', scheme.iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Main Metric with Animated Count-up */}
      <div className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white tracking-tight">
        <AnimatedNumber
          value={value}
          prefix={prefix}
          suffix={suffix}
          format={(n) => n.toLocaleString()}
        />
      </div>

      {/* Footer Sparkline or Trend text */}
      <div className="mt-3 flex items-center justify-between h-7">
        {trend !== undefined ? (
          <div className="flex items-center gap-1.5 text-xs">
            <span className={cn('font-semibold', trend >= 0 ? 'text-success-600' : 'text-danger-600')}>
              {trend >= 0 ? `+${trend}%` : `${trend}%`}
            </span>
            <span className="text-surface-400">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-xs text-surface-400">Active metrics</span>
        )}

        {/* Hover-reveal mini sparkline */}
        <div className="w-20 h-6">
          <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={scheme.stroke}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
              className={cn(
                'transition-all duration-300',
                isHovered ? 'opacity-100 stroke-[3]' : 'opacity-40'
              )}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
