import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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
  Layers,
  Lock,
  Eye,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Check,
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuthenticated)

  // Interactive showcase state
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [showcaseCategory, setShowcaseCategory] = useState('all')

  const showcaseStops = [
    {
      city: 'Paris',
      country: 'France',
      days: '4 Days',
      dates: 'Jun 12 – Jun 16',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      tagline: 'Art, Cafés & Seine Sunset Strolls',
      budget: '€1,450',
      highlights: ['Louvre Priority Access', 'Eiffel Tower Night Summit', 'Le Marais Pastry Walk'],
      lat: '48.8566° N',
      lng: '2.3522° E',
    },
    {
      city: 'Rome',
      country: 'Italy',
      days: '5 Days',
      dates: 'Jun 16 – Jun 21',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
      tagline: 'Colosseum, Trastevere & Ancient Ruins',
      budget: '€1,280',
      highlights: ['Vatican Museums & Sistine', 'Trastevere Food Tour', 'Sunset at Pincio Terrace'],
      lat: '41.9028° N',
      lng: '12.4964° E',
    },
    {
      city: 'Zurich',
      country: 'Switzerland',
      days: '5 Days',
      dates: 'Jun 21 – Jun 26',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800',
      tagline: 'Alpine Lakes, Cable Cars & Old Town',
      budget: '€1,820',
      highlights: ['Lake Zurich Boat Cruise', 'Mount Uetliberg Hike', 'Lindt Home of Chocolate'],
      lat: '47.3769° N',
      lng: '8.5417° E',
    },
  ]

  const editorialDestinations = [
    {
      id: '01',
      name: 'Tokyo',
      country: 'Japan',
      theme: 'Hyper-Modern & Ancient Zen',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000',
      season: 'Best in Spring & Autumn',
      estBudget: '₹1,20,000',
      color: 'from-[#18223c] to-[#223883]',
    },
    {
      id: '02',
      name: 'Amalfi Coast',
      country: 'Italy',
      theme: 'Cliffside Villas & Mediterranean Blue',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000',
      season: 'Best in May – September',
      estBudget: '₹1,45,000',
      color: 'from-[#223883] to-[#5b8a83]',
    },
    {
      id: '03',
      name: 'Kyoto',
      country: 'Japan',
      theme: 'Bamboo Groves & Shinto Shrines',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000',
      season: 'Year-Round Culture',
      estBudget: '₹95,000',
      color: 'from-[#5b8a83] to-[#18223c]',
    },
    {
      id: '04',
      name: 'Reykjavik',
      country: 'Iceland',
      theme: 'Glaciers, Waterfalls & Northern Lights',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1000',
      season: 'Best in Winter & Summer',
      estBudget: '₹1,80,000',
      color: 'from-[#18223c] to-[#3b72de]',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7fafc] dark:bg-[#0b1120] text-[#18223c] dark:text-slate-100 font-sans selection:bg-[#3b72de] selection:text-white overflow-x-hidden">
      {/* ── 1. Sticky High-Contrast Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-[#18223c]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo variant="white" size="md" />
          </Link>

          {/* Editorial Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-bold text-slate-300">
            <a href="#showcase" className="hover:text-sky-400 transition-colors">
              Live Canvas
            </a>
            <a href="#features" className="hover:text-sky-400 transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-sky-400 transition-colors">
              Methodology
            </a>
            <a href="#destinations" className="hover:text-sky-400 transition-colors">
              Catalog
            </a>
          </nav>

          {/* Unified High-Converting Single Action Button */}
          <div className="flex items-center gap-4">
            {!isAuth ? (
              <Link
                to="/login"
                className="group relative inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-ocean-500 hover:from-sky-300 hover:to-blue-600 text-[#18223c] hover:text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Sign In / Join Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:scale-105 transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Editorial Magazine Hero Section (Color-Blocked Deep Navy) ── */}
      <section className="relative bg-[#18223c] text-white pt-16 pb-24 lg:pt-24 lg:pb-36 overflow-hidden border-b border-white/10">
        {/* Subtle Geometric Wireframe Grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        
        {/* Deep Ambient Glows */}
        <div className="absolute top-1/4 -right-40 w-96 h-96 rounded-full bg-[#3b72de]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 rounded-full bg-[#5b8a83]/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-16">
          {/* Top Stamp / Issue Marker */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4 text-xs font-mono uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>Issue No. 2026 • Intelligent Travel Operating System</span>
            </div>
            <div>Multi-City Routing • Expense Ledger • Curated Stays</div>
          </div>

          {/* Asymmetric Headline & Editorial Callout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <h1 className="text-5xl sm:text-7xl xl:text-8xl font-display font-black tracking-tight leading-[0.98] text-white">
                Don't just visit.{' '}
                <span className="italic font-serif font-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">
                  Orchestrate
                </span>{' '}
                every mile.
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                Triply unifies multi-stop routing, live currency budgeting, hotel bookings, and
                custom daily itineraries into one synchronized master canvas.
              </p>
            </div>

            {/* High-Converting Floating Action Box */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-300">
                  ⚡ Instant Access Canvas
                </span>
                <h3 className="text-xl font-display font-bold text-white">
                  Ready to map your next journey?
                </h3>
                <p className="text-xs text-slate-300">
                  Free forever for personal itineraries. No credit card required.
                </p>
              </div>

              <Link
                to={isAuth ? '/trips/create' : '/login'}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-600 text-[#18223c] font-black text-sm tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>{isAuth ? 'Create New Trip Canvas' : 'Start Planning Free'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>★ 4.9/5 by 50,000+ travelers</span>
                <span>120+ countries</span>
              </div>
            </div>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/15">
            {[
              { num: 120, suffix: '+', label: 'Countries Mapped' },
              { num: 50, suffix: 'k+', label: 'Active Travelers' },
              { num: 98, suffix: '%', label: 'On-Budget Rate' },
              { num: 1, suffix: ' Click', label: 'Public Itinerary Copy' },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-display font-black text-white">
                  <AnimatedNumber value={stat.num} />
                  <span className="text-sky-400">{stat.suffix}</span>
                </p>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Live Showcase Teaser Section (Curiosity-to-Conversion Engine) ── */}
      <section id="showcase" className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-surface-200 dark:border-surface-800 pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#3b72de] font-bold">
              <Compass className="w-4 h-4 text-[#3b72de]" />
              <span>Interactive Trip Canvas Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-[#18223c] dark:text-white tracking-tight">
              A Living Route Canvas.{' '}
              <span className="text-slate-400 font-normal">Not a static PDF.</span>
            </h2>
          </div>

          {/* Secondary Conversion CTA */}
          <div className="flex items-center gap-3">
            <Link
              to={isAuth ? '/trips/create' : '/login'}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#18223c] dark:bg-white text-white dark:text-[#18223c] font-bold text-xs sm:text-sm shadow-md hover:scale-105 transition-all"
            >
              <span>Build A Route Like This</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── The Master Showcase Console ── */}
        <div className="rounded-3xl bg-white dark:bg-[#111c35] border border-surface-200 dark:border-surface-800 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#18223c] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="font-mono text-xs text-slate-300 ml-2">
                triply.app/public/grand-european-tour-2026
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/trip/public/golden-triangle-adventure-BYB_b0"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-sky-300 transition-colors"
              >
                <span>Live Public Preview</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Interactive Multi-Stop Tabs Bar */}
          <div className="grid grid-cols-3 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStopIndex === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStopIndex(idx)}
                  className={`p-4 sm:p-6 text-left transition-all duration-200 relative border-r last:border-r-0 border-surface-200 dark:border-surface-800 ${
                    isActive
                      ? 'bg-white dark:bg-[#111c35] shadow-sm'
                      : 'hover:bg-white/50 dark:hover:bg-surface-800/50 opacity-70'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-[#3b72de]" />
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#3b72de] font-bold">
                    Stop 0{idx + 1} • {stop.days}
                  </p>
                  <h4 className="text-base sm:text-xl font-display font-bold text-[#18223c] dark:text-white truncate">
                    {stop.city}
                  </h4>
                  <p className="text-xs text-surface-500 truncate hidden sm:block">{stop.dates}</p>
                </button>
              )
            })}
          </div>

          {/* Active Stop Preview with Teaser / Conversion Lock Overlay */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Destination Imagery & Route Story */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-surface-400">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    Coordinates: {showcaseStops[activeStopIndex].lat},{' '}
                    {showcaseStops[activeStopIndex].lng}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-[#18223c] dark:text-white">
                  {showcaseStops[activeStopIndex].city} —{' '}
                  <span className="font-normal italic font-serif text-[#3b72de]">
                    {showcaseStops[activeStopIndex].tagline}
                  </span>
                </h3>
              </div>

              {/* Photo Card with Aspect */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg border border-surface-200 dark:border-surface-700">
                <img
                  src={showcaseStops[activeStopIndex].image}
                  alt={showcaseStops[activeStopIndex].city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs flex items-center justify-between">
                  <span className="font-mono font-bold">Est. City Budget: {showcaseStops[activeStopIndex].budget}</span>
                  <span className="text-[10px] uppercase font-bold text-sky-400">Verified Itinerary</span>
                </div>
              </div>

              {/* Curated Highlights */}
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-wider text-surface-400 font-bold">
                  Scheduled Daily Itinerary Moments:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {showcaseStops[activeStopIndex].highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800/60 border border-surface-200/80 dark:border-surface-700 text-xs font-semibold text-surface-800 dark:text-surface-200 flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-Time Financial Ledger & Teaser Lock CTA */}
            <div className="lg:col-span-5 bg-surface-50 dark:bg-surface-900/80 border-t lg:border-t-0 lg:border-l border-surface-200 dark:border-surface-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-mono uppercase tracking-widest text-[#18223c] dark:text-white font-bold">
                    Multi-Currency Ledger
                  </h4>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                    Auto-Synced (EUR/INR)
                  </span>
                </div>

                {/* Live Expense Progress Ring */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111c35] border border-surface-200 dark:border-surface-700 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-surface-600">Total Route Allocation</span>
                    <span className="font-bold text-[#18223c] dark:text-white font-mono text-sm">
                      €4,550 / €5,000
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
                    <div className="w-[91%] h-full bg-gradient-to-r from-sky-400 via-[#3b72de] to-emerald-500 rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[10px]">
                    <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800">
                      <p className="text-surface-400">Stays</p>
                      <p className="font-bold text-surface-900 dark:text-white">€2,100</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800">
                      <p className="text-surface-400">Activities</p>
                      <p className="font-bold text-surface-900 dark:text-white">€1,350</p>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-50 dark:bg-surface-800">
                      <p className="text-surface-400">Transit</p>
                      <p className="font-bold text-surface-900 dark:text-white">€1,100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔒 The Teaser Lock Box (Converts interest directly into Signup) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#18223c] to-[#223883] text-white space-y-4 shadow-xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 text-sky-300 text-xs font-mono uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Customize This Canvas</span>
                </div>
                <h5 className="text-lg font-display font-bold leading-snug">
                  Want to clone, reorder, and budget your own custom itinerary?
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join Triply in 10 seconds. Import this sample itinerary directly to your account or build
                  a new one from scratch.
                </p>

                <Link
                  to={isAuth ? '/trips/create' : '/login'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-sky-400 hover:bg-sky-300 text-[#18223c] font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  <span>Claim Your Free Canvas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Editorial Capabilities Section (Asymmetric Color-Blocked) ── */}
      <section id="features" className="py-24 bg-[#18223c] text-white border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-sky-400 font-bold">
                Engineered for Modern Voyagers
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white">
                Four Pillars of the Triply Architecture
              </h2>
            </div>
            <div className="lg:col-span-4 text-xs text-slate-300 font-light leading-relaxed">
              We eliminated the chaos of toggling between Google Maps, Excel sheets, and email confirmations.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: '01',
                title: 'Visual Multi-City Routing',
                desc: 'Connect unlimited stops with smart transit time estimates, arrival dates, and interactive Leaflet map rails.',
                badge: 'Drag & Drop Sequencing',
                icon: Compass,
              },
              {
                num: '02',
                title: 'Real-Time Expense Ledger',
                desc: 'Allocate budgets across accommodations, excursions, flights, and meals with instant multi-currency conversions.',
                badge: 'Auto Multi-Currency',
                icon: DollarSign,
              },
              {
                num: '03',
                title: 'Curated Sightseeing Engine',
                desc: 'Access verified activities, secret food walks, museum tickets, and bookable experiences for 100+ cities.',
                badge: '1,000+ City Guides',
                icon: Sparkles,
              },
              {
                num: '04',
                title: '1-Click Share & Selective Copy',
                desc: 'Publish high-resolution public travel magazines with live QR codes. Friends can selectively copy any stop into their trips.',
                badge: 'Social Publishing',
                icon: Share2,
              },
            ].map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-white/10 transition-all duration-300 space-y-6 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-sky-400">{feat.num}</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono uppercase tracking-wider">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-2xl font-display font-bold text-white group-hover:text-sky-300 transition-colors">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">{feat.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Third Conversion Touchpoint */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-[#223883] to-[#5b8a83] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/15">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xl font-display font-bold text-white">Experience Triply on your next journey</h4>
              <p className="text-xs text-slate-200">Start drafting an itinerary in under 60 seconds.</p>
            </div>
            <Link
              to={isAuth ? '/trips/create' : '/login'}
              className="px-7 py-3.5 rounded-full bg-white text-[#18223c] font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex-shrink-0"
            >
              Start Planning Free ➔
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Methodology / How It Works in 3 Fluid Steps ── */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#3b72de] font-bold">
            The Flow
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#18223c] dark:text-white tracking-tight">
            How It Works in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: 'Step 01',
              title: 'Pin Your Destinations',
              desc: 'Select your starting point, waypoints, and destinations. Triply calculates durations and calendar dates.',
              icon: MapPin,
            },
            {
              step: 'Step 02',
              title: 'Curate Daily Schedule',
              desc: 'Slot sightseeing spots, meals, and accommodations into days. View budget rings update as you add items.',
              icon: Calendar,
            },
            {
              step: 'Step 03',
              title: 'Travel & Share',
              desc: 'Access your trip offline or on mobile. Send your public magazine link to friends and travel groups.',
              icon: Globe,
            },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-[#111c35] border border-surface-200 dark:border-surface-800 shadow-soft space-y-5 relative"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#18223c] text-sky-400 flex items-center justify-center shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#3b72de]">
                  {item.step}
                </span>
                <h4 className="text-xl font-display font-bold text-[#18223c] dark:text-white">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-surface-500 leading-relaxed font-light">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 6. Editorial Destination Catalog Spotlight ── */}
      <section id="destinations" className="py-24 bg-surface-100/60 dark:bg-surface-900 border-t border-surface-200/80 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-sunset-500 font-bold">
                Curated Travel Lookbook
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-[#18223c] dark:text-white tracking-tight">
                Trending Itineraries This Season
              </h2>
            </div>
            <Link
              to="/cities"
              className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#3b72de] hover:underline"
            >
              <span>Explore All Catalog Cities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorialDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative rounded-3xl overflow-hidden shadow-lg border border-surface-200 dark:border-surface-800 bg-[#18223c] text-white flex flex-col justify-between aspect-[3/4]"
              >
                {/* Background Image */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18223c] via-[#18223c]/40 to-transparent" />

                {/* Top Badge */}
                <div className="relative z-10 p-5 flex items-center justify-between">
                  <span className="font-mono text-xs text-sky-400 font-bold">{dest.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-mono text-slate-200">
                    {dest.estBudget} est.
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10 p-5 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-sky-300 font-semibold">
                    {dest.country} • {dest.season}
                  </p>
                  <h4 className="text-2xl font-display font-black text-white">{dest.name}</h4>
                  <p className="text-xs text-slate-300 line-clamp-1">{dest.theme}</p>

                  <div className="pt-2">
                    <Link
                      to={`/trips/create?destination=${encodeURIComponent(dest.name)}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white text-[#18223c] font-black text-xs uppercase tracking-wider hover:bg-sky-300 transition-colors shadow-md"
                    >
                      <span>Plan Trip Here</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Massive High-Impact Conversion Banner ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#18223c] via-[#223883] to-[#18223c] text-white p-8 sm:p-16 lg:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-white/10 text-sky-300 text-xs font-mono uppercase tracking-widest font-bold">
              Join 50,000+ Smart Travelers
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-[1.05]">
              Your dream itinerary starts with one click.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl mx-auto">
              Build your routes, organize stays, and share unforgettable adventures with Triply today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuth ? '/dashboard' : '/login'}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 text-[#18223c] font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-all"
              >
                <span>{isAuth ? 'Go to Dashboard' : 'Get Started Free Now'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Magazine Editorial Footer ── */}
      <footer className="border-t border-surface-200/80 dark:border-surface-800 bg-white dark:bg-[#0b1120] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-surface-400 font-mono">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <p>© {new Date().getFullYear()} Triply Inc. The Intelligent Travel Planning Operating System.</p>
          <div className="flex items-center gap-6 font-bold uppercase">
            <Link to="/login" className="hover:text-[#3b72de]">
              Sign In
            </Link>
            <Link to="/cities" className="hover:text-[#3b72de]">
              Destinations
            </Link>
            <Link to="/activities" className="hover:text-[#3b72de]">
              Activities
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
