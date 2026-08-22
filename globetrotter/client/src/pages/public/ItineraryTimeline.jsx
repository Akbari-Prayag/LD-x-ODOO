import { MapPin, Calendar, Home, Navigation, CheckCircle2 } from 'lucide-react'
import ActivityItem from './ActivityItem.jsx'
import { dateRange, tripDuration } from '../../utils/dateUtils.js'
import { formatCurrency } from '../../utils/formatUtils.js'

export default function ItineraryTimeline({ stops = [], currency = 'INR' }) {
  if (!stops || stops.length === 0) {
    return (
      <div className="card p-8 sm:p-12 text-center bg-white border border-dashed border-surface-200 rounded-2xl">
        <Navigation className="w-10 h-10 text-surface-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-surface-700">No stops in itinerary yet</h3>
        <p className="text-xs text-surface-500 mt-1">This trip is still being drafted.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 flex items-center gap-2">
          <span>Day-by-Day Itinerary</span>
        </h2>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ocean-100 text-ocean-700">
          {stops.length} {stops.length === 1 ? 'Stop' : 'Stops'} Total
        </span>
      </div>

      <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-ocean-400 before:via-sage-400 before:to-surface-200 before:pointer-events-none">
        {stops.map((stop, index) => {
          const city = stop.city || {}
          const cityName = city.name || stop.customCityName || `Stop ${index + 1}`
          const country = city.country || ''
          const activities = stop.activities || []
          const duration = tripDuration(stop.arrivalDate, stop.departureDate)

          return (
            <div key={stop._id || index} className="relative pl-10 sm:pl-14 space-y-4">
              {/* Timeline Node Icon */}
              <div className="absolute left-1.5 sm:left-3.5 top-0 w-6 h-6 rounded-full bg-ocean-600 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px] font-bold z-10">
                {index + 1}
              </div>

              {/* Stop Card */}
              <div className="card overflow-hidden border border-surface-200/90 rounded-2xl bg-white shadow-sm hover:shadow-card-md transition-shadow">
                {/* Stop Header Banner */}
                <div className="p-5 sm:p-6 bg-gradient-to-r from-surface-50 via-ocean-50/30 to-sage-50/30 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-ocean-700">
                        Stop {index + 1} • {duration} {duration === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-surface-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-sage-600" />
                      <span>{cityName}</span>
                      {country && <span className="text-sm font-normal text-surface-500">({country})</span>}
                    </h3>

                    {stop.arrivalDate && stop.departureDate && (
                      <p className="text-xs text-surface-500 flex items-center gap-1.5 pt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-surface-400" />
                        <span>{dateRange(stop.arrivalDate, stop.departureDate)}</span>
                      </p>
                    )}
                  </div>

                  {/* Accommodation badge if available */}
                  {stop.accommodation?.name && (
                    <div className="p-3 rounded-xl bg-white border border-surface-200 text-xs space-y-0.5 self-start sm:self-auto">
                      <p className="font-semibold text-surface-800 flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-ocean-600" />
                        <span>{stop.accommodation.name}</span>
                      </p>
                      {stop.accommodation.cost > 0 && (
                        <p className="text-[11px] text-surface-500">
                          {formatCurrency(stop.accommodation.cost, currency)}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Stop Content: Notes & Activities */}
                <div className="p-5 sm:p-6 space-y-4">
                  {stop.notes && (
                    <div className="p-3.5 rounded-xl bg-surface-50 text-xs text-surface-600 border border-surface-100 italic">
                      "{stop.notes}"
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400">
                      Scheduled Activities ({activities.length})
                    </h4>

                    {activities.length === 0 ? (
                      <div className="py-4 text-center text-xs text-surface-400 bg-surface-50 rounded-xl">
                        Free exploration time — no scheduled activities.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2.5">
                        {activities.map((act, actIdx) => (
                          <ActivityItem
                            key={act._id || actIdx}
                            tripActivity={act}
                            currency={currency}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
