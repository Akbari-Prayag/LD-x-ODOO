import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import AppRoutes from './routes/AppRoutes.jsx'
import { loadUserFromStorage } from './store/slices/authSlice.js'

function App() {
  const dispatch = useDispatch()

  // Rehydrate auth state from localStorage on app boot
  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
