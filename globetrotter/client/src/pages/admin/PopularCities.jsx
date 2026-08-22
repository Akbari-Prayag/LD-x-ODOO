import { Link } from 'react-router-dom'
import { MapPin, Trophy, Flame, ArrowRight } from 'lucide-react'

const DEFAULT_CITY = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=200'

export default function PopularCities({ popularCities = [], loading = false }) {
  const getRankBadge = (idx) => {
    if (idx === 0) return 'bg-amber-400 text-amber-950 font-extrabold shadow-sm'
    if (idx === 1) return 'bg-slate-300 text-slate-900 font-extrabold shadow-sm'
    if (idx === 2) return 'bg-amber-600/80 text-white font-extrabold shadow-sm'
    return 'bg-surface-100 text-surface-600 font-semibold'
  }

  return (
    <div className="card border border-surface-200/90 rounded-2xl bg-white overflow-hidden shadow-sm space-y-0">
      <div className="p-5 border-b border-surface-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-surface-900">
              Popular Cities Leaderboard
            </h3>
            <p className="text-xs text-surface-500">
              Top trending destinations across all traveler itineraries
            </p>
          </div>
        </div>

        <Link
          to="/cities"
          className="text-xs font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1"
        >
          <span>Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-12 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : popularCities.length === 0 ? (
        <div className="p-8 text-center text-xs text-surface-500">
          No destination metrics found.
        </div>
      ) : (
        <div className="divide-y divide-surface-100">
          {popularCities.map((city, idx) => (
            <div
              key={city.id || city._id || idx}
              className="p-4 flex items-center justify-between gap-3 hover:bg-surface-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Rank Badge */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${getRankBadge(
                    idx
                  )}`}
                >
                  {idx + 1}
                </div>

                {/* City Photo */}
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                  <img
                    src={city.image || DEFAULT_CITY}
                    alt={city.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = DEFAULT_CITY
                    }}
                  />
                </div>

                {/* City and Country */}
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm text-surface-900 truncate">
                    {city.name}
                  </h4>
                  <p className="text-xs text-surface-500 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-sage-600" />
                    <span>{city.country}</span>
                  </p>
                </div>
              </div>

              {/* Popularity metric */}
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-sage-800 bg-sage-50 px-2.5 py-1 rounded-full border border-sage-200">
                  {city.popularity || 80}% score
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
