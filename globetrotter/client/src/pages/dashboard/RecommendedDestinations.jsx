import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, RefreshCw, Compass } from 'lucide-react'
import DestinationCard from './DestinationCard.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

export default function RecommendedDestinations({
  cities = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const displayCities = cities.slice(0, 4)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 flex items-center gap-2">
            <span>Recommended Destinations</span>
            <Sparkles className="w-4 h-4 text-accent-500" />
          </h2>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Hand-picked places trending with globetrotters worldwide
          </p>
        </div>

        <Link
          to="/cities"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-sage-600 hover:text-sage-700 transition-colors"
        >
          <span>All Cities</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="card overflow-hidden border animate-pulse space-y-3 p-0 rounded-2xl"
            >
              <div className="aspect-[4/3] bg-surface-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-2/3" />
                <div className="h-3 bg-surface-100 rounded w-1/3" />
                <div className="h-8 bg-surface-200 rounded-xl mt-3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="card p-6 text-center bg-white border border-danger-100">
          <ErrorState
            message={error || 'Unable to load recommended destinations.'}
            onRetry={onRetry}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && displayCities.length === 0 && (
        <div className="card p-8 text-center bg-surface-50 border border-surface-200 rounded-2xl">
          <p className="text-sm text-surface-500">No recommended cities found.</p>
        </div>
      )}

      {/* Destinations Grid */}
      {!loading && !error && displayCities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayCities.map((city) => (
            <DestinationCard key={city.id || city._id || city.name} city={city} />
          ))}
        </div>
      )}
    </section>
  )
}
