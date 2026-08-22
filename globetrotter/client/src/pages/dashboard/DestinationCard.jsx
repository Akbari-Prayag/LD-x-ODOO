import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Heart, Sparkles, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/formatUtils.js'

const DEFAULT_CITY_IMG = 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800'

export default function DestinationCard({ city, onSave, onPlanTrip }) {
  if (!city) return null

  const {
    id,
    _id,
    name,
    country,
    image,
    costIndex = 3,
    popularity = 90,
    avgDailyCost,
    tags = [],
  } = city

  const cityId = id || _id
  const costDollars = '$'.repeat(Math.min(Math.max(costIndex, 1), 5))

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="card-hover group relative flex flex-col overflow-hidden bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 rounded-3xl shadow-soft"
    >
      {/* City Hero Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img
          src={image || DEFAULT_CITY_IMG}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Popularity / Match Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-sunset-300" />
          <span>{popularity}% Match</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSave?.(city)
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-sunset-500 text-white backdrop-blur-md border border-white/30 transition-all duration-150 active:scale-90"
          title="Save to Wishlist"
        >
          <Heart className="w-3.5 h-3.5" />
        </button>

        {/* Destination Name & Country */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <h4 className="text-lg font-display font-bold truncate leading-tight drop-shadow-sm">
            {name}
          </h4>
          <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-sunset-300 flex-shrink-0" />
            <span className="truncate">{country}</span>
          </p>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ocean-700 dark:text-ocean-300 tracking-wider">
            {costDollars}
          </span>
          {avgDailyCost && (
            <span className="text-surface-500 dark:text-surface-400">
              ~{formatCurrency(avgDailyCost, 'INR')}/day
            </span>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((t, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 capitalize"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Plan Trip CTA */}
        <Link
          to={`/trips/create?destination=${encodeURIComponent(name)}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-2xl bg-surface-50 dark:bg-surface-800/80 hover:bg-ocean-50 dark:hover:bg-ocean-950/50 text-surface-800 dark:text-surface-200 hover:text-ocean-700 dark:hover:text-ocean-300 font-semibold text-xs transition-colors"
        >
          <span>Plan Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  )
}
