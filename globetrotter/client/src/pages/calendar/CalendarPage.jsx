import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Filter, MapPin, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { addDays, addMonths, differenceInCalendarDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrip, fetchTrips, selectCurrentTrip, selectTrips } from '../../store/slices/tripsSlice.js'
import { formatCurrency } from '../../utils/formatUtils.js'

const colors = ['pink', 'blue', 'green', 'purple']
const colorClasses = {
  pink: 'bg-pink-100 text-pink-700 border-pink-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
}
const toDate = value => new Date(`${String(value).slice(0, 10)}T00:00:00`)
const keyOf = value => format(value, 'yyyy-MM-dd')
const getId = item => item.id ?? item._id

export default function CalendarPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const trip = useSelector(selectCurrentTrip)
  const trips = useSelector(selectTrips)
  const [month, setMonth] = useState(startOfMonth(new Date()))
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('date')

  useEffect(() => {
    dispatch(fetchTrips())
    if (!trip || String(getId(trip)) !== id) dispatch(fetchTrip(id))
  }, [dispatch, id, trip])

  useEffect(() => {
    if (trip?.startDate) setMonth(startOfMonth(toDate(trip.startDate)))
  }, [trip?.startDate])

  const days = useMemo(() => {
    const first = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
    const last = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
    const result = []
    for (let day = first; day <= last; day = addDays(day, 1)) result.push(day)
    return result
  }, [month])

  const events = useMemo(() => {
    const tripEvents = trips.map((item, index) => ({
      id: getId(item),
      name: item.name,
      start: toDate(item.startDate),
      end: toDate(item.endDate),
      budget: item.budget || 0,
      color: colors[index % colors.length],
    }))
    return tripEvents
      .filter(event => !search || event.name.toLowerCase().includes(search.toLowerCase()))
      .filter(event => filter === 'all' || event.id === filter)
      .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : a.start - b.start)
  }, [filter, search, sort, trips])

  const tripDays = trip?.startDate && trip?.endDate ? differenceInCalendarDays(toDate(trip.endDate), toDate(trip.startDate)) + 1 : 0
  const monthTrips = events.filter(event => event.start <= endOfMonth(month) && event.end >= startOfMonth(month))
  const estimatedBudget = monthTrips.reduce((total, item) => total + item.budget, 0)
  const nextTrip = [...trips]
    .filter(item => toDate(item.startDate) >= startOfMonth(new Date()))
    .sort((a, b) => toDate(a.startDate) - toDate(b.startDate))[0]
  const getEventsForDay = day => events.filter(event => keyOf(day) >= keyOf(event.start) && keyOf(day) <= keyOf(event.end))

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">Plan at a glance</p>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-surface-900 mt-1">Calendar view</h1>
          <p className="text-sm text-surface-500 mt-1">Your trips, dates, and next destination in one calm view.</p>
        </div>
        <Link to="/trips/create" className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"><Sparkles className="w-4 h-4" /> Add new trip</Link>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><input className="input pl-9" placeholder="Search trips..." value={search} onChange={event => setSearch(event.target.value)} /></div>
        <div className="relative"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><select className="input pl-9 md:w-44" value={filter} onChange={event => setFilter(event.target.value)}><option value="all">All trips</option>{trips.map(item => <option key={getId(item)} value={getId(item)}>{item.name}</option>)}</select></div>
        <div className="relative"><SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" /><select className="input pl-9 md:w-40" value={sort} onChange={event => setSort(event.target.value)}><option value="date">Sort by date</option><option value="name">Sort by name</option></select></div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[225px_1fr]">
        <aside className="space-y-5">
          <section className="card p-4">
            <div className="flex items-center justify-between mb-4"><h2 className="font-semibold text-surface-900">{format(month, 'MMMM yyyy')}</h2><div className="flex gap-1"><button type="button" aria-label="Previous month" className="p-1 text-surface-500 hover:text-primary-600" onClick={() => setMonth(value => subMonths(value, 1))}><ChevronLeft className="w-4 h-4" /></button><button type="button" aria-label="Next month" className="p-1 text-surface-500 hover:text-primary-600" onClick={() => setMonth(value => addMonths(value, 1))}><ChevronRight className="w-4 h-4" /></button></div></div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] text-surface-400 mb-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs">{days.map(day => <button type="button" key={day.toISOString()} className={`mx-auto w-6 h-6 rounded-full ${!isSameMonth(day, month) ? 'text-surface-300' : 'text-surface-700'} ${isSameDay(day, new Date()) ? 'bg-primary-600 text-white font-bold' : ''}`} onClick={() => setMonth(startOfMonth(day))}>{format(day, 'd')}</button>)}</div>
          </section>
          <section className="card p-4"><div className="flex items-center justify-between mb-3"><h2 className="font-semibold text-surface-900">My trips</h2><span className="text-xs text-surface-400">{events.length}</span></div><div className="space-y-2">{events.slice(0, 5).map(event => <button type="button" key={event.id} className="w-full text-left rounded-xl border border-surface-100 p-3 hover:border-primary-200 hover:bg-primary-50/30" onClick={() => setMonth(startOfMonth(event.start))}><span className={`inline-block w-2 h-2 rounded-full mr-2 ${event.color === 'pink' ? 'bg-pink-400' : event.color === 'blue' ? 'bg-blue-500' : event.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`} /><span className="text-sm font-medium text-surface-800">{event.name}</span><p className="text-xs text-surface-500 mt-1 ml-4">{format(event.start, 'MMM d')} - {format(event.end, 'MMM d, yyyy')}</p></button>)}</div></section>
        </aside>

        <section className="card overflow-hidden min-w-0">
          <div className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-surface-100"><div className="flex items-center gap-3"><button type="button" aria-label="Previous month" className="p-2 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50" onClick={() => setMonth(value => subMonths(value, 1))}><ChevronLeft className="w-4 h-4" /></button><h2 className="text-xl md:text-2xl font-display font-bold text-surface-900">{format(month, 'MMMM yyyy')}</h2><button type="button" aria-label="Next month" className="p-2 rounded-lg border border-surface-200 text-surface-600 hover:bg-surface-50" onClick={() => setMonth(value => addMonths(value, 1))}><ChevronRight className="w-4 h-4" /></button></div><button type="button" className="rounded-lg border border-primary-200 px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50" onClick={() => setMonth(startOfMonth(new Date()))}>Today</button></div>
          <div className="grid grid-cols-7 border-b border-surface-100">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-surface-400">{day}</div>)}</div>
          <div className="grid grid-cols-7">{days.map(day => { const dayEvents = getEventsForDay(day); return <div key={day.toISOString()} className={`min-h-28 md:min-h-32 border-r border-b border-surface-100 p-2 ${!isSameMonth(day, month) ? 'bg-surface-50/60' : ''}`}><div className={`text-xs font-semibold ${isSameDay(day, new Date()) ? 'inline-flex w-6 h-6 items-center justify-center rounded-full bg-primary-600 text-white' : 'text-surface-500'}`}>{format(day, 'd')}</div><div className="space-y-1 mt-2">{dayEvents.map(event => <div key={event.id} className={`truncate rounded-md border px-2 py-1 text-[10px] font-semibold ${colorClasses[event.color]}`} title={event.name}><MapPin className="inline w-3 h-3 mr-1" />{event.name}</div>)}</div></div> })}</div>
        </section>
      </div>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[[CalendarDays, 'Total trips', trips.length, 'This month'], [Clock3, 'Total days', tripDays || 0, 'Selected trip'], [CircleDollarSign, 'Est. budget', formatCurrency(estimatedBudget, trip?.currency), 'This month'], [MapPin, 'Next trip', nextTrip?.name || 'No upcoming trip', nextTrip ? format(toDate(nextTrip.startDate), 'MMM d, yyyy') : 'Plan something new']].map(([Icon, label, value, note]) => <div key={label} className="card p-4 flex items-start gap-3"><div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div><div className="min-w-0"><p className="text-xs text-surface-500">{label}</p><p className="font-semibold text-surface-900 mt-1 truncate">{value}</p><p className="text-[11px] text-surface-400 mt-0.5">{note}</p></div></div>)}</section>
    </div>
  )
}
