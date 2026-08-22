import { cn } from '../../utils/cn.js'

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'ocean', // 'ocean' | 'sage' | 'accent' | 'primary'
  loading = false,
  className,
}) {
  const schemeMap = {
    ocean: {
      bg: 'bg-ocean-50/70 border-ocean-200/80 hover:border-ocean-300',
      iconBg: 'bg-ocean-500 text-white shadow-sm shadow-ocean-500/20',
      accentText: 'text-ocean-700',
      glow: 'hover:shadow-ocean-100',
    },
    sage: {
      bg: 'bg-sage-50/70 border-sage-200/80 hover:border-sage-300',
      iconBg: 'bg-sage-500 text-white shadow-sm shadow-sage-500/20',
      accentText: 'text-sage-700',
      glow: 'hover:shadow-sage-100',
    },
    accent: {
      bg: 'bg-accent-50/70 border-accent-200/80 hover:border-accent-300',
      iconBg: 'bg-accent-500 text-white shadow-sm shadow-accent-500/20',
      accentText: 'text-accent-700',
      glow: 'hover:shadow-accent-100',
    },
    primary: {
      bg: 'bg-primary-50/70 border-primary-200/80 hover:border-primary-300',
      iconBg: 'bg-primary-600 text-white shadow-sm shadow-primary-600/20',
      accentText: 'text-primary-700',
      glow: 'hover:shadow-primary-100',
    },
  }

  const currentScheme = schemeMap[colorScheme] || schemeMap.ocean

  if (loading) {
    return (
      <div className="card p-5 border animate-pulse flex items-start justify-between">
        <div className="space-y-2.5 flex-1">
          <div className="h-3.5 bg-surface-200 rounded w-24" />
          <div className="h-7 bg-surface-300 rounded w-20" />
          <div className="h-3 bg-surface-100 rounded w-32" />
        </div>
        <div className="w-12 h-12 rounded-2xl bg-surface-200" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'card p-5 border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md',
        currentScheme.bg,
        currentScheme.glow,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-display font-bold text-surface-900 mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-surface-500 mt-1 flex items-center gap-1 font-medium">
              {trend && (
                <span className={cn('font-semibold', currentScheme.accentText)}>
                  {trend}
                </span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105',
              currentScheme.iconBg
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}
