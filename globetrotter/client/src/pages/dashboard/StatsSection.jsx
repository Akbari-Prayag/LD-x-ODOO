import { motion } from 'framer-motion'
import { Plane, MapPin, DollarSign, CalendarCheck } from 'lucide-react'
import StatCard from './StatCard.jsx'

export default function StatsSection({ trips = [], loading = false }) {
  // Compute aggregated stats
  const totalTrips = trips.length

  // Calculate unique visited/planned destinations
  const destinationSet = new Set()
  trips.forEach((t) => {
    if (Array.isArray(t.stops)) {
      t.stops.forEach((s) => {
        if (s.city?.name) destinationSet.add(s.city.name)
        else if (s.customCityName) destinationSet.add(s.customCityName)
      })
    }
  })
  const totalDestinations = destinationSet.size || (totalTrips > 0 ? totalTrips * 2 : 0)

  // Calculate total money spent
  const totalSpent = trips.reduce((acc, t) => acc + (Number(t.totalSpent) || 0), 0)

  // Calculate active/upcoming plans
  const activePlans = trips.filter(
    (t) => t.status === 'planning' || t.status === 'upcoming' || t.status === 'ongoing'
  ).length

  const stats = [
    {
      id: 'trips',
      title: 'Total Trips',
      value: totalTrips,
      icon: Plane,
      colorScheme: 'ocean',
      trend: 12,
      trendLabel: 'vs last year',
      sparklineData: [2, 4, 3, 6, 8, totalTrips || 10],
    },
    {
      id: 'destinations',
      title: 'Destinations',
      value: totalDestinations,
      icon: MapPin,
      colorScheme: 'sage',
      trend: 25,
      trendLabel: 'new places',
      sparklineData: [4, 8, 7, 12, 16, totalDestinations || 18],
    },
    {
      id: 'spent',
      title: 'Total Spent',
      value: totalSpent,
      prefix: '₹',
      icon: DollarSign,
      colorScheme: 'sunset',
      trend: -5,
      trendLabel: 'budget efficiency',
      sparklineData: [15000, 28000, 32000, 45000, 52000, totalSpent || 60000],
    },
    {
      id: 'active',
      title: 'Active Plans',
      value: activePlans,
      icon: CalendarCheck,
      colorScheme: 'accent',
      trend: 50,
      trendLabel: 'itineraries',
      sparklineData: [1, 2, 1, 3, 2, activePlans || 4],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
    >
      {stats.map((stat) => (
        <motion.div key={stat.id} variants={itemVariants}>
          <StatCard {...stat} loading={loading} />
        </motion.div>
      ))}
    </motion.section>
  )
}
