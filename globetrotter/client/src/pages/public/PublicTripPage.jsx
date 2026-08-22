import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, useScroll } from 'framer-motion'
import {
  Globe,
  Compass,
  ArrowRight,
  Sparkles,
  LogIn,
  UserPlus,
  Share2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'

import PublicTripHero from './PublicTripHero.jsx'
import TripSummary from './TripSummary.jsx'
import ItineraryTimeline from './ItineraryTimeline.jsx'
import TripMapRail from './TripMapRail.jsx'
import SelectiveCopyModal from './SelectiveCopyModal.jsx'
import StickyMobileCopyBar from './StickyMobileCopyBar.jsx'
import SkeletonBlock from '../../components/ui/SkeletonBlock.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'
import { fireTripCopiedConfetti } from '../../components/ui/Confetti.js'

export default function PublicTripPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = useSelector(selectIsAuthenticated)

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCopying, setIsCopying] = useState(false)
  const [isSelectiveModalOpen, setIsSelectiveModalOpen] = useState(false)
  const [activeStopId, setActiveStopId] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  // Track window scroll for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch public trip details
  const fetchPublicTrip = async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await api.get(`/public/trip/${slug}`)
      if (data.success && data.trip) {
        setTrip(data.trip)
        if (data.trip.stops?.length > 0) {
          setActiveStopId(data.trip.stops[0].id || data.trip.stops[0]._id)
        }
      } else {
        setError('Public trip not found or is private.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load public itinerary.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      fetchPublicTrip()
    }
  }, [slug])

  // Handle selective copy confirm
  const handleConfirmCopy = async (selectedStopIds) => {
    if (!isAuth) {
      toast.error('Please log in or create an account to copy this itinerary!')
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsCopying(true)
      const { data } = await api.post(`/public/trip/${slug}/copy`, {
        selectedStopIds,
      })

      if (data.success && data.trip) {
        setIsSelectiveModalOpen(false)
        fireTripCopiedConfetti()
        toast.success(`🎉 "${data.trip.name}" imported to your account!`)
        navigate(`/trips/${data.trip.id || data.trip._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to copy trip')
    } finally {
      setIsCopying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        <SkeletonBlock className="w-full h-[400px] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <SkeletonBlock className="w-full h-24 rounded-2xl" />
            <SkeletonBlock className="w-full h-64 rounded-2xl" />
          </div>
          <SkeletonBlock className="w-full h-80 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-soft text-center space-y-4">
          <ErrorState
            message={error || 'This itinerary is either private or does not exist.'}
            onRetry={fetchPublicTrip}
          />
          <Link
            to="/cities"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-ocean-600 text-white font-medium text-xs sm:text-sm shadow-md"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Other Destinations</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-20 sm:pb-12">
      {/* Sticky Frosted Glass Public Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/75 dark:bg-surface-900/75 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ocean-600 to-sage-500 text-white flex items-center justify-center shadow-md shadow-ocean-600/20 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-lg text-surface-900 dark:text-white tracking-tight">
              GlobeTrotter
            </span>
          </Link>

          {!isAuth ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                state={{ from: location }}
                className="btn btn-ghost btn-sm text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Log In</span>
              </Link>
              <Link
                to="/register"
                state={{ from: location }}
                className="btn btn-ocean btn-sm text-xs font-semibold shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                <span>Sign Up Free</span>
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="btn btn-sage btn-sm text-xs font-semibold shadow-sm"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* 1. Full-Bleed Parallax Hero */}
        <PublicTripHero
          trip={trip}
          scrollY={scrollY}
          onCopyTrip={() => setIsSelectiveModalOpen(true)}
          isCopying={isCopying}
        />

        {/* 2. Quick Facts Summary Strip */}
        <TripSummary trip={trip} />

        {/* 3. 2-Column Itinerary & Sticky Leaflet Map Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Self-Drawing Itinerary Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border-b border-surface-200 dark:border-surface-800 pb-3">
              <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">
                Detailed Daily Itinerary
              </h3>
              <p className="text-xs text-surface-500">
                Explore destinations, booked accommodations, and scheduled sightseeing activities
              </p>
            </div>

            <ItineraryTimeline
              stops={trip.stops}
              currency={trip.currency}
              onStopInView={(stopId) => setActiveStopId(stopId)}
            />
          </div>

          {/* Right: Sticky Leaflet Map Rail (Desktop) */}
          <div className="hidden lg:block lg:col-span-5">
            <TripMapRail stops={trip.stops} activeStopId={activeStopId} />
          </div>
        </div>
      </main>

      {/* Selective Copy Modal */}
      <SelectiveCopyModal
        trip={trip}
        isOpen={isSelectiveModalOpen}
        onClose={() => setIsSelectiveModalOpen(false)}
        onConfirmCopy={handleConfirmCopy}
        isCopying={isCopying}
      />

      {/* Mobile Sticky Copy CTA Bar */}
      <StickyMobileCopyBar
        trip={trip}
        onCopyClick={() => setIsSelectiveModalOpen(true)}
        isCopying={isCopying}
      />
    </div>
  )
}
