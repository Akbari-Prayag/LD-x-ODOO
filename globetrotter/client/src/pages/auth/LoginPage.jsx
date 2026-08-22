import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Apple, Chrome, Eye, EyeOff, Facebook, Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { loginSchema } from '../../utils/validationSchemas.js'
import { clearError, loginUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const clearAuthError = () => { if (authError) dispatch(clearError()) }

  return (
    <div className="px-0.5 py-1">
      <div className="mb-6 text-center">
        <h2 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-[#08a9e8]">
          Ready to Explore?
        </h2>
        <p className="mt-2 text-sm text-surface-500">Sign in to continue your journey</p>
      </div>

      {authError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
          <p className="font-medium">{authError}</p>
          {authError.toLowerCase().includes('register first') && (
            <Link to="/register" className="mt-1 inline-block font-semibold text-[#0a8ccb] hover:text-[#0b6ea0]">
              Create an account now
            </Link>
          )}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a8ccb]">Email Id</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              onFocus={clearAuthError}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-4 focus:ring-[#09a6e3]/15 ${errors.email ? 'border-red-400' : 'border-[#8bd5f7]'}`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="pl-1 text-xs font-medium text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0a8ccb]">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              onFocus={clearAuthError}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-4 focus:ring-[#09a6e3]/15 ${errors.password ? 'border-red-400' : 'border-[#8bd5f7]'}`}
              {...register('password')}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-surface-400 transition-colors hover:text-surface-700"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="pl-1 text-xs font-medium text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <label className="inline-flex cursor-pointer select-none items-center gap-2 text-surface-600">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-surface-300 text-[#09a6e3] focus:ring-[#09a6e3]"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="font-semibold text-[#6f7f88] transition-colors hover:text-[#09a6e3]">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-xl bg-[#08a9e8] px-4 py-3 text-sm font-bold tracking-wide text-white shadow-[0_10px_20px_rgba(8,169,232,0.32)] transition-all hover:bg-[#039ad6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : 'LOGIN'}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="flex-1 h-px bg-surface-200" />
        <span className="text-xs font-semibold text-surface-500">OR</span>
        <div className="flex-1 h-px bg-surface-200" />
      </div>


      <p className="text-center text-sm text-surface-600">
        Don't have account?{' '}
        <Link to="/register" className="font-bold text-[#0999d8] transition-colors hover:text-[#087db0]">
          Register Now
        </Link>
      </p>
    </div>
  )
}