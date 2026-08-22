import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  Share2,
  Globe,
  Star,
  Check,
  Plane,
  ChevronRight,
  Shield,
  Layers,
  ArrowUpRight,
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
    description: 'Neon skylines, historic shrines, and vibrant culinary culture.',
    avgDailyCost: '₹8,500',
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    description: 'Iconic architecture, world-class museums, and Seine riverside promenades.',
    avgDailyCost: '€140',
  },
  {
    id: 3,
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
    description: 'Ancient monuments, the Colosseum, and vibrant piazza culture.',
    avgDailyCost: '€120',
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
    description: 'Lush terraced rice fields, coastal cliffs, and serene wellness retreats.',
    avgDailyCost: '₹4,500',
  },
]

export default function LandingPage() {
  const isAuth = useSelector(selectIsAuthenticated)
  const shouldReduceMotion = useReducedMotion()

  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [activeStop, setActiveStop] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const heroRef = useRef(null)
  const { scrollY, scrollYProgress } = useScroll()

  // Scroll effects for Hero
  const heroParallax = useTransform(scrollY, [0, 800], [0, shouldReduceMotion ? 0 : 200])
  const heroOpacity = useTransform(scrollY, [0, 600], [1, shouldReduceMotion ? 1 : 0.3])
  const heroScale = useTransform(scrollY, [0, 800], [1, shouldReduceMotion ? 1 : 1.08])

  // Track scroll position for navbar condense
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 30)
    })
    return () => unsubscribe()
  }, [scrollY])

  // Real Itinerary Showcase stops
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
      highlights: ['Lake Zurich Steamboat', 'Uetliberg Ridge Hike', 'Old Town Heritage Walk'],
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

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.94, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <div className="min-h-screen bg-[#0c1222] text-[#f0f8fb] font-sans selection:bg-[#3b72de] selection:text-white relative overflow-x-hidden">
      {/* ── Ambient Background Glows & Noise Mesh ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3b72de]/15 via-[#16255b]/20 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#223883]/20 via-[#16255b]/10 to-transparent blur-3xl opacity-50" />
        <div className="absolute bottom-[10%] left-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-[#3b72de]/10 via-[#16255b]/15 to-transparent blur-3xl opacity-60" />
      </div>

      {/* ── 1. Sleek, Adaptive Navigation Bar ── */}
      <motion.header
        initial={false}
        animate={{
          height: isScrolled ? '3.75rem' : '4.25rem',
          backgroundColor: isScrolled ? 'rgba(12, 18, 34, 0.92)' : 'rgba(12, 18, 34, 0.75)',
          borderBottomColor: isScrolled ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
        }}
        transition={{ duration: 0.25 }}
        className="sticky top-0 z-50 w-full backdrop-blur-xl border-b transition-colors flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <Logo variant="white" size="sm" />
          </Link>

          {/* Clean Nav Links with Micro-interaction */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#89c7e2]">
            {[
              { label: 'Canvas', href: '#canvas' },
              { label: 'Destinations', href: '#destinations' },
              { label: 'Features', href: '#features' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative py-1 text-[#89c7e2] hover:text-white transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3b72de] group-hover:w-full transition-all duration-300 rounded-full" />
              </a>
            ))}
          </nav>

          {/* Clean Login CTA */}
          <div className="flex items-center gap-3">
            {!isAuth ? (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#3b72de] to-[#223883] hover:from-[#4b82ee] hover:to-[#304899] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#3b72de]/20 hover:shadow-[#3b72de]/35 transition-all block"
                >
                  Log In
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b72de] hover:bg-[#4b82ee] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#3b72de]/20 transition-all"
                >
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── 2. Cinematic Parallax Hero Section ── */}
      <section
        ref={heroRef}
        className="relative min-h-[86vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-b border-[#223883]/30 overflow-hidden"
      >
        {/* Background Ambient Video & Parallax Layer */}
        <motion.div
          style={{ y: heroParallax, scale: heroScale, opacity: heroOpacity }}
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
              alt="Scenic mountain valley"
              className="w-full h-full object-cover opacity-35"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/75 to-[#0c1222]/40" />
        </motion.div>

        {/* Hero Content with Staggered Clip-Path Entrance */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-white leading-[1.04]">
              Plan Less.{' '}
              <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#89c7e2] via-[#3b72de] to-[#d2e9ec]">
                Experience More.
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-xl text-[#d2e9ec]/85 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Triply brings multi-city routing, multi-currency budgeting, and daily itineraries into one
            effortless, synchronized canvas.
          </motion.p>

          {/* Action CTAs with Micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/cities"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#3b72de] to-[#223883] hover:from-[#4b82ee] hover:to-[#304899] text-white font-bold text-sm sm:text-base shadow-xl shadow-[#3b72de]/30 hover:shadow-[#3b72de]/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/trip/public/golden-triangle-adventure-BYB_b0"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-semibold text-sm sm:text-base backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Compass className="w-4 h-4 text-[#89c7e2]" />
                <span>View Sample Itinerary</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Interactive Itinerary Canvas Showcase ── */}
      <section id="canvas" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#223883]/40 pb-6"
        >
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
              Featured Itinerary
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
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

        {/* Master Showcase Box (Elevated Glass Panel) */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={scaleUp}
          className="rounded-3xl bg-[#16255b]/40 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl"
        >
          {/* Stop Tabs */}
          <div className="grid grid-cols-3 border-b border-[#223883]/80 bg-[#0e172e]/90">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStop === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStop(idx)}
                  className={`p-4 sm:p-6 text-left transition-all duration-300 relative border-r last:border-r-0 border-[#223883]/60 focus:outline-none ${
                    isActive ? 'bg-[#16255b]/80 text-white' : 'text-[#89c7e2]/70 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute top-0 left-0 right-0 h-1 bg-[#3b72de]"
                    />
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                    Stop 0{idx + 1} • {stop.duration}
                  </p>
                  <h4 className="text-base sm:text-xl font-display font-bold truncate mt-0.5">{stop.city}</h4>
                  <p className="text-xs text-[#d2e9ec]/60 truncate hidden sm:block font-light">{stop.dates}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stop Grid with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStop}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              {/* Photo & Highlights */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img
                    src={showcaseStops[activeStop].image}
                    alt={showcaseStops[activeStop].city}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-[#0c1222]/85 backdrop-blur-md text-xs flex items-center justify-between text-white border border-white/10">
                    <span className="font-mono">Est. Budget: {showcaseStops[activeStop].budget}</span>
                    <span className="text-[#89c7e2] font-semibold">{showcaseStops[activeStop].country}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#89c7e2] font-bold">
                    Highlights:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {showcaseStops[activeStop].highlights.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-3 rounded-xl bg-[#0c1222]/70 border border-[#223883]/60 text-xs text-[#d2e9ec] flex items-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-[#3b72de] flex-shrink-0" />
                        <span className="truncate">{h}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Budget Ledger Widget */}
              <div className="lg:col-span-5 bg-[#0e172e]/90 border-t lg:border-t-0 lg:border-l border-[#223883]/60 p-6 sm:p-8 flex flex-col justify-between space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                      Multi-Currency Ledger
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      EUR / INR
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#16255b]/40 border border-[#223883] space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#d2e9ec]/70">Total Spend</span>
                      <span className="font-bold text-white text-sm">
                        {showcaseStops[activeStop].totalEstimated}
                      </span>
                    </div>

                    {/* Animated Budget Bar */}
                    <div className="w-full h-2 rounded-full bg-[#0c1222] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${showcaseStops[activeStop].progressPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-[#89c7e2] to-[#3b72de] rounded-full"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center text-[11px] font-mono text-[#d2e9ec]">
                      <div className="p-2.5 rounded-xl bg-[#0c1222]/80 border border-white/5">
                        <p className="text-[#89c7e2]">Stays</p>
                        <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].stays}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0c1222]/80 border border-white/5">
                        <p className="text-[#89c7e2]">Activities</p>
                        <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].activities}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0c1222]/80 border border-white/5">
                        <p className="text-[#89c7e2]">Transit</p>
                        <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].transit}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Box with Micro-interaction */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1e3070] to-[#223883] border border-[#3b72de]/40 space-y-3.5 text-white shadow-xl">
                  <h4 className="text-base font-display font-bold">Build Your Custom Itinerary</h4>
                  <p className="text-xs text-[#d2e9ec]/80 leading-relaxed font-light">
                    Sign in to create, reorder, and budget your own multi-city travel routes.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to={isAuth ? '/trips/create' : '/login'}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                      <span>Start Planning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── 4. Destination Catalog Showcase ── */}
      <section id="destinations" className="py-24 bg-[#0e172e]/70 border-t border-b border-[#223883]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeInUp}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                Destinations
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Popular Cities on Triply
              </h2>
            </div>
            <Link
              to="/cities"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#89c7e2] hover:text-white transition-colors group"
            >
              <span>View All Cities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Grid of Cities (with Loading Skeleton) */}
          {loadingCities ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/5 bg-[#16255b]/20 aspect-[3/4] animate-pulse p-4 flex flex-col justify-end space-y-3"
                >
                  <div className="h-6 w-1/2 bg-white/10 rounded-lg" />
                  <div className="h-3 w-3/4 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(cities.length > 0 ? cities : DEFAULT_CITIES).map((city) => (
                <motion.div
                  key={city.id || city._id}
                  variants={scaleUp}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="group relative rounded-2xl overflow-hidden border border-[#223883] hover:border-[#3b72de] bg-[#16255b]/40 flex flex-col justify-between aspect-[3/4] shadow-xl hover:shadow-[#3b72de]/20 transition-all duration-300"
                >
                  <img
                    src={city.image || DEFAULT_CITIES[0].image}
                    alt={city.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/40 to-transparent" />

                  <div className="relative z-10 p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0c1222]/85 backdrop-blur-md text-[10px] font-mono text-[#89c7e2] border border-white/10">
                      {city.country}
                    </span>
                  </div>

                  <div className="relative z-10 p-5 space-y-2.5">
                    <h4 className="text-2xl font-display font-bold text-white group-hover:text-[#89c7e2] transition-colors">
                      {city.name}
                    </h4>
                    <p className="text-xs text-[#d2e9ec]/75 line-clamp-2 font-light">{city.description}</p>
                    
                    <div className="pt-2 transform opacity-90 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <Link
                        to={`/trips/create?destination=${encodeURIComponent(city.name)}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-[#3b72de] text-[#1e3070] hover:text-white font-bold text-xs transition-colors shadow-md"
                      >
                        <span>Plan Trip Here</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 5. Features Grid ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto space-y-2.5"
        >
          <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Built for seamless travel planning
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              title: 'Multi-City Routing',
              desc: 'Organize multi-stop itineraries with scheduling and transit duration tracking.',
              icon: Compass,
            },
            {
              title: 'Budget Ledger',
              desc: 'Allocate spending across stays, food, and flights with automated currency conversions.',
              icon: DollarSign,
            },
            {
              title: 'Activities Directory',
              desc: 'Discover verified tours, cultural walks, and excursions across 20+ destinations.',
              icon: Sparkles,
            },
            {
              title: 'Public Trip Sharing',
              desc: 'Share live public itineraries with friends, family, and travel groups with one click.',
              icon: Share2,
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                variants={scaleUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-[#16255b]/35 border border-[#223883] hover:border-[#3b72de] transition-all space-y-4 shadow-xl hover:shadow-[#3b72de]/15"
              >
                <div className="w-12 h-12 rounded-xl bg-[#223883]/80 text-[#89c7e2] flex items-center justify-center border border-white/5">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-display font-bold text-white">{item.title}</h4>
                <p className="text-xs sm:text-sm text-[#d2e9ec]/75 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* ── 6. Bottom Banner ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={scaleUp}
          className="rounded-3xl bg-gradient-to-r from-[#1e3070] via-[#223883] to-[#1e3070] border border-[#3b72de]/40 p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#3b72de]/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Ready to plan your next trip?
          </h2>
          <p className="text-sm sm:text-base text-[#d2e9ec]/85 max-w-lg mx-auto font-light leading-relaxed">
            Build your routes, organize stays, and explore the world with Triply.
          </p>
          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
              <Link
                to={isAuth ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-sm sm:text-base shadow-2xl transition-all"
              >
                <span>{isAuth ? 'Go to Dashboard' : 'Sign In to Triply'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── 7. Clean Minimal Footer ── */}
      <footer className="border-t border-[#223883]/40 bg-[#080d19] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#89c7e2]/70 font-mono">
          <div className="flex items-center gap-2.5">
            <Logo variant="white" size="sm" />
          </div>
          <p>© {new Date().getFullYear()} Triply. All rights reserved.</p>
          <div className="flex items-center gap-6 font-medium uppercase tracking-wider">
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
