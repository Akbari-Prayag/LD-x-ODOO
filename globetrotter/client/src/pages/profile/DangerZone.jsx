import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { logout } from '../../store/slices/authSlice.js'
import Button from '../../components/ui/Button.jsx'

export default function DangerZone({ tripsCount = 0, savedPlacesCount = 0 }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE in all uppercase to confirm')
      return
    }

    try {
      setIsDeleting(true)
      const { data } = await api.delete('/users/account')
      if (data.success) {
        toast.success('Account deactivated. We are sad to see you go!')
        dispatch(logout())
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate account')
    } finally {
      setIsDeleting(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-danger-50/40 dark:bg-danger-950/20 border border-danger-200/80 dark:border-danger-900/40 shadow-soft space-y-6">
      <div className="border-b border-danger-200/60 dark:border-danger-900/40 pb-4">
        <h3 className="text-xl font-display font-bold text-danger-700 dark:text-danger-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-600" />
          <span>Danger Zone: Account Deactivation</span>
        </h3>
        <p className="text-xs text-danger-600/80 dark:text-danger-400/80 mt-0.5">
          Irreversible actions related to your GlobeTrotter personal account and trip records
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="p-4 rounded-2xl bg-white dark:bg-surface-900 border border-danger-200 dark:border-danger-900/50 space-y-2">
          <h4 className="text-sm font-bold text-surface-900 dark:text-white">
            Deactivate & Delete Account
          </h4>
          <p className="text-xs text-surface-500 leading-relaxed">
            Deactivating your account will permanently revoke your login access and mark all your
            custom itineraries, budget histories, and wishlist entries as inactive.
          </p>
          <div className="pt-2">
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="rounded-xl shadow-sm"
            >
              Deactivate My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Type "DELETE" High-Stakes Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-danger-200 dark:border-danger-800 text-surface-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-danger-600">
                <div className="w-9 h-9 rounded-2xl bg-danger-100 dark:bg-danger-950 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-display font-bold">Are you absolutely sure?</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface-100 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cost of leaving summary */}
            <div className="p-3.5 rounded-2xl bg-danger-50 dark:bg-danger-950/40 border border-danger-200 dark:border-danger-900/50 text-xs text-danger-800 dark:text-danger-300 space-y-1">
              <p className="font-semibold">⚠️ The following data will become inaccessible:</p>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                <li>All planned, upcoming, and completed itineraries</li>
                <li>Bookmarked destinations and budget logs</li>
                <li>Public itinerary links you have shared</li>
              </ul>
            </div>

            {/* Type DELETE Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                To confirm deactivation, please type <strong className="font-mono text-danger-600">DELETE</strong> below:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="input font-mono uppercase text-sm border-danger-300 focus:border-danger-500"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl"
              >
                Keep My Account
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDeleteAccount}
                loading={isDeleting}
                disabled={deleteConfirmation !== 'DELETE'}
                className="rounded-xl shadow-md"
              >
                Permanently Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
