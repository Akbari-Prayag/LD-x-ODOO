import { Globe } from 'lucide-react'

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-4">
      <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center animate-pulse">
        <Globe className="w-7 h-7 text-white" />
      </div>
      <p className="text-surface-500 text-sm animate-pulse">Loading GlobeTrotter...</p>
    </div>
  )
}
