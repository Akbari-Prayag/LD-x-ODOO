import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Circle,
  CircleDollarSign,
  Clock,
  Clock3,
  Compass,
  DollarSign,
  Edit3,
  Filter,
  GripVertical,
  Layers,
  List,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrip, fetchTrips, selectCurrentTrip, selectTrips } from '../../store/slices/tripsSlice.js'
import { formatCurrency } from '../../utils/formatUtils.js'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'

const colors = ['blue', 'teal', 'amber', 'purple', 'emerald', 'rose']
const colorClasses = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  teal: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100',
}

const colorBadgeDots = {
  blue: 'bg-blue-500',
  teal: 'bg-teal-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
}

const statusColors = {
  planned: 'bg-surface-100 text-surface-700 border-surface-200',
  booked: 'bg-primary-50 text-primary-700 border-primary-200',
  completed: 'bg-success-50 text-success-700 border-success-200',
  cancelled: 'bg-danger-50 text-danger-700 border-danger-200',
}

const ACTIVITY_CATEGORIES = [
  'Sightseeing',
  'Food & Dining',
  'Adventure',
  'Culture & History',
  'Nature & Outdoors',
  'Shopping',
  'Entertainment',
  'Relaxation',
]

const toDate = value => new Date(`${String(value).slice(0, 10)}T00:00:00`)
const keyOf = value => format(value, 'yyyy-MM-dd')
const getId = item => String(item.id ?? item._id ?? Math.random())

