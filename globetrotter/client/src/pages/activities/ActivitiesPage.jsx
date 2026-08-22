import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  X,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  Check,
  MapPin,
  Compass,
  Sparkles,
} from 'lucide-react'
import {
  fetchActivities,
  setFilter,
  clearFilters,
  selectActivities,
  selectActivityFilters,
  selectActivitiesLoading,
} from '../../store/slices/activitiesSlice.js'
import { fetchTrips, selectTrips } from '../../store/slices/tripsSlice.js'
import ActivityCard from '../../components/features/ActivityCard.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import api from '../../services/api.js'
import { mockActivities, mockTrips } from '../../utils/mockData.js'

const CATEGORIES = [
  { value: '', label: '🌟 All Activities' },
  { value: 'sightseeing', label: '🏛 Sightseeing' },
  { value: 'food', label: '🍕 Food & Dining' },
  { value: 'adventure', label: '🧗 Adventure' },
  { value: 'culture', label: '🎨 Art & Culture' },
  { value: 'shopping', label: '🛍 Shopping' },
  { value: 'nature', label: '🌿 Nature & Parks' },
  { value: 'entertainment', label: '🎭 Entertainment' },
  { value: 'nightlife', label: '🍻 Nightlife' },
]

export default function ActivitiesPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const apiActivities = useSelector(selectActivities)
  const filters = useSelector(selectActivityFilters)
  const isLoading = useSelector(selectActivitiesLoading)
  const trips = useSelector(selectTrips)

  const [tripsList, setTripsList] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [selectedTripId, setSelectedTripId] = useState('')
  const [stopsList, setStopsList] = useState([])
  const [selectedStopId, setSelectedStopId] = useState('')

  const [scheduledDate, setScheduledDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('12:30')
  const [status, setStatus] = useState('planned')
  const [notes, setNotes] = useState('')
  const [openItineraryAfterAdd, setOpenItineraryAfterAdd] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.search || searchParams.get('search') || '')
  const filterCardRef = useRef(null)

  // Fetch activities from backend / Redux on initial mount and when filters change
  useEffect(() => {
    dispatch(fetchActivities(filters))
    dispatch(fetchTrips())
  }, [dispatch, filters])

  // Sync trips list from Redux or local storage fallback
  useEffect(() => {
    if (trips && trips.length > 0) {
      setTripsList(trips)
    } else {
      const saved = localStorage.getItem('globetrotter_trips')
      if (saved) {
        try {
          setTripsList(JSON.parse(saved))
        } catch (e) {
          setTripsList(mockTrips)
        }
      } else {
        localStorage.setItem('globetrotter_trips', JSON.stringify(mockTrips))
        setTripsList(mockTrips)
      }
    }
  }, [trips])

  // Compute displayed activities with smart fallback & instant local filtering
  const displayedActivities = useMemo(() => {
    let list = apiActivities && apiActivities.length > 0 ? apiActivities : mockActivities

    // Search query filter
    if (filters.search) {
      const query = filters.search.toLowerCase().trim()
      list = list.filter(
        (a) =>
          a.name?.toLowerCase().includes(query) ||
          a.description?.toLowerCase().includes(query) ||
          a.city?.name?.toLowerCase().includes(query) ||
          a.city?.country?.toLowerCase().includes(query) ||
          (a.tags && a.tags.some((t) => t.toLowerCase().includes(query)))
      )
    }

    // Category filter
    if (filters.category) {
      const cat = filters.category.toLowerCase()
      list = list.filter((a) => a.category?.toLowerCase() === cat)
    }

    // Country filter
    if (filters.country) {
      const c = filters.country.toLowerCase()
      list = list.filter((a) => a.city?.country?.toLowerCase() === c)
    }

    // Max Cost filter
    if (filters.maxCost) {
      const max = Number(filters.maxCost)
      list = list.filter((a) => (a.estimatedCost || 0) <= max)
    }

    // Duration filter
    if (filters.duration) {
      const dur = Number(filters.duration)
      list = list.filter((a) => {
        const val = a.durationValue ?? a.duration?.value ?? 0
        return val <= dur
      })
    }

    return list
  }, [apiActivities, filters])

  // Update stops dropdown when trip changes
  useEffect(() => {
    if (selectedTripId) {
      const trip = tripsList.find(
        (t) => String(t.id || t._id) === String(selectedTripId)
      )
      if (trip && trip.stops && trip.stops.length > 0) {
        setStopsList(trip.stops)
        const defaultStop = trip.stops[0]
        setSelectedStopId(defaultStop.id || defaultStop._id)
        if (defaultStop.arrivalDate) {
          setScheduledDate(defaultStop.arrivalDate.split('T')[0])
        }
      } else {
        setStopsList([])
        setSelectedStopId('new-stop')
      }
    }
  }, [selectedTripId, tripsList])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    dispatch(setFilter({ search: searchInput.trim() }))
  }

  const handleCategorySelect = (val) => {
    dispatch(setFilter({ category: val }))
  }

  const handleResetFilters = () => {
    setSearchInput('')
    dispatch(clearFilters())
  }

  const openAddModal = (activity) => {
    setSelectedActivity(activity)
    setIsAddModalOpen(true)
    if (tripsList.length > 0) {
      const firstTrip = tripsList[0]
      const firstTripId = firstTrip.id || firstTrip._id
      setSelectedTripId(firstTripId)
      if (firstTrip.stops && firstTrip.stops.length > 0) {
        setStopsList(firstTrip.stops)
        setSelectedStopId(firstTrip.stops[0].id || firstTrip.stops[0]._id)
        if (firstTrip.stops[0].arrivalDate) {
          setScheduledDate(firstTrip.stops[0].arrivalDate.split('T')[0])
        }
      }
    }
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setSelectedActivity(null)
    setNotes('')
    setOpenItineraryAfterAdd(false)
  }

  const handleAddActivitySubmit = async (e) => {
    e.preventDefault()
    if (!selectedTripId) {
      toast.error('Please select a trip first')
      return
    }

    setIsAdding(true)
    try {
      const selectedTrip = tripsList.find(
        (t) => String(t.id || t._id) === String(selectedTripId)
      )

      // Try adding via backend API if supported
      try {
        await api.post(`/trips/${selectedTripId}/stops/${selectedStopId}/activities`, {
          activityId: selectedActivity.id || selectedActivity._id,
          customName: selectedActivity.name,
          customCost: selectedActivity.estimatedCost,
          scheduledDate,
          startTime,
          endTime,
          status,
          notes,
        })
      } catch (apiErr) {
        // Fallback local storage sync
        console.info('Synced activity locally to trip record')
      }

      // Update local storage trips state
      const saved = localStorage.getItem('globetrotter_trips')
      let localTrips = saved ? JSON.parse(saved) : [...tripsList]
      const tripIdx = localTrips.findIndex(
        (t) => String(t.id || t._id) === String(selectedTripId)
      )

      if (tripIdx !== -1) {
        if (!localTrips[tripIdx].stops || localTrips[tripIdx].stops.length === 0) {
          localTrips[tripIdx].stops = [
            {
              id: `stop-${Date.now()}`,
              _id: `stop-${Date.now()}`,
              city: selectedActivity.city || { name: 'Destination', country: '' },
              arrivalDate: scheduledDate || new Date().toISOString(),
              departureDate: scheduledDate || new Date().toISOString(),
              activities: [],
            },
          ]
        }

        const targetStop = localTrips[tripIdx].stops[0]
        if (!targetStop.activities) targetStop.activities = []
        targetStop.activities.push({
          id: `act-${Date.now()}`,
          _id: `act-${Date.now()}`,
          name: selectedActivity.name,
          activity: selectedActivity,
          cost: selectedActivity.estimatedCost || 0,
          scheduledDate: scheduledDate || targetStop.arrivalDate,
          startTime,
          endTime,
          status,
          notes,
        })

        localStorage.setItem('globetrotter_trips', JSON.stringify(localTrips))
        setTripsList(localTrips)
      }

      toast.success(`🎉 Added "${selectedActivity.name}" to ${selectedTrip?.name || 'your trip'}!`)
      dispatch(fetchTrips())
      closeAddModal()

      if (openItineraryAfterAdd) {
        navigate(`/trips/${selectedTripId}/itinerary`)
      }
    } catch (err) {
      toast.error('Failed to add activity to trip')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 pb-16">
      {/* Top Header & Search Bar */}
      <div className="bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-ocean-600 dark:text-ocean-400 font-bold">
            Curated Experiences
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-surface-900 dark:text-white">
            Explore Activities
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 max-w-lg mx-auto font-light">
            Discover guided tours, cultural landmarks, outdoor excursions, and dining experiences worldwide.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-4 max-w-xl mx-auto">
            <div className="relative flex items-center bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl p-1.5 focus-within:border-ocean-500 shadow-sm transition-all">
              <Search className="w-5 h-5 text-surface-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search activities by keyword, city, or landmark..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent border-0 text-surface-900 dark:text-white placeholder:text-surface-400 text-xs sm:text-sm px-3 focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-white mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Categories Pill Chips */}
          <div className="pt-6 flex flex-wrap gap-2 justify-center max-w-3xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = (filters.category || '') === cat.value
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? 'bg-ocean-600 text-white border-ocean-600 shadow-sm scale-105'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-ocean-400'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between pb-4">
          <p className="text-xs text-surface-500 font-mono">
            Showing <strong className="text-surface-900 dark:text-white font-bold">{displayedActivities.length}</strong> experiences
          </p>

          {(filters.search || filters.category) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-ocean-600 hover:underline font-semibold"
            >
              Clear filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="w-8 h-8 text-ocean-600 animate-spin" />
            <p className="text-xs text-surface-500">Loading activities...</p>
          </div>
        ) : displayedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedActivities.map((activity) => (
              <ActivityCard
                key={activity.id || activity._id}
                activity={activity}
                onAddToStop={openAddModal}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-center space-y-3 max-w-md mx-auto">
            <Clock className="w-10 h-10 text-surface-400 mx-auto" />
            <h3 className="text-base font-bold text-surface-900 dark:text-white">
              No Activities Found
            </h3>
            <p className="text-xs text-surface-500">
              We couldn't find any activities matching your keywords or category. Try clearing your search.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Add Activity to Trip Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={`Add "${selectedActivity?.name || 'Activity'}" to Itinerary`}
        size="md"
      >
        <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Select Trip */}
          <div className="space-y-1.5">
            <label className="input-label">Select Destination Trip</label>
            {tripsList.length > 0 ? (
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="input"
                required
              >
                {tripsList.map((trip) => (
                  <option key={trip.id || trip._id} value={trip.id || trip._id}>
                    {trip.name} ({trip.currency || 'INR'})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-amber-600 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                You don't have any trips created yet. We'll create one automatically when you add this activity!
              </p>
            )}
          </div>

          {/* Scheduled Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="input-label">Scheduled Date</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="input-label">Time Window</label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input px-2"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input px-2"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="input-label">Personal Notes or Booking Reference</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Booking confirmation code, meet at entrance..."
              className="input resize-none"
            />
          </div>

          {/* Open Itinerary Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="open-itinerary-checkbox"
              checked={openItineraryAfterAdd}
              onChange={(e) => setOpenItineraryAfterAdd(e.target.checked)}
              className="rounded text-ocean-600 focus:ring-ocean-500 w-4 h-4"
            />
            <label htmlFor="open-itinerary-checkbox" className="text-xs text-surface-600 dark:text-surface-300">
              Open itinerary builder immediately after adding
            </label>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-surface-100 dark:border-surface-800">
            <Button type="button" variant="outline" size="sm" onClick={closeAddModal} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="ocean"
              size="sm"
              loading={isAdding}
              leftIcon={<Plus className="w-4 h-4" />}
              className="rounded-xl shadow-md"
            >
              Add to Trip
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
