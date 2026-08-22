import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Heart, Trash2, Compass, MapPin, ArrowRight, LayoutGrid, Map as MapIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api.js'

const DEFAULT_CITY_IMG = 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800'

export default function SavedDestinations({ user, onDestinationsUpdated }) {
  const [savedCities, setSavedCities] = useState(user?.savedDestinations || [])
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'map'
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemoveCity = async (cityId) => {
    try {
      setIsRemoving(true)
      const { data } = await api.post(`/users/saved-destinations/${cityId}`)
      if (data.success) {
        setSavedCities(data.savedDestinations)
        toast.success('Destination removed from wishlist')
        onDestinationsUpdated?.(data.savedDestinations)
      }
    } catch (err) {
      toast.error('Failed to remove destination')
    } finally {
      setIsRemoving(false)
    }
  }

  // Extract map markers
  const cityMarkers = savedCities
    .map((c) => {
      const cityObj = typeof c === 'object' ? c : { id: c, name: 'Saved Place' }
      const lat = cityObj.lat ? Number(cityObj.lat) : 28.6139
      const lng = cityObj.lng ? Number(cityObj.lng) : 77.209
      return { id: cityObj.id || cityObj._id, name: cityObj.name, country: cityObj.country, lat, lng }
    })
    .filter((c) => c.lat && c.lng)

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-100 dark:border-surface-800 pb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-sunset-500 fill-current" />
            <span>Saved Wishlist Destinations</span>
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Destinations you've bookmarked to include in future itineraries
          </p>
        </div>

        {/* View Switcher */}
        {savedCities.length > 0 && (
          <div className="flex items-center bg-surface-100 dark:bg-surface-800 p-1 rounded-xl border border-surface-200 dark:border-surface-700 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-800'
              }`}
              title="Map View"
            >
              <MapIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedCities.length === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-surface-50 dark:bg-surface-800/40 border border-dashed border-surface-200 dark:border-surface-700 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sunset-100 dark:bg-sunset-950/60 text-sunset-600 flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-surface-800 dark:text-surface-200">No saved destinations yet</h4>
          <p className="text-xs sm:text-sm text-surface-500 max-w-sm mx-auto">
            Browse our catalog of world cities and bookmark your dream travel spots for quick itinerary planning.
          </p>
          <div className="pt-2">
            <Link to="/cities" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-ocean-600 hover:bg-ocean-700 text-white font-semibold text-xs shadow-md">
              <Compass className="w-4 h-4" />
              <span>Explore Cities</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'map' ? (
        /* Map View */
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-inner">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={4}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {cityMarkers.map((city) => (
              <Marker key={city.id} position={[city.lat, city.lng]}>
                <Popup>
                  <div className="text-xs font-semibold text-surface-900">
                    {city.name} {city.country ? `• ${city.country}` : ''}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedCities.map((city) => {
            const cityObj = typeof city === 'object' ? city : { id: city, name: 'Saved City' }
            const cityId = cityObj.id || cityObj._id
            return (
              <motion.div
                key={cityId}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-surface-200/90 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-soft"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-surface-100 relative">
                  <img
                    src={cityObj.image || DEFAULT_CITY_IMG}
                    alt={cityObj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCity(cityId)}
                    disabled={isRemoving}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-danger-500 text-surface-600 hover:text-white backdrop-blur-md transition-colors shadow-sm"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* City Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                    <h5 className="font-display font-bold text-base truncate">{cityObj.name}</h5>
                    {cityObj.country && (
                      <p className="text-xs text-surface-200 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-sunset-300" />
                        <span>{cityObj.country}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <Link
                    to={`/trips/create?destination=${encodeURIComponent(cityObj.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-ocean-50 text-surface-800 dark:text-surface-200 hover:text-ocean-700 font-semibold text-xs transition-colors"
                  >
                    <span>Plan Trip Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
