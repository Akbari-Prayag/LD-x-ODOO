import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

const storedToken = localStorage.getItem('token')
const storedUserValue = localStorage.getItem('user')
let storedUser = null

try {
  storedUser = storedUserValue ? JSON.parse(storedUserValue) : null
} catch (_) {
  localStorage.removeItem('user')
}

// ─── Thunks ──────────────────────────────────────────────────
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed')
  }
})

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/users/profile', profileData)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed')
  }
})

export const loadUserFromStorage = () => (dispatch) => {
  const token = localStorage.getItem('token')
  const user  = localStorage.getItem('user')
  if (token && user) {
    dispatch(setCredentials({ token, user: JSON.parse(user) }))
  }
}

let initialToken = null
let initialUser = null
try {
  initialToken = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  if (userStr) initialUser = JSON.parse(userStr)
} catch (e) {}

// ─── Slice ───────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:      storedUser || initialUser,
    token:     storedToken || initialToken,
    isLoading: false,
    error:     null,
  },
  reducers: {
    setCredentials(state, { payload }) {
      state.user  = payload.user
      state.token = payload.token
      state.error = null
    },
    logout(state) {
      state.user  = null
      state.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending,    (s) => { s.isLoading = true;  s.error = null })
      .addCase(loginUser.fulfilled,  (s, { payload }) => {
        s.isLoading = false; s.user = payload.user; s.token = payload.token
      })
      .addCase(loginUser.rejected,   (s, { payload }) => { s.isLoading = false; s.error = payload })
    // Register
      .addCase(registerUser.pending,   (s) => { s.isLoading = true;  s.error = null })
      .addCase(registerUser.fulfilled, (s, { payload }) => {
        s.isLoading = false; s.user = payload.user; s.token = payload.token
      })
      .addCase(registerUser.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
    // Update profile
      .addCase(updateProfile.pending,   (s) => { s.isLoading = true })
      .addCase(updateProfile.fulfilled, (s, { payload }) => { s.isLoading = false; s.user = payload })
      .addCase(updateProfile.rejected,  (s, { payload }) => { s.isLoading = false; s.error = payload })
  },
})

export const { setCredentials, logout, clearError } = authSlice.actions

// ─── Selectors ───────────────────────────────────────────────
export const selectCurrentUser    = (state) => state.auth.user
export const selectToken          = (state) => state.auth.token
export const selectIsAuthenticated = (state) => !!state.auth.token
export const selectAuthLoading    = (state) => state.auth.isLoading
export const selectAuthError      = (state) => state.auth.error

export default authSlice.reducer
