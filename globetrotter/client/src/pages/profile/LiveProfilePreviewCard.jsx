import { motion } from 'framer-motion'
import { User, ShieldCheck, DollarSign, Globe, CheckCircle2, Sparkles } from 'lucide-react'
import { formatCurrency } from '../../utils/formatUtils.js'

export default function LiveProfilePreviewCard({
  formData = {},
  user = {},
  tripsCount = 0,
  savedPlacesCount = 0,
}) {
  const name = formData.name || user.name || 'Traveler Name'
  const email = user.email || 'traveler@globetrotter.com'
  const avatar = formData.avatar || user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  const role = user.role || 'user'
  const currency = formData.currency || user.currency || 'INR'
  const language = formData.language || user.language || 'en'

  // Profile completeness score
  let completeness = 60
  if (user.avatar || formData.avatar) completeness += 20
  if (user.preferences || formData.currency) completeness += 20

  // Live Currency Converter Sample
  const sampleINR = 1000
  const rates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.82, AED: 0.044, CAD: 0.016, AUD: 0.018 }
  const converted = (sampleINR * (rates[currency] || 1)).toFixed(2)

  return (
    <div className="sticky top-24 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft p-6 space-y-6">
      {/* Live Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-surface-400">
          Live Profile Preview
        </span>
        <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Syncing Live</span>
        </span>
      </div>

      {/* User Avatar & Name Card */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-ocean-100 dark:ring-ocean-900 shadow-md transition-all duration-300"
          />
          {role === 'admin' && (
            <div
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-accent-500 text-white shadow-sm"
              title="Administrator"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h4 className="text-lg font-display font-bold text-surface-900 dark:text-white truncate max-w-[220px]">
            {name}
          </h4>
          <p className="text-xs text-surface-400 truncate max-w-[220px]">{email}</p>
        </div>

        <span
          className={`px-3 py-0.5 text-xs font-semibold rounded-full capitalize ${
            role === 'admin'
              ? 'bg-accent-100 text-accent-800 border border-accent-200'
              : 'bg-ocean-100 text-ocean-800 border border-ocean-200'
          }`}
        >
          {role === 'admin' ? '🛡️ Admin Account' : '✈️ Traveler'}
        </span>
      </div>

      {/* Completeness Meter */}
      <div className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-surface-700 dark:text-surface-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sunset-500" />
            <span>Profile Completeness</span>
          </span>
          <span className="font-bold text-ocean-600 dark:text-ocean-400">{completeness}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-sage-500"
          />
        </div>
      </div>

      {/* Active Settings Snapshot */}
      <div className="space-y-2.5 pt-1 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-800">
          <span className="text-surface-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-ocean-600" />
            <span>Currency Preview</span>
          </span>
          <span className="font-bold text-surface-900 dark:text-white">
            ₹1,000 ≈ {currency} {converted}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/40 border border-surface-100 dark:border-surface-800">
          <span className="text-surface-500 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-sage-600" />
            <span>Language</span>
          </span>
          <span className="font-semibold text-surface-800 dark:text-surface-200 uppercase">
            {language}
          </span>
        </div>
      </div>
    </div>
  )
}
