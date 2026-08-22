import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Search, SlidersHorizontal, Compass, Sparkles } from 'lucide-react'
import {
  fetchTrips,
  selectTrips,
  selectTripsLoading,
  selectTripsError,
} from '../../store/slices/tripsSlice.js'
import TripCard from '../../components/features/TripCard.jsx'
import Button from '../../components/ui/Button.jsx'
import SearchBar from '../../components/ui/SearchBar.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

const STATUS_FILTERS = [
  { id: 'all', label: 'All Trips' },
  { id: 'planning', label: 'Planning' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
]

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Recently Created' },
  { value: 'created_asc', label: 'Oldest First' },
  { value: 'date_asc', label: 'Start Date (Earliest)' },
  { value: 'date_desc', label: 'Start Date (Latest)' },
  { value: 'budget_desc', label: 'Budget (High to Low)' },
  { value: 'budget_asc', label: 'Budget (Low to High)' },
]

export default function TripsPage() {
  const dispatch = useDispatch()
  const trips = useSelector(selectTrips)
  const isLoading = useSelector(selectTripsLoading)
  const error = useSelector(selectTripsError)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('created_desc')

  useEffect(() => {
    dispatch(fetchTrips())
  }, [dispatch])

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    let result = Array.isArray(trips) ? [...trips] : []

    // Filter by status
    if (selectedStatus !== 'all') {
      result = result.filter((trip) => trip.status === selectedStatus)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter(
        (trip) =>
          trip.name?.toLowerCase().includes(q) ||
          trip.description?.toLowerCase().includes(q) ||
          (Array.isArray(trip.tags) && trip.tags.some((tag) => tag.toLowerCase().includes(q)))
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'created_asc':
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        case 'date_asc':
          return new Date(a.startDate || 0) - new Date(b.startDate || 0)
        case 'date_desc':
          return new Date(b.startDate || 0) - new Date(a.startDate || 0)
        case 'budget_desc':
          return (b.budget || 0) - (a.budget || 0)
        case 'budget_asc':
          return (a.budget || 0) - (b.budget || 0)
        case 'created_desc':
        default:
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
    })

    return result
  }, [trips, selectedStatus, searchQuery, sortBy])

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { all: Array.isArray(trips) ? trips.length : 0, planning: 0, upcoming: 0, ongoing: 0, completed: 0 }
    if (Array.isArray(trips)) {
      trips.forEach((t) => {
        if (counts[t.status] !== undefined) counts[t.status]++
      })
    }
    return counts
  }, [trips])

  if (error && (!trips || !trips.length)) {
    return (
      <div className="py-12">
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchTrips())}
        />
      </div>
    )
  }

  return (
    <div className="space-y-7 animate-fade-in">
      {/* Header with Title and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">
              My Trips
            </h1>
            <span className="badge-primary px-2.5 py-0.5 text-xs font-semibold">
              {Array.isArray(trips) ? trips.length : 0} {trips?.length === 1 ? 'trip' : 'trips'}
            </span>
          </div>
          <p className="text-sm text-surface-500 mt-1">
            Manage your travel itineraries, view schedules, and track budgets.
          </p>
        </div>

        <Link to="/trips/create">
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-sm"
          >
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="w-full md:max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by trip title, description, or tags..."
              className="w-full"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-surface-400 shrink-0" />
            <span className="text-xs font-medium text-surface-600 whitespace-nowrap hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input py-2 text-xs font-medium bg-surface-50 border-surface-200 text-surface-800 rounded-lg cursor-pointer focus:bg-white"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide pt-1 border-t border-surface-100">
          {STATUS_FILTERS.map((filter) => {
            const isSelected = selectedStatus === filter.id
            const count = statusCounts[filter.id] || 0
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedStatus(filter.id)}
                className={`chip cursor-pointer text-xs transition-all duration-150 whitespace-nowrap ${
                  isSelected
                    ? 'chip-active ring-1 ring-primary-500/30 font-semibold'
                    : 'hover:bg-surface-200 text-surface-600'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-surface-200 text-surface-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Trips Content Grid / Skeleton / Empty States */}
      {isLoading && (!trips || !trips.length) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="card overflow-hidden animate-pulse">
              <div className="aspect-video bg-surface-200" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-surface-200 rounded-md w-3/4" />
                <div className="h-3 bg-surface-200 rounded-md w-full" />
                <div className="h-3 bg-surface-200 rounded-md w-1/2" />
                <div className="pt-4 border-t border-surface-100 flex justify-between">
                  <div className="h-4 bg-surface-200 rounded-md w-24" />
                  <div className="h-4 bg-surface-200 rounded-md w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id || trip._id} trip={trip} />
          ))}
        </div>
      ) : trips && trips.length > 0 ? (
        /* Filtered Empty State */
        <div className="card p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-surface-100 flex items-center justify-center text-surface-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-surface-800">No matching trips found</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or switching filters to view other trips.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedStatus('all')
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      ) : (
        /* First-time Empty State */
        <div className="card p-12 text-center border-dashed border-2 border-surface-200">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4 shadow-sm">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-display font-semibold text-surface-900">
            No trips planned yet
          </h2>
          <p className="text-sm text-surface-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            Ready to explore? Start by creating your first trip itinerary with personalized stops, activities, and budget tracking.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/trips/create">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Your First Trip
              </Button>
            </Link>
            <Link to="/cities">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4 text-accent-500" />}
              >
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