// Sortable Item Component for DnD
function SortableActivityItem({ activity, onEdit, onToggleStatus, currency }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getId(activity) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const status = activity.status || 'planned'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-surface-200 hover:border-[#4677d9] rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-xs flex items-start gap-2.5 group"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="text-surface-300 group-hover:text-surface-600 cursor-grab active:cursor-grabbing p-1 mt-0.5"
        title="Drag to reorder"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <div className="flex-1 min-w-0" onClick={() => onEdit(activity)}>
        <div className="flex flex-wrap items-center justify-between gap-1.5 cursor-pointer">
          <span className="font-semibold text-surface-900 text-xs md:text-sm truncate">
            {activity.customName || activity.activity?.name || 'Activity'}
          </span>
          <div className="flex items-center gap-1.5">
            {activity.category && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 capitalize">
                {activity.category}
              </span>
            )}
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${
                statusColors[status] || statusColors.planned
              }`}
            >
              {status}
            </span>
          </div>
        </div>

        <p className="text-xs text-surface-500 mt-1 line-clamp-2 cursor-pointer">
          {activity.customDescription || activity.activity?.description || activity.notes || 'Click to view full notes.'}
        </p>

        <div className="flex items-center justify-between text-[11px] text-surface-500 mt-2.5 pt-2 border-t border-surface-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-surface-400" />
            {activity.startTime ? `${activity.startTime}${activity.endTime ? ` - ${activity.endTime}` : ''}` : 'Flexible timing'}
          </span>
          <span className="font-semibold text-surface-900">
            {activity.cost || activity.customCost
              ? formatCurrency(activity.cost || activity.customCost, currency)
              : 'Free / Included'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
        <button
          type="button"
          onClick={() => onToggleStatus(activity)}
          className="p-1 rounded-lg text-surface-400 hover:text-success-600 hover:bg-success-50 transition-colors"
          title="Cycle Status (Planned → Booked → Completed)"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onEdit(activity)}
          className="p-1 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
          title="Edit Details"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function CalendarPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentTrip = useSelector(selectCurrentTrip)
  const trips = useSelector(selectTrips)

  const [viewMode, setViewMode] = useState('calendar') // 'calendar' | 'timeline'
  const [selectedTripId, setSelectedTripId] = useState(id || 'all')
  const [month, setMonth] = useState(startOfMonth(new Date()))

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // Local state for modified activities (for instant reordering and editing)
  const [localActivities, setLocalActivities] = useState([])
  const [collapsedDays, setCollapsedDays] = useState({})

  // Modals
  const [selectedDay, setSelectedDay] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false)
  const [targetDayForAdd, setTargetDayForAdd] = useState('')
  const [newActivityForm, setNewActivityForm] = useState({
    customName: '',
    category: 'Sightseeing',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    customCost: '',
    scheduledDate: '',
    status: 'planned',
    notes: '',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    dispatch(fetchTrips())
    if (id && (!currentTrip || String(getId(currentTrip)) !== id)) {
      dispatch(fetchTrip(id))
      setSelectedTripId(id)
    }
  }, [dispatch, id, currentTrip])

  // Sync month when selected trip changes
  useEffect(() => {
    if (selectedTripId !== 'all') {
      const activeTrip = trips.find(t => String(getId(t)) === String(selectedTripId)) || currentTrip
      if (activeTrip?.startDate) {
        setMonth(startOfMonth(toDate(activeTrip.startDate)))
      }
    }
  }, [selectedTripId, trips, currentTrip])

  // Sync local activities from trips
  useEffect(() => {
    const allActs = []
    const sourceTrips = selectedTripId === 'all' ? trips : trips.filter(t => String(getId(t)) === String(selectedTripId))

    sourceTrips.forEach(t => {
      (t.stops || []).forEach(stop => {
        (stop.activities || []).forEach(act => {
          allActs.push({
            ...act,
            tripId: getId(t),
            tripName: t.name,
            currency: t.currency || 'INR',
            stopCity: stop.city?.name || stop.customCityName || 'Destination',
            stopArrival: String(stop.arrivalDate || '').slice(0, 10),
            stopDeparture: String(stop.departureDate || '').slice(0, 10),
          })
        })
      })
    })
    setLocalActivities(allActs)
  }, [trips, selectedTripId])

  // Calendar Days Calculation
  const days = useMemo(() => {
    const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    const result = []
    for (let day = first; day <= last; day = addDays(day, 1)) {
      result.push(day)
    }
    return result
  }, [month])

  // Process Trips into Calendar Events
  const events = useMemo(() => {
    return trips
      .map((item, index) => ({
        id: getId(item),
        name: item.name,
        start: toDate(item.startDate),
        end: toDate(item.endDate),
        budget: Number(item.budget) || 0,
        currency: item.currency || 'INR',
        color: colors[index % colors.length],
        stops: item.stops || [],
        rawTrip: item,
      }))
      .filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase())
        const matchesTrip = selectedTripId === 'all' || String(event.id) === String(selectedTripId)
        return matchesSearch && matchesTrip
      })
      .sort((a, b) => a.start - b.start)
  }, [trips, search, selectedTripId])

  // Active focused trip
  const activeFocusedTrip = useMemo(() => {
    if (selectedTripId === 'all') return currentTrip || trips[0] || null
    return trips.find(t => String(getId(t)) === String(selectedTripId)) || currentTrip || null
  }, [selectedTripId, trips, currentTrip])

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return localActivities.filter(act => {
      const q = search.toLowerCase()
      const title = (act.customName || act.activity?.name || '').toLowerCase()
      const desc = (act.customDescription || act.activity?.description || act.notes || '').toLowerCase()
      const city = (act.stopCity || '').toLowerCase()

      const matchesSearch = !q || title.includes(q) || desc.includes(q) || city.includes(q)
      const matchesCat = categoryFilter === 'all' || (act.category && act.category.toLowerCase() === categoryFilter.toLowerCase())
      const matchesStatus = statusFilter === 'all' || (act.status || 'planned').toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesCat && matchesStatus
    })
  }, [localActivities, search, categoryFilter, statusFilter])

  // Filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (search.trim()) count++
    if (categoryFilter !== 'all') count++
    if (statusFilter !== 'all') count++
    if (selectedTripId !== 'all') count++
    return count
  }, [search, categoryFilter, statusFilter, selectedTripId])

  // Get Events for a day
  const getEventsForDay = (day) => {
    const dayKey = keyOf(day)
    return events.filter(event => {
      const s = keyOf(event.start)
      const e = keyOf(event.end)
      return dayKey >= s && dayKey <= e
    })
  }

  // Get Activities for a day
  const getActivitiesForDay = (day) => {
    const dayKey = keyOf(day)
    return filteredActivities.filter(act => {
      const actDate = act.scheduledDate ? String(act.scheduledDate).slice(0, 10) : ''
      return actDate === dayKey || (!actDate && dayKey >= act.stopArrival && dayKey <= act.stopDeparture)
    })
  }

  // Timeline Days Sequence
  const timelineDays = useMemo(() => {
    if (!activeFocusedTrip?.startDate || !activeFocusedTrip?.endDate) return []
    const start = toDate(activeFocusedTrip.startDate)
    const end = toDate(activeFocusedTrip.endDate)
    const result = []

    for (let cur = new Date(start); cur <= end; cur = addDays(cur, 1)) {
      const dateKey = keyOf(cur)
      const stops = (activeFocusedTrip.stops || []).filter(stop => {
        const sArr = String(stop.arrivalDate || '').slice(0, 10)
        const sDep = String(stop.departureDate || '').slice(0, 10)
        return dateKey >= sArr && dateKey <= sDep
      })

      const actsForDate = filteredActivities.filter(act => {
        const actDate = act.scheduledDate ? String(act.scheduledDate).slice(0, 10) : ''
        return (
          String(act.tripId) === String(getId(activeFocusedTrip)) &&
          (actDate === dateKey || (!actDate && stops.some(s => s.city?.name === act.stopCity || s.customCityName === act.stopCity)))
        )
      })

      result.push({
        date: new Date(cur),
        dateKey,
        stops,
        activities: actsForDate,
      })
    }
    return result
  }, [activeFocusedTrip, filteredActivities])

  // Overview metrics
  const tripDaysCount = activeFocusedTrip?.startDate && activeFocusedTrip?.endDate
    ? differenceInCalendarDays(toDate(activeFocusedTrip.endDate), toDate(activeFocusedTrip.startDate)) + 1
    : 0

  const monthTrips = events.filter(event => event.start <= endOfMonth(month) && event.end >= startOfMonth(month))
  const estimatedBudget = monthTrips.reduce((total, item) => total + item.budget, 0)

  const nextUpcomingTrip = useMemo(() => {
    const today = startOfMonth(new Date())
    return [...trips]
      .filter(t => toDate(t.startDate) >= today)
      .sort((a, b) => toDate(a.startDate) - toDate(b.startDate))[0] || null
  }, [trips])

  // DnD Reorder Handler
  const handleDragEnd = (event, dateKey) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setLocalActivities(prev => {
      const oldIndex = prev.findIndex(item => getId(item) === active.id)
      const newIndex = prev.findIndex(item => getId(item) === over.id)
      if (oldIndex === -1 || newIndex === -1) return prev
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  // Quick Status Toggle Handler
  const handleToggleStatus = (act) => {
    const statuses = ['planned', 'booked', 'completed']
    const nextStatus = statuses[(statuses.indexOf(act.status || 'planned') + 1) % statuses.length]
    setLocalActivities(prev =>
      prev.map(item => (getId(item) === getId(act) ? { ...item, status: nextStatus } : item))
    )
  }

  // Save Edited Activity
  const handleSaveActivity = (e) => {
    e.preventDefault()
    if (!editingActivity) return

    setLocalActivities(prev =>
      prev.map(item =>
        getId(item) === getId(editingActivity)
          ? {
              ...item,
              customName: editingActivity.customName,
              category: editingActivity.category,
              startTime: editingActivity.startTime,
              endTime: editingActivity.endTime,
              customCost: editingActivity.customCost,
              status: editingActivity.status,
              notes: editingActivity.notes,
              scheduledDate: editingActivity.scheduledDate,
            }
          : item
      )
    )
    setEditingActivity(null)
  }

  // Delete Activity
  const handleDeleteActivity = (act) => {
    if (!window.confirm(`Remove "${act.customName || act.activity?.name || 'activity'}"?`)) return
    setLocalActivities(prev => prev.filter(item => getId(item) !== getId(act)))
    if (editingActivity && getId(editingActivity) === getId(act)) {
      setEditingActivity(null)
    }
  }

  // Add New Custom Activity
  const handleCreateActivity = (e) => {
    e.preventDefault()
    if (!newActivityForm.customName.trim()) return

    const newAct = {
      id: `custom-${Date.now()}`,
      tripId: selectedTripId === 'all' && activeFocusedTrip ? getId(activeFocusedTrip) : selectedTripId,
      tripName: activeFocusedTrip?.name || 'Trip',
      currency: activeFocusedTrip?.currency || 'INR',
      stopCity: activeFocusedTrip?.stops?.[0]?.city?.name || 'Local City',
      customName: newActivityForm.customName,
      category: newActivityForm.category,
      startTime: newActivityForm.startTime,
      endTime: newActivityForm.endTime,
      customCost: Number(newActivityForm.customCost) || 0,
      scheduledDate: newActivityForm.scheduledDate || targetDayForAdd,
      status: newActivityForm.status,
      notes: newActivityForm.notes,
    }

    setLocalActivities(prev => [newAct, ...prev])
    setIsAddActivityOpen(false)
    setNewActivityForm({
      customName: '',
      category: 'Sightseeing',
      startTime: '10:00 AM',
      endTime: '12:00 PM',
      customCost: '',
      scheduledDate: '',
      status: 'planned',
      notes: '',
    })
  }

  const clearAllFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setSelectedTripId('all')
  }

  const toggleCollapseDay = (dateKey) => {
    setCollapsedDays(prev => ({ ...prev, [dateKey]: !prev[dateKey] }))
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4677d9]">
            Itinerary & Timeline Schedule
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-[#2d3e86] mt-1">
            Trip Calendar & Timeline
          </h1>
          <p className="text-surface-500 text-sm mt-0.5">
            Visualize your itinerary via interactive monthly grid or chronological vertical timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle Button */}
          <div className="inline-flex rounded-xl border border-surface-200 bg-surface-100 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#2d3e86] shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Calendar View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#2d3e86] shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Timeline View
            </button>
          </div>

          <Button
            type="button"
            className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl text-xs font-semibold shadow-sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setTargetDayForAdd(activeFocusedTrip?.startDate ? String(activeFocusedTrip.startDate).slice(0, 10) : '')
              setIsAddActivityOpen(true)
            }}
          >
            Add Activity
          </Button>
        </div>
      </div>

      {/* 4 Stats Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          [CalendarDays, 'Total Trips', trips.length, 'In your profile'],
          [Clock3, 'Trip Duration', `${tripDaysCount || 0} days`, activeFocusedTrip ? activeFocusedTrip.name : 'All trips'],
          [CircleDollarSign, 'Est. Monthly Budget', formatCurrency(estimatedBudget), format(month, 'MMMM yyyy')],
          [MapPin, 'Next Destination', nextUpcomingTrip?.name || 'None planned', nextUpcomingTrip ? format(toDate(nextUpcomingTrip.startDate), 'MMM d, yyyy') : 'Ready to explore'],
        ].map(([Icon, label, value, note]) => (
          <div key={label} className="card p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-surface-500">{label}</p>
              <p className="font-semibold text-surface-900 mt-0.5 truncate">{value}</p>
              <p className="text-[11px] text-surface-400 mt-0.5 truncate">{note}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Filter and Search Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              className="input pl-10 text-xs md:text-sm"
              placeholder="Search activities by title, city, or note..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" />
              <select
                className="input pl-9 md:w-48 text-xs font-medium"
                value={selectedTripId}
                onChange={e => setSelectedTripId(e.target.value)}
              >
                <option value="all">All Trips Overview</option>
                {trips.map(item => (
                  <option key={getId(item)} value={getId(item)}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <select
              className="input md:w-36 text-xs font-medium"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {ACTIVITY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="input md:w-32 text-xs font-medium"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="booked">Booked</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="!rounded-xl text-xs"
              onClick={() => setMonth(startOfMonth(new Date()))}
            >
              Today
            </Button>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between text-xs text-surface-500 pt-1 border-t border-surface-100">
            <span>
              Active filters: <strong>{activeFiltersCount}</strong> · Showing <strong>{filteredActivities.length}</strong> activities
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-[#4677d9] font-semibold hover:underline"
            >
              <RotateCcw className="w-3 h-3" /> Reset filters
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT: CALENDAR OR TIMELINE VIEW */}
      {viewMode === 'calendar' ? (
        <div className="grid gap-5 xl:grid-cols-[250px_1fr]">
          {/* Left Mini Sidebar */}
          <aside className="space-y-4">
            {/* Mini Month Picker */}
            <section className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-surface-900 text-sm">{format(month, 'MMMM yyyy')}</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous month"
                    className="p-1 rounded text-surface-500 hover:text-[#4677d9] hover:bg-surface-100"
                    onClick={() => setMonth(val => subMonths(val, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    className="p-1 rounded text-surface-500 hover:text-[#4677d9] hover:bg-surface-100"
                    onClick={() => setMonth(val => addMonths(val, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center text-[10px] font-semibold text-surface-400 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={`${d}-${i}`}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
                {days.map(day => {
                  const isCurrentMonth = isSameMonth(day, month)
                  const isToday = isSameDay(day, new Date())
                  const isSelected = selectedDay && isSameDay(day, selectedDay)

                  return (
                    <button
                      type="button"
                      key={day.toISOString()}
                      className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                        !isCurrentMonth
                          ? 'text-surface-300'
                          : isSelected
                          ? 'bg-[#2d3e86] text-white font-bold'
                          : isToday
                          ? 'bg-[#4677d9] text-white font-bold'
                          : 'text-surface-700 hover:bg-surface-100'
                      }`}
                      onClick={() => {
                        setSelectedDay(day)
                        if (!isCurrentMonth) setMonth(startOfMonth(day))
                      }}
                    >
                      {format(day, 'd')}
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Active Trips Quick List */}
            <section className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-surface-900 text-sm">Trips</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                  {events.length}
                </span>
              </div>

              {events.length === 0 ? (
                <p className="text-xs text-surface-400 py-3 text-center">No matching trips</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {events.map(event => (
                    <button
                      type="button"
                      key={event.id}
                      className={`w-full text-left rounded-xl border p-2.5 transition-all ${
                        selectedTripId === String(event.id)
                          ? 'border-[#4677d9] bg-primary-50/40 shadow-xs'
                          : 'border-surface-100 hover:border-surface-200 hover:bg-surface-50'
                      }`}
                      onClick={() => {
                        setSelectedTripId(String(event.id))
                        setMonth(startOfMonth(event.start))
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorBadgeDots[event.color] || 'bg-[#4677d9]'}`} />
                        <span className="text-xs font-bold text-surface-800 truncate">{event.name}</span>
                      </div>
                      <p className="text-[10px] text-surface-500 mt-1 ml-4.5">
                        {format(event.start, 'MMM d')} – {format(event.end, 'MMM d, yyyy')}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </aside>

          {/* Large Monthly Grid */}
          <section className="card overflow-hidden min-w-0 flex flex-col">
            <div className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-surface-100 bg-surface-50/40">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="p-2 rounded-xl border border-surface-200 bg-white text-surface-600 hover:bg-surface-100 transition-colors"
                  onClick={() => setMonth(val => subMonths(val, 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg md:text-xl font-display font-bold text-[#2d3e86]">
                  {format(month, 'MMMM yyyy')}
                </h2>
                <button
                  type="button"
                  aria-label="Next month"
                  className="p-2 rounded-xl border border-surface-200 bg-white text-surface-600 hover:bg-surface-100 transition-colors"
                  onClick={() => setMonth(val => addMonths(val, 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-surface-500">
                Click any date cell to view scheduled stops, activities, and expenses.
              </div>
            </div>

            <div className="grid grid-cols-7 border-b border-surface-100 bg-surface-50/80">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-surface-500">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 flex-1">
              {days.map(day => {
                const dayEvents = getEventsForDay(day)
                const dayActivities = getActivitiesForDay(day)
                const isCurrentMonth = isSameMonth(day, month)
                const isToday = isSameDay(day, new Date())
                const isSelected = selectedDay && isSameDay(day, selectedDay)

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-24 md:min-h-32 border-r border-b border-surface-100 p-2 transition-all cursor-pointer ${
                      !isCurrentMonth ? 'bg-surface-50/50' : 'hover:bg-primary-50/20'
                    } ${isSelected ? 'ring-2 ring-inset ring-[#4677d9] bg-primary-50/30' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold ${
                          isToday
                            ? 'inline-flex w-6 h-6 items-center justify-center rounded-full bg-[#4677d9] text-white font-bold shadow-2xs'
                            : !isCurrentMonth
                            ? 'text-surface-400'
                            : 'text-surface-700'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>

                      {dayActivities.length > 0 && (
                        <span className="text-[10px] font-semibold text-[#4677d9] bg-primary-50 px-1.5 py-0.2 rounded">
                          {dayActivities.length} act
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div
                          key={ev.id}
                          className={`truncate rounded-md border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                            colorClasses[ev.color] || colorClasses.blue
                          }`}
                          title={`${ev.name}`}
                        >
                          <MapPin className="inline w-2.5 h-2.5 mr-1" />
                          {ev.name}
                        </div>
                      ))}

                      {dayEvents.length > 2 && (
                        <span className="text-[9px] text-surface-400 font-medium pl-1">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      ) : (
        /* TIMELINE VIEW (Vertical Day-by-Day Flow with Drag and Drop Reordering) */
        <section className="card p-5 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-100">
            <div>
              <h2 className="text-xl font-display font-bold text-surface-900">
                Itinerary Timeline – {activeFocusedTrip?.name || 'Trip Route'}
              </h2>
              <p className="text-xs text-surface-500 mt-1">
                Day-by-day journey flow. Drag handle to reorder activities.
              </p>
            </div>

            {activeFocusedTrip?.startDate && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary-50 text-[#2d3e86] border border-primary-100">
                {format(toDate(activeFocusedTrip.startDate), 'MMM d, yyyy')} – {format(toDate(activeFocusedTrip.endDate), 'MMM d, yyyy')} ({tripDaysCount} days)
              </span>
            )}
          </div>

          {timelineDays.length === 0 ? (
            <div className="p-12 text-center text-sm text-surface-400">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 text-surface-300" />
              <p>No timeline dates found for this trip. Set start and end dates in your trip settings.</p>
            </div>
          ) : (
            <div className="relative mt-8 pl-4 md:pl-8 before:absolute before:left-3.5 md:before:left-7.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-primary-200">
              {timelineDays.map((dayItem, index) => {
                const isCollapsed = collapsedDays[dayItem.dateKey]
                const dayActIds = dayItem.activities.map(a => getId(a))

                return (
                  <div key={dayItem.dateKey} className="relative pb-8 last:pb-2">
                    <div className="absolute -left-4 md:-left-8 top-1 w-4 h-4 rounded-full bg-[#4677d9] ring-4 ring-white shadow-xs" />

                    <div className="bg-surface-50 border border-surface-200 rounded-2xl p-4 md:p-5 shadow-2xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="rounded-xl bg-[#2d3e86] px-3 py-1 text-xs font-bold text-white shadow-2xs">
                            Day {index + 1}
                          </span>
                          <span className="font-display font-bold text-surface-900 text-sm md:text-base">
                            {format(dayItem.date, 'EEEE, MMMM d, yyyy')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {dayItem.stops[0] && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4677d9] bg-white border border-primary-100 rounded-lg px-2.5 py-1 shadow-2xs">
                              <MapPin className="w-3.5 h-3.5 text-[#4677d9]" />
                              <span>{dayItem.stops[0].city?.name || dayItem.stops[0].customCityName || 'City Stop'}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setTargetDayForAdd(dayItem.dateKey)
                              setIsAddActivityOpen(true)
                            }}
                            className="text-xs font-semibold text-[#4677d9] hover:text-[#2d3e86] p-1 flex items-center gap-1"
                            title="Add activity to this day"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleCollapseDay(dayItem.dateKey)}
                            className="text-surface-400 hover:text-surface-700 p-1"
                            title={isCollapsed ? 'Expand Day' : 'Collapse Day'}
                          >
                            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {!isCollapsed && (
                        <div>
                          {dayItem.activities.length > 0 ? (
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(e) => handleDragEnd(e, dayItem.dateKey)}
                            >
                              <SortableContext items={dayActIds} strategy={verticalListSortingStrategy}>
                                <div className="space-y-2.5 mt-3">
                                  {dayItem.activities.map((act) => (
                                    <SortableActivityItem
                                      key={getId(act)}
                                      activity={act}
                                      onEdit={(a) => setEditingActivity(a)}
                                      onToggleStatus={handleToggleStatus}
                                      currency={activeFocusedTrip?.currency}
                                    />
                                  ))}
                                </div>
                              </SortableContext>
                            </DndContext>
                          ) : (
                            <p className="text-xs text-surface-400 py-3 text-center bg-white rounded-xl border border-dashed border-surface-200">
                              No activities scheduled for this day.{' '}
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetDayForAdd(dayItem.dateKey)
                                  setIsAddActivityOpen(true)
                                }}
                                className="font-semibold text-[#4677d9] hover:underline"
                              >
                                Add an activity +
                              </button>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      )}

      {/* Selected Day Quick Inspector Drawer / Modal */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#4677d9]">Day Details</p>
                <h3 className="font-display font-bold text-lg text-surface-900 mt-0.5">
                  {format(selectedDay, 'EEEE, MMMM d, yyyy')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
              {/* Trips on this day */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
                  Active Trips ({getEventsForDay(selectedDay).length})
                </h4>
                {getEventsForDay(selectedDay).length === 0 ? (
                  <p className="text-xs text-surface-400">No active trips on this day.</p>
                ) : (
                  <div className="space-y-2">
                    {getEventsForDay(selectedDay).map(ev => (
                      <div
                        key={ev.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${colorClasses[ev.color]}`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-xs truncate">{ev.name}</p>
                          <p className="text-[10px] opacity-80 mt-0.5">
                            {format(ev.start, 'MMM d')} – {format(ev.end, 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Link
                          to={`/trips/${ev.id}/itinerary`}
                          className="text-[11px] font-semibold underline shrink-0 ml-2"
                        >
                          View Itinerary →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Activities for this day */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Planned Activities ({getActivitiesForDay(selectedDay).length})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetDayForAdd(keyOf(selectedDay))
                      setIsAddActivityOpen(true)
                    }}
                    className="text-xs font-semibold text-[#4677d9] hover:underline"
                  >
                    + Add to day
                  </button>
                </div>

                {getActivitiesForDay(selectedDay).length === 0 ? (
                  <p className="text-xs text-surface-400">No activities scheduled for this date.</p>
                ) : (
                  <div className="space-y-2">
                    {getActivitiesForDay(selectedDay).map(act => (
                      <div
                        key={getId(act)}
                        onClick={() => {
                          setSelectedDay(null)
                          setEditingActivity(act)
                        }}
                        className="p-3 rounded-xl border border-surface-200 bg-white hover:border-[#4677d9] transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-surface-900 text-xs truncate">
                            {act.customName || act.activity?.name || 'Activity'}
                          </p>
                          <p className="text-[10px] text-surface-500 mt-0.5">
                            {act.stopCity} · {act.startTime || 'Time not set'}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-surface-800 shrink-0">
                          {act.cost || act.customCost ? formatCurrency(act.cost || act.customCost, act.currency) : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-surface-100 bg-surface-50/50 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="!rounded-xl"
                onClick={() => setSelectedDay(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Activity Modal */}
      {editingActivity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4677d9] px-2 py-0.5 bg-primary-50 rounded-full">
                  Edit Activity
                </span>
                <h3 className="font-display font-bold text-lg text-surface-900 mt-1">
                  {editingActivity.customName || editingActivity.activity?.name || 'Activity Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingActivity(null)}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-5 space-y-4 text-xs">
              <Input
                label="Activity Name"
                value={editingActivity.customName || editingActivity.activity?.name || ''}
                onChange={e => setEditingActivity({ ...editingActivity, customName: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input text-xs"
                    value={editingActivity.category || 'Sightseeing'}
                    onChange={e => setEditingActivity({ ...editingActivity, category: e.target.value })}
                  >
                    {ACTIVITY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Status</label>
                  <select
                    className="input text-xs"
                    value={editingActivity.status || 'planned'}
                    onChange={e => setEditingActivity({ ...editingActivity, status: e.target.value })}
                  >
                    <option value="planned">Planned</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time"
                  placeholder="e.g. 10:00 AM"
                  value={editingActivity.startTime || ''}
                  onChange={e => setEditingActivity({ ...editingActivity, startTime: e.target.value })}
                />
                <Input
                  label="End Time"
                  placeholder="e.g. 12:30 PM"
                  value={editingActivity.endTime || ''}
                  onChange={e => setEditingActivity({ ...editingActivity, endTime: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Scheduled Date"
                  type="date"
                  value={editingActivity.scheduledDate ? String(editingActivity.scheduledDate).slice(0, 10) : ''}
                  onChange={e => setEditingActivity({ ...editingActivity, scheduledDate: e.target.value })}
                />
                <Input
                  label="Estimated Cost"
                  type="number"
                  placeholder="0"
                  value={editingActivity.customCost || editingActivity.cost || ''}
                  onChange={e => setEditingActivity({ ...editingActivity, customCost: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Notes</label>
                <textarea
                  className="input min-h-[70px] resize-none text-xs"
                  placeholder="Add tips, directions, booking refs..."
                  value={editingActivity.notes || ''}
                  onChange={e => setEditingActivity({ ...editingActivity, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                <button
                  type="button"
                  onClick={() => handleDeleteActivity(editingActivity)}
                  className="flex items-center gap-1 text-danger-600 hover:text-danger-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingActivity(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-surface-900">
                Add Activity to Itinerary
              </h3>
              <button
                type="button"
                onClick={() => setIsAddActivityOpen(false)}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="p-5 space-y-4 text-xs">
              <Input
                label="Activity Name"
                placeholder="e.g. Visit Eiffel Tower / Sunset boat tour"
                value={newActivityForm.customName}
                onChange={e => setNewActivityForm({ ...newActivityForm, customName: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="input text-xs"
                    value={newActivityForm.category}
                    onChange={e => setNewActivityForm({ ...newActivityForm, category: e.target.value })}
                  >
                    {ACTIVITY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Status</label>
                  <select
                    className="input text-xs"
                    value={newActivityForm.status}
                    onChange={e => setNewActivityForm({ ...newActivityForm, status: e.target.value })}
                  >
                    <option value="planned">Planned</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time"
                  placeholder="e.g. 10:00 AM"
                  value={newActivityForm.startTime}
                  onChange={e => setNewActivityForm({ ...newActivityForm, startTime: e.target.value })}
                />
                <Input
                  label="End Time"
                  placeholder="e.g. 12:30 PM"
                  value={newActivityForm.endTime}
                  onChange={e => setNewActivityForm({ ...newActivityForm, endTime: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date"
                  type="date"
                  value={newActivityForm.scheduledDate || targetDayForAdd}
                  onChange={e => setNewActivityForm({ ...newActivityForm, scheduledDate: e.target.value })}
                  required
                />
                <Input
                  label="Estimated Cost"
                  type="number"
                  placeholder="0"
                  value={newActivityForm.customCost}
                  onChange={e => setNewActivityForm({ ...newActivityForm, customCost: e.target.value })}
                />
              </div>

              <div>
                <label className="input-label">Notes (optional)</label>
                <textarea
                  className="input min-h-[70px] resize-none text-xs"
                  placeholder="Tickets, meeting spot, notes..."
                  value={newActivityForm.notes}
                  onChange={e => setNewActivityForm({ ...newActivityForm, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddActivityOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add to Timeline
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

