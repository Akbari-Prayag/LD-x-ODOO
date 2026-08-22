import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plane,
} from 'lucide-react'
import TripCard from './TripCard.jsx'
import SkeletonBlock from '../../components/ui/SkeletonBlock.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

export default function RecentTrips({ trips = [], loading = false, error = null, onRetry }) {
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const handleSurpriseMe = () => {
    navigate('/trips/create?destination=Paris')
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <span>Your Trips & Itineraries</span>
            {trips.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-900/60 text-ocean-700 dark:text-ocean-300">
                {trips.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            Swipe or scroll through your upcoming and past travel adventures
          </p>
        </div>

        {/* Carousel Controls / View All */}
        <div className="flex items-center gap-2">
          {trips.length > 3 && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => scroll('left')}
                className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 shadow-sm transition-colors"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 shadow-sm transition-colors"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link
            to="/trips"
            className="text-xs font-semibold text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 flex items-center gap-1 transition-colors pl-2"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Loading Shimmer Skeletons */}
      {loading && (
        <div className="flex gap-5 overflow-hidden py-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className="min-w-[280px] sm:min-w-[320px] rounded-3xl p-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-4">
              <SkeletonBlock className="aspect-[16/10] w-full rounded-2xl" />
              <SkeletonBlock className="w-3/4 h-5" />
              <SkeletonBlock className="w-1/2 h-4" />
              <SkeletonBlock className="w-full h-8 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-6 rounded-3xl bg-white dark:bg-surface-900 border border-danger-100 dark:border-danger-900/30 text-center">
          <ErrorState message={error || 'Unable to load trips.'} onRetry={onRetry} />
        </div>
      )}

      {/* Smart Animated Empty State */}
      {!loading && !error && trips.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-ocean-50/40 via-white to-surface-50 dark:from-surface-900 dark:to-surface-900 border border-dashed border-ocean-200 dark:border-surface-700 text-center space-y-4 shadow-soft"
        >
          {/* Animated Takeoff Illustration */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-ocean-500 to-sage-400 text-white flex items-center justify-center mx-auto shadow-glow">
            <Plane className="w-8 h-8 animate-bounce-sm" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h4 className="text-lg font-display font-bold text-surface-900 dark:text-white">
              No Trips in Your Passport Yet!
            </h4>
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
              Your travel story is waiting to be written. Build your dream itinerary or let our AI curator surprise you.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-ocean-600 hover:bg-ocean-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-ocean-600/20 transition-all duration-150 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Your First Trip</span>
            </Link>

            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 text-surface-800 dark:text-surface-200 font-semibold text-xs sm:text-sm transition-all duration-150 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-sunset-500" />
              <span>Surprise Me</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Horizontal Snap-Scroll Carousel */}
      {!loading && !error && trips.length > 0 && (
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-surface-200 dark:scrollbar-thumb-surface-800 scroll-smooth"
        >
          {trips.map((trip) => (
            <div key={trip.id || trip._id} className="snap-start">
              <TripCard trip={trip} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
