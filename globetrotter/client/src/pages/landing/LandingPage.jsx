import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Compass,
  ArrowRight,
  Sparkles,
  Share2,
  DollarSign,
  Check,
  MapPin,
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import api from '../../services/api.js'

const DEFAULT_CITIES = [
  {
    id: 1,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
    description: 'Neon skylines, ancient shrines, and legendary food alleys.',
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
    description: 'Iconic monuments, Seine walks, and historic neighborhoods.',
  },
  {
    id: 3,
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
    description: 'Ancient architecture, the Colosseum, and vibrant piazzas.',
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80',
    description: 'Terraced rice fields, coastal cliffs, and quiet retreats.',
  },
]

export default function LandingPage() {
  const isAuth = useSelector(selectIsAuthenticated)
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(true)
  const [activeStop, setActiveStop] = useState(0)

  // Itinerary Showcase stops
  const showcaseStops = [
    {
      city: 'Paris',
      country: 'France',
      duration: '4 Days',
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo variant="white" size="sm" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <a href="#itinerary" className="hover:text-white transition-colors">
              Itinerary
            </a>
            <a href="#destinations" className="hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {!isAuth ? (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-colors"
              >
                Log In
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-colors"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section (Deep Black Editorial) ── */}
      <section className="relative min-h-[75vh] flex flex-col justify-center px-6 py-20 border-b border-white/10 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80"
            alt="Mountains background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-widest text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Smart Travel Planning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
            Plan Less. Experience More.
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto font-light leading-relaxed">
            Multi-city routing, live expense budgeting, and daily itineraries unified in one clear, simple canvas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/cities"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/trip/public/golden-triangle-adventure-BYB_b0"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-neutral-400" />
              <span>Sample Itinerary</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Interactive Showcase Section ── */}
      <section id="itinerary" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Featured Route
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Grand European Expedition
            </h2>
          </div>
          <Link
            to={isAuth ? '/trips/create' : '/login'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <span>Create Trip</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Master Showcase Box */}
        <div className="rounded-xl bg-neutral-950 border border-white/10 overflow-hidden">
          {/* Stop Tabs */}
          <div className="grid grid-cols-3 border-b border-white/10 bg-neutral-900/50">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStop === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStop(idx)}
                  className={`p-4 text-left transition-colors relative border-r last:border-r-0 border-white/10 ${
                    isActive ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {isActive && <div className="absolute top-0 left-0 right-0 h-0.5 bg-white" />}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    Stop 0{idx + 1}
                  </p>
                  <h4 className="text-sm sm:text-base font-display font-bold truncate mt-0.5">{stop.city}</h4>
                  <p className="text-xs text-neutral-500 truncate hidden sm:block">{stop.duration}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stop Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-0"
            >
              {/* Photo & Highlights */}
              <div className="md:col-span-7 p-6 space-y-4">
                <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-900">
                  <img
                    src={showcaseStops[activeStop].image}
                    alt={showcaseStops[activeStop].city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/80 backdrop-blur-md text-xs flex items-center justify-between text-white border border-white/10">
                    <span className="font-mono">Est. Budget: {showcaseStops[activeStop].budget}</span>
                    <span className="text-neutral-400 font-semibold">{showcaseStops[activeStop].country}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {showcaseStops[activeStop].highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-neutral-900 border border-white/5 text-xs text-neutral-300 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Ledger */}
              <div className="md:col-span-5 bg-neutral-900/30 border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400 uppercase font-bold">Expense Breakdown</span>
                    <span className="text-white font-bold">{showcaseStops[activeStop].totalEstimated}</span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      style={{ width: `${showcaseStops[activeStop].progressPercent}%` }}
                      className="h-full bg-white rounded-full transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-neutral-300">
                    <div className="p-2 rounded-lg bg-neutral-900">
                      <p className="text-neutral-500">Stays</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].stays}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-900">
                      <p className="text-neutral-500">Activities</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].activities}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-neutral-900">
                      <p className="text-neutral-500">Transit</p>
                      <p className="font-bold text-white mt-0.5">{showcaseStops[activeStop].transit}</p>
                    </div>
                  </div>
                </div>

                <Link
                  to={isAuth ? '/trips/create' : '/login'}
                  className="w-full py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-wider text-center transition-colors block"
                >
                  Start Planning
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Destinations Catalog ── */}
      <section id="destinations" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              Destinations
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Popular Cities on Triply
            </h2>
          </div>
          <Link
            to="/cities"
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loadingCities ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl bg-neutral-900 aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(cities.length > 0 ? cities : DEFAULT_CITIES).map((city) => (
              <div
                key={city.id || city._id}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-neutral-900 flex flex-col justify-between aspect-[3/4]"
              >
                <img
                  src={city.image || DEFAULT_CITIES[0].image}
                  alt={city.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                <div className="relative z-10 p-4">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300">
                    {city.country}
                  </span>
                </div>

                <div className="relative z-10 p-4 space-y-2">
                  <h4 className="text-lg font-display font-bold text-white">{city.name}</h4>
                  <p className="text-xs text-neutral-400 line-clamp-2 font-light">{city.description}</p>
                  <Link
                    to={`/trips/create?destination=${encodeURIComponent(city.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1 py-2 px-3 rounded bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-20 max-w-5xl mx-auto px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
            Features
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
            Built for modern itinerary planning
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: 'Multi-City Routing',
              desc: 'Organize multi-stop itineraries with scheduling and transit tracking.',
              icon: Compass,
            },
            {
              title: 'Budget Ledger',
              desc: 'Track expenses with automated currency conversion across destinations.',
              icon: DollarSign,
            },
            {
              title: 'Activities Directory',
              desc: 'Discover verified tours, cultural walks, and excursions worldwide.',
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
              <div
                key={idx}
                className="p-5 rounded-xl bg-neutral-950 border border-white/10 space-y-3"
              >
                <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center border border-white/5">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-display font-bold text-white">{item.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Minimalist Footer ── */}
      <footer className="border-t border-white/10 bg-black py-10">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
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
