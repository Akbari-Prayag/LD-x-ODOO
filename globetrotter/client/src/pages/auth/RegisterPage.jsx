import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { registerSchema } from '../../utils/validationSchemas.js'
import { clearError, registerUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (userData) => {
    const result = await dispatch(registerUser(userData))
    if (registerUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const clearAuthError = () => {
    if (authError) dispatch(clearError())
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4677d9] mb-3">Begin your adventure</p>
        <h2 className="text-3xl font-display font-bold text-[#2d3e86]">Create an account</h2>
        <p className="text-surface-500 mt-2 text-sm">Start planning personalized multi-city trips today.</p>
      </div>

      {authError && (
        <div className="rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3 text-sm text-danger-700" role="alert" aria-live="polite">
          <p>{authError}</p>
          {authError.toLowerCase().includes('already registered') && (
            <Link to="/login" className="inline-block mt-2 font-semibold text-[#2d3e86] underline underline-offset-2">
              Sign in instead
            </Link>
          )}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="e.g. Kushal Patel"
          leftIcon={<User className="w-4 h-4" />}
          onFocus={clearAuthError}
          error={errors.name?.message}
          {...register('name')}
        />

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
          autoComplete="new-password"
          placeholder="At least 6 characters"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="pointer-events-auto text-surface-400 hover:text-[#2d3e86]"
              onClick={() => setShowPassword(current => !current)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          onFocus={clearAuthError}
          error={errors.password?.message}
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
        />

        <Input
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="pointer-events-auto text-surface-400 hover:text-[#2d3e86]"
              onClick={() => setShowConfirmPassword(current => !current)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          onFocus={clearAuthError}
          error={errors.confirmPassword?.message}
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
          loading={isLoading}
        >
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#4677d9] hover:text-[#2d3e86]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
