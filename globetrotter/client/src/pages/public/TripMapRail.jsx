import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Navigation } from 'lucide-react'

// Fix default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom Pin Icon
const createCustomIcon = (isActive) =>
  L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="${
        isActive
          ? 'w-8 h-8 bg-sunset-500 ring-4 ring-sunset-300/50 scale-125 animate-bounce'
          : 'w-7 h-7 bg-ocean-600'
      } rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  })

// Auto-pan map component
function MapAutoPan({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, 7, { duration: 1.2 })
    }
  }, [center, map])
  return null
}

export default function TripMapRail({ stops = [], activeStopId = null }) {
  // Extract coordinates from stops (or fallback to world coordinates)
  const coords = stops
    .map((s) => {
      const lat = s.city?.lat || (s.lat ? Number(s.lat) : 28.6139)
      const lng = s.city?.lng || (s.lng ? Number(s.lng) : 77.209)
      return { id: s.id || s._id, name: s.city?.name || s.customCityName || 'Stop', lat, lng }
    })
    .filter((c) => c.lat && c.lng)

  const activeCoord = coords.find((c) => c.id === activeStopId) || coords[0] || { lat: 28.6139, lng: 77.209 }
  const polylinePositions = coords.map((c) => [c.lat, c.lng])

  return (
    <div className="sticky top-24 rounded-3xl overflow-hidden bg-white dark:bg-surface-900 border border-surface-200/90 dark:border-surface-800 shadow-soft p-4 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-ocean-600" />
          <span>Interactive Route Map</span>
        </h4>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-300">
          {coords.length} Stops
        </span>
      </div>

      <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-surface-200 dark:border-surface-700">
        <MapContainer
          center={[activeCoord.lat, activeCoord.lng]}
          zoom={6}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapAutoPan center={[activeCoord.lat, activeCoord.lng]} />

          {/* Polyline flight route */}
          {polylinePositions.length > 1 && (
            <Polyline
              positions={polylinePositions}
              color="#3b72de"
              weight={3}
              dashArray="6, 8"
              opacity={0.8}
            />
          )}

          {/* Stop markers */}
          {coords.map((stop) => {
            const isActive = stop.id === activeStopId
            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lng]}
                icon={createCustomIcon(isActive)}
              >
                <Popup>
                  <div className="text-xs font-semibold text-surface-900">{stop.name}</div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      <p className="text-[11px] text-surface-400 text-center">
        Pins highlight automatically as you scroll through each itinerary stop.
      </p>
    </div>
  )
}
