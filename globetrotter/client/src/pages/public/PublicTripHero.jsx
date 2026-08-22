import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import {
  Share2,
  Copy,
  Calendar,
  User,
  Check,
  Eye,
  Sparkles,
  QrCode,
  Printer,
  X,
  ExternalLink,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { dateRange } from '../../utils/dateUtils.js'
import Button from '../../components/ui/Button.jsx'

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600'

export default function PublicTripHero({
  trip,
  onCopyTrip,
  isCopying = false,
  scrollY = 0,
}) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')

  const {
    name = 'Shared Itinerary',
    description,
    coverPhoto,
    startDate,
    endDate,
    owner,
    stops = [],
    publicSlug,
  } = trip || {}

  const currentUrl = window.location.href

  // Generate QR Code on mount or share open
  useEffect(() => {
    QRCode.toDataURL(currentUrl, { width: 180, margin: 1 })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code error:', err))
  }, [currentUrl])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopiedLink(true)
      toast.success('Public itinerary link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2500)
    } catch (err) {
      toast.error('Unable to copy link')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Extract cities route array
  const cityNames = stops
    .map((s) => s.city?.name || s.customCityName)
    .filter(Boolean)

  const routeString =
    cityNames.length > 0 ? cityNames.join('  ➔  ') : 'Multi-City Adventure'

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-surface-950 text-white min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10">
      {/* Parallax Cover Image */}
      <motion.div
        style={{
          y: scrollY * 0.3,
        }}
        className="absolute inset-0 w-full h-[130%] -top-[15%] pointer-events-none"
      >
        <img
          src={coverPhoto || DEFAULT_HERO}
          alt={name}
          className="w-full h-full object-cover brightness-[0.65] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-black/30" />
      </motion.div>

      {/* Top Floating Bar: Social Proof & Actions */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        {/* Social Proof Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-xs text-white/90">
          <Eye className="w-3.5 h-3.5 text-ocean-300" />
          <span>1,204 viewed</span>
          <span className="text-white/40">•</span>
          <Sparkles className="w-3.5 h-3.5 text-sunset-300" />
          <span>89 copied</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Print / PDF Export Button */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all active:scale-95"
            title="Print or Export PDF"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Share Popover Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white font-medium text-xs sm:text-sm transition-all duration-150 active:scale-95"
          >
            <Share2 className="w-4 h-4 text-ocean-300" />
            <span>Share Sheet</span>
          </button>
        </div>
      </div>

      {/* Hero Body Content */}
      <div className="relative z-10 space-y-4 max-w-3xl pt-8">
        {/* Animated Route Flow String */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset-500/20 backdrop-blur-md border border-sunset-400/30 text-sunset-300 text-xs font-semibold uppercase tracking-wider">
          <span>{routeString}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white drop-shadow-md">
          {name}
        </h1>

        {description && (
          <p className="text-sm sm:text-base text-surface-200 line-clamp-3 max-w-2xl font-light">
            {description}
          </p>
        )}

        {/* Creator Avatar & Dates */}
        <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-surface-200 pt-2">
          {owner && (
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
              <img
                src={owner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={owner.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-medium text-white">Curated by {owner.name}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            <Calendar className="w-4 h-4 text-sage-300" />
            <span>{dateRange(startDate, endDate) || 'Dates flexible'}</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Copy Pill Button */}
      <div className="relative z-10 pt-6 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <Button
            onClick={onCopyTrip}
            loading={isCopying}
            variant="ocean"
            size="lg"
            className="rounded-2xl shadow-glow text-sm sm:text-base font-bold px-6 py-3"
            leftIcon={<Copy className="w-5 h-5" />}
          >
            Copy This Itinerary to My Trips
          </Button>
        </motion.div>
      </div>

      {/* Share Sheet Popover Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-surface-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-ocean-100 dark:bg-ocean-900 text-ocean-600 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-display font-bold">Share Itinerary</h3>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="p-1.5 rounded-xl hover:bg-surface-100 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code */}
            {qrCodeDataUrl && (
              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-50 dark:bg-surface-800/60 border border-surface-100 dark:border-surface-800">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-36 h-36 rounded-xl shadow-sm bg-white p-1"
                />
                <p className="text-[11px] text-surface-400 mt-2 text-center">
                  Scan with mobile camera to open this itinerary instantly
                </p>
              </div>
            )}

            {/* Copy Link Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-surface-500 uppercase">
                Public Share Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="input text-xs truncate bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="ocean"
                  size="sm"
                  className="rounded-xl flex-shrink-0"
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Check out this travel itinerary: ${name} - ${currentUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-medium text-xs transition-colors shadow-sm"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `Check out this travel itinerary: ${name}`
                )}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-black hover:bg-surface-800 text-white font-medium text-xs transition-colors shadow-sm"
              >
                <span>Share on X</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
