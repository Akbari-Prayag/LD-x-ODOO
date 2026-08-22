import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchCities = createAsyncThunk('cities/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cities', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load cities')
  }
})

export const fetchCityById = createAsyncThunk('cities/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/cities/${id}`)
    return data.city
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load city')
  }
})

const citiesSlice = createSlice({
  name: 'cities',
  initialState: {
    list:        [],
    currentCity: null,
    total:       0,
    page:        1,
    totalPages:  1,
    isLoading:   false,
    error:       null,
    filters: {
      search:     '',
      country:    '',
      region:     '',
      minCost:    '',
      maxCost:    '',
      sortBy:     'popularity',
    },
  },
  reducers: {
    setFilter(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
    },
    clearFilters(state) {
      state.filters = { search: '', country: '', region: '', minCost: '', maxCost: '', sortBy: 'popularity' }
    },
    setPage(state, { payload }) {
      state.page = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending,   (s) => { s.isLoading = true; s.error = null })
      .addCase(fetchCities.fulfilled, (s, { payload }) => {
        s.isLoading  = false
        s.list       = payload.cities
        s.total      = payload.total
        s.page       = payload.page
        s.totalPages = payload.totalPages
      })
      .addCase(fetchCities.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
      .addCase(fetchCityById.pending,   (s) => { s.isLoading = true })
      .addCase(fetchCityById.fulfilled, (s, { payload }) => { s.isLoading = false; s.currentCity = payload })
      .addCase(fetchCityById.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
  },
})

export const { setFilter, clearFilters, setPage } = citiesSlice.actions

export const selectCities      = (s) => s.cities.list
export const selectCurrentCity = (s) => s.cities.currentCity
export const selectCitiesLoading = (s) => s.cities.isLoading
export const selectCityFilters = (s) => s.cities.filters
export const selectCityPagination = (s) => ({ page: s.cities.page, total: s.cities.total, totalPages: s.cities.totalPages })

export default citiesSlice.reducer
