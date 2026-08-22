import { motion } from 'framer-motion'
import { User, ShieldCheck, DollarSign, Globe, Sparkles } from 'lucide-react'

export default function LiveProfilePreviewCard({ formData = {}, user = {} }) {
  const name = formData.name || user?.name || 'Traveler'
  const email = user?.email || 'traveler@triply.app'
  const avatar =
    formData.avatar ||
    user?.avatar ||
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
  const role = user?.role || 'user'
  const currency = formData.currency || user?.currency || 'INR'
  const language = formData.language || user?.language || 'en'

  // Completeness score
  let completeness = 60
  if (formData.avatar || user?.avatar) completeness += 20
  if (formData.currency || user?.currency) completeness += 20

  // Rates calculation
  const sampleINR = 1000
  const rates = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    JPY: 1.82,
    AED: 0.044,
    CAD: 0.016,
    AUD: 0.018,
  }
  const converted = (sampleINR * (rates[currency] || 1)).toFixed(2)

  return (
    <div className="sticky top-24 rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-2xl p-6 space-y-6 backdrop-blur-md">
      {/* Live Badge */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#89c7e2]">
          Live Preview
        </span>
        <span className="flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Syncing Live</span>
        </span>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#3b72de]/30 shadow-lg transition-all duration-300"
          />
          {role === 'admin' && (
            <div
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#3b72de] text-white shadow-sm"
              title="Administrator"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <h4 className="text-lg font-display font-bold text-white truncate max-w-[220px]">
            {name}
          </h4>
          <p className="text-xs text-slate-400 truncate max-w-[220px] font-light">{email}</p>
        </div>

        <span
          className={`px-3 py-0.5 text-xs font-semibold rounded-full capitalize ${
            role === 'admin'
              ? 'bg-[#3b72de]/20 text-[#89c7e2] border border-[#3b72de]/40'
              : 'bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          {role === 'admin' ? '🛡️ Admin Account' : '✈️ Traveler'}
        </span>
      </div>

      {/* Completeness Meter */}
      <div className="p-4 rounded-xl bg-[#0c1222]/50 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3b72de]" />
            <span>Profile Completeness</span>
          </span>
          <span className="font-mono font-bold text-[#89c7e2]">{completeness}%</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-[#0c1222] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#89c7e2] to-[#3b72de]"
          />
        </div>
      </div>

      {/* Active Settings Snapshot */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c1222]/50 border border-white/5 font-mono">
          <span className="text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#3b72de]" />
            <span>Currency Preview</span>
          </span>
          <span className="font-bold text-white">
            ₹1,000 ≈ {currency} {converted}
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0c1222]/50 border border-white/5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Language</span>
          </span>
          <span className="font-semibold text-white uppercase font-mono">{language}</span>
        </div>
      </div>
    </div>
  )
}
