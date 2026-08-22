import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Camera, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
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
  const [avatar, setAvatar] = useState(null)
  const fileRef = useRef(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  const onSubmit = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const clearAuthError = () => { if (authError) dispatch(clearError()) }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setAvatar(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative group">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-[#2d3e86]/25 bg-gradient-to-br from-[#4677d9]/20 to-[#2d3e86]/30 flex items-center justify-center transition-transform duration-200 hover:scale-105 focus:outline-none"
            aria-label="Upload profile photo"
          >
            {avatar
              ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              : <User className="w-8 h-8 text-[#4677d9]/50" />
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#4677d9] border-2 border-white flex items-center justify-center shadow">
            <Camera className="w-3 h-3 text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <p className="text-[10px] text-[#4677d9] font-semibold mt-1.5">
          {avatar ? 'Photo uploaded ✓' : 'Upload your photo'}
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#4677d9] mb-1">Welcome back</p>
        <h2 className="text-xl font-display font-bold text-[#2d3e86]">Sign In to GlobeTrotter</h2>
        <p className="text-surface-500 mt-0.5 text-xs">Your journey continues where you left off.</p>
      </div>

      {/* Error */}
      {authError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3" role="alert">
          <p>{authError}</p>
          {authError.toLowerCase().includes('register first') && (
            <Link to="/register" className="inline-block mt-1 font-semibold text-[#2d3e86] underline underline-offset-2">Register now →</Link>
          )}
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Email */}
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-[#2d3e86]">Username / Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4677d9]/60 pointer-events-none" />
            <input
              type="email" autoComplete="email" placeholder="you@example.com"
              onFocus={clearAuthError}
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border-2 bg-[#f0f7ff] text-surface-900 text-sm placeholder:text-surface-400 outline-none transition-all focus:border-[#4677d9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(70,119,217,0.12)] ${errors.email ? 'border-red-400' : 'border-transparent'}`}
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500 pl-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-[#2d3e86]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4677d9]/60 pointer-events-none" />
            <input
              autoComplete="current-password" placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              onFocus={clearAuthError}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl border-2 bg-[#f0f7ff] text-surface-900 text-sm placeholder:text-surface-400 outline-none transition-all focus:border-[#4677d9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(70,119,217,0.12)] ${errors.password ? 'border-red-400' : 'border-transparent'}`}
              {...register('password')}
            />
            <button type="button" aria-label="Toggle password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4677d9]/60 hover:text-[#2d3e86] transition-colors"
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[10px] text-red-500 pl-1">{errors.password.message}</p>}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-1.5 text-surface-600 cursor-pointer select-none">
            <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#4677d9]" {...register('rememberMe')} />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-[#4677d9] hover:text-[#2d3e86] font-semibold transition-colors text-xs">
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit" disabled={isLoading}
          className="relative w-full py-3 rounded-xl bg-gradient-to-r from-[#4677d9] to-[#2d3e86] text-white text-sm font-bold tracking-wide shadow-md shadow-[#2d3e86]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in…
            </span>
          ) : 'Login'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-surface-200" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-400">or</span>
        <div className="flex-1 h-px bg-surface-200" />
      </div>

      <p className="text-center text-xs text-surface-500">
        New to GlobeTrotter?{' '}
        <Link to="/register" className="font-bold text-[#4677d9] hover:text-[#2d3e86] underline underline-offset-2 transition-colors">
          Create an account
        </Link>
      </p>
    </div>
  )
}
