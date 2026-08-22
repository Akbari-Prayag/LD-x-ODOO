import { format, formatDistance, parseISO, isValid } from 'date-fns'

export const formatDate    = (d, fmt = 'MMM dd, yyyy') => d ? format(parseISO(d instanceof Date ? d.toISOString() : d), fmt) : '—'
export const formatShort   = (d) => formatDate(d, 'MMM dd')
export const formatLong    = (d) => formatDate(d, 'MMMM dd, yyyy')
export const formatRelative = (d) => d ? formatDistance(new Date(d), new Date(), { addSuffix: true }) : '—'
export const dateRange     = (start, end) => `${formatShort(start)} – ${formatShort(end)}`
export const isValidDate   = (d) => isValid(new Date(d))

/**
 * Compute trip duration in days
 */
export function tripDuration(start, end) {
  if (!start || !end) return 0
  const diff = new Date(end) - new Date(start)
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24))) + 1
}

/**
 * Return array of ISO date strings for each day in a range
 */
export function getDaysInRange(start, end) {
  const days = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return days
}
