import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { resetPasswordSchema } from '../../utils/validationSchemas.js'
import { setCredentials } from '../../store/slices/authSlice.js'
import api from '../../services/api.js'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async ({ password }) => {
    if (!token) {
      setErrorMessage('Reset token is missing or invalid.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password })
      if (data.token && data.user) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        dispatch(setCredentials({ token: data.token, user: data.user }))
      }
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Password reset link is invalid or has expired.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center border border-success-100 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-[#2d3e86]">Password updated!</h2>
          <p className="text-surface-600 mt-2 text-sm">
            Your password has been successfully reset. Redirecting you to your dashboard...
          </p>
        </div>
        <Button
          type="button"
          className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard now
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4677d9] mb-3">Security</p>
        <h2 className="text-3xl font-display font-bold text-[#2d3e86]">Reset password</h2>
        <p className="text-surface-500 mt-2 text-sm">Create a strong new password for your account.</p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3 text-sm text-danger-700" role="alert">
          <p>{errorMessage}</p>
          <Link to="/forgot-password" className="inline-block mt-2 font-semibold text-[#2d3e86] underline underline-offset-2">
            Request a new link
          </Link>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="New password"
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
          error={errors.password?.message}
          onFocus={() => setErrorMessage('')}
          type={showPassword ? 'text' : 'password'}
          {...register('password')}
        />

        <Input
          label="Confirm new password"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
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
          error={errors.confirmPassword?.message}
          onFocus={() => setErrorMessage('')}
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
          loading={isLoading}
          leftIcon={<ShieldCheck className="w-4 h-4" />}
        >
          Reset and Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-semibold text-[#4677d9] hover:text-[#2d3e86]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
