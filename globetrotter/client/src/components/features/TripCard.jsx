import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Calendar,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Copy,
  Share2,
  ExternalLink,
  Wallet,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { deleteTrip, duplicateTrip, publishTrip } from '../../store/slices/tripsSlice.js'
import { dateRange, tripDuration } from '../../utils/dateUtils.js'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

const STATUS_BADGES = {
  planning:  { label: 'Planning',  className: 'badge-primary' },
  upcoming:  { label: 'Upcoming',  className: 'badge-accent' },
  ongoing:   { label: 'Ongoing',   className: 'badge-warning' },
  completed: { label: 'Completed', className: 'badge-success' },
}

export default function TripCard({ trip }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const {
    id,
    _id,
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
    isPublic = false,
    publicSlug,
  } = trip

  const tripId = id || _id
  const duration = tripDuration(startDate, endDate)
  const stopCount = stops.length
  const statusInfo = STATUS_BADGES[status] || STATUS_BADGES.planning
  const percentSpent = budgetPercentage(totalSpent, budget)
  const isOverBudget = budget > 0 && totalSpent > budget

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteTrip(tripId)).unwrap()
      toast.success('Trip deleted successfully')
      setShowDeleteModal(false)
    } catch (err) {
      toast.error(err || 'Failed to delete trip')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async (e) => {
    e.stopPropagation()
    setMenuOpen(false)
    setIsDuplicating(true)
    try {
      const duplicated = await dispatch(duplicateTrip(tripId)).unwrap()
      const newId = duplicated.id || duplicated._id
      toast.success(`Duplicated as "${duplicated.name}"`)
      navigate(`/trips/${newId}/edit`)
    } catch (err) {
      toast.error(err || 'Failed to duplicate trip')
    } finally {
      setIsDuplicating(false)
    }
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    setMenuOpen(false)
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

  return (
    <>
      <div className="card-hover group relative flex flex-col overflow-hidden bg-white">
        {/* Cover Photo & Badges */}
        <div className="trip-card-image relative bg-surface-100">
          <img
            src={coverPhoto || DEFAULT_COVER}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COVER
            }}
          />
          <div className="trip-card-overlay" />

          {/* Top floating badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className={statusInfo.className}>
              {statusInfo.label}
            </span>
            {isPublic && (
              <span className="badge bg-emerald-500/90 text-white backdrop-blur-xs text-[11px] font-semibold">
                Public
              </span>
            )}
          </div>

          {/* Duration Badge */}
          {duration > 0 && (
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 text-xs font-semibold text-white/95 drop-shadow-sm bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>{duration} {duration === 1 ? 'day' : 'days'}</span>
            </div>
          )}

          {/* Actions Dropdown Button */}
          <div className="absolute top-3 right-3 z-20" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen((prev) => !prev)
              }}
              aria-label="Trip options"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-surface-700 shadow-sm backdrop-blur-xs transition hover:bg-white hover:text-surface-900 focus:outline-hidden"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="dropdown right-0 mt-1.5 w-44 py-1">
                <Link
                  to={`/trips/${tripId}`}
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <ExternalLink className="w-4 h-4 text-surface-500" />
                  <span>View Details</span>
                </Link>
                <Link
                  to={`/trips/${tripId}/itinerary`}
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <MapPin className="w-4 h-4 text-surface-500" />
                  <span>Itinerary</span>
                </Link>
                <Link
                  to={`/trips/${tripId}/edit`}
                  className="dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Edit2 className="w-4 h-4 text-surface-500" />
                  <span>Edit Trip</span>
                </Link>
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                  className="dropdown-item w-full text-left"
                >
                  <Copy className="w-4 h-4 text-surface-500" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="dropdown-item w-full text-left"
                >
                  <Share2 className="w-4 h-4 text-surface-500" />
                  <span>Share Trip</span>
                </button>
                <div className="divider my-1" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setMenuOpen(false)
                    setShowDeleteModal(true)
                  }}
                  className="dropdown-item w-full text-left text-danger-600 hover:bg-danger-50 hover:text-danger-700"
                >
                  <Trash2 className="w-4 h-4 text-danger-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1">
            <Link to={`/trips/${tripId}`}>
              <h3 className="text-lg font-display font-semibold text-surface-900 line-clamp-1 hover:text-primary-600 transition-colors">
                {name}
              </h3>
            </Link>

            {description && (
              <p className="mt-1.5 text-xs text-surface-500 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Date & Stops Meta */}
            <div className="mt-3.5 space-y-2 text-xs text-surface-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-500 shrink-0" />
                <span className="font-medium text-surface-700">
                  {dateRange(startDate, endDate)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                <span>
                  {stopCount} {stopCount === 1 ? 'stop' : 'stops'} planned
                </span>
              </div>
            </div>
          </div>

          {/* Budget Progress / Details */}
          {budget > 0 && (
            <div className="mt-4 pt-3.5 border-t border-surface-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-medium text-surface-500">
                  <Wallet className="w-3.5 h-3.5 text-surface-400" />
                  Budget
                </span>
                <span className="font-semibold text-surface-800">
                  {formatCurrency(totalSpent, currency)}
                  <span className="text-surface-400 font-normal"> / {formatCurrency(budget, currency)}</span>
                </span>
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

          {/* Card Footer Button */}
          <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between gap-2">
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              Open Builder &rarr;
            </Link>
            <Link
              to={`/trips/${tripId}`}
              className="btn btn-xs btn-secondary"
            >
              Overview
            </Link>
          </div>
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
            Are you sure you want to delete <strong className="text-surface-900">"{name}"</strong>? This will permanently delete the itinerary, all stops, and recorded expenses.
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
    </>
  )
}
