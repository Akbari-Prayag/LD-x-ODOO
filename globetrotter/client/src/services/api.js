import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request interceptor – attach JWT ────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor – handle 401 ───────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem('token');
      if (token === 'dummy-token-for-hackathon-demo') {
        // Prevent redirect to /login for local demo mode
        return Promise.reject(error);
      }
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Redirect to login (handled via router in components)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
