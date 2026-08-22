import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Globe, ArrowLeft, LogIn, UserPlus, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { selectIsAuthenticated } from '../../store/slices/authSlice.js'

import PublicTripHero from './PublicTripHero.jsx'
import TripSummary from './TripSummary.jsx'
import ItineraryTimeline from './ItineraryTimeline.jsx'
import LoadingPage from '../../components/ui/LoadingPage.jsx'

export default function PublicTripPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = useSelector(selectIsAuthenticated)

  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCopying, setIsCopying] = useState(false)

  useEffect(() => {
    const fetchPublicTrip = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await api.get(`/public/trip/${slug}`)
        if (data.success) {
          setTrip(data.trip)
        } else {
          setError(data.message || 'Public trip not found')
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Public trip not found or link has expired')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchPublicTrip()
    }
  }, [slug])

  const handleCopyTrip = async () => {
    if (!isAuth) {
      toast.error('Please log in or create an account to copy this trip!')
      navigate('/login', { state: { from: location } })
      return
    }

    try {
      setIsCopying(true)
      const { data } = await api.post(`/public/trip/${slug}/copy`)
      if (data.success && data.trip) {
        toast.success(`"${data.trip.name}" added to your account!`)
        // Redirect to new trip
        navigate(`/trips/${data.trip.id || data.trip._id}`)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to copy trip')
    } finally {
      setIsCopying(false)
    }
  }

  if (loading) {
    return <LoadingPage />
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
        <div className="card p-8 sm:p-12 max-w-md w-full text-center space-y-4 border border-surface-200 shadow-card-lg">
          <div className="w-16 h-16 rounded-2xl bg-danger-50 text-danger-500 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-bold text-surface-900">Trip Not Found</h2>
          <p className="text-sm text-surface-500">
            {error || 'This public itinerary may have been set to private or does not exist.'}
          </p>
          <div className="pt-2">
            <Link to="/" className="btn btn-primary btn-md w-full">
              <ArrowLeft className="w-4 h-4" />
              Back to GlobeTrotter
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      {/* Top Public Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ocean-600 flex items-center justify-center text-white">
              <Globe className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-display font-bold text-surface-900">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuth ? (
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  <LogIn className="w-4 h-4" />
                  <span>Log in</span>
                </Link>
                <Link to="/register" className="btn btn-ocean btn-sm">
                  <UserPlus className="w-4 h-4" />
                  <span>Sign up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fade-in">
        {/* Hero Section */}
        <PublicTripHero
          trip={trip}
          onCopyTrip={handleCopyTrip}
          isCopying={isCopying}
          isAuthenticated={isAuth}
        />

        {/* Overview Stats */}
        <TripSummary trip={trip} />

        {/* Timeline Itinerary */}
        <ItineraryTimeline stops={trip.stops || []} currency={trip.currency || 'INR'} />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-surface-200 bg-white py-6 text-center text-xs text-surface-400">
        GlobeTrotter • Plan, Share & Explore Adventures Worldwide
      </footer>
    </div>
  )
}
