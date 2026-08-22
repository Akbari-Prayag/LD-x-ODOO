import { Wallet, PieChart, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatCurrency, budgetPercentage } from '../../utils/formatUtils.js'
import { cn } from '../../utils/cn.js'

export default function BudgetHighlight({ trips = [], loading = false }) {
  if (loading) {
    return (
      <div className="card p-6 border animate-pulse space-y-4 rounded-2xl">
        <div className="h-4 bg-surface-200 rounded w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-surface-100 rounded-xl" />
          <div className="h-16 bg-surface-100 rounded-xl" />
          <div className="h-16 bg-surface-100 rounded-xl" />
        </div>
        <div className="h-3 bg-surface-200 rounded-full" />
      </div>
    )
  }

  // Calculate overall budget summary
  const totalBudget = trips.reduce((acc, t) => acc + (t.budget || 0), 0)
  const totalSpent = trips.reduce((acc, t) => acc + (t.totalSpent || 0), 0)
  const remaining = totalBudget - totalSpent
  const pct = budgetPercentage(totalSpent, totalBudget)

  const isOverBudget = remaining < 0 && totalBudget > 0
  const isCloseToLimit = pct >= 80 && !isOverBudget

  return (
    <div className="card p-6 border border-surface-200/90 rounded-2xl bg-gradient-to-br from-white via-surface-50/50 to-ocean-50/20 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-100 text-ocean-700 flex items-center justify-center flex-shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-display font-bold text-surface-900">
              Budget Overview
            </h3>
            <p className="text-xs text-surface-500">
              Consolidated financial status across active itineraries
            </p>
          </div>
        </div>

        {totalBudget > 0 && (
          <div className="self-start sm:self-auto">
            {isOverBudget ? (
              <span className="badge badge-danger">
                <AlertTriangle className="w-3 h-3" /> Over Budget
              </span>
            ) : isCloseToLimit ? (
              <span className="badge badge-warning">
                <TrendingUp className="w-3 h-3" /> High Utilization
              </span>
            ) : (
              <span className="badge badge-sage">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </span>
            )}
          </div>
        )}
      </div>

      {totalBudget === 0 && totalSpent === 0 ? (
        <div className="py-4 text-center text-xs text-surface-500 bg-surface-50 rounded-xl border border-dashed border-surface-200">
          No budget data available yet. Set budgets when planning your trips to track spending here!
        </div>
      ) : (
        <div className="space-y-4">
          {/* Key Figures */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-3.5 rounded-xl bg-white border border-surface-100 shadow-sm">
              <p className="text-xs font-semibold text-surface-500">Total Budget</p>
              <p className="text-lg sm:text-xl font-display font-bold text-surface-900 mt-0.5">
                {formatCurrency(totalBudget)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-surface-100 shadow-sm">
              <p className="text-xs font-semibold text-surface-500">Estimated Spent</p>
              <p className="text-lg sm:text-xl font-display font-bold text-ocean-600 mt-0.5">
                {formatCurrency(totalSpent)}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-surface-100 shadow-sm">
              <p className="text-xs font-semibold text-surface-500">Remaining</p>
              <p
                className={cn(
                  'text-lg sm:text-xl font-display font-bold mt-0.5',
                  remaining >= 0 ? 'text-sage-600' : 'text-danger-600'
                )}
              >
                {formatCurrency(remaining)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-medium text-surface-600">
              <span>Overall Utilization</span>
              <span className="font-bold text-surface-800">{pct}%</span>
            </div>

            <div className="h-2.5 w-full bg-surface-100 rounded-full overflow-hidden p-0.5 border border-surface-200/60">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-700',
                  isOverBudget
                    ? 'bg-danger-500'
                    : pct > 75
                    ? 'bg-accent-500'
                    : 'bg-gradient-to-r from-ocean-500 to-sage-500'
                )}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
