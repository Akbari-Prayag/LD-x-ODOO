import React from 'react'
import { Star, Clock, Tag, Banknote, MapPin, Plus } from 'lucide-react'
import Button from '../ui/Button.jsx'

export default function ActivityCard({ activity = {}, onAddToStop }) {
  const {
    id,
    _id,
    name = 'Activity',
    category = 'sightseeing',
    estimatedCost = 0,
    durationValue,
    durationUnit,
    duration,
    description = '',
    ratingAverage,
    ratingCount,
    rating,
    image,
    tags = [],
  } = activity

  const displayDurationValue = durationValue ?? duration?.value ?? 2
  const displayDurationUnit = durationUnit ?? duration?.unit ?? 'hours'
  const displayRatingAverage = ratingAverage ?? rating?.average ?? 4.8
  const displayRatingCount = ratingCount ?? rating?.count ?? 120

  // Format currency based on country
  const formatCost = (cost) => {
    if (cost === 0) return 'Free'
    const country = activity.city?.country
    if (country === 'India') {
      return `₹${cost.toLocaleString('en-IN')}`
    }
    if (country === 'France' || country === 'Italy' || country === 'Germany') {
      const converted = Math.round(cost * 0.011)
      return `€${converted.toLocaleString('fr-FR')}`
    }
    if (country === 'Japan') {
      const converted = Math.round(cost * 1.8)
      return `¥${converted.toLocaleString('ja-JP')}`
    }
    if (country === 'Indonesia') {
      const converted = Math.round(cost * 188)
      return `Rp ${converted.toLocaleString('id-ID')}`
    }
    if (country === 'UAE') {
      const converted = Math.round(cost * 0.044)
      return `AED ${converted.toLocaleString()}`
    }
    return `₹${cost.toLocaleString('en-IN')}`
  }

  // Capitalize category
  const formatCategory = (cat = '') => {
    return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'Activity'
  }

  // Map category to color scheme
  const getCategoryColor = (cat = '') => {
    const map = {
      sightseeing: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300',
      food: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/60 dark:text-amber-300',
      adventure: 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/60 dark:text-rose-300',
      culture: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/60 dark:text-teal-300',
      shopping: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/60 dark:text-purple-300',
      nature: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300',
      entertainment: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/60 dark:text-blue-300',
      nightlife: 'bg-violet-900 text-violet-100 border-violet-800',
    }
    return map[cat.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200'
  }

  return (
    <div className="overflow-hidden group hover:shadow-xl border border-surface-200 dark:border-surface-800 hover:border-ocean-400 dark:hover:border-ocean-500 transition-all duration-300 flex flex-col h-full bg-white dark:bg-surface-900 rounded-3xl">
      {/* Activity Image */}
      <div className="relative h-48 overflow-hidden bg-surface-100 dark:bg-surface-800">
        <img
          src={image || 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800'}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge */}
        <span className={`absolute top-3 left-3 border text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm backdrop-blur-md ${getCategoryColor(category)}`}>
          {formatCategory(category)}
        </span>

        {/* Rating badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span>{Number(displayRatingAverage).toFixed(1)}</span>
          <span className="text-white/60 font-normal text-[10px]">({displayRatingCount})</span>
        </div>

        {/* City/Country Overlay */}
        {activity.city && (
          <div className="absolute bottom-2.5 left-3 right-3 text-white">
            <p className="text-[11px] font-semibold flex items-center gap-1 text-white/90">
              <MapPin className="w-3 h-3 text-ocean-400" />
              <span>{activity.city.name}{activity.city.country ? `, ${activity.city.country}` : ''}</span>
            </p>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Name */}
        <div>
          <h3 className="text-base font-display font-bold text-surface-900 dark:text-white group-hover:text-ocean-600 dark:group-hover:text-ocean-400 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed flex-grow line-clamp-2">
          {description}
        </p>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-100 dark:border-surface-800 text-xs">
          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300">
            <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-ocean-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-surface-400 block uppercase font-medium">Duration</span>
              <span className="font-bold text-surface-900 dark:text-white text-xs">{displayDurationValue} {displayDurationUnit}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-surface-600 dark:text-surface-300">
            <div className="w-7 h-7 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-emerald-600">
              <Banknote className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-surface-400 block uppercase font-medium">Est. Cost</span>
              <span className="font-bold text-surface-900 dark:text-white text-xs">{formatCost(estimatedCost)}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 px-2 py-0.5 rounded-md font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Stop Action */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={() => onAddToStop?.(activity)}
            variant="ocean"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full rounded-xl shadow-sm justify-center font-semibold"
          >
            Add to Itinerary
          </Button>
        </div>
      </div>
    </div>
  )
}
