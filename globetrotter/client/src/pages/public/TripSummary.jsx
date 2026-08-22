import { MapPin, Calendar, Wallet, Tag } from 'lucide-react'
import { formatCurrency } from '../../utils/formatUtils.js'
import { tripDuration } from '../../utils/dateUtils.js'

export default function TripSummary({ trip }) {
  if (!trip) return null

  const {
    startDate,
    endDate,
    stops = [],
    budget = 0,
    currency = 'INR',
    tags = [],
  } = trip

  const days = tripDuration(startDate, endDate)
  const stopCount = stops.length || 1

  return (
    <div className="card p-5 sm:p-6 border border-surface-200/90 rounded-2xl bg-white space-y-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-500">
        Trip Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Cities */}
        <div className="p-3.5 rounded-xl bg-ocean-50/60 border border-ocean-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ocean-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Destinations</p>
            <p className="text-base sm:text-lg font-display font-bold text-surface-900">
              {stopCount} {stopCount === 1 ? 'City' : 'Cities'}
            </p>
          </div>
        </div>

        {/* Days */}
        <div className="p-3.5 rounded-xl bg-sage-50/60 border border-sage-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sage-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Duration</p>
            <p className="text-base sm:text-lg font-display font-bold text-surface-900">
              {days} {days === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>

        {/* Budget */}
        <div className="p-3.5 rounded-xl bg-accent-50/60 border border-accent-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-surface-500 font-medium">Budget</p>
            <p className="text-base sm:text-lg font-display font-bold text-surface-900">
              {budget > 0 ? formatCurrency(budget, currency) : 'Flexible'}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="p-3.5 rounded-xl bg-surface-50 border border-surface-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Tag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-surface-500 font-medium">Travel Style</p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {tags.length > 0 ? (
                tags.slice(0, 2).map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-surface-700 border border-surface-200 capitalize truncate"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-surface-600 font-semibold">Leisure</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
