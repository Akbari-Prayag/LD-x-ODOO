import { Clock, DollarSign, Tag, CheckCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

export default function ActivityItem({ tripActivity, currency = 'INR' }) {
  if (!tripActivity) return null

  const {
    activity,
    customName,
    customDescription,
    customCost,
    startTime,
    endTime,
    status = 'planned',
  } = tripActivity

  const name = activity?.name || customName || 'Scheduled Activity'
  const description = activity?.description || customDescription
  const cost = customCost !== undefined ? customCost : activity?.estimatedCost
  const category = activity?.category || 'sightseeing'
  const image = activity?.image

  const categoryConfig = {
    sightseeing: { label: 'Sightseeing', badge: 'bg-ocean-100 dark:bg-ocean-950 text-ocean-700 dark:text-ocean-300' },
    food: { label: 'Food & Dining', badge: 'bg-sunset-100 dark:bg-sunset-950 text-sunset-700 dark:text-sunset-300' },
    adventure: { label: 'Adventure', badge: 'bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-300' },
    culture: { label: 'Culture & Arts', badge: 'bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-300' },
    shopping: { label: 'Shopping', badge: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' },
    nature: { label: 'Nature', badge: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
    entertainment: { label: 'Entertainment', badge: 'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300' },
  }

  const currentCat = categoryConfig[category] || {
    label: category,
    badge: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300',
  }

  return (
    <div className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 hover:border-ocean-300 dark:hover:border-ocean-700 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Activity Image Thumbnail */}
      {image && (
        <div className="relative w-full sm:w-28 sm:h-24 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Activity Body */}
      <div className="flex-1 min-w-0 space-y-1.5 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h5 className="font-display font-bold text-sm sm:text-base text-surface-900 dark:text-white truncate">
            {name}
          </h5>

          {/* Time Chip */}
          {startTime && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-xs font-semibold font-mono">
              <Clock className="w-3 h-3 text-ocean-600 dark:text-ocean-400" />
              <span>{startTime} {endTime ? `– ${endTime}` : ''}</span>
            </span>
          )}
        </div>

        {description && (
          <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Footer Meta: Category + Cost */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className={cn('px-2.5 py-0.5 text-[10px] font-semibold rounded-full capitalize', currentCat.badge)}>
            {currentCat.label}
          </span>

          {cost !== undefined && Number(cost) > 0 && (
            <span className="text-xs font-bold text-surface-800 dark:text-surface-200">
              {formatCurrency(cost, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
