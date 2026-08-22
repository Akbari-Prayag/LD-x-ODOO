import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Layers,
  Heart,
  X,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import DestinationCard from './DestinationCard.jsx'
import SkeletonBlock from '../../components/ui/SkeletonBlock.jsx'
import { fireCelebrationConfetti } from '../../components/ui/Confetti.js'
import api from '../../services/api.js'

export default function RecommendedDestinations({
  cities = [],
  loading = false,
  error = null,
  onRetry,
}) {
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'deck'
  const [deckIndex, setDeckIndex] = useState(0)
  const [savedCityIds, setSavedCityIds] = useState(new Set())

  const displayCities = cities.slice(0, 8)

  const handleSaveCity = async (city, e) => {
    try {
      const cityId = city.id || city._id
      await api.post(`/users/saved-destinations/${cityId}`)

      setSavedCityIds((prev) => new Set([...prev, cityId]))
      fireCelebrationConfetti()
      toast.success(`✨ ${city.name} added to your Saved Places!`)
    } catch (err) {
      toast.error('Sign in to save destinations to your profile')
    }
  }

  // Handle Tinder-style deck swipe
  const handleDeckSwipe = (direction, city) => {
    if (direction === 'right') {
      handleSaveCity(city)
    }
    setDeckIndex((prev) => (prev + 1 < displayCities.length ? prev + 1 : 0))
  }

  const currentDeckCity = displayCities[deckIndex]

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <span>Trending Destinations</span>
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
            Curated world cities based on seasonal popularity and traveler rankings
          </p>
        </div>

        {/* View Mode Switcher & Catalog Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 p-1 rounded-xl border border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('deck')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'deck'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
              title="Swipeable Card Deck"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>

          <Link
            to="/cities"
            className="text-xs font-semibold text-sage-600 hover:text-sage-700 dark:text-sage-400 flex items-center gap-1 transition-colors pl-2"
          >
            <span>Explore all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="rounded-3xl p-4 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-3">
              <SkeletonBlock className="aspect-[4/3] w-full rounded-2xl" />
              <SkeletonBlock className="w-3/4 h-5" />
              <SkeletonBlock className="w-1/2 h-4" />
            </div>
          ))}
        </div>
      )}

      {/* Swipeable Card Deck View */}
      {!loading && !error && viewMode === 'deck' && displayCities.length > 0 && currentDeckCity && (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-full max-w-sm aspect-[4/5] flex items-center justify-center">
            <AnimatePresence>
              <motion.div
                key={currentDeckCity.id || currentDeckCity._id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = offset.x
                  if (swipe > 100) {
                    handleDeckSwipe('right', currentDeckCity)
                  } else if (swipe < -100) {
                    handleDeckSwipe('left', currentDeckCity)
                  }
                }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ x: 200, opacity: 0 }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative bg-surface-900 text-white">
                  <img
                    src={currentDeckCity.image}
                    alt={currentDeckCity.name}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                      Swipe Right to Save 👉
                    </span>
                    <span className="px-3 py-1 rounded-full bg-sunset-500 text-white text-xs font-bold shadow-md">
                      {currentDeckCity.popularity}% Match
                    </span>
                  </div>

                  {/* Bottom Information */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-2 pointer-events-none">
                    <h4 className="text-2xl font-display font-bold">{currentDeckCity.name}</h4>
                    <p className="text-sm text-surface-200">{currentDeckCity.country}</p>
                    <p className="text-xs text-surface-300 line-clamp-2">{currentDeckCity.description}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Swipe Buttons */}
          <div className="flex items-center gap-4 mt-5">
            <button
              onClick={() => handleDeckSwipe('left', currentDeckCity)}
              className="p-4 rounded-full bg-white dark:bg-surface-800 text-surface-600 hover:text-danger-500 border border-surface-200 dark:border-surface-700 shadow-md hover:scale-110 active:scale-95 transition-all"
              title="Skip"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={() => handleDeckSwipe('right', currentDeckCity)}
              className="p-4 rounded-full bg-sunset-500 text-white shadow-glow hover:scale-110 active:scale-95 transition-all"
              title="Save to Wishlist"
            >
              <Heart className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && viewMode === 'grid' && displayCities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayCities.map((city) => (
            <DestinationCard
              key={city.id || city._id || city.name}
              city={city}
              onSave={handleSaveCity}
            />
          ))}
        </div>
      )}
    </section>
  )
}
