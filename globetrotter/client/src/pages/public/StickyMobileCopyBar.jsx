import { motion } from 'framer-motion'
import { Copy, Sparkles } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import { formatCurrency } from '../../utils/formatUtils.js'

export default function StickyMobileCopyBar({
  trip,
  onCopyClick,
  isCopying = false,
}) {
  if (!trip) return null

  const cost = trip.budget || 50000

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-t border-surface-200/80 dark:border-surface-800 shadow-2xl flex items-center justify-between gap-3">
      <div className="space-y-0.5 min-w-0 pl-1">
        <span className="text-[10px] uppercase font-bold text-surface-400">Total Est.</span>
        <p className="text-sm font-bold text-ocean-600 dark:text-ocean-400 truncate">
          {formatCurrency(cost, trip.currency || 'INR')}
        </p>
      </div>

      <Button
        onClick={onCopyClick}
        loading={isCopying}
        variant="ocean"
        size="md"
        className="rounded-2xl shadow-glow font-bold text-xs flex-1"
        leftIcon={<Copy className="w-4 h-4" />}
      >
        Copy Itinerary
      </Button>
    </div>
  )
}
