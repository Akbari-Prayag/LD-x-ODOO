import { Outlet, Link } from 'react-router-dom'
import { ArrowUpRight, Compass, MapPin, Sparkles } from 'lucide-react'
import Logo from '../components/ui/Logo.jsx'

export default function AuthLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#0c0f17] flex font-sans selection:bg-[#e05a38] selection:text-white">
      {/* Left Editorial Photo & Typography Showcase */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[50%] flex-col p-8 xl:p-12 relative overflow-hidden bg-[#121722] text-white">
        {/* Full-bleed Editorial Background Photo */}
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600"
          alt="Cinematic highway through majestic mountain pass"
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f17] via-[#0c0f17]/70 to-[#0c0f17]/40" />

        {/* Brand Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="group">
            <Logo variant="white" size="md" />
          </Link>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#f06e4b] font-bold">
            Traveler Access
          </span>
        </div>

        {/* Center Quote & Story */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8 space-y-6 max-w-xl">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Intelligent Travel Planning
          </span>
          <h1 className="text-4xl xl:text-5xl font-display font-black text-[#f4f1eb] leading-[1.08] tracking-tight">
            The journey is yours to compose.{' '}
            <span className="italic font-serif font-normal text-[#f06e4b]">Every single mile.</span>
          </h1>
          <p className="text-slate-300 text-sm xl:text-base leading-relaxed font-light">
            Plan multi-city itineraries, allocate budgets in multiple currencies, and share high-res travel
            magazines with fellow travelers.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
            <div>
              <p className="text-2xl font-display font-bold text-white">50k+</p>
              <p className="text-[11px] text-slate-400 font-mono uppercase">Travelers</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">120+</p>
              <p className="text-[11px] text-slate-400 font-mono uppercase">Countries</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-white">4.9★</p>
              <p className="text-[11px] text-slate-400 font-mono uppercase">Rating</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono border-t border-white/10 pt-4">
          <span>Triply Travel Platform</span>
          <Link to="/" className="text-slate-300 hover:text-white underline">
            ← Back to Landing Page
          </Link>
        </div>
      </div>

      {/* Right Form Card Pane */}
      <div className="w-full lg:w-[52%] xl:w-[50%] h-full flex items-center justify-center p-6 md:p-12 bg-[#0c0f17] overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand Header */}
          <div className="flex items-center justify-between lg:hidden mb-4">
            <Link to="/">
              <Logo variant="white" size="md" />
            </Link>
            <Link to="/" className="text-xs text-slate-400 font-mono underline">
              Home
            </Link>
          </div>

          <div className="bg-[#151b28] rounded-[2rem] shadow-2xl border border-white/10 p-7 sm:p-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
