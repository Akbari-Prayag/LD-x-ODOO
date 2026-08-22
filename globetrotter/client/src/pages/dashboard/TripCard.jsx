import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Wallet, Sparkles } from 'lucide-react'
import { dateRange } from '../../utils/dateUtils.js'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800'

export default function TripCard({ trip }) {
  if (!trip) return null

  const tripId = trip.id || trip._id
  const {
    name,
    coverPhoto,
    startDate,
    endDate,
    stops = [],
    budget = 0,
    totalSpent = 0,
    currency = 'INR',
    status = 'planning',
    isPublic = false,
  } = trip

  const stopCount = stops.length || 1
  const pct = budgetPercentage(totalSpent, budget)

  const statusConfig = {
    planning: { label: 'Planning', badge: 'bg-ocean-100 dark:bg-ocean-950/60 text-ocean-800 dark:text-ocean-300 border-ocean-200 dark:border-ocean-800' },
    upcoming: { label: 'Upcoming', badge: 'bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 border-sage-200 dark:border-sage-800' },
    ongoing: { label: 'Ongoing', badge: 'bg-sunset-100 dark:bg-sunset-950/60 text-sunset-800 dark:text-sunset-300 border-sunset-200 dark:border-sunset-800' },
    completed: { label: 'Completed', badge: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700' },
  }

  const currentStatus = statusConfig[status] || statusConfig.planning

  // 3D Tilt calculation
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    setRotate({ x, y })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <motion.div
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 rounded-3xl shadow-soft transition-shadow hover:shadow-xl duration-300 min-w-[280px] sm:min-w-[320px] flex-shrink-0"
    >
      {/* Cover Image with Ken Burns zoom */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img
          src={coverPhoto || DEFAULT_COVER}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-full border shadow-sm backdrop-blur-md',
              currentStatus.badge
            )}
          >
            {currentStatus.label}
          </span>

          {isPublic && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-white/20 text-white backdrop-blur-md border border-white/30">
              Public
            </span>
          )}
        </div>

        {/* Bottom Image Overlay text */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <h3 className="font-display font-bold text-lg sm:text-xl truncate leading-tight drop-shadow-md">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1">
            <Calendar className="w-3.5 h-3.5 text-sunset-300" />
            <span>{dateRange(startDate, endDate) || 'Dates flexible'}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Stops and Details */}
        <div className="flex items-center justify-between text-xs text-surface-600 dark:text-surface-400">
          <div className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-ocean-600 dark:text-ocean-400" />
            <span>{stopCount} {stopCount === 1 ? 'City Stop' : 'City Stops'}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-sage-700 dark:text-sage-300 bg-sage-50 dark:bg-sage-950/50 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 text-sage-500" />
            <span>Itinerary Ready</span>
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-surface-500 dark:text-surface-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-surface-400" />
              <span>Budget</span>
            </span>
            <span className="text-surface-800 dark:text-surface-200">
              <span className="font-bold text-surface-900 dark:text-white">{formatCurrency(totalSpent, currency)}</span>
              {budget > 0 && <span className="text-surface-400"> / {formatCurrency(budget, currency)}</span>}
            </span>
          </div>

          {budget > 0 && (
            <div className="w-full h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(pct, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  pct > 90 ? 'bg-danger-500' : pct > 70 ? 'bg-sunset-500' : 'bg-ocean-500'
                )}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
          <Link
            to={`/trips/${tripId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-surface-50 dark:bg-surface-800/80 hover:bg-ocean-50 dark:hover:bg-ocean-950/50 text-surface-800 dark:text-surface-200 hover:text-ocean-700 dark:hover:text-ocean-300 font-semibold text-xs sm:text-sm transition-all duration-150 group/btn shadow-sm"
          >
            <span>View Trip Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
