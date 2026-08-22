import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { User, Mail, Shield, Save, Camera, Sparkles, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'
import Button from '../../components/ui/Button.jsx'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
]

export default function ProfileInfo({ user, onProfileUpdated, onLiveChange }) {
  const dispatch = useDispatch()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_PRESETS[0])
  const [customAvatarInput, setCustomAvatarInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleNameChange = (val) => {
    setName(val)
    onLiveChange?.({ name: val, avatar })
  }

  const handleAvatarSelect = (url) => {
    setAvatar(url)
    onLiveChange?.({ name, avatar: url })
  }

  const handleCustomAvatar = (e) => {
    e.preventDefault()
    if (!customAvatarInput) return
    setAvatar(customAvatarInput)
    onLiveChange?.({ name, avatar: customAvatarInput })
    setCustomAvatarInput('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter a valid name')
      return
    }

    try {
      setIsSaving(true)
      const res = await dispatch(
        updateProfile({
          name: name.trim(),
          avatar,
        })
      ).unwrap()

      toast.success('Profile updated successfully!')
      onProfileUpdated?.(res)
    } catch (err) {
      toast.error(err || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-7">
      <div className="border-b border-surface-100 dark:border-surface-800 pb-4">
        <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">
          Personal Information
        </h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Update your public profile name, avatar representation, and account credentials
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Preset Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-surface-500 flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-ocean-600" />
            <span>Select Profile Avatar</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAvatarSelect(preset)}
                className={`relative w-14 h-14 rounded-full overflow-hidden transition-all duration-200 ${
                  avatar === preset
                    ? 'ring-4 ring-ocean-500 scale-105 shadow-md'
                    : 'ring-2 ring-transparent opacity-70 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                {avatar === preset && (
                  <div className="absolute inset-0 bg-ocean-900/40 flex items-center justify-center text-white">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Avatar URL input */}
          <div className="pt-2 flex items-center gap-2 max-w-md">
            <input
              type="url"
              value={customAvatarInput}
              onChange={(e) => setCustomAvatarInput(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="input text-xs"
            />
            <Button
              type="button"
              onClick={handleCustomAvatar}
              variant="outline"
              size="sm"
              className="rounded-xl flex-shrink-0"
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5 max-w-md">
          <label htmlFor="name-input" className="input-label flex items-center gap-1.5">
            <User className="w-4 h-4 text-surface-500" />
            <span>Full Name</span>
          </label>
          <input
            id="name-input"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="input"
            placeholder="Prayag Patel"
            required
          />
        </div>

        {/* Email (Read-Only) */}
        <div className="space-y-1.5 max-w-md">
          <label htmlFor="email-input" className="input-label flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-surface-500" />
            <span>Email Address (Account ID)</span>
          </label>
          <input
            id="email-input"
            type="email"
            value={user?.email || ''}
            disabled
            className="input bg-surface-100 dark:bg-surface-800 text-surface-500 cursor-not-allowed"
          />
          <p className="input-hint">Your email is verified and cannot be changed.</p>
        </div>

        {/* Role Badge */}
        <div className="space-y-1.5 max-w-md">
          <label className="input-label flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-surface-500" />
            <span>Account Privilege Role</span>
          </label>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                user?.role === 'admin'
                  ? 'bg-accent-100 text-accent-800 border border-accent-200'
                  : 'bg-ocean-100 text-ocean-800 border border-ocean-200'
              }`}
            >
              {user?.role === 'admin' ? '🛡️ Administrator' : '✈️ Traveler'}
            </span>
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
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
