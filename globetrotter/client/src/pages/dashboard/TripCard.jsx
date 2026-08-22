import { Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowRight, Wallet, Share2 } from 'lucide-react'
import { dateRange } from '../../utils/dateUtils.js'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'

export default function TripCard({ trip }) {
  if (!trip) return null

  const tripId = trip.id || trip._id
  const {
    name,
    coverPhoto,
    startDate,
    endDate,
    stops = [],
    budget = 0,
    totalSpent = 0,
    currency = 'INR',
    status = 'planning',
    isPublic = false,
    publicSlug,
  } = trip

  const stopCount = stops.length || 1
  const pct = budgetPercentage(totalSpent, budget)

  const statusConfig = {
    planning: { label: 'Planning', badge: 'bg-ocean-100 text-ocean-800 border-ocean-200' },
    upcoming: { label: 'Upcoming', badge: 'bg-sage-100 text-sage-800 border-sage-200' },
    ongoing: { label: 'Ongoing', badge: 'bg-accent-100 text-accent-800 border-accent-200' },
    completed: { label: 'Completed', badge: 'bg-surface-100 text-surface-700 border-surface-200' },
  }

  const currentStatus = statusConfig[status] || statusConfig.planning

  return (
    <div className="card-hover group flex flex-col overflow-hidden bg-white border border-surface-200/80 rounded-2xl">
      {/* Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-100">
        <img
          src={coverPhoto || DEFAULT_COVER}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = DEFAULT_COVER
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm backdrop-blur-md',
              currentStatus.badge
            )}
          >
            {currentStatus.label}
          </span>

          {isPublic && publicSlug && (
            <Link
              to={`/trip/public/${publicSlug}`}
              title="View Public Share Link"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-display font-bold text-white leading-snug drop-shadow-sm truncate">
            {name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-4">
        <div className="space-y-3">
          {/* Dates & Stops */}
          <div className="grid grid-cols-2 gap-2 text-xs text-surface-600">
            <div className="flex items-center gap-1.5 truncate">
              <Calendar className="w-3.5 h-3.5 text-ocean-500 flex-shrink-0" />
              <span className="truncate">{dateRange(startDate, endDate)}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate justify-end">
              <MapPin className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
              <span>{stopCount} {stopCount === 1 ? 'Stop' : 'Stops'}</span>
            </div>
          </div>

          {/* Budget bar */}
          {budget > 0 ? (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-surface-500 flex items-center gap-1">
                  <Wallet className="w-3 h-3 text-surface-400" />
                  Budget
                </span>
                <span className="text-surface-800 font-semibold">
                  {formatCurrency(totalSpent, currency)} / {formatCurrency(budget, currency)}
                </span>
              </div>
              <div className="h-1.5 w-full bg-surface-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    pct > 90 ? 'bg-danger-500' : pct > 70 ? 'bg-accent-500' : 'bg-sage-500'
                  )}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-xs text-surface-400 py-1 italic">
              No budget set
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-surface-100 flex items-center justify-between gap-2">
          <Link
            to={`/trips/${tripId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface-100 hover:bg-ocean-50 text-surface-800 hover:text-ocean-700 font-medium text-xs sm:text-sm transition-all duration-150 group/btn"
          >
            <span>View Trip</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
