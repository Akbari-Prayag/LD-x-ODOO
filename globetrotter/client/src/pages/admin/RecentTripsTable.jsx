import { Link } from 'react-router-dom'
import { Calendar, User, Wallet, ExternalLink } from 'lucide-react'
import { dateRange } from '../../utils/dateUtils.js'
import { formatCurrency } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

export default function RecentTripsTable({ recentTrips = [], loading = false }) {
  const statusBadge = {
    planning: 'bg-ocean-100 text-ocean-800 border-ocean-200',
    upcoming: 'bg-sage-100 text-sage-800 border-sage-200',
    ongoing: 'bg-accent-100 text-accent-800 border-accent-200',
    completed: 'bg-surface-100 text-surface-700 border-surface-200',
  }

  return (
    <div className="card border border-surface-200/90 rounded-2xl bg-white overflow-hidden shadow-sm space-y-0">
      <div className="p-5 border-b border-surface-100 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-display font-bold text-surface-900">
            Recent Platform Trips
          </h3>
          <p className="text-xs text-surface-500">
            Latest itineraries created across all registered accounts
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-100 text-surface-700">
          {recentTrips.length} Loaded
        </span>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-10 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recentTrips.length === 0 ? (
        <div className="p-8 text-center text-xs text-surface-500">
          No platform trips recorded yet.
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface-50 text-surface-500 text-xs uppercase font-semibold border-b border-surface-200">
                <tr>
                  <th className="py-3 px-4">Trip</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {recentTrips.map((trip) => (
                  <tr key={trip.id || trip._id} className="hover:bg-surface-50/70 transition-colors">
                    {/* Trip Name & Cover */}
                    <td className="py-3.5 px-4 font-semibold text-surface-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-surface-100 flex-shrink-0">
                          {trip.coverPhoto ? (
                            <img
                              src={trip.coverPhoto}
                              alt={trip.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <div className="w-full h-full bg-ocean-100 flex items-center justify-center text-ocean-700 font-bold text-xs">
                              ✈
                            </div>
                          )}
                        </div>
                        <span className="truncate max-w-[180px]">{trip.name}</span>
                      </div>
                    </td>

                    {/* Owner */}
                    <td className="py-3.5 px-4 text-surface-600">
                      <div>
                        <p className="font-medium text-surface-800">{trip.owner?.name || 'Anonymous'}</p>
                        <p className="text-[11px] text-surface-400 truncate max-w-[140px]">
                          {trip.owner?.email || '—'}
                        </p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 text-surface-600 whitespace-nowrap">
                      {dateRange(trip.startDate, trip.endDate)}
                    </td>

                    {/* Budget */}
                    <td className="py-3.5 px-4 font-semibold text-surface-900">
                      {formatCurrency(trip.budget, trip.currency || 'INR')}
                    </td>

                    {/* Status */}
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
                      {trip.isPublic && trip.publicSlug ? (
                        <Link
                          to={`/trip/public/${trip.publicSlug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-ocean-600 hover:text-ocean-700 font-medium"
                        >
                          <span>Public</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-[11px] text-surface-400">Private</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-surface-100">
            {recentTrips.map((trip) => (
              <div key={trip.id || trip._id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm text-surface-900 truncate">
                    {trip.name}
                  </h4>
                  <span
                    className={cn(
                      'px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize',
                      statusBadge[trip.status] || 'bg-surface-100 text-surface-700'
                    )}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="text-xs text-surface-500 space-y-0.5">
                  <p>👤 {trip.owner?.name || 'Anonymous'} ({trip.owner?.email || '—'})</p>
                  <p>📅 {dateRange(trip.startDate, trip.endDate)}</p>
                  <p>💰 {formatCurrency(trip.budget, trip.currency || 'INR')}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
