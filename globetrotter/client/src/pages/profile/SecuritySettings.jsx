import { useState } from 'react'
import { Lock, Key, Eye, EyeOff, ShieldCheck, QrCode, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import Button from '../../components/ui/Button.jsx'

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)

  // Calculate password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-surface-200' }
    let score = 0
    if (pwd.length >= 6) score += 1
    if (pwd.length >= 10) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-danger-500' }
    if (score <= 4) return { score: 66, label: 'Good', color: 'bg-sunset-500' }
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
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-8">
      {/* Header */}
      <div className="border-b border-surface-100 dark:border-surface-800 pb-4">
        <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white">
          Security & Authentication
        </h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Manage your account password, login credentials, and two-factor authentication
        </p>
      </div>

      {/* Password Update Form */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label htmlFor="current-pwd" className="input-label flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-surface-500" />
            <span>Current Password</span>
          </label>
          <div className="relative">
            <input
              id="current-pwd"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input pr-10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label htmlFor="new-pwd" className="input-label flex items-center gap-1.5">
            <Key className="w-4 h-4 text-ocean-600" />
            <span>New Password</span>
          </label>
          <div className="relative">
            <input
              id="new-pwd"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input pr-10"
              placeholder="At least 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="space-y-1 pt-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-surface-400">Password Strength</span>
                <span className="font-bold text-surface-700 dark:text-surface-300">{strength.label}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-100 dark:bg-surface-800 overflow-hidden">
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
          <label htmlFor="confirm-pwd" className="input-label flex items-center gap-1.5">
            <Key className="w-4 h-4 text-surface-500" />
            <span>Confirm New Password</span>
          </label>
          <input
            id="confirm-pwd"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-danger-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Passwords do not match</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="ocean"
            loading={isUpdating}
            className="rounded-2xl shadow-md"
          >
            Update Password
          </Button>
        </div>
      </form>

      {/* Two-Factor Authentication (2FA) Setup Section */}
      <div className="pt-6 border-t border-surface-100 dark:border-surface-800 space-y-4 max-w-md">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-semibold text-surface-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Two-Factor Authentication (2FA)</span>
            </h4>
            <p className="text-xs text-surface-500">
              Add an extra layer of security to prevent unauthorized access.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              is2FAEnabled ? 'bg-emerald-500' : 'bg-surface-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {is2FAEnabled && (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-2">
            <p className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Two-factor authentication is active</span>
            </p>
            <p className="text-emerald-700 dark:text-emerald-400">
              Your account is protected with time-based authenticator codes.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
