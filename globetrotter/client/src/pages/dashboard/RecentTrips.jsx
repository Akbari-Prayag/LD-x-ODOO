import { Link } from 'react-router-dom'
import { ArrowRight, Plus, MapPin, RefreshCw, Compass } from 'lucide-react'
import TripCard from './TripCard.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

export default function RecentTrips({
  trips = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const recentList = trips.slice(0, 3)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 flex items-center gap-2">
            <span>Recent Trips</span>
            {trips.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-ocean-100 text-ocean-700 font-semibold">
                {trips.length}
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Pick up where you left off or plan next details
          </p>
        </div>

        {trips.length > 0 && (
          <Link
            to="/trips"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="card overflow-hidden border animate-pulse space-y-4 p-0 rounded-2xl"
            >
              <div className="aspect-[16/9] bg-surface-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-surface-200 rounded w-3/4" />
                <div className="h-3 bg-surface-100 rounded w-1/2" />
                <div className="h-2 bg-surface-100 rounded w-full mt-2" />
                <div className="h-8 bg-surface-200 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="card p-8 text-center bg-white border border-danger-100">
          <ErrorState message={error || 'Unable to load your trips.'} onRetry={onRetry} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recentList.length === 0 && (
        <div className="card p-8 sm:p-12 text-center bg-gradient-to-b from-white to-ocean-50/30 border border-dashed border-ocean-200 rounded-2xl">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-ocean-100 flex items-center justify-center text-ocean-600 mb-4 shadow-sm">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-display font-semibold text-surface-800">
            No trips planned yet
          </h3>
          <p className="text-sm text-surface-500 max-w-sm mx-auto mt-1.5 mb-6">
            Your travel log is waiting for your next destination. Create your first itinerary and start packing!
          </p>
          <Link
            to="/trips/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-medium text-sm shadow-md shadow-ocean-600/20 transition-all duration-150 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Plan Your First Trip</span>
          </Link>
        </div>
      )}

      {/* Trips Grid */}
      {!loading && !error && recentList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentList.map((trip) => (
            <TripCard key={trip.id || trip._id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  )
}
