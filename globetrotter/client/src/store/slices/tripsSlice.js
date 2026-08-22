import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

// ─── Thunks ──────────────────────────────────────────────────
export const fetchTrips = createAsyncThunk('trips/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/trips')
    return data.trips
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load trips')
  }
})

export const fetchTrip = createAsyncThunk('trips/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/trips/${id}`)
    return data.trip
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load trip')
  }
})

export const createTrip = createAsyncThunk('trips/create', async (tripData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/trips', tripData)
    return data.trip
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create trip')
  }
})

export const updateTrip = createAsyncThunk('trips/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/trips/${id}`, updates)
    return data.trip
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update trip')
  }
})

export const deleteTrip = createAsyncThunk('trips/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/trips/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete trip')
  }
})

export const duplicateTrip = createAsyncThunk('trips/duplicate', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/trips/${id}/duplicate`)
    return data.trip
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to duplicate trip')
  }
})

export const publishTrip = createAsyncThunk('trips/publish', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/trips/${id}/publish`)
    return data.trip
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to publish trip')
  }
})

// ─── Slice ───────────────────────────────────────────────────
const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    list:         [],
    currentTrip:  null,
    isLoading:    false,
    isCreating:   false,
    error:        null,
    filters: {
      search:   '',
      status:   'all',
      sortBy:   'createdAt',
      sortDir:  'desc',
    },
  },
  reducers: {
    setCurrentTrip(state, { payload }) {
      state.currentTrip = payload
    },
    clearCurrentTrip(state) {
      state.currentTrip = null
    },
    setFilter(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
    },
    clearError(state) {
      state.error = null
    },
    // Optimistic update for stop reordering
    reorderStops(state, { payload }) {
      if (state.currentTrip) {
        state.currentTrip.stops = payload
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTrips.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchTrips.fulfilled, (s, { payload }) => { s.isLoading = false; s.list = payload })
      .addCase(fetchTrips.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
      // Fetch one
      .addCase(fetchTrip.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchTrip.fulfilled, (s, { payload }) => { s.isLoading = false; s.currentTrip = payload })
      .addCase(fetchTrip.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
      // Create
      .addCase(createTrip.pending,   (s) => { s.isCreating = true; s.error = null })
      .addCase(createTrip.fulfilled, (s, { payload }) => {
        s.isCreating = false; s.list.unshift(payload); s.currentTrip = payload
      })
      .addCase(createTrip.rejected,  (s, { payload }) => { s.isCreating = false; s.error = payload })
      // Update
      .addCase(updateTrip.fulfilled, (s, { payload }) => {
        s.currentTrip = payload
        const idx = s.list.findIndex(t => (t.id || t._id) === (payload.id || payload._id))
        if (idx !== -1) s.list[idx] = payload
      })
      // Delete
      .addCase(deleteTrip.fulfilled, (s, { payload: id }) => {
        s.list = s.list.filter(t => (t.id || t._id) !== id)
        if ((s.currentTrip?.id || s.currentTrip?._id) === id) s.currentTrip = null
      })
      // Duplicate
      .addCase(duplicateTrip.fulfilled, (s, { payload }) => {
        s.list.unshift(payload)
      })
      // Publish
      .addCase(publishTrip.fulfilled, (s, { payload }) => {
        s.currentTrip = payload
        const idx = s.list.findIndex(t => (t.id || t._id) === (payload.id || payload._id))
        if (idx !== -1) s.list[idx] = payload
      })
  },
})

export const { setCurrentTrip, clearCurrentTrip, setFilter, clearError, reorderStops } = tripsSlice.actions

export const selectTrips       = (s) => s.trips.list
export const selectAllTrips    = (s) => s.trips.list
export const selectCurrentTrip = (s) => s.trips.currentTrip
export const selectTripsLoading = (s) => s.trips.isLoading
export const selectTripsCreating = (s) => s.trips.isCreating
export const selectTripsError  = (s) => s.trips.error
export const selectTripFilters = (s) => s.trips.filters

export default tripsSlice.reducer
