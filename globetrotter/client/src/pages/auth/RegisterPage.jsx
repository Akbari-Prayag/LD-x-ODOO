import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { clearError, registerUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'

const registerFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPwd, setShowPwd] = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      password: '',
      confirmPassword: '',
    },
  })

  const clearAuthError = () => { if (authError) dispatch(clearError()) }

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      name:            `${data.firstName} ${data.lastName}`.trim(),
      email:           data.email,
      password:        data.password,
      confirmPassword: data.confirmPassword,
    }))
    if (registerUser.fulfilled.match(result)) navigate('/dashboard')
  }

  return (
 <div className="px-0.5 py-0.5">
  <div className="mb-3 text-center">
    <h2 className="font-display text-[2rem] font-bold leading-tight tracking-tight text-[#08a9e8]">
     Begin Your Adventure
    </h2>

    <p className="mt-1 text-[13px] text-surface-500">
      Sign up to start exploring
    </p>
  </div>

      {authError && (
        <div className="mb-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          <p className="font-medium">{authError}</p>
          {authError.toLowerCase().includes('already registered') && (
            <Link to="/login" className="mt-1 inline-block font-semibold text-[#0a8ccb] hover:text-[#0b6ea0]">Sign in instead</Link>
          )}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="rounded-2xl border border-[#dbeffc] p-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">First Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  onFocus={clearAuthError}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.firstName ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                  {...register('firstName')}
                />
              </div>
              {errors.firstName && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Last Name</label>
              <input
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                onFocus={clearAuthError}
                className={`w-full rounded-xl border bg-white py-2.5 px-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.lastName ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                {...register('lastName')}
              />
              {errors.lastName && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  onFocus={clearAuthError}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.email ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                  {...register('email')}
                />
              </div>
              {errors.email && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Phone Number</label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  onFocus={clearAuthError}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.phone ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                  {...register('phone')}
                />
              </div>
              {errors.phone && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">City</label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City"
                  onFocus={clearAuthError}
                  className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.city ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                  {...register('city')}
                />
              </div>
              {errors.city && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.city.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Country</label>
              <input
                type="text"
                autoComplete="country-name"
                placeholder="Country"
                onFocus={clearAuthError}
                className={`w-full rounded-xl border bg-white py-2.5 px-4 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.country ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                {...register('country')}
              />
              {errors.country && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.country.message}</p>}
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                onFocus={clearAuthError}
                className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.password ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                {...register('password')}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-surface-400 transition-colors hover:text-surface-700"
                onClick={() => setShowPwd(v => !v)}
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#0a8ccb]">Confirm Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                type={showCPwd ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your password"
                onFocus={clearAuthError}
                className={`w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-sm text-surface-900 outline-none transition-all focus:border-[#09a6e3] focus:ring-2 focus:ring-[#09a6e3]/15 ${errors.confirmPassword ? 'border-red-400' : 'border-[#8bd5f7]'}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-surface-400 transition-colors hover:text-surface-700"
                onClick={() => setShowCPwd(v => !v)}
              >
                {showCPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="pl-1 text-[11px] font-medium text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-1 w-full rounded-xl bg-[#08a9e8] px-4 py-2.5 text-sm font-bold tracking-wide text-white shadow-[0_10px_20px_rgba(8,169,232,0.32)] transition-all hover:bg-[#039ad6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account...
            </span>
          ) : 'SIGN UP'}
        </button>
      </form>

      <p className="mt-3 text-center text-sm text-surface-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#0999d8] transition-colors hover:text-[#087db0]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
