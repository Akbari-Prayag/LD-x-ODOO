import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Share2,
  Edit2,
  Copy,
  Trash2,
  Layers,
  CalendarDays,
  DollarSign,
  Globe,
  Lock,
  Plus,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchTrip,
  deleteTrip,
  duplicateTrip,
  publishTrip,
  selectCurrentTrip,
  selectTripsLoading,
  selectTripsError,
} from '../../store/slices/tripsSlice.js'
import { dateRange, tripDuration } from '../../utils/dateUtils.js'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import LoadingPage from '../../components/ui/LoadingPage.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'

const STATUS_BADGES = {
  planning:  { label: 'Planning',  className: 'badge-primary' },
  upcoming:  { label: 'Upcoming',  className: 'badge-accent' },
  ongoing:   { label: 'Ongoing',   className: 'badge-warning' },
  completed: { label: 'Completed', className: 'badge-success' },
}

export default function TripDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const trip = useSelector(selectCurrentTrip)
  const isLoading = useSelector(selectTripsLoading)
  const error = useSelector(selectTripsError)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTrip(id))
    }
  }, [dispatch, id])

  if (isLoading && (!trip || (String(trip.id) !== String(id) && String(trip._id) !== String(id)))) {
    return <LoadingPage />
  }

  if (error && (!trip || (String(trip.id) !== String(id) && String(trip._id) !== String(id)))) {
    return (
      <div className="py-12">
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchTrip(id))}
        />
      </div>
    )
  }

  if (!trip) {
    return null
  }

  const {
    id: tripSqlId,
    _id: tripMongoId,
    name,
    description,
    coverPhoto,
    startDate,
    endDate,
    budget = 0,
    totalSpent = 0,
    currency = 'INR',
    status = 'planning',
    stops = [],
    tags = [],
    isPublic = false,
    publicSlug,
  } = trip

  const tripId = tripSqlId || tripMongoId || id
  const duration = tripDuration(startDate, endDate)
  const statusInfo = STATUS_BADGES[status] || STATUS_BADGES.planning
  const percentSpent = budgetPercentage(totalSpent, budget)
  const remaining = Math.max(0, budget - totalSpent)
  const isOverBudget = budget > 0 && totalSpent > budget

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteTrip(tripId)).unwrap()
      toast.success('Trip deleted successfully')
      navigate('/trips')
    } catch (err) {
      toast.error(err || 'Failed to delete trip')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const duplicated = await dispatch(duplicateTrip(tripId)).unwrap()
      const newId = duplicated.id || duplicated._id
      toast.success(`Duplicated as "${duplicated.name}"`)
      navigate(`/trips/${newId}`)
    } catch (err) {
      toast.error(err || 'Failed to duplicate trip')
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleShare = async () => {
    try {
      let slug = publicSlug
      if (!isPublic || !slug) {
        const updated = await dispatch(publishTrip(tripId)).unwrap()
        slug = updated.publicSlug
      }
      const publicUrl = `${window.location.origin}/trip/public/${slug}`
      await navigator.clipboard.writeText(publicUrl)
      toast.success('Public trip link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy public link')
    }
  }

  const handleTogglePublish = async () => {
    try {
      const updated = await dispatch(publishTrip(tripId)).unwrap()
      toast.success(updated.isPublic ? 'Trip is now public!' : 'Trip is now private.')
    } catch (err) {
      toast.error('Failed to update visibility')
    }
  }

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="btn btn-sm btn-ghost text-surface-500 hover:text-surface-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Trips</span>
        </Link>

        {/* Quick action bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePublish}
            className={`btn btn-xs ${
              isPublic
                ? 'btn-outline text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                : 'btn-secondary'
            }`}
            title="Toggle public visibility"
          >
            {isPublic ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Public</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Private</span>
              </>
            )}
          </button>

          <Button
            variant="outline"
            size="xs"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={handleShare}
          >
            Share
          </Button>

          <Link to={`/trips/${tripId}/edit`}>
            <Button
              variant="outline"
              size="xs"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Edit
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="xs"
            onClick={handleDuplicate}
            loading={isDuplicating}
            title="Duplicate Trip"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => setShowDeleteModal(true)}
            className="text-danger-600 hover:bg-danger-50"
            title="Delete Trip"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-card-lg bg-surface-900 min-h-[300px] flex flex-col justify-end text-white p-6 sm:p-8">
        <img
          src={coverPhoto || DEFAULT_COVER}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-65"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_COVER
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={statusInfo.className}>{statusInfo.label}</span>
            {isPublic && (
              <span className="badge bg-emerald-500/90 text-white backdrop-blur-xs text-xs font-medium">
                Public Share Active
              </span>
            )}
            {tags.map((t) => (
              <span
                key={t}
                className="badge bg-white/20 backdrop-blur-xs text-white text-xs border border-white/10"
              >
                {t}
              </span>
            ))}
          </div>

          <div>
            <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight drop-shadow-sm">
              {name}
            </h1>
            {description && (
              <p className="text-sm text-surface-200 mt-2 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-surface-200 pt-2 border-t border-white/15">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-primary-400" />
              <span>{dateRange(startDate, endDate)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent-400" />
              <span>{duration} {duration === 1 ? 'day' : 'days'} duration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{stops.length} {stops.length === 1 ? 'destination' : 'destinations'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to={`/trips/${tripId}/itinerary`}
          className="card-interactive p-5 flex items-center gap-4 bg-gradient-to-br from-white to-primary-50/40 border-primary-100"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900 flex items-center gap-1">
              <span>Itinerary Builder</span>
              <ExternalLink className="w-3.5 h-3.5 text-primary-500" />
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Manage stops, drag & drop daily activities.
            </p>
          </div>
        </Link>

        <Link
          to={`/trips/${tripId}/budget`}
          className="card-interactive p-5 flex items-center gap-4 bg-gradient-to-br from-white to-amber-50/40 border-amber-100"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900 flex items-center gap-1">
              <span>Budget & Expenses</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-500" />
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Track spending, categories, and logs.
            </p>
          </div>
        </Link>

        <Link
          to={`/trips/${tripId}/calendar`}
          className="card-interactive p-5 flex items-center gap-4 bg-gradient-to-br from-white to-accent-50/40 border-accent-100"
        >
          <div className="w-12 h-12 rounded-2xl bg-accent-100 text-accent-600 flex items-center justify-center shrink-0 shadow-sm">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-surface-900 flex items-center gap-1">
              <span>Timeline / Calendar</span>
              <ExternalLink className="w-3.5 h-3.5 text-accent-500" />
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              View day-by-day visual calendar timeline.
            </p>
          </div>
        </Link>
      </div>

      {/* Stats & Budget Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Summary Card */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-100 pb-3">
            <h2 className="font-display font-semibold text-surface-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary-600" />
              <span>Budget Snapshot</span>
            </h2>
            <Link
              to={`/trips/${tripId}/budget`}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              Details &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-surface-500">Allocated Budget</span>
              <span className="text-base font-semibold text-surface-900">
                {formatCurrency(budget, currency)}
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-surface-500">Total Spent</span>
              <span className={`text-base font-semibold ${isOverBudget ? 'text-danger-600' : 'text-surface-900'}`}>
                {formatCurrency(totalSpent, currency)}
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs text-surface-500">Remaining</span>
              <span className="text-base font-semibold text-emerald-600">
                {formatCurrency(remaining, currency)}
              </span>
            </div>

            {budget > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-surface-500 mb-1">
                  <span>Usage</span>
                  <span className="font-medium">{percentSpent}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${
                      isOverBudget ? 'bg-danger-500' : percentSpent > 80 ? 'bg-warning-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${Math.min(percentSpent, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stops Preview & Itinerary quick list */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-100 pb-3">
            <h2 className="font-display font-semibold text-surface-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-500" />
              <span>Itinerary Destinations ({stops.length})</span>
            </h2>
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </Link>
          </div>

          {stops && stops.length > 0 ? (
            <div className="divide-y divide-surface-100">
              {stops.map((stop, index) => (
                <div key={stop.id || stop._id || index} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-surface-900">
                        {stop.city?.name || stop.cityName || 'Destination'}
                      </h4>
                      <p className="text-xs text-surface-500">
                        {stop.arrivalDate && stop.departureDate
                          ? dateRange(stop.arrivalDate, stop.departureDate)
                          : 'Dates not set'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge-gray text-xs">
                      {stop.activities?.length || 0} activities
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-xs text-surface-500">No destinations added to this itinerary yet.</p>
              <Link to={`/trips/${tripId}/itinerary`} className="mt-3 inline-block">
                <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Add First Stop in Itinerary Builder
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Trip"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-600">
            Are you sure you want to permanently delete <strong className="text-surface-900">"{name}"</strong>? This will remove all stops, itinerary schedules, and expenses recorded for this trip.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
