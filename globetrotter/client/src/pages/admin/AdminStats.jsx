import { Users, Map, Globe, Activity } from 'lucide-react'
import StatCard from '../dashboard/StatCard.jsx'

export default function AdminStats({ stats, loading = false }) {
  const {
    totalUsers = 0,
    totalTrips = 0,
    totalCities = 0,
    totalActivities = 0,
  } = stats || {}

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
      <StatCard
        title="Total Users"
        value={loading ? '—' : totalUsers.toLocaleString()}
        subtitle="Registered travelers"
        icon={Users}
        colorScheme="ocean"
        loading={loading}
      />

      <StatCard
        title="Total Trips"
        value={loading ? '—' : totalTrips.toLocaleString()}
        subtitle="Itineraries generated"
        icon={Map}
        colorScheme="sage"
        loading={loading}
      />

      <StatCard
        title="Total Cities"
        value={loading ? '—' : totalCities.toLocaleString()}
        subtitle="Destinations indexed"
        icon={Globe}
        colorScheme="ocean"
        loading={loading}
      />

      <StatCard
        title="Activities"
        value={loading ? '—' : totalActivities.toLocaleString()}
        subtitle="Curated experiences"
        icon={Activity}
        colorScheme="sage"
        loading={loading}
      />
    </div>
  )
}
