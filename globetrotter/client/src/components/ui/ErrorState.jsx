import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="empty-state">
      <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center text-danger-500 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700">{message}</h3>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-outline btn-sm mt-4">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  )
}
