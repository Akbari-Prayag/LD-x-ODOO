import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ExternalLink,
  MapPin,
  Calendar,
  DollarSign,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  MoreVertical,
} from 'lucide-react'
import { dateRange } from '../../utils/dateUtils.js'
import { formatCurrency } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'
import toast from 'react-hot-toast'

export default function RecentTripsTable({
  recentTrips = [],
  statusFilter = null,
  onStatusFilterChange,
}) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortAsc, setSortAsc] = useState(false)

  const statusBadge = {
    planning: 'bg-ocean-100 dark:bg-ocean-950 text-ocean-800 dark:text-ocean-300 border-ocean-200',
    upcoming: 'bg-sage-100 dark:bg-sage-950 text-sage-800 dark:text-sage-300 border-sage-200',
    ongoing: 'bg-sunset-100 dark:bg-sunset-950 text-sunset-800 dark:text-sunset-300 border-sunset-200',
    completed: 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200',
  }

  // Filter trips by search and selected status
  const filtered = recentTrips.filter((trip) => {
    const matchesStatus = !statusFilter || trip.status === statusFilter
    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      trip.name?.toLowerCase().includes(term) ||
      trip.owner?.name?.toLowerCase().includes(term) ||
      trip.owner?.email?.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  // Sort trips
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'budget') {
      return sortAsc ? (a.budget || 0) - (b.budget || 0) : (b.budget || 0) - (a.budget || 0)
    }
    if (sortField === 'name') {
      return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }
    return sortAsc ? 1 : -1
  })

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Trip Name,Owner,Budget,Status,Start Date,End Date']
        .concat(
          sorted.map(
            (t) =>
              `"${t.id || t._id}","${t.name}","${t.owner?.name || 'User'}","${t.budget || 0}","${t.status}","${t.startDate || ''}","${t.endDate || ''}"`
          )
        )
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'triply_trips_report.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Trips report exported successfully!')
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-5">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white">
            Recent Platform Itineraries
          </h3>
          <p className="text-xs text-surface-500">
            Audit, inspect, and monitor travel itineraries created by users across the system
          </p>
        </div>

        {/* Search & Export */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or trip..."
              className="input pl-9 text-xs py-2 rounded-2xl"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 text-surface-700 dark:text-surface-300 text-xs font-semibold transition-colors"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pill */}
      {statusFilter && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-surface-500">Filtering by status:</span>
          <span className="px-2.5 py-0.5 rounded-full font-bold bg-ocean-100 text-ocean-700 uppercase text-[10px]">
            {statusFilter}
          </span>
          <button
            onClick={() => onStatusFilterChange?.(null)}
            className="text-ocean-600 hover:underline font-semibold text-[11px]"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="p-8 text-center text-xs text-surface-500 rounded-2xl bg-surface-50 dark:bg-surface-800/40">
          No itineraries match the search / filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-surface-50 dark:bg-surface-800/60 text-surface-500 text-xs uppercase font-bold border-b border-surface-200 dark:border-surface-700">
              <tr>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-surface-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Trip Details</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Dates</th>
                <th
                  onClick={() => toggleSort('budget')}
                  className="py-3 px-4 cursor-pointer hover:text-surface-900 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Budget</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {sorted.map((trip) => {
                const tripId = trip.id || trip._id
                return (
                  <tr key={tripId} className="hover:bg-surface-50/70 dark:hover:bg-surface-800/40 transition-colors">
                    {/* Trip Name & Cover */}
                    <td className="py-3.5 px-4 font-semibold text-surface-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100'}
                          alt={trip.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-bold">{trip.name}</p>
                          <span className="text-[11px] font-normal text-surface-500">
                            {trip.stops?.length || 1} Stops
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4 text-surface-600 dark:text-surface-300">
                      <div className="space-y-0.5">
                        <p className="font-medium text-surface-900 dark:text-white truncate">
                          {trip.owner?.name || 'User'}
                        </p>
                        <p className="text-[11px] text-surface-400 truncate">{trip.owner?.email}</p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-surface-600 dark:text-surface-300 text-xs">
                      {dateRange(trip.startDate, trip.endDate) || 'Flexible'}
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-bold text-surface-900 dark:text-white text-xs">
                      {formatCurrency(trip.budget || 0, trip.currency || 'INR')}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize',
                          statusBadge[trip.status] || 'bg-surface-100 text-surface-700'
                        )}
                      >
                        {trip.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trip.publicSlug && (
                          <Link
                            to={`/trip/public/${trip.publicSlug}`}
                            target="_blank"
                            className="p-1.5 rounded-xl hover:bg-surface-100 text-surface-500 hover:text-ocean-600 transition-colors"
                            title="Open Public View"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/trips/${tripId}`}
                          className="px-3 py-1 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-ocean-50 text-surface-700 dark:text-surface-200 hover:text-ocean-700 font-semibold text-xs transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
