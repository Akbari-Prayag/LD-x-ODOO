import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Hotel, DollarSign, Activity as ActivityIcon } from 'lucide-react'
import ActivityItem from './ActivityItem.jsx'
import { dateRange } from '../../utils/dateUtils.js'
import { formatCurrency } from '../../utils/formatUtils.js'

// Subcomponent for each stop in the timeline
function TimelineStopItem({ stop, index, currency, onVisible }) {
  const stopId = stop.id || stop._id
  const { ref, inView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (inView) {
      onVisible?.(stopId)
    }
  }, [inView, stopId, onVisible])

  const cityName = stop.city?.name || stop.customCityName || `Stop ${index + 1}`
  const countryName = stop.city?.country || 'Destination'
  const activities = stop.activities || []
  const accommodation = stop.accommodationName ? {
    name: stop.accommodationName,
    cost: stop.accommodationCost,
  } : stop.accommodation

  return (
    <div ref={ref} className="relative pl-8 sm:pl-10 pb-10 last:pb-0">
      {/* Timeline Node Icon */}
      <div
        className={`absolute -left-3 top-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 border-white dark:border-surface-900 transition-all duration-300 ${
          inView ? 'bg-sunset-500 text-white ring-4 ring-sunset-300/40 scale-110' : 'bg-ocean-600 text-white'
        }`}
      >
        {index + 1}
      </div>

      {/* Stop Card Header */}
      <div className="space-y-3">
        <div className="p-4 sm:p-5 rounded-3xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/80 dark:border-surface-700 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ocean-600 dark:text-ocean-400">
                Stop {index + 1} • {countryName}
              </span>
              <h4 className="text-lg sm:text-xl font-display font-bold text-surface-900 dark:text-white">
                {cityName}
              </h4>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-300 bg-white dark:bg-surface-800 px-3 py-1 rounded-full border border-surface-200/80 dark:border-surface-700">
              <Calendar className="w-3.5 h-3.5 text-sage-500" />
              <span>{dateRange(stop.arrivalDate, stop.departureDate) || 'Flexible Dates'}</span>
            </div>
          </div>

          {/* Accommodation Info */}
          {accommodation && accommodation.name && (
            <div className="flex items-center justify-between text-xs text-surface-600 dark:text-surface-300 pt-1 border-t border-surface-200/60 dark:border-surface-700">
              <div className="flex items-center gap-1.5 truncate">
                <Hotel className="w-4 h-4 text-ocean-500 flex-shrink-0" />
                <span className="truncate">Stay: <strong>{accommodation.name}</strong></span>
              </div>
              {accommodation.cost > 0 && (
                <span className="font-semibold text-surface-800 dark:text-surface-200">
                  {formatCurrency(accommodation.cost, currency)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Scheduled Activities List */}
        <div className="space-y-2.5 pt-1">
          {activities.length === 0 ? (
            <p className="text-xs text-surface-400 italic pl-2">
              No scheduled activities listed for this stop.
            </p>
          ) : (
            activities.map((act) => (
              <ActivityItem
                key={act.id || act._id}
                tripActivity={act}
                currency={currency}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function ItineraryTimeline({ stops = [], currency = 'INR', onStopInView }) {
  if (!stops || stops.length === 0) {
    return (
      <div className="p-8 text-center rounded-3xl bg-surface-50 dark:bg-surface-800/40 border border-surface-200 dark:border-surface-700">
        <p className="text-xs text-surface-500">No itinerary stops documented for this trip.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Self-drawing Vertical Line Track */}
      <div className="absolute left-1 top-4 bottom-4 w-0.5 bg-gradient-to-b from-ocean-500 via-sunset-400 to-sage-400 opacity-40" />

      <div className="space-y-2">
        {stops.map((stop, idx) => (
          <TimelineStopItem
            key={stop.id || stop._id || idx}
            stop={stop}
            index={idx}
            currency={currency}
            onVisible={onStopInView}
          />
        ))}
      </div>
    </div>
  )
}
