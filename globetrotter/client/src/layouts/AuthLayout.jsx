import { Outlet } from 'react-router-dom'
import { ArrowUpRight, Compass, Globe, Map, Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#d5e8e8] flex">
      <div className="hidden lg:flex lg:w-[46%] xl:w-[52%] flex-col p-7 xl:p-9 relative overflow-hidden bg-[#2d3e86]">
        <div className="absolute -right-28 top-24 w-80 h-80 rounded-full border-[52px] border-[#8fc9d8]/20" />
        <div className="absolute -left-20 bottom-20 w-64 h-64 rounded-full border-[34px] border-[#d5e8e8]/10" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] bg-[size:42px_42px]" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-[#8fc9d8] rounded-2xl flex items-center justify-center rotate-3 shadow-lg shadow-[#16255b]/30">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-white">GlobeTrotter</span>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center py-5 xl:py-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d5e8e8] mb-4 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#8fc9d8]" /> Plan beautifully
          </div>
          <h1 className="text-4xl xl:text-[3.25rem] font-display font-bold text-white leading-[1.03] mb-4 max-w-xl">
            Make room for<br /><span className="text-[#8fc9d8]">the places</span> ahead.
          </h1>
          <p className="text-[#d5e8e8]/80 text-sm xl:text-base max-w-md leading-relaxed">
            Build multi-city adventures with a clear plan, a thoughtful budget, and every detail close at hand.
          </p>

          <div className="grid grid-cols-3 gap-3 mt-6 max-w-lg">
            {[['01', 'Map your route', Map], ['02', 'Track your spend', Compass], ['03', 'Share the story', ArrowUpRight]].map(([number, label, Icon]) => (
              <div key={number} className="border-t border-white/25 pt-3">
                <Icon className="w-4 h-4 text-[#8fc9d8] mb-3" />
                <p className="text-[10px] uppercase tracking-widest text-[#8fc9d8]">{number}</p>
                <p className="text-sm text-white mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 max-w-lg rounded-2xl border border-white/15 bg-[#23346f]/80 p-3 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#8fc9d8]">A little further</p>
                <p className="text-xs font-semibold text-white mt-1">Lisbon to Kyoto</p>
              </div>
              <span className="rounded-full bg-[#8fc9d8]/15 px-2.5 py-1 text-[10px] text-[#bfe5ea]">12 days</span>
            </div>
            <div className="relative h-14 overflow-hidden rounded-xl bg-[#1d2d62]">
              <div className="absolute left-[13%] top-[55%] h-px w-[72%] rotate-[-10deg] bg-[#8fc9d8]/60" />
              <div className="absolute left-[13%] top-[55%] h-2.5 w-2.5 rounded-full bg-[#8fc9d8] ring-4 ring-[#8fc9d8]/15" />
              <div className="absolute left-[48%] top-[38%] h-2.5 w-2.5 rounded-full bg-[#d5e8e8] ring-4 ring-[#d5e8e8]/15" />
              <div className="absolute right-[12%] top-[28%] h-2.5 w-2.5 rounded-full bg-[#8fc9d8] ring-4 ring-[#8fc9d8]/15" />
              <div className="absolute left-[9%] bottom-2 text-[10px] text-[#d5e8e8]/70">Lisbon</div>
              <div className="absolute right-[8%] top-2 text-[10px] text-[#d5e8e8]/70">Kyoto</div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2.5 text-[11px]">
              <div><p className="text-white font-semibold">3</p><p className="text-[#d5e8e8]/60 mt-0.5">cities</p></div>
              <div><p className="text-white font-semibold">18</p><p className="text-[#d5e8e8]/60 mt-0.5">moments</p></div>
              <div><p className="text-white font-semibold">$1.8k</p><p className="text-[#d5e8e8]/60 mt-0.5">planned</p></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/15 pt-3 pb-1">
          <p className="text-[#d5e8e8]/75 text-xs">Your next chapter, organized.</p>
          <span className="text-[10px] uppercase tracking-[0.16em] text-[#8fc9d8]">Travel, thoughtfully</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-5 md:p-10 bg-[#d5e8e8]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-[#2d3e86] rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-[#2d3e86]">GlobeTrotter</span>
          </div>

          <div className="bg-white rounded-[1.75rem] shadow-[0_24px_60px_rgba(45,62,134,0.16)] border border-white/70 p-6 md:p-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
