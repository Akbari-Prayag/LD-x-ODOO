import { useState, useEffect } from 'react'
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'

import AdminStats from './AdminStats.jsx'
import TripStatusChart from './TripStatusChart.jsx'
import RecentTripsTable from './RecentTripsTable.jsx'
import PopularCities from './PopularCities.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAdminStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await api.get('/admin/stats')
      if (res.data.success) {
        setData(res.data)
      } else {
        setError(res.data.message || 'Failed to fetch administrator statistics')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access denied or server error loading admin statistics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdminStats()
  }, [])

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fade-in pb-12">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-100 text-ocean-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">
            Platform Analytics & Overview
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Monitor real-time platform engagement, trip statistics, and destinations.
          </p>
        </div>

        <div>
          <button
            onClick={fetchAdminStats}
            disabled={loading}
            className="btn btn-outline btn-sm inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {!loading && error && (
        <div className="card p-8 bg-white border border-danger-200">
          <ErrorState message={error} onRetry={fetchAdminStats} />
        </div>
      )}

      {/* Top Metric Cards */}
      <AdminStats stats={data?.stats} loading={loading} />

      {/* Chart Section */}
      <TripStatusChart
        tripsByStatus={data?.tripsByStatus || []}
        loading={loading}
      />

      {/* Tables / Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTripsTable
            recentTrips={data?.recentTrips || []}
            loading={loading}
          />
        </div>

        <div className="lg:col-span-1">
          <PopularCities
            popularCities={data?.popularCities || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
