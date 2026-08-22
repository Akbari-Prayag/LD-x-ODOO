import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Sparkles,
  Share2,
  DollarSign,
  Check,
  Plane,
  MapPin,
  Calendar,
  Globe2,
  TrendingUp,
  ShieldCheck,
  Navigation,
  Clock,
  ChevronRight,
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import api from '../../services/api.js'

// Curated high-resolution destination data fallback
const DEFAULT_CITIES = [
  {
    id: 1,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    description: 'Neon skylines, ancient shrines, and legendary food alleys.',
    tag: 'Trending',
    rating: '4.9',
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    description: 'Iconic monuments, Seine walks, and historic neighborhoods.',
    tag: 'Popular',
    rating: '4.8',
  },
  {
    id: 3,
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
    description: 'Ancient architecture, the Colosseum, and vibrant piazzas.',
    tag: 'Historic',
    rating: '4.9',
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
    description: 'Terraced rice fields, coastal cliffs, and quiet retreats.',
    tag: 'Tropical',
    rating: '4.9',
  },
]

const LIVE_ROUTES = [
  '🗼 Tokyo → Kyoto → Osaka',
  '🥐 Paris → Rome → Zurich',
  '🌴 Bali → Ubud → Nusa Penida',
  '🏛️ Athens → Santorini → Mykonos',
  '🏔️ Zurich → Interlaken → Zermatt',
  '🗽 New York → Boston → Montreal',
]

const STATS = [
  { value: '50+', label: 'Global Cities', icon: Globe2 },
  { value: '12,000+', label: 'Routes Planned', icon: Navigation },
  { value: '100%', label: 'Budget Precision', icon: DollarSign },
  { value: '4.9 ★', label: 'Traveler Rating', icon: Sparkles },
]

