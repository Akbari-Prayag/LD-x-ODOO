import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { loginSchema } from '../../utils/validationSchemas.js'
import { clearError, loginUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '', rememberMe: false } })

  const onSubmit = async (credentials) => {
    const result = await dispatch(loginUser(credentials))
    if (loginUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const clearAuthError = () => {
    if (authError) dispatch(clearError())
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4677d9] mb-3">Welcome back</p>
        <h2 className="text-3xl font-display font-bold text-[#2d3e86]">Your journey awaits.</h2>
        <p className="text-surface-500 mt-2 text-sm">Sign in to pick up where you left off.</p>
      </div>
      {authError && <div className="rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3 text-sm text-danger-700" role="alert" aria-live="polite">
        <p>{authError}</p>
        {authError.toLowerCase().includes('register first') && <Link to="/register" className="inline-block mt-2 font-semibold text-[#2d3e86] underline underline-offset-2">Register now</Link>}
      </div>}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          onFocus={clearAuthError}
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={<button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="pointer-events-auto text-surface-400 hover:text-[#2d3e86]" onClick={() => setShowPassword(current => !current)}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>}
          onFocus={clearAuthError}
          error={errors.password?.message}
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-surface-600 cursor-pointer">
            <input type="checkbox" className="accent-primary-600" {...register('rememberMe')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-[#4677d9] hover:text-[#2d3e86] font-medium">Forgot password?</Link>
        </div>
        <Button type="submit" size="lg" className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl" loading={isLoading}>Sign in</Button>
      </form>
      <p className="text-center text-sm text-surface-500">
        New to GlobeTrotter? <Link to="/register" className="font-semibold text-[#4677d9] hover:text-[#2d3e86]">Create an account</Link>
      </p>
    </div>
  )
}
