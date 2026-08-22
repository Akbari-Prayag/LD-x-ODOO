import { Link } from 'react-router-dom'
import { MapPin, TrendingUp, ArrowRight, DollarSign } from 'lucide-react'

const DEFAULT_CITY_IMAGE = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'

export default function DestinationCard({ city }) {
  if (!city) return null

  const {
    name,
    country,
    image,
    costIndex = 2,
    popularity = 85,
    avgDailyCost,
    tags = [],
  } = city

  // Render cost indicator ($ / $$ / $$$)
  const costSymbols = '$'.repeat(Math.max(1, Math.min(5, costIndex)))

  return (
    <div className="card-hover group flex flex-col overflow-hidden bg-white border border-surface-200/80 rounded-2xl">
      {/* Cover Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-100">
        <img
          src={image || DEFAULT_CITY_IMAGE}
          alt={`${name}, ${country}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = DEFAULT_CITY_IMAGE
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-white/90 text-surface-800 shadow-sm backdrop-blur-md">
            {costSymbols}
          </span>

          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-sage-500/90 text-white shadow-sm backdrop-blur-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-sage-200" />
            <span>{popularity}% match</span>
          </span>
        </div>

        {/* City & Country on Image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base sm:text-lg font-display font-bold text-white drop-shadow-sm truncate">
            {name}
          </h3>
          <p className="text-xs text-sage-100 flex items-center gap-1 mt-0.5 truncate">
            <MapPin className="w-3 h-3 text-sage-300 flex-shrink-0" />
            <span>{country}</span>
          </p>
        </div>
      </div>

      {/* Card Info & CTA */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-3 bg-white">
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sage-50 text-sage-700 border border-sage-200/50 capitalize"
            >
              {tag}
            </span>
          ))}
          {avgDailyCost ? (
            <span className="text-[11px] font-medium text-surface-500 ml-auto self-center">
              ~₹{avgDailyCost.toLocaleString()}/day
            </span>
          ) : null}
        </div>

        <Link
          to={`/cities?search=${encodeURIComponent(name)}`}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-800 font-semibold text-xs transition-colors group/btn w-full"
        >
          <span>Explore {name}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
