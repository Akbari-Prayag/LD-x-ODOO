import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { BarChart3 } from 'lucide-react'

const STATUS_CONFIG = {
  planning: { label: 'Planning', color: '#3b72de' },
  upcoming: { label: 'Upcoming', color: '#5b8a83' },
  ongoing: { label: 'Ongoing', color: '#f97316' },
  completed: { label: 'Completed', color: '#22c55e' },
}

export default function TripStatusChart({ tripsByStatus = [], loading = false }) {
  if (loading) {
    return (
      <div className="card p-6 border border-surface-200 rounded-2xl bg-white space-y-4 animate-pulse">
        <div className="h-4 bg-surface-200 rounded w-1/3" />
        <div className="h-60 bg-surface-100 rounded-xl" />
      </div>
    )
  }

  // Normalize data for all 4 statuses
  const statusMap = {}
  tripsByStatus.forEach((item) => {
    if (item._id) statusMap[item._id] = item.count
  })

  const chartData = ['planning', 'upcoming', 'ongoing', 'completed'].map((statusKey) => ({
    name: STATUS_CONFIG[statusKey]?.label || statusKey,
    count: statusMap[statusKey] || 0,
    color: STATUS_CONFIG[statusKey]?.color || '#3b72de',
  }))

  const totalTripsInStatus = chartData.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="card p-6 border border-surface-200/90 rounded-2xl bg-white space-y-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ocean-50 text-ocean-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-surface-900">
              Trip Status Analytics
            </h3>
            <p className="text-xs text-surface-500">
              Distribution of itineraries across lifecycle stages
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-100 text-surface-700">
          {totalTripsInStatus} Active / Logged
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="p-3 bg-surface-900 text-white rounded-xl shadow-lg text-xs space-y-1">
                      <p className="font-semibold text-surface-200">{data.name}</p>
                      <p className="text-sm font-bold text-white">
                        {data.count} {data.count === 1 ? 'Trip' : 'Trips'}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-surface-100">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-surface-600 font-medium">{item.name}:</span>
            <span className="font-bold text-surface-800">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
