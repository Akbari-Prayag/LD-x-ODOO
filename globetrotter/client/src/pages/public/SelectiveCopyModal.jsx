import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckSquare, Square, X, Copy, MapPin, Sparkles, DollarSign } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import { formatCurrency } from '../../utils/formatUtils.js'

export default function SelectiveCopyModal({
  trip,
  isOpen,
  onClose,
  onConfirmCopy,
  isCopying = false,
}) {
  if (!isOpen || !trip) return null

  const stops = trip.stops || []

  // Initialize all stop IDs as checked by default
  const [selectedStopIds, setSelectedStopIds] = useState(
    new Set(stops.map((s) => s.id || s._id))
  )

  const toggleStop = (stopId) => {
    setSelectedStopIds((prev) => {
      const next = new Set(prev)
      if (next.has(stopId)) next.delete(stopId)
      else next.add(stopId)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedStopIds.size === stops.length) {
      setSelectedStopIds(new Set())
    } else {
      setSelectedStopIds(new Set(stops.map((s) => s.id || s._id)))
    }
  }

  // Calculate estimated cost of selected stops
  const estimatedCost = stops
    .filter((s) => selectedStopIds.has(s.id || s._id))
    .reduce((acc, s) => {
      const stayCost = Number(s.accommodationCost) || 0
      const actCost = (s.activities || []).reduce((a, act) => a + (Number(act.customCost) || 0), 0)
      return acc + stayCost + actCost
    }, 0) || trip.budget || 50000

  const handleCopy = () => {
    onConfirmCopy(Array.from(selectedStopIds))
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white dark:bg-surface-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white space-y-5 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-100 dark:border-surface-800 pb-4">
          <div className="space-y-0.5">
            <h3 className="text-lg font-display font-bold flex items-center gap-2">
              <Copy className="w-5 h-5 text-ocean-600" />
              <span>Customize Copy Itinerary</span>
            </h3>
            <p className="text-xs text-surface-500">
              Select which destinations and stops you'd like to import into your account.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-100 text-surface-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Select All Toggle */}
        <div className="flex items-center justify-between text-xs px-1">
          <button
            onClick={toggleAll}
            className="font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1.5"
          >
            {selectedStopIds.size === stops.length ? (
              <CheckSquare className="w-4 h-4 text-ocean-600" />
            ) : (
              <Square className="w-4 h-4 text-surface-400" />
            )}
            <span>{selectedStopIds.size === stops.length ? 'Deselect All' : 'Select All Stops'}</span>
          </button>

          <span className="text-surface-400">
            {selectedStopIds.size} of {stops.length} stops selected
          </span>
        </div>

        {/* Stops List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {stops.map((stop, idx) => {
            const stopId = stop.id || stop._id
            const isChecked = selectedStopIds.has(stopId)
            const stopName = stop.city?.name || stop.customCityName || `Stop ${idx + 1}`
            const activitiesCount = stop.activities?.length || 0

            return (
              <div
                key={stopId}
                onClick={() => toggleStop(stopId)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-ocean-50/60 dark:bg-ocean-950/40 border-ocean-300 dark:border-ocean-800'
                    : 'bg-surface-50 dark:bg-surface-800/40 border-surface-200 dark:border-surface-700 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-ocean-600 flex-shrink-0">
                    {isChecked ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-surface-400" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-surface-900 dark:text-white truncate">
                      {idx + 1}. {stopName}
                    </h4>
                    <p className="text-[11px] text-surface-500">
                      {activitiesCount} scheduled activities
                    </p>
                  </div>
                </div>

                {stop.accommodationName && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 truncate max-w-[120px]">
                    🏨 {stop.accommodationName}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Live Cost Counter & Submit */}
        <div className="pt-3 border-t border-surface-100 dark:border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5 w-full sm:w-auto">
            <span className="text-[11px] uppercase font-semibold text-surface-400">Estimated Budget</span>
            <p className="text-base font-bold text-ocean-600 dark:text-ocean-400">
              {formatCurrency(estimatedCost, trip.currency || 'INR')}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button onClick={onClose} variant="ghost" size="sm" className="rounded-xl flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button
              onClick={handleCopy}
              loading={isCopying}
              disabled={selectedStopIds.size === 0}
              variant="ocean"
              size="md"
              className="rounded-xl flex-1 sm:flex-none shadow-md"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Import ({selectedStopIds.size} Stops)
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
