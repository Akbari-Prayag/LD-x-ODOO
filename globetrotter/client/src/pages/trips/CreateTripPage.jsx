import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  Image as ImageIcon,
  Tag,
  Sparkles,
  MapPin,
  Check,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createTrip, selectTripsCreating } from '../../store/slices/tripsSlice.js'
import { createTripSchema } from '../../utils/validationSchemas.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

// Curated preset cover photos for quick aesthetic selection
const PRESET_COVERS = [
  {
    name: 'Mountain Escape',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tropical Beach',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Historic Architecture',
    url: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Neon City Lights',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Desert Safari',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Lakeside Serenity',
    url: 'https://images.unsplash.com/photo-1439853941329-a99ce045c18c?auto=format&fit=crop&w=1200&q=80',
  },
]

const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', label: 'USD ($) - US Dollar' },
  { code: 'EUR', label: 'EUR (€) - Euro' },
  { code: 'GBP', label: 'GBP (£) - British Pound' },
  { code: 'AED', label: 'AED (د.إ) - UAE Dirham' },
  { code: 'SGD', label: 'SGD (S$) - Singapore Dollar' },
  { code: 'JPY', label: 'JPY (¥) - Japanese Yen' },
  { code: 'THB', label: 'THB (฿) - Thai Baht' },
  { code: 'AUD', label: 'AUD (A$) - Australian Dollar' },
  { code: 'CAD', label: 'CAD (C$) - Canadian Dollar' },
]

const TAG_SUGGESTIONS = [
  'Adventure',
  'Beach & Relaxation',
  'Cultural & Heritage',
  'Road Trip',
  'Solo Trip',
  'Family Holiday',
  'Romantic Getaway',
  'Food & Culinary',
  'Wildlife Safari',
  'Backpacking',
]

export default function CreateTripPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isCreating = useSelector(selectTripsCreating)

  // Default dates: today and 7 days from now
  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0].url)
  const [useCustomCover, setUseCustomCover] = useState(false)
  const [selectedTags, setSelectedTags] = useState(['Adventure'])
  const [customTag, setCustomTag] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: today,
      endDate: nextWeek,
      budget: 0,
      currency: 'INR',
      coverPhoto: PRESET_COVERS[0].url,
    },
  })

  const watchStartDate = watch('startDate')

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleAddCustomTag = (e) => {
    e.preventDefault()
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()])
      setCustomTag('')
    }
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        coverPhoto: useCustomCover ? data.coverPhoto : selectedCover,
        tags: selectedTags,
      }

      const createdTrip = await dispatch(createTrip(payload)).unwrap()
      const newId = createdTrip.id || createdTrip._id
      toast.success('Trip created successfully!')
      // Navigate to the newly created trip's itinerary or overview
      navigate(`/trips/${newId}/itinerary`)
    } catch (err) {
      toast.error(err || 'Failed to create trip')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top navigation */}
      <div className="flex items-center gap-3">
        <Link
          to="/trips"
          className="btn btn-sm btn-ghost text-surface-500 hover:text-surface-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trips</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 flex items-center gap-2">
            <span>Create New Trip</span>
            <Sparkles className="w-6 h-6 text-accent-500" />
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Set up your journey details, dates, estimated budget, and styling.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="border-b border-surface-100 pb-3">
            <h2 className="text-lg font-display font-semibold text-surface-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span>Trip Overview</span>
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Give your adventure a name and brief description.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Trip Name"
              required
              placeholder="e.g. European Summer Exploration, Kerala Backwaters Voyage"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="space-y-1.5">
              <label className="input-label">Description / Travel Notes</label>
              <textarea
                rows={3}
                placeholder="What's the main vibe, goal, or special plan for this journey?"
                className="input py-2.5 resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="input-error-msg">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Dates & Budget */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="border-b border-surface-100 pb-3">
            <h2 className="text-lg font-display font-semibold text-surface-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-600" />
              <span>Dates & Budget</span>
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Specify your travel timeline and target financial budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Start Date"
              type="date"
              required
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.startDate?.message}
              {...register('startDate')}
            />

            <Input
              label="End Date"
              type="date"
              required
              min={watchStartDate}
              leftIcon={<Calendar className="w-4 h-4" />}
              error={errors.endDate?.message}
              {...register('endDate')}
            />

            <Input
              label="Target Budget"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              leftIcon={<IndianRupee className="w-4 h-4" />}
              error={errors.budget?.message}
              hint="Estimated spending limit for activities, stays, transport, and food."
              {...register('budget')}
            />

            <div className="space-y-1.5">
              <label className="input-label">Currency</label>
              <select
                className="input py-2.5 bg-white text-surface-900"
                {...register('currency')}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Cover Photo */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-surface-100 pb-3">
            <div>
              <h2 className="text-lg font-display font-semibold text-surface-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary-600" />
                <span>Cover Photo</span>
              </h2>
              <p className="text-xs text-surface-500 mt-0.5">
                Choose a scenic preset photo or enter your own image link.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setUseCustomCover(!useCustomCover)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline"
            >
              {useCustomCover ? 'Pick from Presets' : 'Use Custom URL'}
            </button>
          </div>

          {!useCustomCover ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRESET_COVERS.map((preset) => {
                  const isSelected = selectedCover === preset.url
                  return (
                    <div
                      key={preset.name}
                      onClick={() => {
                        setSelectedCover(preset.url)
                        setValue('coverPhoto', preset.url)
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video cursor-pointer border-2 transition-all group ${
                        isSelected
                          ? 'border-primary-600 ring-2 ring-primary-500/20 shadow-md scale-[1.02]'
                          : 'border-transparent hover:border-surface-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[11px] font-medium text-white drop-shadow-sm">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1 shadow-sm">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Input
                label="Custom Image URL"
                placeholder="https://images.unsplash.com/..."
                leftIcon={<ImageIcon className="w-4 h-4" />}
                error={errors.coverPhoto?.message}
                {...register('coverPhoto')}
              />
              {watch('coverPhoto') && (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video max-h-48 border border-surface-200">
                  <img
                    src={watch('coverPhoto')}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Tags */}
        <div className="card p-6 md:p-8 space-y-5">
          <div className="border-b border-surface-100 pb-3">
            <h2 className="text-lg font-display font-semibold text-surface-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary-600" />
              <span>Trip Tags</span>
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              Categorize this trip to make filtering and organizing easy.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {TAG_SUGGESTIONS.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`chip cursor-pointer transition-colors ${
                    isSelected
                      ? 'chip-active ring-1 ring-primary-500/40 font-medium'
                      : 'hover:bg-surface-200'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 inline mr-1 text-primary-700" />}
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Add custom tag input */}
          <div className="flex items-center gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom tag..."
              className="input py-1.5 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddCustomTag(e)
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCustomTag}
              disabled={!customTag.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
          <Link to="/trips">
            <Button variant="outline" size="md" disabled={isCreating}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isCreating}
            className="min-w-[160px]"
          >
            Create Itinerary
          </Button>
        </div>
      </form>
    </div>
  )
}
