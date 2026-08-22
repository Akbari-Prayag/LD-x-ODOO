import { Link } from 'react-router-dom'
import { Plus, Compass, Calendar } from 'lucide-react'
import { formatDate } from '../../utils/dateUtils.js'

export default function DashboardHeader({ user }) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Traveler'
  const todayStr = formatDate(new Date(), 'EEEE, MMMM do')

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ocean-700 via-ocean-600 to-sage-600 p-6 sm:p-8 md:p-10 text-white shadow-card-lg">
      {/* Background ambient lighting effects */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-sage-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-ocean-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-ocean-100 border border-white/10">
            <Calendar className="w-3.5 h-3.5 text-sage-200" />
            <span>{todayStr}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white">
            {getGreeting()}, {firstName}! 👋
          </h1>

          <p className="text-sm sm:text-base text-ocean-100/90 max-w-xl">
            Where to next? Discover exciting destinations, organize your daily itineraries, and track your travel budget effortlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/cities"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium backdrop-blur-sm transition-all duration-150 active:scale-95"
          >
            <Compass className="w-4 h-4 text-sage-200" />
            <span>Explore Places</span>
          </Link>

          <Link
            to="/trips/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-ocean-700 hover:bg-ocean-50 text-sm font-semibold shadow-md shadow-black/10 transition-all duration-150 active:scale-95 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 text-ocean-600 stroke-[2.5]" />
            <span>+ Plan New Trip</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
