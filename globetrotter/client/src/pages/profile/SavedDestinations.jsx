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
    <div className="p-6 sm:p-7 rounded-2xl bg-[#16255b]/30 border border-white/10 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span>Saved Destinations</span>
          </h3>
          <p className="text-xs text-[#d2e9ec]/70 font-light mt-0.5">
            Bookmarked locations for future itineraries.
          </p>
        </div>

        {/* View Switcher */}
        {savedCities.length > 0 && (
          <div className="flex items-center bg-[#0c1222]/80 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#3b72de] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-[#3b72de] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
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
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0c1222]/40 border border-dashed border-white/10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#3b72de]/20 text-[#89c7e2] flex items-center justify-center mx-auto shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No saved destinations yet</h4>
          <p className="text-xs sm:text-sm text-[#d2e9ec]/70 max-w-sm mx-auto font-light">
            Browse our catalog of world cities and bookmark your dream travel spots for quick itinerary planning.
          </p>
          <div className="pt-2">
            <Link
              to="/cities"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3b72de] hover:bg-[#2c5ec6] text-white font-semibold text-xs shadow-md transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Cities</span>
            </Link>
          </div>
        </div>
      ) : viewMode === 'map' ? (
        /* Map View */
        <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
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
                  <div className="text-xs font-semibold text-slate-900">
                    {city.name} {city.country ? `• ${city.country}` : ''}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedCities.map((city) => {
            const cityObj = typeof city === 'object' ? city : { id: city, name: 'Saved City' }
            const cityId = cityObj.id || cityObj._id
            return (
              <motion.div
                key={cityId}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1222]/60 shadow-md flex flex-col justify-between"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-slate-800 relative">
                  <img
                    src={cityObj.image || DEFAULT_CITY_IMG}
                    alt={cityObj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCity(cityId)}
                    disabled={isRemoving}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-colors shadow-sm"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* City Label */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white pointer-events-none">
                    <h5 className="font-display font-bold text-base truncate">{cityObj.name}</h5>
                    {cityObj.country && (
                      <p className="text-[11px] text-[#d2e9ec]/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#89c7e2]" />
                        <span>{cityObj.country}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <Link
                    to={`/trips/create?destination=${encodeURIComponent(cityObj.name)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-[#3b72de] text-white font-semibold text-xs transition-colors"
                  >
                    <span>Plan Trip</span>
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
