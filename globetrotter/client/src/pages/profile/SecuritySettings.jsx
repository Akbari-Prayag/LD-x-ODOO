import { useState } from 'react'
import { Lock, Key, Eye, EyeOff, ShieldCheck, AlertCircle, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-700' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 10) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-red-500' }
    if (score <= 4) return { score: 66, label: 'Good', color: 'bg-amber-500' }
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' }
  }

  const strength = getPasswordStrength(newPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    try {
      setIsUpdating(true)
      const { data } = await api.put('/users/password', {
        currentPassword,
        newPassword,
      })

      if (data.success) {
        toast.success('Password updated successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-xl backdrop-blur-sm space-y-7">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <h3 className="text-xl font-display font-bold text-white">Security & Password</h3>
        <p className="text-xs text-[#d2e9ec]/70 font-light mt-0.5">
          Manage your account password and security credentials.
        </p>
      </div>

      {/* Password Update Form */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label htmlFor="current-pwd" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Current Password</span>
          </label>
          <div className="relative">
            <input
              id="current-pwd"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="new-pwd" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-[#3b72de]" />
            <span>New Password</span>
          </label>
          <div className="relative">
            <input
              id="new-pwd"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
              placeholder="At least 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Strength Meter */}
          {newPassword && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">Password Strength</span>
                <span className="font-bold text-white">{strength.label}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#0c1222] overflow-hidden">
                <div
                  style={{ width: `${strength.score}%` }}
                  className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm-pwd" className="text-xs font-semibold text-[#89c7e2] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <span>Confirm New Password</span>
          </label>
          <input
            id="confirm-pwd"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#0c1222]/70 border border-white/10 focus:border-[#3b72de] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
            placeholder="••••••••"
            required
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Passwords do not match</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="px-6 py-2.5 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#3b72de]/20 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isUpdating ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>

      {/* Two-Factor Authentication (Accurately Labeled as Coming Soon) */}
      <div className="pt-5 border-t border-white/10 space-y-3 max-w-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#89c7e2]" />
                <span>Two-Factor Authentication (2FA)</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-400">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-[#d2e9ec]/60 font-light">
              TOTP authenticator app support will be available in the next security release.
            </p>
          </div>

          <div className="w-10 h-5 flex items-center rounded-full p-0.5 bg-slate-800 opacity-60 cursor-not-allowed">
            <div className="bg-slate-500 w-4 h-4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
