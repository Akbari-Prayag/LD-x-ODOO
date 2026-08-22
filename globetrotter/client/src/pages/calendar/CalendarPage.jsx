import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Clock3,
  Compass,
  DollarSign,
  Eye,
  Filter,
  Layers,
  List,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  X,
} from 'lucide-react'
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrip, fetchTrips, selectCurrentTrip, selectTrips } from '../../store/slices/tripsSlice.js'
import { EXPENSE_COLORS, formatCurrency } from '../../utils/formatUtils.js'
import Button from '../../components/ui/Button.jsx'

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

const toDate = value => new Date(`${String(value).slice(0, 10)}T00:00:00`)
const keyOf = value => format(value, 'yyyy-MM-dd')
const getId = item => item.id ?? item._id

export default function CalendarPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const currentTrip = useSelector(selectCurrentTrip)
  const trips = useSelector(selectTrips)

  const [viewMode, setViewMode] = useState('calendar') // 'calendar' | 'timeline'
  const [selectedTripId, setSelectedTripId] = useState(id || 'all')
  const [month, setMonth] = useState(startOfMonth(new Date()))
  const [search, setSearch] = useState('')
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)

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

  // Focused Trip
  const activeFocusedTrip = useMemo(() => {
    if (selectedTripId === 'all') return currentTrip || trips[0] || null
    return trips.find(t => String(getId(t)) === String(selectedTripId)) || currentTrip || null
  }, [selectedTripId, trips, currentTrip])

  // Events on a given calendar day
  const getEventsForDay = (day) => {
    const dayKey = keyOf(day)
    return events.filter(event => {
      const s = keyOf(event.start)
      const e = keyOf(event.end)
      return dayKey >= s && dayKey <= e
    })
  }

  // Activities for a focused trip or all trips on a day
  const getActivitiesForDay = (day) => {
    const dayKey = keyOf(day)
    const activeTripsList = selectedTripId === 'all'
      ? trips
      : trips.filter(t => String(getId(t)) === String(selectedTripId))

    const list = []
    activeTripsList.forEach(t => {
      (t.stops || []).forEach(stop => {
        (stop.activities || []).forEach(act => {
          const actDate = act.scheduledDate ? String(act.scheduledDate).slice(0, 10) : ''
          const stopStart = String(stop.arrivalDate || '').slice(0, 10)
          const stopEnd = String(stop.departureDate || '').slice(0, 10)

          if (actDate === dayKey || (!actDate && dayKey >= stopStart && dayKey <= stopEnd)) {
            list.push({
              ...act,
              tripName: t.name,
              currency: t.currency,
              stopCity: stop.city?.name || stop.customCityName || 'City Stop',
            })
          }
        })
      })
    })
    return list
  }

  // Timeline Days Sequence for the active focused trip
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
      const activities = stops.flatMap(stop =>
        (stop.activities || []).map(act => ({
          ...act,
          stopCity: stop.city?.name || stop.customCityName || 'City Stop',
          currency: activeFocusedTrip.currency,
        }))
      )

      result.push({
        date: new Date(cur),
        dateKey,
        stops,
        activities,
      })
    }
    return result
  }, [activeFocusedTrip])

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
            Visualize your full itinerary through a monthly interactive calendar or vertical day-by-day flow.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="inline-flex rounded-xl border border-surface-200 bg-surface-100 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#2d3e86] shadow-sm'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <List className="w-3.5 h-3.5" /> Timeline View
            </button>
          </div>

          <Link
            to="/trips/create"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#4677d9] hover:bg-[#2d3e86] px-4 py-2 text-xs font-semibold text-white shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Plan Trip
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
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
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            className="input pl-10 text-sm"
            placeholder="Search trips, activities, or places..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <select
              className="input pl-10 md:w-56 text-sm"
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="!rounded-xl"
            onClick={() => setMonth(startOfMonth(new Date()))}
          >
            Today
          </Button>
        </div>
      </div>

      {/* MAIN VIEW: CALENDAR OR TIMELINE */}
      {viewMode === 'calendar' ? (
        <div className="grid gap-5 xl:grid-cols-[250px_1fr]">
          {/* Left Mini Sidebar */}
          <aside className="space-y-4">
            {/* Mini Calendar Month Picker */}
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

            {/* Trips List in Sidebar */}
            <section className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-surface-900 text-sm">Active Trips</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-100 text-surface-600">
                  {events.length}
                </span>
              </div>

              {events.length === 0 ? (
                <p className="text-xs text-surface-400 py-3 text-center">No trips found</p>
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

          {/* Large Monthly Calendar Grid */}
          <section className="card overflow-hidden min-w-0 flex flex-col">
            {/* Month Header Nav */}
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
                Click any date cell to view scheduled stops and activities.
              </div>
            </div>

            {/* Days of Week Headers */}
            <div className="grid grid-cols-7 border-b border-surface-100 bg-surface-50/80">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div
                  key={d}
                  className="px-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wider text-surface-500"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
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

                    {/* Event bars */}
                    <div className="space-y-1 mt-1.5">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div
                          key={ev.id}
                          className={`truncate rounded-md border px-1.5 py-0.5 text-[10px] font-semibold transition-colors ${
                            colorClasses[ev.color] || colorClasses.blue
                          }`}
                          title={`${ev.name} (${format(ev.start, 'MMM d')} - ${format(ev.end, 'MMM d')})`}
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
        /* TIMELINE VIEW (Vertical Day-by-Day Journey) */
        <section className="card p-5 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-100">
            <div>
              <h2 className="text-xl font-display font-bold text-surface-900">
                Itinerary Timeline – {activeFocusedTrip?.name || 'Trip Route'}
              </h2>
              <p className="text-xs text-surface-500 mt-1">
                Day-by-day chronological travel flow from start to finish.
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
              {timelineDays.map((dayItem, index) => (
                <div key={dayItem.dateKey} className="relative pb-8 last:pb-2">
                  {/* Timeline Dot */}
                  <div className="absolute -left-4 md:-left-8 top-1 w-4 h-4 rounded-full bg-[#4677d9] ring-4 ring-white shadow-xs" />

                  {/* Day Header Box */}
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

                      {dayItem.stops[0] && (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4677d9] bg-white border border-primary-100 rounded-lg px-2.5 py-1 shadow-2xs">
                          <MapPin className="w-3.5 h-3.5 text-[#4677d9]" />
                          <span>{dayItem.stops[0].city?.name || dayItem.stops[0].customCityName || 'City Stop'}</span>
                        </div>
                      )}
                    </div>

                    {/* Activities in Day */}
                    {dayItem.activities.length > 0 ? (
                      <div className="grid gap-2.5 sm:grid-cols-2 mt-3">
                        {dayItem.activities.map((act) => (
                          <div
                            key={getId(act)}
                            onClick={() => setSelectedActivity(act)}
                            className="bg-white border border-surface-200 hover:border-[#4677d9] rounded-xl p-3.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-surface-900 text-xs md:text-sm truncate">
                                  {act.activity?.name || act.customName || 'Activity'}
                                </span>
                                {act.category && (
                                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-100 text-surface-600 capitalize shrink-0">
                                    {act.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-surface-500 mt-1 line-clamp-2">
                                {act.activity?.description || act.notes || 'No extra notes provided.'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-surface-500 mt-3 pt-2 border-t border-surface-100">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-surface-400" />
                                {act.startTime || 'Flexible'}
                              </span>
                              <span className="font-semibold text-surface-900">
                                {act.cost ? formatCurrency(act.cost, act.currency) : 'Free'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-surface-400 py-2">
                        No specific activities planned for this day yet. Relax or explore the city freely!
                      </p>
                    )}
                  </div>
                </div>
              ))}
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
              {/* Trips active on this day */}
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
                <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500 mb-2">
                  Planned Activities ({getActivitiesForDay(selectedDay).length})
                </h4>
                {getActivitiesForDay(selectedDay).length === 0 ? (
                  <p className="text-xs text-surface-400">No activities scheduled for this date.</p>
                ) : (
                  <div className="space-y-2">
                    {getActivitiesForDay(selectedDay).map(act => (
                      <div
                        key={getId(act)}
                        onClick={() => {
                          setSelectedDay(null)
                          setSelectedActivity(act)
                        }}
                        className="p-3 rounded-xl border border-surface-200 bg-white hover:border-[#4677d9] transition-all cursor-pointer shadow-2xs flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-surface-900 text-xs truncate">
                            {act.activity?.name || act.customName || 'Activity'}
                          </p>
                          <p className="text-[10px] text-surface-500 mt-0.5">
                            {act.stopCity} · {act.startTime || 'Time not set'}
                          </p>
                        </div>
                        <span className="font-bold text-xs text-surface-800 shrink-0">
                          {act.cost ? formatCurrency(act.cost, act.currency) : 'Free'}
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

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-surface-200 w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-surface-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#4677d9] px-2 py-0.5 bg-primary-50 rounded-full">
                  {selectedActivity.category || 'Activity'}
                </span>
                <h3 className="font-display font-bold text-lg text-surface-900 mt-1">
                  {selectedActivity.activity?.name || selectedActivity.customName || 'Activity Details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="text-surface-400 hover:text-surface-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-surface-50 p-3 rounded-xl border border-surface-100">
                <div>
                  <span className="text-surface-400 block text-[10px]">Location</span>
                  <span className="font-semibold text-surface-800 text-xs">
                    {selectedActivity.stopCity || 'City Stop'}
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Time / Duration</span>
                  <span className="font-semibold text-surface-800 text-xs">
                    {selectedActivity.startTime || 'Flexible'} · {selectedActivity.activity?.duration || 2}h
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Estimated Cost</span>
                  <span className="font-semibold text-surface-800 text-xs">
                    {selectedActivity.cost
                      ? formatCurrency(selectedActivity.cost, selectedActivity.currency)
                      : 'Free'}
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Rating</span>
                  <span className="font-semibold text-surface-800 text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedActivity.activity?.rating || '4.8'} / 5.0
                  </span>
                </div>
              </div>

              {selectedActivity.activity?.description && (
                <div>
                  <span className="font-semibold text-surface-700 block mb-1">Description</span>
                  <p className="text-surface-600 leading-relaxed bg-white border border-surface-100 p-3 rounded-xl">
                    {selectedActivity.activity.description}
                  </p>
                </div>
              )}

              {selectedActivity.notes && (
                <div>
                  <span className="font-semibold text-surface-700 block mb-1">Traveler Notes</span>
                  <p className="text-surface-600 italic bg-white border border-surface-100 p-3 rounded-xl">
                    {selectedActivity.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-surface-100 flex justify-end">
              <Button
                type="button"
                className="!bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
                onClick={() => setSelectedActivity(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

