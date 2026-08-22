import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Activity,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'

import AdminStats from './AdminStats.jsx'
import TripStatusChart from './TripStatusChart.jsx'
import RecentTripsTable from './RecentTripsTable.jsx'
import PopularCities from './PopularCities.jsx'
import GlobalActivityMap from './GlobalActivityMap.jsx'
import Button from '../../components/ui/Button.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [prevStats, setPrevStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchAdminStats = async (isPoll = false) => {
    try {
      if (!isPoll) setLoading(true)
      else setRefreshing(true)

      const res = await api.get('/admin/stats')
      if (res.data.success) {
        if (data?.stats) {
          setPrevStats(data.stats)
        }
        setData(res.data)
        setLastUpdated(new Date())
        setError(null)
      }
    } catch (err) {
      if (!isPoll) {
        setError(err.response?.data?.message || 'Failed to load administrator statistics')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAdminStats()
  }, [])

  // 30-Second live polling
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAdminStats(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [data])

  if (error && !data) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <ErrorState message={error} onRetry={() => fetchAdminStats(false)} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-200 dark:border-surface-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent-100 dark:bg-accent-950/60 text-accent-800 dark:text-accent-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </span>

            {/* Live Status Pulse */}
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Healthy · 30s Live Poll</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 dark:text-white">
            Operations & Analytics Control Center
          </h1>
          <p className="text-xs sm:text-sm text-surface-500">
            Real-time platform metrics, user bookings, itinerary statuses, and global travel trends
          </p>
        </div>

        {/* Refresh button & Last Updated */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-surface-400 hidden sm:inline">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>

          <Button
            onClick={() => fetchAdminStats(true)}
            loading={refreshing}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            className="rounded-2xl shadow-sm"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* 1. Metric Stat Cards with Count-up and Deltas */}
      <AdminStats
        stats={data?.stats}
        prevStats={prevStats}
        loading={loading}
      />

      {/* 2. Charts Row: Status Donut & Top Cities Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Trip Status Donut with Table Cross-Filter */}
        <div className="lg:col-span-7">
          <TripStatusChart
            tripsByStatus={data?.tripsByStatus || []}
            selectedStatus={selectedStatusFilter}
            onSelectStatus={(status) => setSelectedStatusFilter(status)}
          />
        </div>

        {/* Top Cities Leaderboard */}
        <div className="lg:col-span-5">
          <PopularCities popularCities={data?.popularCities || []} />
        </div>
      </div>

      {/* 3. Global Activity Heatmap */}
      <GlobalActivityMap popularCities={data?.popularCities || []} />

      {/* 4. Recent Itineraries Table with Search, Filter & CSV Export */}
      <RecentTripsTable
        recentTrips={data?.recentTrips || []}
        statusFilter={selectedStatusFilter}
        onStatusFilterChange={(status) => setSelectedStatusFilter(status)}
      />
    </motion.div>
  )
}
