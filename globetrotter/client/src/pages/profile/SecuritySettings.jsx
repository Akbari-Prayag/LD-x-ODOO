import { useState } from 'react'
import { KeyRound, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react'
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error('Please enter your current password')
      return
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match')
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
    <div className="card p-6 sm:p-8 border border-surface-200/90 rounded-2xl bg-white space-y-6">
      <div className="border-b border-surface-100 pb-4">
        <h3 className="text-lg font-display font-bold text-surface-900">Security & Password</h3>
        <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
          Ensure your account stays secure by using a strong password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
        {/* Current Password */}
        <div>
          <label htmlFor="current-password" className="input-label">
            Current Password
          </label>
          <div className="relative">
            <input
              id="current-password"
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
              className="absolute right-3 top-3 text-surface-400 hover:text-surface-600"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="new-password" className="input-label">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input pr-10"
              placeholder="Min. 6 characters"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-3 text-surface-400 hover:text-surface-600"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirm-password" className="input-label">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input"
            placeholder="Re-type new password"
            required
          />
          {newPassword && confirmPassword && newPassword === confirmPassword && (
            <p className="text-xs text-sage-600 mt-1 flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5" /> Passwords match
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="ocean"
            loading={isUpdating}
            leftIcon={<KeyRound className="w-4 h-4" />}
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
}