export default function LandingPage() {
  const isAuth = useSelector(selectIsAuthenticated)
  const shouldReduceMotion = useReducedMotion()

  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [activeStop, setActiveStop] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const heroRef = useRef(null)
  const { scrollY } = useScroll()

  // Gentle parallax for Hero
  const heroParallax = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : 150])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0.35])

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 20)
    })
    return () => unsubscribe()
  }, [scrollY])

  // Itinerary Showcase stops
  const showcaseStops = [
    {
      city: 'Paris',
      country: 'France',
      duration: '4 Days',
      dates: 'Day 1 – 4',
      budget: '€1,450',
      totalEstimated: '€4,550 / €5,000',
      stays: '€2,100',
      activities: '€1,350',
      transit: '€1,100',
      progressPercent: 91,
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Louvre Priority Pass', 'Eiffel Tower Sunset', 'Seine River Cruise'],
    },
    {
      city: 'Rome',
      country: 'Italy',
      duration: '5 Days',
      dates: 'Day 5 – 9',
      budget: '€1,280',
      totalEstimated: '€4,550 / €5,000',
      stays: '€1,950',
      activities: '€1,500',
      transit: '€1,100',
      progressPercent: 91,
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Colosseum & Forum', 'Trastevere Food Tour', 'Vatican Museums'],
    },
    {
      city: 'Zurich',
      country: 'Switzerland',
      duration: '5 Days',
      dates: 'Day 10 – 14',
      budget: '€1,820',
      totalEstimated: '€4,550 / €5,000',
      stays: '€2,300',
      activities: '€1,150',
      transit: '€1,100',
      progressPercent: 91,
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Lake Zurich Steamboat', 'Uetliberg Ridge Hike', 'Old Town Walk'],
    },
  ]

  // Fetch real cities with fallback
  useEffect(() => {
    let isMounted = true
    async function loadCities() {
      try {
        setLoadingCities(true)
        const { data } = await api.get('/cities')
        if (isMounted) {
          if (data.success && data.cities && data.cities.length > 0) {
            setCities(data.cities.slice(0, 4))
          } else {
            setCities(DEFAULT_CITIES)
          }
        }
      } catch (err) {
        if (isMounted) setCities(DEFAULT_CITIES)
      } finally {
        if (isMounted) setLoadingCities(false)
      }
    }
    loadCities()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#0c1222] text-[#f0f8fb] font-sans selection:bg-[#3b72de] selection:text-white overflow-x-hidden">
      {/* ── Background Floating Ambient Glow Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#3b72de]/15 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#08a9e8]/12 blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            x: [0, 25, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute bottom-20 left-1/4 w-96 h-96 rounded-full bg-[#1e3a8a]/20 blur-[130px]"
        />
      </div>

      {/* ── 1. Clean, Modern Navigation Bar ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0c1222]/90 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent border-b border-white/5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Logo variant="white" size="sm" />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#89c7e2]">
            <a href="#canvas" className="hover:text-white transition-colors relative py-1">
              Canvas
            </a>
            <a href="#destinations" className="hover:text-white transition-colors relative py-1">
              Destinations
            </a>
            <a href="#features" className="hover:text-white transition-colors relative py-1">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!isAuth ? (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white text-xs font-semibold shadow-md shadow-[#3b72de]/25 transition-all"
                >
                  Log In
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white text-xs font-semibold shadow-md shadow-[#3b72de]/25 transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Cinematic Hero Section with Floating Micro-Cards ── */}
      <section
        ref={heroRef}
        className="relative min-h-[86vh] flex flex-col justify-center px-6 py-20 border-b border-white/10 overflow-hidden"
      >
        <motion.div
          style={{ y: heroParallax, opacity: heroOpacity }}
          className="absolute inset-0 z-0 will-change-transform"
        >
          {!shouldReduceMotion ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
              className="w-full h-full object-cover opacity-35"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-coming-to-the-beach-5020-large.mp4"
                type="video/mp4"
              />
            </video>
          ) : (
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
              alt="Mountain Pass"
              className="w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/70 to-[#0c1222]/30" />
        </motion.div>

        {/* Floating Badges in Background (Hidden on small screens) */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 max-w-6xl mx-auto pointer-events-none hidden lg:block z-10">
            {/* Floating Card Left */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: 0 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -12, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.4 },
                x: { duration: 0.8, delay: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
              }}
              className="absolute top-28 left-6 rounded-2xl bg-[#0c172e]/80 border border-white/15 p-3.5 backdrop-blur-md shadow-2xl shadow-black/60 flex items-center gap-3 text-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#3b72de]/20 border border-[#3b72de]/40 flex items-center justify-center text-[#89c7e2]">
                <Plane className="w-4 h-4 transform -rotate-45" />
              </div>
              <div>
                <p className="font-semibold text-white">Flight to Tokyo</p>
                <p className="text-[11px] text-[#89c7e2]/80">Confirmed • ¥84,000</p>
              </div>
            </motion.div>

            {/* Floating Card Right */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 0 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, 14, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.6 },
                x: { duration: 0.8, delay: 0.6 },
                y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 },
              }}
              className="absolute top-20 right-6 rounded-2xl bg-[#0c172e]/80 border border-white/15 p-3.5 backdrop-blur-md shadow-2xl shadow-black/60 flex items-center gap-3 text-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Budget Optimized</p>
                <p className="text-[11px] text-emerald-400">Under €4,550 Cap</p>
              </div>
            </motion.div>

            {/* Floating Card Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: [0, -10, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.8 },
                y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
              }}
              className="absolute bottom-20 left-12 rounded-2xl bg-[#0c172e]/80 border border-white/15 p-3 backdrop-blur-md shadow-2xl flex items-center gap-2.5 text-xs"
            >
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#89c7e2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3b72de]"></span>
              </span>
              <span className="font-medium text-[#d2e9ec]">3 Stops • 14 Days Expedition</span>
            </motion.div>
          </div>
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Animated Glow Release Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-[#89c7e2] backdrop-blur-md shadow-inner"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#89c7e2]" />
            </motion.span>
            <span className="font-medium text-white/90">Smart Multi-City Itinerary Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.05]"
          >
            Plan Less.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89c7e2] via-[#3b72de] to-[#d2e9ec]">
              Experience More.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-xl text-[#d2e9ec]/85 max-w-xl mx-auto font-light leading-relaxed"
          >
            Multi-city routing, live expense budgeting, and daily itineraries unified in one interactive canvas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/cities"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-sm shadow-xl shadow-[#3b72de]/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
              <Link
                to="/trip/public/golden-triangle-adventure-BYB_b0"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#89c7e2]" />
                <span>Sample Itinerary</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 2.5 Live Route Marquee / Ticker ── */}
      <div className="relative py-4 bg-[#0a0f1d] border-b border-white/10 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-8 whitespace-nowrap text-xs font-mono tracking-wider text-[#89c7e2]/80"
        >
          {[...LIVE_ROUTES, ...LIVE_ROUTES, ...LIVE_ROUTES].map((route, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#3b72de] font-bold">●</span>
              <span>{route}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── 2.8 Metrics / Stats Bar ── */}
      <section className="py-12 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(59, 114, 222, 0.5)' }}
                className="p-5 rounded-2xl bg-[#16255b]/20 border border-white/10 backdrop-blur-sm flex items-center gap-3.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3b72de]/20 border border-[#3b72de]/30 flex items-center justify-center text-[#89c7e2] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">{stat.value}</h3>
                  <p className="text-[11px] text-[#89c7e2]/75 uppercase tracking-wider font-mono">{stat.label}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── 3. Interactive Itinerary Canvas Showcase ── */}
      <section id="canvas" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between border-b border-white/10 pb-4"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#3b72de]" />
              Featured Itinerary
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Grand European Expedition
            </h2>
          </div>
          <Link
            to={isAuth ? '/trips/create' : '/login'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#89c7e2] hover:text-white transition-colors group"
          >
            <span>Create Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Master Showcase Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-md"
        >
          {/* Stop Tabs */}
          <div className="grid grid-cols-3 border-b border-white/10 bg-[#0e172e]/60 relative">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStop === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStop(idx)}
                  className={`p-4 sm:p-5 text-left transition-all relative border-r last:border-r-0 border-white/10 ${
                    isActive ? 'bg-[#16255b]/80 text-white' : 'text-[#89c7e2]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeStopTabIndicator"
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#89c7e2] to-[#3b72de] shadow-[0_0_12px_rgba(59,114,222,0.8)]"
                    />
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#89c7e2]">
                    Stop 0{idx + 1}
                  </p>
                  <h4 className="text-base sm:text-lg font-display font-bold truncate mt-0.5">{stop.city}</h4>
                  <p className="text-xs text-[#d2e9ec]/60 truncate hidden sm:block">{stop.duration}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stop Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStop}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Photo & Highlights */}
              <div className="md:col-span-7 p-6 space-y-4">
                <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/10 group">
                  <motion.img
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6 }}
                    src={showcaseStops[activeStop].image}
                    alt={showcaseStops[activeStop].city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-[#0c1222]/85 backdrop-blur-md text-xs flex items-center justify-between text-white border border-white/10 shadow-lg">
                    <span className="font-mono flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#89c7e2]" />
                      Est. Budget: {showcaseStops[activeStop].budget}
                    </span>
                    <span className="text-[#89c7e2] font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {showcaseStops[activeStop].country}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {showcaseStops[activeStop].highlights.map((h, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="p-2.5 rounded-lg bg-[#0c1222]/60 border border-white/10 hover:border-[#3b72de]/50 text-xs text-[#d2e9ec] flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 text-[#3b72de] flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Budget Ledger & Action */}
              <div className="md:col-span-5 bg-[#0e172e]/50 border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#89c7e2] uppercase font-bold flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#3b72de]" />
                      Expense Breakdown
                    </span>
                    <span className="text-white font-bold">{showcaseStops[activeStop].totalEstimated}</span>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-[#0c1222] p-0.5 border border-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${showcaseStops[activeStop].progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#89c7e2] to-[#3b72de] rounded-full shadow-[0_0_10px_rgba(59,114,222,0.6)]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-[#d2e9ec]">
                    <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-[#0c1222]/70 border border-white/5">
                      <p className="text-[#89c7e2]">Stays</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].stays}</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-[#0c1222]/70 border border-white/5">
                      <p className="text-[#89c7e2]">Activities</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].activities}</p>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }} className="p-2.5 rounded-lg bg-[#0c1222]/70 border border-white/5">
                      <p className="text-[#89c7e2]">Transit</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].transit}</p>
                    </motion.div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={isAuth ? '/trips/create' : '/login'}
                    className="w-full py-3.5 rounded-xl bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-xs uppercase tracking-wider text-center transition-colors shadow-lg block"
                  >
                    Start Planning This Trip
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── 4. Destinations Catalog (Interactive 3D Cards) ── */}
      <section id="destinations" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between border-b border-white/10 pb-4"
        >
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
              Destinations
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              Popular Cities on Triply
            </h2>
          </div>
          <Link
            to="/cities"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#89c7e2] hover:text-white transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {loadingCities ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl bg-white/5 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {(cities.length > 0 ? cities : DEFAULT_CITIES).map((city, idx) => (
              <motion.div
                key={city.id || city._id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#16255b]/30 flex flex-col justify-between aspect-[3/4] shadow-lg hover:border-[#3b72de] hover:shadow-[0_20px_35px_rgba(59,114,222,0.2)] transition-all duration-300"
              >
                <img
                  src={city.image || DEFAULT_CITIES[0].image}
                  alt={city.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/40 to-transparent" />

                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0c1222]/80 backdrop-blur-md text-[10px] font-mono text-[#89c7e2] border border-white/10">
                    {city.country}
                  </span>
                  {city.rating && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      ★ {city.rating}
                    </span>
                  )}
                </div>

                <div className="relative z-10 p-4 space-y-2">
                  <h4 className="text-xl font-display font-bold text-white group-hover:text-[#89c7e2] transition-colors">
                    {city.name}
                  </h4>
                  <p className="text-xs text-[#d2e9ec]/75 line-clamp-2 font-light">{city.description}</p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={`/trips/create?destination=${encodeURIComponent(city.name)}`}
                      className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-white hover:bg-[#3b72de] text-[#1e3070] hover:text-white font-bold text-xs transition-colors shadow-md"
                    >
                      <span>Plan Trip</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── 5. Features Grid with Interactive Motion ── */}
      <section id="features" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-xl mx-auto space-y-2"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Built for seamless travel planning
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {[
            {
              title: 'Multi-City Routing',
              desc: 'Organize multi-stop itineraries with scheduling and transit duration tracking.',
              icon: Compass,
            },
            {
              title: 'Budget Ledger',
              desc: 'Track expenses with automated currency conversion across destinations.',
              icon: DollarSign,
            },
            {
              title: 'Activities Directory',
              desc: 'Discover verified tours, cultural walks, and excursions across 20+ destinations.',
              icon: Sparkles,
            },
            {
              title: 'Public Sharing',
              desc: 'Share live public itineraries with friends and travel groups in one click.',
              icon: Share2,
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, borderColor: 'rgba(59, 114, 222, 0.6)' }}
                className="p-5 rounded-2xl bg-[#16255b]/25 border border-white/10 backdrop-blur-sm transition-all duration-300 space-y-3 group shadow-md"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-10 h-10 rounded-xl bg-[#223883]/60 border border-[#3b72de]/30 text-[#89c7e2] flex items-center justify-center group-hover:bg-[#3b72de] group-hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <h4 className="text-base font-display font-bold text-white">{item.title}</h4>
                <p className="text-xs text-[#d2e9ec]/75 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── 6. Bottom Banner with Pulsing Glow ── */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl bg-[#16255b]/40 border border-white/15 p-8 sm:p-12 text-center space-y-4 shadow-2xl overflow-hidden backdrop-blur-md"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b72de]/10 via-transparent to-[#08a9e8]/10 pointer-events-none" />
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-display font-bold text-white relative z-10"
          >
            Ready to plan your next trip?
          </motion.h2>
          <p className="text-xs sm:text-sm text-[#d2e9ec]/80 max-w-md mx-auto font-light relative z-10">
            Build your routes, organize stays, and explore the world with Triply.
          </p>
          <div className="pt-2 relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to={isAuth ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#3b72de]/30 transition-all"
              >
                <span>{isAuth ? 'Go to Dashboard' : 'Sign In to Triply'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── 7. Clean Minimal Footer ── */}
      <footer className="border-t border-white/10 bg-[#080d19] py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89c7e2]/70 font-mono">
          <div className="flex items-center gap-2">
            <Logo variant="white" size="sm" />
          </div>
          <p>© {new Date().getFullYear()} Triply. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium uppercase">
            <Link to="/login" className="hover:text-white transition-colors">
              Log In
            </Link>
            <Link to="/cities" className="hover:text-white transition-colors">
              Cities
            </Link>
            <Link to="/activities" className="hover:text-white transition-colors">
              Activities
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
