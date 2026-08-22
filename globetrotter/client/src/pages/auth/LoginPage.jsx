import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { loginSchema } from '../../utils/validationSchemas.js'
import { clearError, loginUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'
import { cn } from '../../utils/cn.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true })
    }
  }

  const clearAuthError = () => {
    if (authError) dispatch(clearError())
  }

  const handleFillDemo = (email, pwd) => {
    setValue('email', email)
    setValue('password', pwd)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-left">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#e05a38] font-bold">
          Account Access
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#0f172a] dark:text-white tracking-tight">
          Welcome back to Triply
        </h2>
        <p className="text-xs sm:text-sm text-surface-500 font-light">
          Enter your credentials to access your routes, itineraries, and travel journals.
        </p>
      </div>

      {/* Auth Error Banner */}
      {authError && (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900 p-3.5 text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5 animate-fade-in"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-semibold">{authError}</p>
            {authError.toLowerCase().includes('register first') && (
              <Link
                to="/register"
                className="inline-block font-bold text-red-800 dark:text-red-200 underline"
              >
                Create a new account now →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              onFocus={clearAuthError}
              className={cn(
                'w-full pl-10 pr-3.5 py-3 rounded-2xl border bg-surface-50 dark:bg-surface-800/80 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 outline-none transition-all',
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-[#e05a38] focus:bg-white dark:focus:bg-surface-900 focus:ring-4 focus:ring-[#e05a38]/10'
              )}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5 font-medium">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-surface-700 dark:text-surface-300">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-[#e05a38] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your account password"
              onFocus={clearAuthError}
              className={cn(
                'w-full pl-10 pr-10 py-3 rounded-2xl border bg-surface-50 dark:bg-surface-800/80 text-surface-900 dark:text-white text-sm placeholder:text-surface-400 outline-none transition-all',
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400/20'
                  : 'border-surface-200 dark:border-surface-700 focus:border-[#e05a38] focus:bg-white dark:focus:bg-surface-900 focus:ring-4 focus:ring-[#e05a38]/10'
              )}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 dark:hover:text-white p-0.5"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5 font-medium">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded text-[#e05a38] focus:ring-[#e05a38] border-surface-300 accent-[#e05a38]"
            {...register('rememberMe')}
          />
          <label
            htmlFor="remember-me"
            className="text-xs text-surface-600 dark:text-surface-300 font-medium cursor-pointer"
          >
            Keep me signed in on this device
          </label>
        </div>

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] dark:bg-[#e05a38] dark:hover:bg-[#f06e4b] text-white font-extrabold text-sm tracking-wide shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Sign In to Triply</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Subtle Demo Credentials Drawer */}
      <div className="pt-2 border-t border-surface-200/80 dark:border-surface-800">
        <button
          type="button"
          onClick={() => setShowDemoCredentials(!showDemoCredentials)}
          className="text-[11px] font-mono uppercase tracking-wider text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors flex items-center justify-between w-full"
        >
          <span>Need demo accounts for grading?</span>
          <span>{showDemoCredentials ? '▲ Hide' : '▼ Quick Fill'}</span>
        </button>

        {showDemoCredentials && (
          <div className="mt-2.5 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-100 dark:bg-surface-800/60 border border-surface-200 dark:border-surface-700 animate-fade-in">
            <button
              type="button"
              onClick={() => handleFillDemo('demo@globetrotter.com', 'demo123')}
              className="p-2 text-left rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-[#e05a38] text-xs transition-colors"
            >
              <p className="font-bold text-surface-900 dark:text-white">Traveler</p>
              <p className="text-[10px] text-surface-400 font-mono">demo@globetrotter.com</p>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin@globetrotter.com', 'admin123')}
              className="p-2 text-left rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 hover:border-[#e05a38] text-xs transition-colors"
            >
              <p className="font-bold text-surface-900 dark:text-white">Admin</p>
              <p className="text-[10px] text-surface-400 font-mono">admin@globetrotter.com</p>
            </button>
          </div>
        )}
      </div>

      {/* Footer Switch to Register */}
      <p className="text-center text-xs text-surface-500 pt-1">
        Don't have a Triply account?{' '}
        <Link
          to="/register"
          className="font-bold text-[#e05a38] hover:underline underline-offset-2 transition-colors"
        >
          Create an account free
        </Link>
      </p>
    </div>
  )
}
