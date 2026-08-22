import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Share2,
  Globe,
  Heart,
  Star,
  Users,
  ShieldCheck,
  Plane,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import Button from '../../components/ui/Button.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuthenticated)

  const [activeFeatureTab, setActiveFeatureTab] = useState('route')

  const sampleDestinations = [
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600',
      tag: 'Futuristic & Culture',
      rating: '4.9',
    },
    {
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
      tag: 'Art & Romance',
      rating: '4.8',
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600',
      tag: 'Tropical Escape',
      rating: '4.9',
    },
    {
      name: 'Rome',
      country: 'Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600',
      tag: 'Ancient History',
      rating: '4.9',
    },
  ]

  const features = [
    {
      id: 'route',
      title: 'Interactive Multi-Stop Routing',
      desc: 'Connect cities, schedule arrival dates, and visually track your travel line across interactive maps.',
      icon: Compass,
      color: 'bg-ocean-50 text-ocean-600 dark:bg-ocean-950 dark:text-ocean-400',
    },
    {
      id: 'budget',
      title: 'Real-Time Multi-Currency Budgeting',
      desc: 'Automatic budget allocation for stays, dining, flights, and activities with currency auto-conversion.',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    },
    {
      id: 'catalog',
      title: 'Curated Activities & Stays Engine',
      desc: 'Browse thousands of curated sightseeing tours, adventure excursions, and hotel bookings in one click.',
      icon: Sparkles,
      color: 'bg-sunset-50 text-sunset-600 dark:bg-sunset-950 dark:text-sunset-400',
    },
    {
      id: 'share',
      title: '1-Click Public Itinerary Sharing',
      desc: 'Publish magazine-grade itinerary pages for your friends to view, scan via QR code, and duplicate.',
      icon: Share2,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-surface-950 text-surface-900 dark:text-white selection:bg-ocean-500 selection:text-white font-sans">
      {/* ── 1. Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200/70 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-surface-600 dark:text-surface-300">
            <a href="#features" className="hover:text-ocean-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-ocean-600 transition-colors">
              How It Works
            </a>
            <a href="#destinations" className="hover:text-ocean-600 transition-colors">
              Destinations
            </a>
            <a href="#testimonials" className="hover:text-ocean-600 transition-colors">
              Reviews
            </a>
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {!isAuth ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-surface-700 dark:text-surface-200 hover:text-ocean-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#18223c] hover:bg-[#223058] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Get Started Free
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 rounded-2xl bg-ocean-600 hover:bg-ocean-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Background Gradients & Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-ocean-100/60 via-sage-100/30 to-transparent dark:from-ocean-950/40 dark:via-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ocean-50 dark:bg-ocean-950/60 border border-ocean-200/80 dark:border-ocean-800 text-ocean-700 dark:text-ocean-300 text-xs font-bold shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-ocean-500" />
              <span>Next-Gen Travel Planning Engine</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-display font-extrabold text-[#18223c] dark:text-white tracking-tight leading-[1.12]"
            >
              Plan Less. Travel More with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-600 via-sky-500 to-sage-500">
                Triply.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed"
            >
              Build multi-city routes, customize daily activities, monitor expenses in real-time,
              and share gorgeous itineraries with one click.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Link
                to={isAuth ? '/trips/create' : '/register'}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#18223c] hover:bg-[#223058] text-white text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/trip/public/golden-triangle-adventure-BYB_b0"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white dark:bg-surface-800 hover:bg-surface-50 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 text-sm sm:text-base font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-ocean-600" />
                <span>Explore Sample Public Itinerary</span>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-surface-500"
            >
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <strong>4.9/5</strong> Rating by 50,000+ Travelers
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Forever Plan Available
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-ocean-500" /> Enterprise-Grade Security
              </span>
            </motion.div>
          </div>

          {/* ── Hero Live Interactive Card Preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-5xl mx-auto rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-2xl p-4 sm:p-7 overflow-hidden space-y-6"
          >
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-bold text-surface-400 font-mono">
                  triply.app/trips/grand-european-tour
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                ● Live Trip Active
              </span>
            </div>

            {/* Trip Preview Hero Strip */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-600 dark:text-ocean-400 uppercase tracking-wider">
                  <Plane className="w-3.5 h-3.5" />
                  <span>3 Cities • 14 Days Itinerary</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
                  Grand European Summer Expedition
                </h3>
                <p className="text-xs sm:text-sm text-surface-500">
                  Paris ➔ Rome ➔ Zurich with daily museum tours, mountain cable cars, and curated dining.
                </p>

                {/* Live Route Flow */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {['Paris (4d)', 'Rome (5d)', 'Zurich (5d)'].map((city, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-sunset-500" />
                      <span>{city}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Widget Preview */}
              <div className="md:col-span-5 p-5 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/80 dark:border-surface-700 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-surface-700 dark:text-surface-300">Live Budget Tracker</span>
                  <span className="font-bold text-ocean-600">₹1,24,500 / ₹1,50,000</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div className="w-[83%] h-full rounded-full bg-gradient-to-r from-ocean-500 to-sage-500" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-surface-500 text-center">
                  <div className="p-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-100">
                    <p className="font-bold text-surface-900 dark:text-white">₹52k</p>
                    <p className="text-[9px]">Stays</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-100">
                    <p className="font-bold text-surface-900 dark:text-white">₹38k</p>
                    <p className="text-[9px]">Activities</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-surface-900 border border-surface-100">
                    <p className="font-bold text-surface-900 dark:text-white">₹34.5k</p>
                    <p className="text-[9px]">Flights</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. Features Section ── */}
      <section id="features" className="py-20 bg-white dark:bg-surface-900 border-t border-b border-surface-200/80 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-ocean-600">Supercharged Toolkit</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white">
              Everything you need for stress-free travel
            </h2>
            <p className="text-sm text-surface-500">
              Triply replaces messy spreadsheets, scattered notes, and bookmarks with one cohesive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className="p-6 rounded-3xl bg-surface-50 dark:bg-surface-800/50 border border-surface-200/80 dark:border-surface-700 hover:border-ocean-300 dark:hover:border-ocean-700 transition-all duration-200 space-y-4 hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-display font-bold text-surface-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-surface-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 4. How It Works ── */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-sage-600">Simple & Fast</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white">
            Plan your next getaway in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: '01',
              title: 'Select Cities & Travel Dates',
              desc: 'Choose from hundreds of global cities or type any custom destination to automatically compute duration.',
            },
            {
              num: '02',
              title: 'Curate Stays & Activities',
              desc: 'Add sights, restaurants, and tours into daily schedules with timing and price estimates.',
            },
            {
              num: '03',
              title: 'Track Budget & Share',
              desc: 'Keep spending on target and share your interactive trip link with travel companions or friends.',
            },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-4 relative"
            >
              <span className="text-3xl font-display font-extrabold text-ocean-600 dark:text-ocean-400">
                {step.num}
              </span>
              <h4 className="text-lg font-bold text-surface-900 dark:text-white">{step.title}</h4>
              <p className="text-xs sm:text-sm text-surface-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. Trending Destinations ── */}
      <section id="destinations" className="py-20 bg-white dark:bg-surface-900 border-t border-surface-200/80 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sunset-500">Inspiration</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 dark:text-white">
                Trending Destinations on Triply
              </h2>
            </div>
            <Link
              to="/cities"
              className="inline-flex items-center gap-1 text-sm font-bold text-ocean-600 hover:underline"
            >
              <span>View all catalog cities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleDestinations.map((dest, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl border border-surface-200/90 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-soft"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-100 relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-surface-900 flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span>{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h5 className="font-display font-bold text-lg">{dest.name}</h5>
                    <p className="text-xs text-surface-200">{dest.country} • {dest.tag}</p>
                  </div>
                </div>
                <div className="p-3">
                  <Link
                    to={`/trips/create?destination=${encodeURIComponent(dest.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-ocean-50 text-surface-800 dark:text-surface-200 hover:text-ocean-700 font-semibold text-xs transition-colors"
                  >
                    <span>Plan Trip Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Bottom CTA Banner ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-[#18223c] text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-ocean-500/20 rounded-full blur-3xl -z-0" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight">
              Ready for your next adventure?
            </h2>
            <p className="text-sm sm:text-base text-surface-300">
              Join thousands of smart travelers planning and organizing unforgettable itineraries with Triply.
            </p>
            <div className="pt-2">
              <Link
                to={isAuth ? '/dashboard' : '/register'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#18223c] font-extrabold text-sm sm:text-base shadow-xl hover:bg-surface-100 hover:scale-105 transition-all"
              >
                <span>{isAuth ? 'Go to Dashboard' : 'Get Started Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer className="border-t border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <p className="text-xs text-surface-400">
            © {new Date().getFullYear()} Triply Inc. All rights reserved. Made for passionate travelers.
          </p>
        </div>
      </footer>
    </div>
  )
}
