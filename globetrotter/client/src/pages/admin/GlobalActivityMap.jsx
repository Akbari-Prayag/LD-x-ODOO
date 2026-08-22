import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Globe, MapPin, Sparkles } from 'lucide-react'

export default function GlobalActivityMap({ popularCities = [] }) {
  // Center on global view
  const defaultCenter = [22.0, 45.0]

  const citiesWithCoords = popularCities.map((city, idx) => {
    // Generate sensible coordinates if not directly on city
    const lat = city.lat ? Number(city.lat) : 20.0 + (idx * 5) % 40
    const lng = city.lng ? Number(city.lng) : 30.0 + (idx * 15) % 80
    const count = city.visitCount || city.popularity || 85
    return { ...city, lat, lng, count }
  })

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-display font-bold text-surface-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-ocean-600 dark:text-ocean-400" />
            <span>Global Traveler Booking Heatmap</span>
          </h3>
          <p className="text-xs text-surface-500">
            Real-time visual distribution of traveler itineraries across popular world destinations
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ocean-100 dark:bg-ocean-950 text-ocean-700 dark:text-ocean-300">
          {citiesWithCoords.length} Active Hubs
        </span>
      </div>

      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-inner">
        <MapContainer
          center={defaultCenter}
          zoom={2}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {citiesWithCoords.map((city, idx) => {
            const radius = Math.min(Math.max(city.count / 5, 8), 24)
            return (
              <CircleMarker
                key={city.id || city._id || idx}
                center={[city.lat, city.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: '#3b72de',
                  fillOpacity: 0.6,
                  color: '#223883',
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="space-y-1 p-1">
                    <h5 className="font-bold text-sm text-surface-900">{city.name}</h5>
                    <p className="text-xs text-surface-500">{city.country}</p>
                    <p className="text-xs text-ocean-600 font-semibold">
                      Popularity Index: {city.popularity}%
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
    </div>
  )
}
