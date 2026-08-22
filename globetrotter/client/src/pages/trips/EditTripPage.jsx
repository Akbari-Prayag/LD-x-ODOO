import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Calendar,
  IndianRupee,
  Image as ImageIcon,
  Tag,
  MapPin,
  Check,
  Globe,
  Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchTrip,
  updateTrip,
  selectCurrentTrip,
  selectTripsLoading,
  selectTripsError,
} from '../../store/slices/tripsSlice.js'
import { createTripSchema } from '../../utils/validationSchemas.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import LoadingPage from '../../components/ui/LoadingPage.jsx'
import ErrorState from '../../components/ui/ErrorState.jsx'

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

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
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

export default function EditTripPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentTrip = useSelector(selectCurrentTrip)
  const isLoading = useSelector(selectTripsLoading)
  const error = useSelector(selectTripsError)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCover, setSelectedCover] = useState('')
  const [useCustomCover, setUseCustomCover] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [customTag, setCustomTag] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTripSchema),
  })

  const watchStartDate = watch('startDate')

  useEffect(() => {
    if (id) {
      dispatch(fetchTrip(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (currentTrip && (String(currentTrip.id) === String(id) || String(currentTrip._id) === String(id))) {
      const sDate = currentTrip.startDate
        ? new Date(currentTrip.startDate).toISOString().split('T')[0]
        : ''
      const eDate = currentTrip.endDate
        ? new Date(currentTrip.endDate).toISOString().split('T')[0]
        : ''

      reset({
        name: currentTrip.name || '',
        description: currentTrip.description || '',
        startDate: sDate,
        endDate: eDate,
        budget: currentTrip.budget || 0,
        currency: currentTrip.currency || 'INR',
        status: currentTrip.status || 'planning',
        isPublic: currentTrip.isPublic || false,
        coverPhoto: currentTrip.coverPhoto || '',
      })

      setSelectedCover(currentTrip.coverPhoto || PRESET_COVERS[0].url)
      setSelectedTags(currentTrip.tags || [])

      const isPreset = PRESET_COVERS.some((p) => p.url === currentTrip.coverPhoto)
      setUseCustomCover(!isPreset && Boolean(currentTrip.coverPhoto))
    }
  }, [currentTrip, id, reset])

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
    setIsSubmitting(true)
    try {
      const updates = {
        ...data,
        coverPhoto: useCustomCover ? data.coverPhoto : selectedCover,
        tags: selectedTags,
      }

      await dispatch(updateTrip({ id, updates })).unwrap()
      toast.success('Trip updated successfully!')
      navigate(`/trips/${id}`)
    } catch (err) {
      toast.error(err || 'Failed to update trip')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading && (!currentTrip || (String(currentTrip.id) !== String(id) && String(currentTrip._id) !== String(id)))) {
    return <LoadingPage />
  }

  if (error && (!currentTrip || (String(currentTrip.id) !== String(id) && String(currentTrip._id) !== String(id)))) {
    return (
      <div className="py-12">
        <ErrorState
          message={error}
          onRetry={() => dispatch(fetchTrip(id))}
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Top navigation */}
      <div className="flex items-center gap-3">
        <Link
          to={`/trips/${id}`}
          className="btn btn-sm btn-ghost text-surface-500 hover:text-surface-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trip Details</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">
            Edit Trip
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Update destination information, dates, status, or cover image.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Overview */}
        <div className="card p-6 md:p-8 space-y-6">
          <div className="border-b border-surface-100 pb-3">
            <h2 className="text-lg font-display font-semibold text-surface-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              <span>Trip Information</span>
            </h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Trip Name"
              required
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="space-y-1.5">
              <label className="input-label">Description / Travel Notes</label>
              <textarea
                rows={3}
                className="input py-2.5 resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="input-error-msg">{errors.description.message}</p>
              )}
            </div>

            {/* Status Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div className="space-y-1.5">
                <label className="input-label">Trip Status</label>
                <select className="input py-2.5 bg-white" {...register('status')}>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Public Visibility Toggle */}
              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="input-label">Visibility</label>
                <label className="flex items-center gap-3 p-2.5 rounded-xl border border-surface-200 bg-surface-50 cursor-pointer hover:bg-surface-100/70 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                    {...register('isPublic')}
                  />
                  <div className="flex items-center gap-2 text-xs font-medium text-surface-700">
                    {watch('isPublic') ? (
                      <>
                        <Globe className="w-4 h-4 text-emerald-600" />
                        <span>Public (accessible via public URL)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-surface-500" />
                        <span>Private (only visible to you)</span>
                      </>
                    )}
                  </div>
                </label>
              </div>
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
              leftIcon={<IndianRupee className="w-4 h-4" />}
              error={errors.budget?.message}
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200">
          <Link to={`/trips/${id}`}>
            <Button variant="outline" size="md" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            className="min-w-[140px]"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
