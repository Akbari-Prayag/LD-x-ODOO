import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, CloudSun, ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'

export default function NextTripCountdown({ trips = [] }) {
  // Find the next upcoming or ongoing trip (or first planning trip)
  const upcomingTrip =
    trips.find((t) => t.status === 'upcoming' || t.status === 'ongoing') ||
    trips.find((t) => t.status === 'planning') ||
    trips[0]

  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 24, seconds: 45 })

  useEffect(() => {
    if (!upcomingTrip) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [upcomingTrip])

  if (!upcomingTrip) return null

  const tripId = upcomingTrip.id || upcomingTrip._id
  const budget = Number(upcomingTrip.budget) || 45000
  const spent = Number(upcomingTrip.totalSpent) || 12500
  const pct = budgetPercentage(spent, budget)
  const remaining = Math.max(0, budget - spent)

  // Circular progress stroke calculation
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface-900 via-ocean-950 to-surface-900 border border-ocean-800/40 p-6 sm:p-7 shadow-soft text-white"
    >
      {/* Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-ocean-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sunset-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Trip Details & Countdown */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sunset-500/20 border border-sunset-400/30 text-sunset-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sunset-400" />
              <span>Next Upcoming Adventure</span>
            </span>

            {/* Destination Weather Preview */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-surface-200 backdrop-blur-md">
              <CloudSun className="w-3.5 h-3.5 text-sunset-300" />
              <span>28°C · Sunny forecast</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white tracking-tight">
            {upcomingTrip.name}
          </h2>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-surface-300">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-ocean-400" />
              <span>{upcomingTrip.stops?.length || 2} Destination Stops</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-sage-400" />
              <span>{upcomingTrip.startDate ? new Date(upcomingTrip.startDate).toLocaleDateString() : 'Starting Soon'}</span>
            </span>
          </div>

          {/* Live Countdown Timer Chips */}
          <div className="pt-2 flex items-center gap-2 sm:gap-3">
            {[
              { label: 'Days', val: timeLeft.days },
              { label: 'Hours', val: timeLeft.hours },
              { label: 'Mins', val: timeLeft.minutes },
              { label: 'Secs', val: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center w-14 sm:w-16 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center"
              >
                <span className="text-base sm:text-xl font-display font-bold text-white leading-none">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-surface-300 uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Budget Utilization Ring & Action */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-5 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
          {/* Circular SVG Budget Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                {/* Background Track */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-white/15"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Progress Arc */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-sunset-400 transition-all duration-700 ease-out"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-bold text-white leading-none">{pct}%</span>
                <span className="text-[8px] text-surface-300 uppercase">Spent</span>
              </div>
            </div>

            <div className="space-y-0.5 text-left">
              <p className="text-[11px] text-surface-300">Budget Spent</p>
              <p className="text-sm font-bold text-white">{formatCurrency(spent, upcomingTrip.currency || 'INR')}</p>
              <p className="text-[10px] text-sage-300">
                {formatCurrency(remaining, upcomingTrip.currency || 'INR')} remaining
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <Link
            to={`/trips/${tripId}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-surface-900 hover:bg-ocean-50 font-semibold text-xs sm:text-sm shadow-md transition-all duration-150 active:scale-95"
          >
            <span>Open Itinerary</span>
            <ArrowRight className="w-4 h-4 text-ocean-600" />
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
