import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, KeyRound, Mail, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import { forgotPasswordSchema } from '../../utils/validationSchemas.js'
import api from '../../services/api.js'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [devOtp, setDevOtp] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (values) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const { data } = await api.post('/auth/forgot-password', values)
      setSubmitted(true)
      if (data.devOtp) {
        setDevOtp(data.devOtp)
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-success-50 text-success-600 flex items-center justify-center border border-success-100 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-[#2d3e86]">Check your OTP</h2>
          <p className="text-surface-600 mt-2 text-sm max-w-sm mx-auto">
            We have sent a 6-digit OTP to <strong className="text-surface-900">{getValues('email')}</strong> if an account exists.
          </p>
        </div>

        {devOtp && (
          <div className="p-3.5 bg-surface-50 border border-surface-200 rounded-xl text-left text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-primary-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Development OTP:</span>
            </div>
            <p className="text-[#4677d9] font-mono text-base tracking-[0.25em]">{devOtp}</p>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            type="button"
            className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
            onClick={() => navigate('/reset-password', { state: { email: getValues('email') } })}
          >
            Verify OTP and Reset Password
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full !rounded-xl"
            onClick={() => {
              setSubmitted(false)
              setDevOtp('')
            }}
          >
            Try another email
          </Button>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-[#4677d9] hover:text-[#2d3e86]"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#4677d9] hover:text-[#2d3e86] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
        <h2 className="text-3xl font-display font-bold text-[#2d3e86]">Forgot password?</h2>
        <p className="text-surface-500 mt-2 text-sm">
          No worries. Enter your account email and we'll send you recovery instructions.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3 text-sm text-danger-700" role="alert">
          {errorMessage}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          onFocus={() => setErrorMessage('')}
          {...register('email')}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full !bg-[#4677d9] hover:!bg-[#2d3e86] !rounded-xl"
          loading={isLoading}
          leftIcon={<KeyRound className="w-4 h-4" />}
        >
          Send OTP
        </Button>
      </form>

      <p className="text-center text-sm text-surface-500">
        Remember your password?{' '}
        <Link to="/login" className="font-semibold text-[#4677d9] hover:text-[#2d3e86]">
          Sign in
        </Link>
      </p>
    </div>
  )
}
