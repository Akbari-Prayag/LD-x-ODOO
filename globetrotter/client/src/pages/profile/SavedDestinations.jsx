import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, Trash2, ArrowRight, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'

const DEFAULT_CITY_IMG = 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600'

export default function SavedDestinations() {
  const [savedCities, setSavedCities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSaved = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/users/profile')
      if (data.success && data.user) {
        setSavedCities(data.user.savedDestinations || [])
      }
    } catch (err) {
      toast.error('Failed to load saved destinations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  const handleRemoveCity = async (cityId) => {
    try {
      const { data } = await api.post(`/users/saved-destinations/${cityId}`)
      if (data.success) {
        toast.success('Destination removed from saved list')
        setSavedCities((prev) => prev.filter((c) => (c._id || c) !== cityId))
      }
    } catch (err) {
      toast.error('Could not update saved destinations')
    }
  }

  return (
    <div className="card p-6 sm:p-8 border border-surface-200/90 rounded-2xl bg-white space-y-6">
      <div className="border-b border-surface-100 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-surface-900">Saved Destinations</h3>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            Bookmarked places you want to visit in upcoming trips.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sage-100 text-sage-800">
          {savedCities.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="aspect-[4/3] rounded-2xl bg-surface-100 animate-pulse" />
          ))}
        </div>
      ) : savedCities.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-surface-50 border border-dashed border-surface-200 rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sage-100 text-sage-600 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-semibold text-surface-800">No saved destinations yet</h4>
          <p className="text-xs sm:text-sm text-surface-500 max-w-sm mx-auto">
            Browse our catalog of world cities and save your dream travel spots for quick itinerary planning.
          </p>
          <div className="pt-2">
            <Link to="/cities" className="btn btn-sage btn-sm inline-flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>Explore Cities</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCities.map((city) => {
            const cityObj = typeof city === 'object' ? city : { id: city, _id: city, name: 'Saved City' }
            const cityId = cityObj.id || cityObj._id
            return (
              <div
                key={cityId}
                className="card-hover group relative overflow-hidden rounded-2xl border border-surface-200"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-100 relative">
                  <img
                    src={cityObj.image || DEFAULT_CITY_IMG}
                    alt={cityObj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <button
                    onClick={() => handleRemoveCity(cityId)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 hover:bg-danger-500 text-surface-600 hover:text-white backdrop-blur-md transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-display font-bold text-base truncate">{cityObj.name}</h4>
                    {cityObj.country && (
                      <p className="text-xs text-sage-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{cityObj.country}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <Link
                    to={`/cities?search=${encodeURIComponent(cityObj.name)}`}
                    className="text-xs font-semibold text-ocean-600 hover:text-ocean-700 flex items-center justify-between"
                  >
                    <span>View City Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
