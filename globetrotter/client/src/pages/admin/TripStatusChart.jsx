import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { PieChart as PieIcon, Filter } from 'lucide-react'

export default function TripStatusChart({
  tripsByStatus = [],
  selectedStatus = null,
  onSelectStatus,
}) {
  const statusColors = {
    planning: '#3b72de',
    upcoming: '#5b8a83',
    ongoing: '#ee8c5e',
    completed: '#a5d2c1',
  }

  const statusLabels = {
    planning: 'Planning',
    upcoming: 'Upcoming',
    ongoing: 'Ongoing',
    completed: 'Completed',
  }

  const data = tripsByStatus.map((item) => ({
    name: statusLabels[item.status] || item.status,
    rawStatus: item.status,
    count: Number(item.count) || 0,
    color: statusColors[item.status] || '#94a3b8',
  }))

  const total = data.reduce((acc, curr) => acc + curr.count, 0) || 1

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
            <span>Trip Lifecycle Status Distribution</span>
          </h3>
          <p className="text-xs text-surface-500">
            Click a status slice to filter the platform itineraries table below
          </p>
        </div>

        {selectedStatus && (
          <button
            onClick={() => onSelectStatus?.(null)}
            className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-600 hover:text-surface-900 flex items-center gap-1"
          >
            <span>Clear filter</span>
          </button>
        )}
      </div>

      {/* Recharts Donut */}
      <div className="relative flex items-center justify-center min-h-[220px]">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="count"
              onClick={(entry) =>
                onSelectStatus?.(selectedStatus === entry.rawStatus ? null : entry.rawStatus)
              }
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.rawStatus}
                  fill={entry.color}
                  stroke={selectedStatus === entry.rawStatus ? '#ffffff' : 'transparent'}
                  strokeWidth={selectedStatus === entry.rawStatus ? 3 : 0}
                  className="transition-all duration-200 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(val, name) => [`${val} Trips`, name]}
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-[11px] text-surface-400 font-semibold uppercase tracking-wider">Total</span>
          <span className="text-2xl font-display font-bold text-surface-900 dark:text-white leading-tight">
            {total}
          </span>
          <span className="text-[10px] text-ocean-600 dark:text-ocean-400 font-semibold">Itineraries</span>
        </div>
      </div>

      {/* Category Pills / Filter Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {data.map((item) => {
          const isSelected = selectedStatus === item.rawStatus
          return (
            <button
              key={item.rawStatus}
              onClick={() => onSelectStatus?.(isSelected ? null : item.rawStatus)}
              className={`p-2.5 rounded-2xl border text-xs font-semibold transition-all flex items-center justify-between gap-1.5 ${
                isSelected
                  ? 'bg-ocean-50 dark:bg-ocean-950/50 border-ocean-400 dark:border-ocean-700 shadow-sm'
                  : 'bg-surface-50 dark:bg-surface-800/40 border-surface-100 dark:border-surface-800 hover:bg-surface-100'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}</span>
              </div>
              <span className="text-surface-900 dark:text-white font-bold">{item.count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
