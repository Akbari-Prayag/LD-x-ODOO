import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2, Copy, Check, Calendar, User, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { dateRange, tripDuration } from '../../utils/dateUtils.js'

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600'

export default function PublicTripHero({
  trip,
  onCopyTrip,
  isCopying = false,
  isAuthenticated = false,
}) {
  const [copiedLink, setCopiedLink] = useState(false)

  if (!trip) return null

  const {
    name,
    description,
    coverPhoto,
    startDate,
    endDate,
    owner,
    stops = [],
  } = trip

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      toast.success('Public link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2500)
    } catch (err) {
      toast.error('Could not copy link to clipboard')
    }
  }

  const duration = tripDuration(startDate, endDate)
  const cityNames = stops
    .map((s) => s.city?.name || s.customCityName)
    .filter(Boolean)
    .join(' • ')

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-card-xl bg-surface-900 text-white">
      {/* Hero Background Image */}
      <div className="relative aspect-[21/9] min-h-[340px] md:min-h-[420px] w-full overflow-hidden">
        <img
          src={coverPhoto || DEFAULT_COVER}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = DEFAULT_COVER
          }}
        />
        {/* Layered Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-900/60 to-surface-900/20" />
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-between z-10">
        {/* Top bar with tag & share */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-sage-300" />
            <span>Shared Itinerary</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white transition-all active:scale-95"
              title="Copy shareable link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-sage-300" />
                  <span className="hidden sm:inline text-sage-300 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Hero Info */}
        <div className="space-y-4 max-w-3xl">
          {cityNames && (
            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-sage-300 drop-shadow-sm">
              {cityNames}
            </p>
          )}

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white leading-tight drop-shadow-md">
            {name}
          </h1>

          {description && (
            <p className="text-sm sm:text-base text-surface-200 line-clamp-2 drop-shadow-sm max-w-2xl">
              {description}
            </p>
          )}

          {/* Meta Info & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/15">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-surface-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-ocean-300" />
                <span>
                  {dateRange(startDate, endDate)} ({duration} {duration === 1 ? 'day' : 'days'})
                </span>
              </div>

              {owner && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sage-500 flex items-center justify-center text-xs font-bold text-white">
                    {owner.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span>Created by {owner.name}</span>
                </div>
              )}
            </div>

            {/* Copy CTA */}
            <div>
              <button
                onClick={onCopyTrip}
                disabled={isCopying}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-ocean-500 hover:bg-ocean-600 active:scale-95 text-white font-bold text-sm shadow-lg shadow-ocean-500/30 transition-all duration-150"
              >
                <Copy className="w-4 h-4" />
                <span>{isCopying ? 'Copying Trip...' : 'Copy Trip to My Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
