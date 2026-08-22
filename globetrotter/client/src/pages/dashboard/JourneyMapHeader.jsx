import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Flame, Sparkles, Search, Compass, MapPin } from 'lucide-react'

// Curated world map major landmark coordinates for SVG pins
const SAMPLE_MAP_PINS = [
  { id: 'mumbai', x: 670, y: 190, name: 'Mumbai' },
  { id: 'paris', x: 485, y: 125, name: 'Paris' },
  { id: 'tokyo', x: 820, y: 155, name: 'Tokyo' },
  { id: 'dubai', x: 615, y: 175, name: 'Dubai' },
  { id: 'nyc', x: 275, y: 135, name: 'New York' },
]

export default function JourneyMapHeader({ user, trips = [], onOpenCommandPalette }) {
  const [greeting, setGreeting] = useState('Welcome back')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10
    setMousePos({ x, y })
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Traveler'
  const tripCount = trips.length || 0

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-surface-900 via-ocean-950 to-surface-950 text-white shadow-soft border border-white/10 p-6 sm:p-8 min-h-[160px] flex flex-col justify-between"
    >
      {/* Animated SVG World Map Background with Parallax */}
      <motion.div
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute inset-0 pointer-events-none opacity-30 sm:opacity-40"
      >
        <svg
          viewBox="0 0 1000 350"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle World Map Continents Outline (Simplified SVG Path) */}
          <path
            d="M 150,90 Q 200,60 270,80 Q 320,130 290,190 Q 230,220 180,180 Z 
               M 440,70 Q 520,40 560,90 Q 530,150 470,140 Z 
               M 470,150 Q 550,160 540,250 Q 480,270 450,200 Z 
               M 600,80 Q 750,50 820,100 Q 800,200 680,180 Z 
               M 750,220 Q 840,210 830,270 Q 760,280 740,240 Z"
            fill="currentColor"
            className="text-white/10"
          />

          {/* Animated Flight Path Line */}
          <motion.path
            d="M 275,135 Q 380,80 485,125 T 670,190 T 820,155"
            stroke="url(#flightGrad)"
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
          />

          {/* Linear gradient for flight path */}
          <defs>
            <linearGradient id="flightGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#89c7e2" />
              <stop offset="50%" stopColor="#f5a97f" />
              <stop offset="100%" stopColor="#a5d2c1" />
            </linearGradient>
          </defs>

          {/* Glowing Map Pins */}
          {SAMPLE_MAP_PINS.map((pin, i) => (
            <g key={pin.id}>
              {/* Outer pulsing ring */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="6"
                className="animate-ping fill-ocean-400 opacity-60"
              />
              {/* Inner core pin */}
              <circle
                cx={pin.x}
                cy={pin.y}
                r="3.5"
                className="fill-sunset-400 stroke-white stroke-1"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Decorative Glow Spotlights */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-ocean-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-sage-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          {/* Gamification / Streak Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sunset-300 font-medium">
            <Flame className="w-3.5 h-3.5 text-sunset-400 animate-pulse" />
            <span>
              {tripCount > 0
                ? `🔥 ${tripCount} trip${tripCount > 1 ? 's' : ''} planned — exploring the world!`
                : '✨ Your next global adventure begins today'}
            </span>
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white drop-shadow-sm">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-300 via-sunset-300 to-sage-300">{firstName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-surface-300 max-w-md">
            {tripCount > 0
              ? 'Ready to pack? Track your upcoming itineraries, budget utilization, and explore trending cities.'
              : 'Start your journey by creating your first personalized itinerary or browsing curated destinations.'}
          </p>
        </div>

        {/* Action Controls & Floating Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-surface-200 hover:text-white border border-white/15 backdrop-blur-md text-xs font-medium transition-all duration-150 active:scale-95 shadow-sm"
            title="Search anything (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-ocean-300" />
            <span className="hidden sm:inline">Quick Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/20 text-surface-300">
              ⌘K
            </kbd>
          </button>

          {/* Plan New Trip CTA */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/trips/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-ocean-500 to-sunset-500 hover:from-ocean-400 hover:to-sunset-400 text-white font-semibold text-sm shadow-glow transition-all duration-200"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Plan New Trip</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
