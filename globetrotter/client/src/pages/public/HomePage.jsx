import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-surface-50">
      <header className="sticky top-0 z-30 border-b border-surface-200 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 text-surface-900 hover:text-surface-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">GlobeTrotter</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center px-4 py-12 md:px-6">
        <section className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">Trip planning made easy</p>
          <h1 className="text-4xl font-display font-bold leading-tight text-surface-900 md:text-5xl">
            Plan better trips with less effort.
          </h1>
          <p className="mt-4 text-base text-surface-600">
            Keep destinations, activities, and budgets in one place. Start with a simple plan and grow it as your team builds more features.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/register" className="btn btn-primary btn-md">Create account</Link>
            <Link to="/login" className="btn btn-outline btn-md">I already have an account</Link>
          </div>
        </section>
      </main>
    </div>
  )
}
