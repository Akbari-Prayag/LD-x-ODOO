/**
 * Format currency
 * @param {number} amount
 * @param {string} currency - ISO 4217 code e.g. 'INR', 'USD', 'EUR'
 */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

/**
 * Short form: 1200 -> ₹1.2K
 */
export function formatCurrencyShort(amount, currency = 'INR') {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000)     return `${(amount / 1_000).toFixed(1)}K`
  return formatCurrency(amount, currency)
}

/**
 * Budget usage percentage
 */
export function budgetPercentage(spent, total) {
  if (!total) return 0
  return Math.min(100, Math.round((spent / total) * 100))
}

/**
 * Category colors for charts
 */
export const EXPENSE_COLORS = {
  transport:   '#6366f1',
  stay:        '#f97316',
  activities:  '#22c55e',
  meals:       '#f59e0b',
  other:       '#94a3b8',
}

export const EXPENSE_CATEGORIES = [
  { value: 'transport',  label: 'Transport',  color: EXPENSE_COLORS.transport  },
  { value: 'stay',       label: 'Stay',       color: EXPENSE_COLORS.stay       },
  { value: 'activities', label: 'Activities', color: EXPENSE_COLORS.activities },
  { value: 'meals',      label: 'Meals',      color: EXPENSE_COLORS.meals      },
  { value: 'other',      label: 'Other',      color: EXPENSE_COLORS.other      },
]
