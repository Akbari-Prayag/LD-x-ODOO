import { Outlet } from 'react-router-dom'
import { Globe, Plane } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#e8f4fb] p-2.5 md:p-4 lg:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-1.25rem)] max-w-[1400px] overflow-hidden rounded-[28px] border border-[#a4d8f6] bg-white shadow-[0_24px_80px_rgba(0,121,191,0.14)] md:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
        <aside className="relative hidden w-[48%] overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,90,150,0.25) 0%, rgba(0,70,120,0.35) 100%), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80')",
            }}
          />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_35%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white xl:p-10">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/15 px-4 py-1.5 backdrop-blur">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide">Travelista Tours</span>
              </div>
              <h1 className="max-w-md text-5xl font-display font-bold leading-[1.05]">
                Discover your next journey.
              </h1>
              <p className="mt-4 max-w-md text-base text-white/90">
                Travel is the only purchase that enriches you in ways beyond material wealth.
              </p>
            </div>

            <div className="flex items-center justify-between text-sm text-white/85">
              <span>Plan. Explore. Repeat.</span>
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1">
                Travel smart
              </span>
            </div>
          </div>
        </aside>

        <section className="relative flex w-full items-center justify-center overflow-y-auto bg-[linear-gradient(180deg,#f8fdff_0%,#e8f6ff_100%)] px-4 py-8 sm:px-6 lg:w-[52%] lg:px-10">
          <div className="absolute left-0 right-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(46,170,240,0.25),transparent_70%)]" />

          <div className="pointer-events-none absolute right-4 top-4 hidden md:block" aria-hidden="true">
            <Plane className="h-5 w-5 text-[#0aa4ea]" />
            <svg viewBox="0 0 220 85" className="-mt-1 h-14 w-48 text-[#0aa4ea]/70" fill="none">
              <path
                d="M10 42C42 12 92 4 145 18C177 26 200 44 214 70"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 7"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-12 md:block" aria-hidden="true">
            <div className="mx-auto h-full w-[92%] max-w-3xl text-[#15a9ea]">
              <svg viewBox="0 0 980 120" className="h-full w-full" preserveAspectRatio="none">
                <path fill="currentColor" fillOpacity="0.14" d="M0 120V90h120v18h80V86h92v22h88V82h116v26h120V88h94v20h96V80h98v40z" />

                <path fill="currentColor" d="M420 108h140V74H420z" />
                <path fill="currentColor" d="M450 74h80c-4-26-21-42-40-42s-36 16-40 42z" fillOpacity="0.95" />
                <path fill="currentColor" d="M486 24h8v8h-8z" />
                <path fill="currentColor" d="M409 108h10V62h-10zm152 0h10V62h-10zm-20 0h8V70h-8zm-102 0h8V70h-8z" fillOpacity="0.9" />

                <path fill="currentColor" d="M180 108h74V86h-74z" fillOpacity="0.9" />
                <path fill="currentColor" d="M198 86h38c-2-13-9-21-19-21s-17 8-19 21z" fillOpacity="0.85" />

                <path fill="currentColor" d="M690 108h78V88h-78z" fillOpacity="0.9" />
                <path fill="currentColor" d="M716 88h26c-2-11-7-18-13-18s-11 7-13 18z" fillOpacity="0.85" />

                <path fill="currentColor" d="M834 108h10V66h-10zm18 0h10V58h-10zm18 0h10V70h-10z" fillOpacity="0.75" />
              </svg>
            </div>
          </div>

          <div className="relative w-full max-w-md rounded-[26px] border border-[#d4ecfa] bg-white p-5 shadow-[0_20px_50px_rgba(23,126,185,0.12)] sm:p-7">
            <div className="mb-5 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0aa4ea] text-white">
                <Globe className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-semibold text-[#0b3f62]">Travelista Tours</span>
            </div>

            <Outlet />
          </div>
        </section>
      </div>
    </div>
  )
}
