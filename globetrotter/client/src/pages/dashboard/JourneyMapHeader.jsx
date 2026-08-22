import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Sparkles, Search, Compass, MapPin } from 'lucide-react'

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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8
    setMousePos({ x, y })
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Traveler'
  const tripCount = trips.length || 0

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full rounded-2xl overflow-hidden bg-[#0c1427] text-white shadow-lg border border-slate-800/80 p-6 sm:p-8 min-h-[160px] flex flex-col justify-between"
    >
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1d4ed8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#0284c7]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Background Flight Route Map */}
      <motion.div
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="absolute inset-0 pointer-events-none opacity-25"
      >
        <svg
          viewBox="0 0 1000 350"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle World Map Continents Outline */}
          <path
            d="M 150,90 Q 200,60 270,80 Q 320,130 290,190 Q 230,220 180,180 Z 
               M 440,70 Q 520,40 560,90 Q 530,150 470,140 Z 
               M 470,150 Q 550,160 540,250 Q 480,270 450,200 Z 
               M 600,80 Q 750,50 820,100 Q 800,200 680,180 Z 
               M 750,220 Q 840,210 830,270 Q 760,280 740,240 Z"
            fill="currentColor"
            className="text-white/10"
          />

          {/* Clean Flight Path */}
          <motion.path
            d="M 275,135 Q 380,80 485,125 T 670,190 T 820,155"
            stroke="#38bdf8"
            strokeWidth="1.75"
            strokeDasharray="5 5"
            strokeOpacity="0.4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Landmark Pins */}
          {SAMPLE_MAP_PINS.map((pin) => (
            <g key={pin.id}>
              <circle
                cx={pin.x}
                cy={pin.y}
                r="4"
                className="fill-[#38bdf8] opacity-60"
              />
              <circle
                cx={pin.x}
                cy={pin.y}
                r="2"
                className="fill-white"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs text-blue-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>
              {tripCount > 0
                ? `${tripCount} trip${tripCount > 1 ? 's' : ''} planned — ready to explore`
                : 'Your next global adventure begins today'}
            </span>
          </div>

          {/* Clean Crisp Typography */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold tracking-tight text-white">
            {greeting}, <span className="text-[#38bdf8]">{firstName}</span>!
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-light">
            {tripCount > 0
              ? 'Track your upcoming itineraries, budget utilization, and explore curated destination guides.'
              : 'Start your journey by creating your first personalized itinerary or browsing curated destinations.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md text-xs font-medium transition-all shadow-sm"
            title="Search anything (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span className="hidden sm:inline">Quick Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/20 text-slate-300">
              ⌘K
            </kbd>
          </button>

          {/* Plan New Trip CTA Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/trips/create"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b72de] hover:bg-[#2563eb] text-white font-semibold text-xs tracking-wide shadow-md shadow-[#3b72de]/25 transition-all"
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
