import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice.js'
import AppLayout    from '../layouts/AppLayout.jsx'
import AuthLayout   from '../layouts/AuthLayout.jsx'
import LoadingPage  from '../components/ui/LoadingPage.jsx'

// ─── Lazy-loaded pages ───────────────────────────────────────
// Auth
const LoginPage    = lazy(() => import('../pages/auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'))
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage.jsx'))
const ResetPasswordPage  = lazy(() => import('../pages/auth/ResetPasswordPage.jsx'))

// App
const DashboardPage  = lazy(() => import('../pages/dashboard/DashboardPage.jsx'))
const TripsPage      = lazy(() => import('../pages/trips/TripsPage.jsx'))
const CreateTripPage = lazy(() => import('../pages/trips/CreateTripPage.jsx'))
const TripDetailPage = lazy(() => import('../pages/trips/TripDetailPage.jsx'))
const EditTripPage   = lazy(() => import('../pages/trips/EditTripPage.jsx'))

const ItineraryPage  = lazy(() => import('../pages/itinerary/ItineraryPage.jsx'))
const CitiesPage     = lazy(() => import('../pages/cities/CitiesPage.jsx'))
const ActivitiesPage = lazy(() => import('../pages/activities/ActivitiesPage.jsx'))
const BudgetPage     = lazy(() => import('../pages/budget/BudgetPage.jsx'))
const CalendarPage   = lazy(() => import('../pages/calendar/CalendarPage.jsx'))
const ProfilePage    = lazy(() => import('../pages/profile/ProfilePage.jsx'))

// Admin
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard.jsx'))

// Public
const PublicTripPage = lazy(() => import('../pages/public/PublicTripPage.jsx'))

// ─── Guards ──────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuthenticated)
  return isAuth ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const user   = useSelector(selectCurrentUser)
  const isAuth = useSelector(selectIsAuthenticated)
  if (!isAuth) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function PublicOnlyRoute({ children }) {
  const isAuth = useSelector(selectIsAuthenticated)
  return isAuth ? <Navigate to="/dashboard" replace /> : children
}

// ─── Routes ──────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login"          element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
          <Route path="/register"       element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>

        {/* Public trip view (no auth required) */}
        <Route path="/trip/public/:slug" element={<PublicTripPage />} />

        {/* Protected app routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard"              element={<DashboardPage />} />
          <Route path="/trips"                  element={<TripsPage />} />
          <Route path="/trips/create"           element={<CreateTripPage />} />
          <Route path="/trips/:id"              element={<TripDetailPage />} />
          <Route path="/trips/:id/edit"         element={<EditTripPage />} />
          <Route path="/trips/:id/itinerary"    element={<ItineraryPage />} />
          <Route path="/trips/:id/budget"       element={<BudgetPage />} />
          <Route path="/trips/:id/calendar"     element={<CalendarPage />} />
          <Route path="/calendar"               element={<CalendarPage />} />
          <Route path="/budget"                 element={<BudgetPage />} />
          <Route path="/cities"                 element={<CitiesPage />} />
          <Route path="/activities"             element={<ActivitiesPage />} />
          <Route path="/profile"               element={<ProfilePage />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
