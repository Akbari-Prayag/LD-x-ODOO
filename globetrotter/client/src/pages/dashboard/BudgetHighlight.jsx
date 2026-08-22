import { useState } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Wallet, PieChart as PieIcon, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'

export default function BudgetHighlight({ trips = [], onSelectCategory }) {
  const [activeCategory, setActiveCategory] = useState(null)

  // Compute platform/user total budget & spent
  const totalBudget = trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0) || 75000
  const totalSpent = trips.reduce((acc, t) => acc + (Number(t.totalSpent) || 0), 0) || 32000
  const remaining = Math.max(0, totalBudget - totalSpent)
  const pct = budgetPercentage(totalSpent, totalBudget)

  // Category breakdown data
  const categoryData = [
    { name: 'Accommodations', value: Math.round(totalSpent * 0.45) || 14400, color: '#3b72de' },
    { name: 'Flights & Transit', value: Math.round(totalSpent * 0.25) || 8000, color: '#5b8a83' },
    { name: 'Activities & Tours', value: Math.round(totalSpent * 0.20) || 6400, color: '#f5a97f' },
    { name: 'Dining & Food', value: Math.round(totalSpent * 0.10) || 3200, color: '#a5d2c1' },
  ]

  const handleCategoryClick = (entry) => {
    const next = activeCategory === entry.name ? null : entry.name
    setActiveCategory(next)
    onSelectCategory?.(next)
  }

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
            <span>Budget & Expense Breakdown</span>
          </h3>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Interactive breakdown by travel category across all your itineraries
          </p>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
          <span>{pct <= 100 ? `${100 - pct}% remaining` : 'Over budget'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Recharts Interactive Donut Chart */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                onClick={handleCategoryClick}
                cursor="pointer"
              >
                {categoryData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    stroke={activeCategory === entry.name ? '#ffffff' : 'transparent'}
                    strokeWidth={activeCategory === entry.name ? 3 : 0}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(val) => [`₹${val.toLocaleString()}`, 'Estimated']}
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

          {/* Donut Center Total Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xs text-surface-400 font-medium uppercase tracking-wider">Total Spent</span>
            <span className="text-xl font-display font-bold text-surface-900 dark:text-white leading-tight">
              {formatCurrency(totalSpent, 'INR')}
            </span>
            <span className="text-[11px] text-ocean-600 dark:text-ocean-400 font-semibold">{pct}% of Budget</span>
          </div>
        </div>

        {/* Right: Legend & Summary Metrics */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top 3 Summary Pills */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-800">
              <span className="text-[10px] uppercase font-semibold text-surface-400">Total Allocated</span>
              <p className="text-sm font-bold text-surface-900 dark:text-white mt-0.5">{formatCurrency(totalBudget, 'INR')}</p>
            </div>
            <div className="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-800">
              <span className="text-[10px] uppercase font-semibold text-surface-400">Total Spent</span>
              <p className="text-sm font-bold text-ocean-600 dark:text-ocean-400 mt-0.5">{formatCurrency(totalSpent, 'INR')}</p>
            </div>
            <div className="p-3 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-800">
              <span className="text-[10px] uppercase font-semibold text-surface-400">Remaining</span>
              <p className="text-sm font-bold text-sage-600 dark:text-sage-400 mt-0.5">{formatCurrency(remaining, 'INR')}</p>
            </div>
          </div>

          {/* Interactive Category Chips */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Filter by Category
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categoryData.map((cat) => {
                const isSelected = activeCategory === cat.name
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-medium transition-all duration-150 text-left ${
                      isSelected
                        ? 'bg-ocean-50 dark:bg-ocean-950/50 border-ocean-300 dark:border-ocean-700 shadow-sm'
                        : 'bg-white dark:bg-surface-800/40 border-surface-200/80 dark:border-surface-800 hover:bg-surface-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-surface-800 dark:text-surface-200 truncate">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-surface-900 dark:text-white">
                      ₹{cat.value.toLocaleString()}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
