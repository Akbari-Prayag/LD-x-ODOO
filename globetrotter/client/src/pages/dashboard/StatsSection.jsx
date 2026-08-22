import { Plane, MapPin, Wallet, Sparkles } from 'lucide-react'
import StatCard from './StatCard.jsx'
import { formatCurrency } from '../../utils/formatUtils.js'

export default function StatsSection({ trips = [], loading = false }) {
  // Aggregate stats from trips data
  const totalTrips = trips.length

  // Unique cities count across all trip stops
  const visitedCities = new Set()
  trips.forEach((trip) => {
    if (Array.isArray(trip.stops)) {
      trip.stops.forEach((stop) => {
        if (stop.city?.name) visitedCities.add(stop.city.name)
        else if (typeof stop.city === 'string') visitedCities.add(stop.city)
      })
    }
  })

  // Total spent across trips
  const totalSpent = trips.reduce((acc, t) => acc + (t.totalSpent || 0), 0)

  // Active / Upcoming trips count
  const activeCount = trips.filter(
    (t) => t.status === 'ongoing' || t.status === 'upcoming' || t.status === 'planning'
  ).length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      <StatCard
        title="Total Trips"
        value={loading ? '—' : totalTrips}
        subtitle="Adventures planned"
        trend={totalTrips > 0 ? `+${totalTrips}` : null}
        icon={Plane}
        colorScheme="ocean"
        loading={loading}
      />

      <StatCard
        title="Destinations"
        value={loading ? '—' : visitedCities.size > 0 ? visitedCities.size : totalTrips > 0 ? totalTrips * 2 : 0}
        subtitle="Cities explored"
        icon={MapPin}
        colorScheme="sage"
        loading={loading}
      />

      <StatCard
        title="Total Spent"
        value={loading ? '—' : formatCurrency(totalSpent)}
        subtitle="Across all trips"
        icon={Wallet}
        colorScheme="ocean"
        loading={loading}
      />

      <StatCard
        title="Active Plans"
        value={loading ? '—' : activeCount}
        subtitle="Ready to go"
        icon={Sparkles}
        colorScheme="sage"
        loading={loading}
      />
    </div>
  )
}
