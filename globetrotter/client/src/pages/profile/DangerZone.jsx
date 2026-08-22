import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import { logout } from '../../store/slices/authSlice.js'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'

export default function DangerZone() {
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true)
      const { data } = await api.delete('/users/account')
      if (data.success) {
        toast.success('Your account has been deactivated.')
        dispatch(logout())
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate account')
      setIsDeleting(false)
    }
  }

  return (
    <div className="card p-6 sm:p-8 border border-danger-200 rounded-2xl bg-danger-50/20 space-y-6">
      <div className="border-b border-danger-100 pb-4">
        <h3 className="text-lg font-display font-bold text-danger-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          <span>Danger Zone</span>
        </h3>
        <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
          Irreversible and destructive account operations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-danger-200">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-surface-900">Deactivate / Delete Account</h4>
          <p className="text-xs text-surface-500">
            Permanently delete your profile, active itineraries, and stored travel preferences.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          onClick={() => setShowModal(true)}
          leftIcon={<Trash2 className="w-4 h-4" />}
          className="self-start sm:self-auto flex-shrink-0"
        >
          Delete Account
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Delete Your Account?"
        size="md"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              loading={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Yes, Delete Account
            </Button>
          </div>
        }
      >
        <div className="space-y-3 py-2 text-surface-600 text-sm">
          <p className="font-semibold text-danger-600">
            Warning: This action is permanent and cannot be undone.
          </p>
          <p>
            By confirming, your account will be immediately deactivated and all your itineraries, expenses, and saved destination bookmarks will no longer be accessible.
          </p>
        </div>
      </Modal>
    </div>
  )
}
