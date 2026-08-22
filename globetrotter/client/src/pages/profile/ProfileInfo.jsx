import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Lock, Save, Camera, CheckCircle2, ShieldCheck, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'
import Button from '../../components/ui/Button.jsx'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
]

export default function ProfileInfo({ user, onProfileUpdated }) {
  const dispatch = useDispatch()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    try {
      setIsSaving(true)
      const res = await dispatch(updateProfile({ name: name.trim(), avatar })).unwrap()
      toast.success('Profile updated successfully!')
      onProfileUpdated?.(res)
    } catch (err) {
      toast.error(err || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="card p-6 sm:p-8 border border-surface-200/90 rounded-2xl bg-white space-y-6">
      <div className="border-b border-surface-100 pb-4">
        <h3 className="text-lg font-display font-bold text-surface-900">Personal Information</h3>
        <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
          Update your public profile details and avatar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="space-y-3">
          <label className="input-label">Profile Avatar</label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-ocean-50 border-2 border-ocean-200 flex items-center justify-center text-ocean-700 font-bold text-2xl shadow-sm flex-shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={() => setAvatar('')}
                />
              ) : (
                <span>{name?.[0]?.toUpperCase() || 'U'}</span>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-surface-500 font-medium">
                Choose a travel avatar preset:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                      avatar === preset ? 'border-ocean-600 scale-105 shadow-md' : 'border-surface-200 hover:border-ocean-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
                {avatar && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="text-xs text-surface-500 hover:text-danger-600 underline font-medium ml-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Name input */}
        <div>
          <label htmlFor="profile-name" className="input-label">
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input max-w-md"
            placeholder="e.g. Prayag Patel"
            required
          />
        </div>

        {/* Email input (read only) */}
        <div>
          <label htmlFor="profile-email" className="input-label flex items-center justify-between max-w-md">
            <span>Email Address</span>
            <span className="text-[11px] text-surface-400 font-normal flex items-center gap-1">
              <Lock className="w-3 h-3 text-surface-400" /> Read-only
            </span>
          </label>
          <div className="relative max-w-md">
            <input
              id="profile-email"
              type="email"
              value={user?.email || ''}
              disabled
              className="input bg-surface-100 text-surface-500 cursor-not-allowed pr-10 border-surface-200"
            />
            <Lock className="w-4 h-4 text-surface-400 absolute right-3 top-3" />
          </div>
          <p className="input-hint">Your account email is verified and cannot be changed.</p>
        </div>

        {/* Role & Account status */}
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 max-w-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-surface-700">Account Type</p>
            <p className="text-xs text-surface-500 capitalize">{user?.role || 'Member'} Access</p>
          </div>
          <span className="badge badge-ocean capitalize">
            <ShieldCheck className="w-3 h-3" /> {user?.role || 'user'}
          </span>
        </div>

        {/* Action button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="ocean"
            loading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
