import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  Lock,
  ArrowUpRight,
  Clock,
  Check,
  Eye,
} from 'lucide-react'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'
import Logo from '../../components/ui/Logo.jsx'
import AnimatedNumber from '../../components/ui/AnimatedNumber.jsx'

export default function LandingPage() {
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuthenticated)

  // Interactive showcase state
  const [activeStopIndex, setActiveStopIndex] = useState(0)

  const showcaseStops = [
    {
      city: 'Paris',
      country: 'France',
      days: '4 Days',
      dates: 'June 12 – 16',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
      tagline: 'Gothic Cathedrals, Seine Sunsets & Secret Wine Cellars',
      budget: '€1,450',
      lat: '48.8566° N',
      lng: '2.3522° E',
      moments: ['Sunrise at Trocadéro', 'Montmartre Secret Bakery Trail', 'Louvre Private Evening Pass'],
    },
    {
      city: 'Rome',
      country: 'Italy',
      days: '5 Days',
      dates: 'June 16 – 21',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200',
      tagline: 'Centuries of Stone, Espresso Bars & Candlelit Piazzas',
      budget: '€1,280',
      lat: '41.9028° N',
      lng: '12.4964° E',
      moments: ['Night Colosseum Exploration', 'Trastevere Handmade Pasta Class', 'Pincio Terrace Sunset'],
    },
    {
      city: 'Zurich',
      country: 'Switzerland',
      days: '5 Days',
      dates: 'June 21 – 26',
      image: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=1200',
      tagline: 'Glacial Waters, Old Town Clock Towers & Alpine Vistas',
      budget: '€1,820',
      lat: '47.3769° N',
      lng: '8.5417° E',
      moments: ['Uetliberg Panoramic Ridge Trail', 'Lake Zurich Steamboat Passage', 'Swiss Chocolatier Workshop'],
    },
  ]

  const editorialDestinations = [
    {
      id: 'VOL. 01',
      name: 'Kyoto',
      country: 'Japan',
      curation: 'Bamboo Groves, Wooden Machiya & Ancient Shinto Shrines',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
      season: 'Spring / Autumn',
      estBudget: '₹95,000',
      heroSpan: 'lg:col-span-7',
    },
    {
      id: 'VOL. 02',
      name: 'Amalfi Coast',
      country: 'Italy',
      curation: 'Pastel Cliffside Villages & Tyrrhenian Sea Horizons',
      image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200',
      season: 'May – September',
      estBudget: '₹1,40,000',
      heroSpan: 'lg:col-span-5',
    },
    {
      id: 'VOL. 03',
      name: 'Reykjavik & The Highlands',
      country: 'Iceland',
      curation: 'Black Sand Beaches, Volcanic Glaciers & Aurora Skies',
      image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=1200',
      season: 'Year-Round Expeditions',
      estBudget: '₹1,75,000',
      heroSpan: 'lg:col-span-5',
    },
    {
      id: 'VOL. 04',
      name: 'Tokyo',
      country: 'Japan',
      curation: 'Neon Labyrinths, Michelin Alleyways & Futuristic Architecture',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200',
      season: 'Autumn / Winter',
      estBudget: '₹1,20,000',
      heroSpan: 'lg:col-span-7',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b0e14] text-[#f5f2eb] font-sans selection:bg-[#e05a38] selection:text-white overflow-x-hidden">
      {/* ── 1. Top Editorial Masthead & Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full bg-[#0b0e14]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Masthead Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <Logo variant="white" size="md" />
            <span className="hidden sm:inline-block pl-3 border-l border-white/20 text-[10px] font-mono tracking-widest text-[#b8b19f] uppercase">
              Travel Planning OS
            </span>
          </Link>

          {/* Editorial Section Jump Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-widest text-[#b8b19f]">
            <a href="#showcase" className="hover:text-white transition-colors">
              01 / Itinerary Canvas
            </a>
            <a href="#architecture" className="hover:text-white transition-colors">
              02 / Architecture
            </a>
            <a href="#destinations" className="hover:text-white transition-colors">
              03 / Lookbook
            </a>
            <a href="#method" className="hover:text-white transition-colors">
              04 / Method
            </a>
          </nav>

          {/* Unified High-Contrast Action Button */}
          <div className="flex items-center gap-4">
            {!isAuth ? (
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#e05a38] hover:bg-[#f06e4b] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#e05a38]/30 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Sign In / Join Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-[#0b0e14] font-extrabold text-xs sm:text-sm tracking-wide shadow-lg hover:bg-[#f5f2eb] hover:scale-105 transition-all"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. Full-Bleed Cinematic Photo Hero Section ── */}
      <section className="relative min-h-[90vh] flex flex-col justify-between p-6 sm:p-10 lg:p-16 border-b border-white/10 overflow-hidden">
        {/* Full-Bleed Background Photography with Dramatic Lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=2000"
            alt="Majestic mountain valley with golden hour light"
            className="w-full h-full object-cover opacity-45 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/50 to-[#0b0e14]/30" />
        </div>

        {/* Top Header Tagline */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4 text-xs font-mono uppercase tracking-widest text-[#b8b19f]">
          <div className="flex items-center gap-2 text-[#e05a38]">
            <span className="w-2 h-2 rounded-full bg-[#e05a38] animate-pulse" />
            <span>Vol. 2026 • The Modern Travel Canvas</span>
          </div>
          <div>Multi-City Routing • Multi-Currency Ledger • Public Magazines</div>
        </div>

        {/* Central Asymmetric Typography & Story */}
        <div className="relative z-10 py-16 lg:py-24 max-w-5xl space-y-8">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-black tracking-tight leading-[0.95] text-[#f5f2eb]">
            The world is not a spreadsheet.{' '}
            <span className="italic font-serif font-normal text-[#f06e4b]">
              Map it like a story.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-[#b8b19f] max-w-2xl font-light leading-relaxed">
            Triply replaces disconnected browser tabs and notes with a single, living itinerary canvas
            that tracks routes, budgets, and moments across continents.
          </p>

          {/* Primary Action Button Bar with Integrated Social Proof */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
            <Link
              to={isAuth ? '/trips/create' : '/login'}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#e05a38] hover:bg-[#f06e4b] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-[#e05a38]/40 hover:scale-105 active:scale-95 transition-all"
            >
              <span>{isAuth ? 'Create New Trip Canvas' : 'Start Planning Free'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/trip/public/golden-triangle-adventure-BYB_b0"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono uppercase tracking-wider text-[#f5f2eb] hover:text-[#e05a38] transition-colors border-b border-white/30 hover:border-[#e05a38] pb-1 w-fit"
            >
              <span>Explore Sample Itinerary</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Bottom Editorial Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/15">
          {[
            { num: 120, suffix: '+', label: 'Countries Documented' },
            { num: 50, suffix: 'k+', label: 'Active Voyagers' },
            { num: 98, suffix: '%', label: 'On-Budget Success' },
            { num: 1, suffix: ' Click', label: 'Public Trip Duplicate' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-0.5">
              <p className="text-2xl sm:text-4xl font-display font-black text-[#f5f2eb]">
                <AnimatedNumber value={item.num} />
                <span className="text-[#e05a38]">{item.suffix}</span>
              </p>
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#b8b19f]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. The "Living Canvas" Master Itinerary Showcase (Curiosity-to-Conversion) ── */}
      <section id="showcase" className="py-24 lg:py-36 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#e05a38] font-bold">
              Living Itinerary Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#f5f2eb] tracking-tight">
              A synchronized canvas for multi-city voyages.
            </h2>
          </div>

          <Link
            to={isAuth ? '/trips/create' : '/login'}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#f5f2eb] text-xs font-mono uppercase tracking-widest transition-all w-fit"
          >
            <span>Draft Your Itinerary</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Magazine-Grade Interactive Console ── */}
        <div className="rounded-[2.5rem] bg-[#121722] border border-white/10 shadow-2xl overflow-hidden">
          {/* Header Bar */}
          <div className="bg-[#0b0e14] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e05a38]" />
              <span className="font-mono text-xs text-[#b8b19f]">
                triply.app/public/grand-european-expedition-2026
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#b8b19f]">
              <span>14 Days</span>
              <span>•</span>
              <span>3 Cities</span>
              <span>•</span>
              <span className="text-emerald-400">€4,550 Total Est.</span>
            </div>
          </div>

          {/* Interactive Stop Switcher Strip */}
          <div className="grid grid-cols-3 border-b border-white/10 bg-[#0e121b]">
            {showcaseStops.map((stop, idx) => {
              const isActive = activeStopIndex === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStopIndex(idx)}
                  className={`p-4 sm:p-7 text-left transition-all duration-300 relative border-r last:border-r-0 border-white/10 ${
                    isActive ? 'bg-[#121722] opacity-100' : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#e05a38]" />
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#e05a38] font-bold">
                    Stop 0{idx + 1} • {stop.days}
                  </p>
                  <h4 className="text-lg sm:text-2xl font-display font-black text-[#f5f2eb]">
                    {stop.city}
                  </h4>
                  <p className="text-xs font-mono text-[#b8b19f] hidden sm:block">{stop.dates}</p>
                </button>
              )
            })}
          </div>

          {/* Stop Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Full Photo Story */}
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#b8b19f]">
                  <MapPin className="w-3.5 h-3.5 text-[#e05a38]" />
                  <span>
                    {showcaseStops[activeStopIndex].lat}, {showcaseStops[activeStopIndex].lng}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-[#f5f2eb]">
                  {showcaseStops[activeStopIndex].city} —{' '}
                  <span className="font-serif font-normal italic text-[#e05a38]">
                    {showcaseStops[activeStopIndex].tagline}
                  </span>
                </h3>
              </div>

              {/* Large Format Photo */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src={showcaseStops[activeStopIndex].image}
                  alt={showcaseStops[activeStopIndex].city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0b0e14]/80 backdrop-blur-md text-xs font-mono text-[#f5f2eb] flex items-center justify-between border border-white/10">
                  <span>City Budget: {showcaseStops[activeStopIndex].budget}</span>
                  <span className="text-[#e05a38] font-bold">Documented Itinerary</span>
                </div>
              </div>

              {/* Scheduled Moments */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#b8b19f] font-bold">
                  Curated Day Highlights:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {showcaseStops[activeStopIndex].moments.map((moment, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#0e121b] border border-white/10 text-xs text-[#f5f2eb] flex items-start gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#e05a38] flex-shrink-0 mt-0.5" />
                      <span className="font-light">{moment}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Multi-Currency Ledger & Conversion Teaser Box */}
            <div className="lg:col-span-5 bg-[#0e121b] border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#f5f2eb] font-bold">
                    Multi-Currency Ledger
                  </span>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    Auto-Synced EUR/INR
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#b8b19f]">Total Allocation</span>
                    <span className="font-bold text-white text-base">€4,550 / €5,000</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#0b0e14] overflow-hidden">
                    <div className="w-[91%] h-full bg-[#e05a38] rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-white/5">
                      <p className="text-[#b8b19f]">Stays</p>
                      <p className="font-bold text-white mt-0.5">€2,100</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-white/5">
                      <p className="text-[#b8b19f]">Activities</p>
                      <p className="font-bold text-white mt-0.5">€1,350</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0b0e14] border border-white/5">
                      <p className="text-[#b8b19f]">Transit</p>
                      <p className="font-bold text-white mt-0.5">€1,100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔒 The Teaser Lock Box (Direct Conversion Drive) */}
              <div className="p-7 rounded-2xl bg-[#151b27] border border-white/15 space-y-4 relative overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 text-[#e05a38] text-xs font-mono uppercase tracking-widest font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Build Your Own Route</span>
                </div>
                <h4 className="text-xl font-display font-bold text-white leading-snug">
                  Clone this itinerary or build an original canvas in seconds.
                </h4>
                <p className="text-xs text-[#b8b19f] leading-relaxed font-light">
                  Join Triply today. Keep all your stops, activities, budgets, and dates unified in one
                  canvas.
                </p>

                <Link
                  to={isAuth ? '/trips/create' : '/login'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#e05a38] hover:bg-[#f06e4b] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  <span>Claim Your Free Canvas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. The Four Pillars of Architecture Section ── */}
      <section id="architecture" className="py-24 lg:py-36 bg-[#0e121b] border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/10 pb-8">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#e05a38] font-bold">
                Triply Architecture
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#f5f2eb] tracking-tight">
                Designed for complex, multi-stop itineraries.
              </h2>
            </div>
            <p className="lg:col-span-4 text-xs font-mono text-[#b8b19f] leading-relaxed">
              No more fragmented spreadsheets, screenshot folders, or scattered confirmation emails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: '01',
                title: 'Multi-City Route Sequencer',
                desc: 'Connect unlimited stops with smart transit durations, arrival dates, and interactive Leaflet map rails.',
                tag: 'Route Sequencing',
              },
              {
                num: '02',
                title: 'Real-Time Financial Ledger',
                desc: 'Allocate spending across hotels, dining, flights, and excursions with automated multi-currency conversion.',
                tag: 'Expense Control',
              },
              {
                num: '03',
                title: 'Curated Sights & Stays Catalog',
                desc: 'Access verified activities, hidden food walks, museum passes, and hotel bookings across 100+ cities.',
                tag: 'Curated Library',
              },
              {
                num: '04',
                title: '1-Click Social Magazine Sharing',
                desc: 'Publish high-resolution public itineraries with live QR codes. Friends can selectively copy any stop into their trips.',
                tag: 'Publishing',
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-8 sm:p-10 rounded-3xl bg-[#121722] border border-white/10 hover:border-[#e05a38] transition-all duration-300 space-y-6 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-4xl font-black text-[#e05a38]">{pillar.num}</span>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-mono uppercase tracking-wider text-[#b8b19f]">
                    {pillar.tag}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-display font-bold text-white group-hover:text-[#f06e4b] transition-colors">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-[#b8b19f] leading-relaxed font-light">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Third Action Touchpoint */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#151b27] border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xl font-display font-bold text-white">Experience Triply on your next journey</h4>
              <p className="text-xs text-[#b8b19f]">Start drafting an itinerary in under 60 seconds.</p>
            </div>
            <Link
              to={isAuth ? '/trips/create' : '/login'}
              className="px-8 py-4 rounded-full bg-[#e05a38] hover:bg-[#f06e4b] text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex-shrink-0"
            >
              Start Planning Free ➔
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Editorial Lookbook (Double-Page Magazine Spread Layout) ── */}
      <section id="destinations" className="py-24 lg:py-36 max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#e05a38] font-bold">
              Editorial Destination Lookbook
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-[#f5f2eb] tracking-tight">
              Curated Itinerary Inspirations
            </h2>
          </div>
          <Link
            to="/cities"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#b8b19f] hover:text-[#e05a38] transition-colors"
          >
            <span>View All Catalog Cities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Magazine Spread Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {editorialDestinations.map((item) => (
            <div
              key={item.id}
              className={`${item.heroSpan} group relative rounded-3xl overflow-hidden border border-white/10 bg-[#121722] min-h-[420px] lg:min-h-[500px] flex flex-col justify-between p-7 sm:p-10 shadow-2xl`}
            >
              {/* Full-bleed Photo Background */}
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/40 to-transparent" />

              {/* Top Tag & Budget */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#f06e4b] font-bold">
                  {item.id}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold">
                  {item.estBudget} est.
                </span>
              </div>

              {/* Bottom Details & Action */}
              <div className="relative z-10 space-y-3">
                <p className="text-xs font-mono uppercase tracking-widest text-[#b8b19f]">
                  {item.country} • {item.season}
                </p>
                <h4 className="text-3xl sm:text-4xl font-display font-black text-white">{item.name}</h4>
                <p className="text-xs sm:text-sm text-slate-300 font-light max-w-lg">{item.curation}</p>

                <div className="pt-2">
                  <Link
                    to={`/trips/create?destination=${encodeURIComponent(item.name)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#e05a38] text-[#0b0e14] hover:text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all duration-200"
                  >
                    <span>Plan Trip Here</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Full-Bleed High-Impact Conversion Banner ── */}
      <section className="py-24 lg:py-36 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="rounded-[3rem] bg-[#121722] border border-white/15 p-10 sm:p-16 lg:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#e05a38]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#e05a38] font-bold">
              Join 50,000+ Voyagers
            </span>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.02]">
              Your dream itinerary starts with one click.
            </h2>
            <p className="text-base sm:text-lg text-[#b8b19f] font-light max-w-xl mx-auto">
              Build your routes, organize stays, and share unforgettable adventures with Triply today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={isAuth ? '/dashboard' : '/login'}
                className="w-full sm:w-auto px-10 py-5 rounded-full bg-[#e05a38] hover:bg-[#f06e4b] text-white font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition-all"
              >
                <span>{isAuth ? 'Go to Dashboard' : 'Get Started Free Now'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Editorial Masthead Footer ── */}
      <footer className="border-t border-white/10 bg-[#080a0f] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#b8b19f] font-mono">
          <div className="flex items-center gap-2">
            <Logo variant="white" size="sm" />
          </div>
          <p>© {new Date().getFullYear()} Triply Inc. The Intelligent Travel Planning Operating System.</p>
          <div className="flex items-center gap-6 font-bold uppercase">
            <Link to="/login" className="hover:text-[#e05a38]">
              Sign In
            </Link>
            <Link to="/cities" className="hover:text-[#e05a38]">
              Destinations
            </Link>
            <Link to="/activities" className="hover:text-[#e05a38]">
              Activities
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
