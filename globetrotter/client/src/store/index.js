import { configureStore } from '@reduxjs/toolkit'
import authReducer          from './slices/authSlice.js'
import tripsReducer         from './slices/tripsSlice.js'
import uiReducer            from './slices/uiSlice.js'
import citiesReducer        from './slices/citiesSlice.js'
import activitiesReducer    from './slices/activitiesSlice.js'
import notificationsReducer from './slices/notificationsSlice.js'

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    trips:         tripsReducer,
    ui:            uiReducer,
    cities:        citiesReducer,
    activities:    activitiesReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore date objects stored in state
        ignoredPaths: ['trips.currentTrip.startDate', 'trips.currentTrip.endDate'],
      },
    }),
})

export default store
