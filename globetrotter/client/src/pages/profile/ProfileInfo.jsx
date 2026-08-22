import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { User, Mail, Shield, Save, Camera, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateProfile } from '../../store/slices/authSlice.js'

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
    if (!customAvatarInput.trim()) return
    setAvatar(customAvatarInput.trim())
    onLiveChange?.({ name, avatar: customAvatarInput.trim() })
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
    <div className="p-6 sm:p-7 rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-xl backdrop-blur-sm space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-display font-bold text-white">Personal Information</h3>
        <p className="text-xs text-[#d2e9ec]/70 font-light mt-0.5">
          Update your public profile details and avatar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Preset Selector */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#89c7e2] flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#3b72de]" />
            <span>Profile Avatar</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAvatarSelect(preset)}
                className={`relative w-12 h-12 rounded-full overflow-hidden transition-all duration-200 focus:outline-none ${
                  avatar === preset
                    ? 'ring-3 ring-[#3b72de] scale-105 shadow-md shadow-[#3b72de]/30'
                    : 'ring-1 ring-white/10 opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={preset} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                {avatar === preset && (
                  <div className="absolute inset-0 bg-[#3b72de]/40 flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Avatar URL or File Input (TODO: Direct multipart upload endpoint) */}
          <div className="flex gap-2 pt-1">
            <input
              type="url"
              value={customAvatarInput}
              onChange={(e) => setCustomAvatarInput(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="flex-1 bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleCustomAvatar}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="profile-name" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Name</span>
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
            placeholder="Your Name"
            required
          />
        </div>

        {/* Email Address (Read-Only) */}
        <div className="space-y-1.5">
          <label htmlFor="profile-email" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Email Address</span>
          </label>
          <input
            id="profile-email"
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-[#0c1222]/40 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-slate-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-slate-500">
            Account email is tied to login credentials and cannot be changed here.
          </p>
        </div>

        {/* Account Role Card */}
        <div className="p-3.5 rounded-xl bg-[#0c1222]/50 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#3b72de]/20 flex items-center justify-center text-[#89c7e2]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Account Status</p>
              <p className="text-[11px] text-slate-400 capitalize">{user?.role || 'Traveler'} Member</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800">
            Active
          </span>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#3b72de]/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
