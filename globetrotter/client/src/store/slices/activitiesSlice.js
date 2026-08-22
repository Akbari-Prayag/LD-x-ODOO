import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchActivities = createAsyncThunk('activities/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/activities', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load activities')
  }
})

export const fetchActivitiesByCity = createAsyncThunk('activities/fetchByCity', async (cityId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/activities/city/${cityId}`)
    return data.activities
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load activities')
  }
})

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    list:       [],
    cityActivities: [],
    total:      0,
    isLoading:  false,
    error:      null,
    filters: {
      search:   '',
      category: '',
      minCost:  '',
      maxCost:  '',
      duration: '',
      cityId:   '',
      country:  '',
    },
  },
  reducers: {
    setFilter(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters(state) {
      state.filters = { search: '', category: '', minCost: '', maxCost: '', duration: '', cityId: '', country: '' }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchActivities.fulfilled, (s, { payload }) => {
        s.isLoading = false; s.list = payload.activities; s.total = payload.total
      })
      .addCase(fetchActivities.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
      .addCase(fetchActivitiesByCity.pending,   (s) => { s.isLoading = true })
      .addCase(fetchActivitiesByCity.fulfilled, (s, { payload }) => { s.isLoading = false; s.cityActivities = payload })
      .addCase(fetchActivitiesByCity.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
  },
})

export const { setFilter, clearFilters } = activitiesSlice.actions

export const selectActivities       = (s) => s.activities.list
export const selectCityActivities   = (s) => s.activities.cityActivities
export const selectActivitiesLoading = (s) => s.activities.isLoading
export const selectActivityFilters  = (s) => s.activities.filters

export default activitiesSlice.reducer
