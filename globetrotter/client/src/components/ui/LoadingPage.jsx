import Logo from './Logo.jsx'

export default function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 gap-4">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      <p className="text-surface-500 text-xs font-semibold tracking-wider uppercase animate-pulse">
        Loading Triply...
      </p>
    </div>
  )
}
