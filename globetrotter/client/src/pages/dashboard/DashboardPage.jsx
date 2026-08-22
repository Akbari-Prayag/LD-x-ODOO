import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '../../store/slices/authSlice.js'
import {
  fetchTrips,
  selectTrips,
  selectTripsLoading,
  selectTripsError,
} from '../../store/slices/tripsSlice.js'
import api from '../../services/api.js'

import DashboardHeader from './DashboardHeader.jsx'
import StatsSection from './StatsSection.jsx'
import RecentTrips from './RecentTrips.jsx'
import RecommendedDestinations from './RecommendedDestinations.jsx'
import BudgetHighlight from './BudgetHighlight.jsx'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const trips = useSelector(selectTrips)
  const tripsLoading = useSelector(selectTripsLoading)
  const tripsError = useSelector(selectTripsError)

  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [citiesError, setCitiesError] = useState(null)

  const loadPopularCities = async () => {
    try {
      setCitiesLoading(true)
      setCitiesError(null)
      const { data } = await api.get('/cities/popular')
      if (data.success) {
        setCities(data.cities || [])
      }
    } catch (err) {
      setCitiesError(err.response?.data?.message || 'Failed to load popular cities')
    } finally {
      setCitiesLoading(false)
    }
  }

  useEffect(() => {
    dispatch(fetchTrips())
    loadPopularCities()
  }, [dispatch])

  const handleRetryTrips = () => {
    dispatch(fetchTrips())
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Welcome Banner */}
      <DashboardHeader user={user} />

      {/* Metrics / Stats Cards */}
      <StatsSection trips={trips} loading={tripsLoading} />

      {/* Main Grid: Recent Trips & Financial Highlight */}
      <div className="space-y-8">
        <RecentTrips
          trips={trips}
          loading={tripsLoading}
          error={tripsError}
          onRetry={handleRetryTrips}
        />

        <BudgetHighlight trips={trips} loading={tripsLoading} />

        <RecommendedDestinations
          cities={cities}
          loading={citiesLoading}
          error={citiesError}
          onRetry={loadPopularCities}
        />
      </div>
    </div>
  )
}
