import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchTrips, selectAllTrips, selectTripsLoading, selectTripsError } from '../../store/slices/tripsSlice.js'
import { selectCurrentUser } from '../../store/slices/authSlice.js'
import api from '../../services/api.js'

import JourneyMapHeader from './JourneyMapHeader.jsx'
import StatsSection from './StatsSection.jsx'
import NextTripCountdown from './NextTripCountdown.jsx'
import RecentTrips from './RecentTrips.jsx'
import BudgetHighlight from './BudgetHighlight.jsx'
import RecommendedDestinations from './RecommendedDestinations.jsx'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const trips = useSelector(selectAllTrips) || []
  const tripsLoading = useSelector(selectTripsLoading)
  const tripsError = useSelector(selectTripsError)

  const [popularCities, setPopularCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [citiesError, setCitiesError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Open the global command palette (owned by AppLayout)
  const openCommandPalette = () =>
    window.dispatchEvent(new CustomEvent('open-command-palette'))

  // Fetch user trips
  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  // Fetch popular cities
  const loadPopularCities = async () => {
    try {
      setCitiesLoading(true)
      setCitiesError(null)
      const { data } = await api.get('/cities/popular')
      if (data.success && Array.isArray(data.cities)) {
        setPopularCities(data.cities)
      }
    } catch (err) {
      setCitiesError(err.response?.data?.message || 'Failed to load popular cities')
    } finally {
      setCitiesLoading(false)
    }
  }

  useEffect(() => {
    loadPopularCities()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12 max-w-7xl mx-auto"
    >
      {/* 1. Animated World Journey Map Header */}
      <JourneyMapHeader
        user={user}
        trips={trips}
        onOpenCommandPalette={openCommandPalette}
      />

      {/* 2. Key Stats Grid with Count-up & Sparklines */}
      <StatsSection trips={trips} loading={tripsLoading} />

      {/* 3. Next Trip Live Countdown Hero Card */}
      {trips.length > 0 && <NextTripCountdown trips={trips} />}

      {/* 4. Snap-Scroll Trips Carousel */}
      <RecentTrips
        trips={trips}
        loading={tripsLoading}
        error={tripsError}
        onRetry={() => dispatch(fetchTrips())}
      />

      {/* 5. Donut Chart Budget & Expense Breakdown */}
      <BudgetHighlight
        trips={trips}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 6. Swipeable Tinder-Style Recommended Destinations */}
      <RecommendedDestinations
        cities={popularCities}
        loading={citiesLoading}
        error={citiesError}
        onRetry={loadPopularCities}
      />

    </motion.div>
  )
}
