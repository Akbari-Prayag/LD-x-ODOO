import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AlertTriangle, Trash2, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { logout } from '../../store/slices/authSlice.js'

export default function DangerZone() {
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
        toast.success('Account deactivated successfully.')
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
    <div className="p-6 sm:p-7 rounded-2xl bg-red-950/20 border border-red-900/40 shadow-xl backdrop-blur-sm space-y-6">
      <div className="border-b border-red-900/40 pb-4">
        <h3 className="text-xl font-display font-bold text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Danger Zone: Account Deactivation</span>
        </h3>
        <p className="text-xs text-red-300/70 font-light mt-0.5">
          Irreversible actions related to your Triply personal account.
        </p>
      </div>

      <div className="space-y-4 max-w-xl">
        <div className="p-4 rounded-xl bg-[#0c1222]/80 border border-red-900/50 space-y-2.5">
          <h4 className="text-sm font-bold text-white">Deactivate & Delete Account</h4>
          <p className="text-xs text-[#d2e9ec]/70 leading-relaxed font-light">
            Deactivating your account will permanently revoke your login access and mark all your
            custom itineraries, budget histories, and wishlist entries as inactive.
          </p>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md shadow-red-900/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Deactivate My Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
        >
          <div className="w-full max-w-md bg-[#121722] rounded-3xl p-6 sm:p-7 shadow-2xl border border-red-900/60 text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-red-400">
                <div className="w-8 h-8 rounded-xl bg-red-950/80 flex items-center justify-center flex-shrink-0 border border-red-800">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-display font-bold">Are you absolutely sure?</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Impact summary */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-300 space-y-1">
              <p className="font-semibold">⚠️ You will lose access to:</p>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-red-300/80">
                <li>All saved itineraries and planned dates</li>
                <li>Live expense records and currency setups</li>
                <li>Public itinerary links you have shared</li>
              </ul>
            </div>

            {/* Type DELETE confirmation */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                To confirm, type <strong className="font-mono text-red-400">DELETE</strong> below:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="w-full bg-[#0c1222] border border-red-800 focus:border-red-500 rounded-xl px-3.5 py-2 text-sm text-white font-mono uppercase outline-none"
                autoFocus
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-xs font-bold text-white transition-colors shadow-md shadow-red-900/30"
              >
                {isDeleting ? 'Deactivating...' : 'Permanently Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
