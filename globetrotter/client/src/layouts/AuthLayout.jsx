import { Outlet } from 'react-router-dom'
import { Globe } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-surface-900 flex">
      {/* Left panel – branding / hero */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-white">GlobeTrotter</span>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight mb-6">
            Your journey,<br />
            <span className="text-gradient bg-gradient-to-r from-primary-300 to-accent-400 bg-clip-text text-transparent">
              perfectly planned.
            </span>
          </h1>
          <p className="text-surface-300 text-lg max-w-md">
            Plan multi-city trips, discover hidden gems, track your budget and share
            your adventures — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 mt-8">
            {['Trip Planner', 'Budget Tracker', 'City Discovery', 'Public Sharing'].map(f => (
              <span key={f} className="px-4 py-2 bg-white/10 rounded-full text-sm text-white border border-white/20">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="glass rounded-2xl p-5 relative z-10 bg-white/10 border border-white/20">
          <p className="text-surface-200 text-sm italic">
            "GlobeTrotter helped me plan my 3-week Europe trip seamlessly — 
            from budget tracking to discovering the best local activities."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
              S
            </div>
            <span className="text-surface-300 text-sm">Shreya M. — Backpacker & Travel Blogger</span>
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-white">GlobeTrotter</span>
          </div>

          {/* Auth form outlet */}
          <div className="card p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
