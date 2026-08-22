import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Globe, DollarSign, Bell, Save, Sparkles, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'
import Button from '../../components/ui/Button.jsx'

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
  const currentCurrency = user?.currency || user?.preferences?.currency || 'INR'
  const currentLanguage = user?.language || user?.preferences?.language || 'en'

  const [currency, setCurrency] = useState(currentCurrency)
  const [language, setLanguage] = useState(currentLanguage)
  const [notifications, setNotifications] = useState(true)
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
          preferences: {
            currency,
            language,
          },
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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-7">
      <div className="border-b border-surface-100 dark:border-surface-800 pb-4">
        <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">
          Preferences & Localization
        </h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Customize currency formatting, language selection, and trip notifications
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Currency selection */}
        <div className="space-y-2">
          <label htmlFor="pref-currency" className="input-label flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-ocean-600" />
            <span>Preferred Display Currency</span>
          </label>
          <select
            id="pref-currency"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="input"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} — {c.name}
              </option>
            ))}
          </select>

          {/* Live Converted Sample Preview */}
          <div className="p-3 rounded-2xl bg-ocean-50/50 dark:bg-ocean-950/30 border border-ocean-200/60 dark:border-ocean-800/40 flex items-center justify-between text-xs">
            <span className="text-ocean-700 dark:text-ocean-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ocean-500" />
              <span>Live Sample Rate:</span>
            </span>
            <span className="font-bold text-ocean-900 dark:text-white font-mono">
              ₹1,000 INR ≈ {selectedCurrObj.symbol} {sampleConverted} {currency}
            </span>
          </div>
        </div>

        {/* Language selection */}
        <div className="space-y-1.5">
          <label htmlFor="pref-lang" className="input-label flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sage-600" />
            <span>Application Language</span>
          </label>
          <select
            id="pref-lang"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="input"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications toggle */}
        <div className="pt-3 border-t border-surface-100 dark:border-surface-800">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-sunset-500" />
                <span>Trip Notifications & Reminders</span>
              </p>
              <p className="text-xs text-surface-500">
                Receive important email updates about upcoming itineraries and budget alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                notifications ? 'bg-ocean-600' : 'bg-surface-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="ocean"
            loading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="rounded-2xl shadow-md"
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}
