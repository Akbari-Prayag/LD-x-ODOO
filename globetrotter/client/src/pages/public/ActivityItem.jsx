import { Clock, DollarSign, Tag, MapPin } from 'lucide-react'
import { formatCurrency } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

export default function ActivityItem({ tripActivity, currency = 'INR' }) {
  if (!tripActivity) return null

  const activity = tripActivity.activity || {}
  const name = tripActivity.customName || activity.name || 'Activity'
  const description = tripActivity.customDescription || activity.description || ''
  const cost = tripActivity.customCost || activity.estimatedCost || 0
  const category = activity.category || 'sightseeing'
  const time = tripActivity.startTime || '09:00'
  const duration = activity.duration ? `${activity.duration.value} ${activity.duration.unit}` : null

  const categoryBadgeMap = {
    sightseeing: 'bg-ocean-100 text-ocean-800 border-ocean-200',
    culture: 'bg-sage-100 text-sage-800 border-sage-200',
    food: 'bg-accent-100 text-accent-800 border-accent-200',
    adventure: 'bg-warning-100 text-warning-800 border-warning-200',
    nature: 'bg-success-100 text-success-800 border-success-200',
    shopping: 'bg-purple-100 text-purple-800 border-purple-200',
  }

  const badgeClass = categoryBadgeMap[category.toLowerCase()] || 'bg-surface-100 text-surface-700 border-surface-200'

  return (
    <div className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl bg-surface-50/70 hover:bg-white border border-surface-200/80 transition-all duration-150 shadow-sm">
      {/* Time column */}
      <div className="w-14 sm:w-16 flex flex-col items-center justify-center p-2 rounded-lg bg-white border border-surface-200 text-center flex-shrink-0">
        <Clock className="w-3.5 h-3.5 text-ocean-600 mb-0.5" />
        <span className="text-xs font-bold text-surface-800">{time}</span>
      </div>

      {/* Activity Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm sm:text-base font-display font-semibold text-surface-900 truncate">
            {name}
          </h4>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border capitalize',
                badgeClass
              )}
            >
              {category}
            </span>

            {cost > 0 && (
              <span className="text-xs font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded-md border border-sage-200">
                {formatCurrency(cost, currency)}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {duration && (
          <p className="text-[11px] text-surface-400 flex items-center gap-1 pt-0.5">
            <span>Estimated duration: {duration}</span>
          </p>
        )}
      </div>
    </div>
  )
}
