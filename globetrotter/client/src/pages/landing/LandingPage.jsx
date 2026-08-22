import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import api from '../../services/api.js'

// Curated high-resolution destination data
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

  const [cities, setCities] = useState([])
  const [activeStop, setActiveStop] = useState(0)

  // Real Itinerary Showcase stops
  const showcaseStops = [
    {
      city: 'Paris',
      country: 'France',
      duration: '4 Days',
      dates: 'Day 1 – 4',
      budget: '€1,450',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Louvre Priority Pass', 'Eiffel Tower Sunset', 'Seine River Cruise'],
    },
    {
      city: 'Rome',
      country: 'Italy',
      duration: '5 Days',
      dates: 'Day 5 – 9',
      budget: '€1,280',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Colosseum & Forum', 'Trastevere Food Tour', 'Vatican Museums'],
    },
    {
      city: 'Zurich',
      country: 'Switzerland',
      duration: '5 Days',
      dates: 'Day 10 – 14',
      budget: '€1,820',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200&auto=format&fit=crop&q=80',
      highlights: ['Lake Zurich Steamboat', 'Uetliberg Ridge Hike', 'Old Town Heritage Walk'],
    },
  ]

  // Fetch real cities from database
  useEffect(() => {
    async function loadCities() {
      try {
        const { data } = await api.get('/cities')
        if (data.success && data.cities && data.cities.length > 0) {
          setCities(data.cities.slice(0, 4))
        } else {
          setCities(DEFAULT_CITIES)
        }
      } catch (err) {
        setCities(DEFAULT_CITIES)
      }
    }
    loadCities()
  }, [])

  return (
    <div className="min-h-screen bg-[#0c1222] text-[#f0f8fb] font-sans selection:bg-[#3b72de] selection:text-white">
      {/* ── 1. Sleek, Slim Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-[#0c1222]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo variant="white" size="sm" />
          </Link>

          {/* Simple Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-wider text-[#89c7e2]">
            <a href="#canvas" className="hover:text-white transition-colors">
              Canvas
            </a>
            <a href="#destinations" className="hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
          </nav>

          {/* Clean Login CTA */}
          <div className="flex items-center gap-3">
            {!isAuth ? (
              <Link
                to="/login"
                className="px-5 py-2 rounded-lg bg-[#3b72de] hover:bg-[#2c5ec6] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#3b72de]/20 hover:shadow-lg transition-all"
              >
                Log In
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#3b72de] hover:bg-[#2c5ec6] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Cinematic Hero Section ── */}
      <section className="relative min-h-[80vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-20 border-b border-[#223883]/30 overflow-hidden">
        {/* Background Ambient Video & Gradient Overlay */}
        <div className="absolute inset-0 z-0">
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/70 to-[#0c1222]/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08]"
          >
            Plan Less.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#89c7e2] via-[#3b72de] to-[#d2e9ec]">
              Experience More.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-[#d2e9ec]/85 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Triply brings multi-city routing, multi-currency budgeting, and daily itineraries into one
            effortless, synchronized canvas.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/cities"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-sm shadow-xl shadow-[#3b72de]/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/trip/public/golden-triangle-adventure-BYB_b0"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-sm backdrop-blur-md transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#89c7e2]" />
              <span>View Sample Itinerary</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Interactive Itinerary Canvas Showcase ── */}
      <section id="canvas" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#223883]/40 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
              Featured Itinerary
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Grand European Expedition
            </h2>
          </div>
          <Link
            to={isAuth ? '/trips/create' : '/login'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#89c7e2] hover:text-white transition-colors"
          >
            <span>Create Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Master Showcase Box */}
        <div className="rounded-2xl bg-[#16255b]/50 border border-[#223883] shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Stop Tabs */}
          <div className="grid grid-cols-3 border-b border-[#223883]/80 bg-[#0e172e]">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStop === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStop(idx)}
                  className={`p-4 sm:p-5 text-left transition-all relative border-r last:border-r-0 border-[#223883]/60 ${
                    isActive ? 'bg-[#16255b] text-white' : 'text-[#89c7e2]/70 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#3b72de]" />
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                    Stop 0{idx + 1} • {stop.duration}
                  </p>
                  <h4 className="text-base sm:text-lg font-display font-bold truncate">{stop.city}</h4>
                  <p className="text-xs text-[#d2e9ec]/60 truncate hidden sm:block">{stop.dates}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stop Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Photo & Highlights */}
            <div className="lg:col-span-7 p-5 sm:p-7 space-y-5">
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[#223883]">
                <img
                  src={showcaseStops[activeStop].image}
                  alt={showcaseStops[activeStop].city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-[#0c1222]/80 backdrop-blur-md text-xs flex items-center justify-between text-white border border-white/10">
                  <span className="font-mono">Est. Budget: {showcaseStops[activeStop].budget}</span>
                  <span className="text-[#89c7e2] font-semibold">{showcaseStops[activeStop].country}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-[#89c7e2] font-bold">
                  Highlights:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {showcaseStops[activeStop].highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#0c1222]/60 border border-[#223883] text-xs text-[#d2e9ec] flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#3b72de] flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Ledger Widget */}
            <div className="lg:col-span-5 bg-[#0e172e]/80 border-t lg:border-t-0 lg:border-l border-[#223883] p-5 sm:p-7 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                    Multi-Currency Ledger
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                    EUR / INR
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#16255b]/40 border border-[#223883] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#d2e9ec]/70">Total Spend</span>
                    <span className="font-bold text-white">€4,550 / €5,000</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0c1222] overflow-hidden">
                    <div className="w-[91%] h-full bg-gradient-to-r from-[#89c7e2] to-[#3b72de] rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-[#d2e9ec]">
                    <div className="p-2 rounded-lg bg-[#0c1222]/80">
                      <p className="text-[#89c7e2]">Stays</p>
                      <p className="font-bold text-white">€2,100</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0c1222]/80">
                      <p className="text-[#89c7e2]">Activities</p>
                      <p className="font-bold text-white">€1,350</p>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0c1222]/80">
                      <p className="text-[#89c7e2]">Transit</p>
                      <p className="font-bold text-white">€1,100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Box */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-[#1e3070] to-[#223883] border border-[#3b72de]/40 space-y-3 text-white">
                <h4 className="text-sm font-display font-bold">Build Your Custom Itinerary</h4>
                <p className="text-xs text-[#d2e9ec]/80 leading-relaxed font-light">
                  Sign in to create, reorder, and budget your own multi-city travel routes.
                </p>
                <Link
                  to={isAuth ? '/trips/create' : '/login'}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Destination Catalog Showcase ── */}
      <section id="destinations" className="py-20 bg-[#0e172e] border-t border-b border-[#223883]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
                Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Popular Cities on Triply
              </h2>
            </div>
            <Link
              to="/cities"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#89c7e2] hover:text-white transition-colors"
            >
              <span>View All Cities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Grid of Real Cities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(cities.length > 0 ? cities : DEFAULT_CITIES).map((city) => (
              <div
                key={city.id || city._id}
                className="group relative rounded-2xl overflow-hidden border border-[#223883] bg-[#16255b]/40 flex flex-col justify-between aspect-[3/4] shadow-lg"
              >
                <img
                  src={city.image || DEFAULT_CITIES[0].image}
                  alt={city.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1222] via-[#0c1222]/30 to-transparent" />

                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0c1222]/80 backdrop-blur-md text-[10px] font-mono text-[#89c7e2]">
                    {city.country}
                  </span>
                </div>

                <div className="relative z-10 p-4 space-y-2">
                  <h4 className="text-xl font-display font-bold text-white">{city.name}</h4>
                  <p className="text-xs text-[#d2e9ec]/70 line-clamp-2">{city.description}</p>
                  <div className="pt-1">
                    <Link
                      to={`/trips/create?destination=${encodeURIComponent(city.name)}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-xs transition-colors shadow-sm"
                    >
                      <span>Plan Trip Here</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Features Grid ── */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#89c7e2] font-bold">
            Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Built for seamless travel planning
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#16255b]/40 border border-[#223883] hover:border-[#3b72de] transition-all space-y-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#223883] text-[#89c7e2] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-display font-bold text-white">{item.title}</h4>
                <p className="text-xs text-[#d2e9ec]/70 leading-relaxed font-light">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 6. Simple Bottom Banner ── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#1e3070] via-[#223883] to-[#1e3070] border border-[#3b72de]/40 p-8 sm:p-12 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Ready to plan your next trip?
          </h2>
          <p className="text-xs sm:text-sm text-[#d2e9ec]/80 max-w-md mx-auto font-light">
            Build your routes, organize stays, and explore the world with Triply.
          </p>
          <div className="pt-1">
            <Link
              to={isAuth ? '/dashboard' : '/login'}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-white hover:bg-[#d2e9ec] text-[#1e3070] font-bold text-xs sm:text-sm shadow-xl hover:scale-105 transition-all"
            >
              <span>{isAuth ? 'Go to Dashboard' : 'Sign In to Triply'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Clean Minimal Footer ── */}
      <footer className="border-t border-[#223883]/40 bg-[#080d19] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#89c7e2]/70 font-mono">
          <div className="flex items-center gap-2">
            <Logo variant="white" size="sm" />
          </div>
          <p>© {new Date().getFullYear()} Triply. All rights reserved.</p>
          <div className="flex items-center gap-5 font-medium uppercase">
            <Link to="/login" className="hover:text-white">
              Log In
            </Link>
            <Link to="/cities" className="hover:text-white">
              Cities
            </Link>
            <Link to="/activities" className="hover:text-white">
              Activities
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
