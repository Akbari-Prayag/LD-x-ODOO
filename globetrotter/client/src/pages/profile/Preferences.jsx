import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Globe, DollarSign, Bell, Save, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)', rate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', rate: 0.0095 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)', rate: 1.82 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)', rate: 0.044 },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar (CAD)', rate: 0.016 },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar (AUD)', rate: 0.018 },
]

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
]

export default function Preferences({ user, onPreferencesUpdated, onLiveChange }) {
  const dispatch = useDispatch()
  const currentCurrency = user?.currency || 'INR'
  const currentLanguage = user?.language || 'en'

  const [currency, setCurrency] = useState(currentCurrency)
  const [language, setLanguage] = useState(currentLanguage)
  const [isSaving, setIsSaving] = useState(false)

  const handleCurrencyChange = (val) => {
    setCurrency(val)
    onLiveChange?.({ currency: val, language })
  }

  const handleLanguageChange = (val) => {
    setLanguage(val)
    onLiveChange?.({ currency, language: val })
  }

  const selectedCurrObj = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0]
  const sampleConverted = (1000 * selectedCurrObj.rate).toFixed(2)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSaving(true)
      const res = await dispatch(
        updateProfile({
          currency,
          language,
        })
      ).unwrap()

      toast.success('Preferences saved successfully!')
      onPreferencesUpdated?.(res)
    } catch (err) {
      toast.error(err || 'Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-xl backdrop-blur-sm space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-display font-bold text-white">Preferences & Localization</h3>
        <p className="text-xs text-[#d2e9ec]/70 font-light mt-0.5">
          Customize currency formatting and language across your itineraries.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Currency selection */}
        <div className="space-y-2">
          <label htmlFor="pref-currency" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#3b72de]" />
            <span>Default Currency</span>
          </label>
          <select
            id="pref-currency"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} className="bg-[#0c1222] text-white">
                {c.symbol} — {c.name}
              </option>
            ))}
          </select>

          {/* Live Converted Sample Preview */}
          <div className="p-3 rounded-xl bg-[#0c1222]/50 border border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-[#89c7e2] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#3b72de]" />
              <span>Sample Rate:</span>
            </span>
            <span className="font-bold text-white">
              ₹1,000 INR ≈ {selectedCurrObj.symbol} {sampleConverted} {currency}
            </span>
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-1.5">
          <label htmlFor="pref-lang" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Application Language</span>
          </label>
          <select
            id="pref-lang"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-colors"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-[#0c1222] text-white">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications (Accurately Labeled) */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trip Notifications & Reminders</span>
                </p>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-400">
                  Beta
                </span>
              </div>
              <p className="text-xs text-[#d2e9ec]/60 font-light">
                Email updates for upcoming trip milestones and budget warnings.
              </p>
            </div>

            <div className="w-10 h-5 flex items-center rounded-full p-0.5 bg-[#3b72de]">
              <div className="bg-white w-4 h-4 rounded-full shadow-md ml-auto" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#3b72de]/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
