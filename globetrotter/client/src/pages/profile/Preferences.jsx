import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Globe, DollarSign, Bell, Save, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'
import Button from '../../components/ui/Button.jsx'

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen (JPY)' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham (AED)' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar (CAD)' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar (AUD)' },
]

const LANGUAGES = [
  { code: 'en', name: 'English (US)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
]

export default function Preferences({ user, onPreferencesUpdated }) {
  const dispatch = useDispatch()
  const currentCurrency = user?.currency || user?.preferences?.currency || 'INR'
  const currentLanguage = user?.language || user?.preferences?.language || 'en'

  const [currency, setCurrency] = useState(currentCurrency)
  const [language, setLanguage] = useState(currentLanguage)
  const [notifications, setNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

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
    <div className="card p-6 sm:p-8 border border-surface-200/90 rounded-2xl bg-white space-y-6">
      <div className="border-b border-surface-100 pb-4">
        <h3 className="text-lg font-display font-bold text-surface-900">Preferences</h3>
        <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
          Customize currency formatting, language, and regional preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        {/* Currency selection */}
        <div>
          <label htmlFor="pref-currency" className="input-label flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-ocean-600" />
            <span>Preferred Display Currency</span>
          </label>
          <select
            id="pref-currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="input"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} — {c.name}
              </option>
            ))}
          </select>
          <p className="input-hint">Default currency used across dashboards, estimates, and budget items.</p>
        </div>

        {/* Language selection */}
        <div>
          <label htmlFor="pref-lang" className="input-label flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-sage-600" />
            <span>Application Language</span>
          </label>
          <select
            id="pref-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
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
        <div className="pt-2 border-t border-surface-100">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-surface-800 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-accent-500" />
                <span>Trip Notifications & Reminders</span>
              </p>
              <p className="text-xs text-surface-500">
                Receive important email updates about upcoming itineraries and budget alerts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                notifications ? 'bg-ocean-600' : 'bg-surface-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
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
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}
