import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { Camera, Eye, EyeOff, FileText, Globe, Lock, Mail, MapPin, Phone, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { clearError, registerUser, selectAuthError, selectAuthLoading } from '../../store/slices/authSlice.js'

const extendedRegisterSchema = z.object({
  firstName:       z.string().min(1, 'Required'),
  lastName:        z.string().min(1, 'Required'),
  email:           z.string().email('Invalid email'),
  phone:           z.string().optional(),
  city:            z.string().optional(),
  country:         z.string().optional(),
  additionalInfo:  z.string().max(500).optional(),
  password:        z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path:    ['confirmPassword'],
})

function Field({ label, error, icon: Icon, type = 'text', placeholder, right, ...props }) {
  return (
    <div className="space-y-0.5">
      {label && <label className="text-[9px] font-bold uppercase tracking-widest text-[#2d3e86]">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#4677d9]/60 pointer-events-none" />}
        <input
          type={type} placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-8' : 'pl-2.5'} ${right ? 'pr-8' : 'pr-2.5'} py-2 rounded-lg border-2 bg-[#f0f7ff] text-surface-900 text-xs placeholder:text-surface-400 outline-none transition-all focus:border-[#4677d9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(70,119,217,0.1)] ${error ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
          {...props}
        />
        {right && <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
      {error && <p className="text-[9px] text-red-500 pl-0.5">{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectAuthLoading)
  const authError = useSelector(selectAuthError)
  const [showPwd, setShowPwd] = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const fileRef = useRef(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', city: '', country: '', additionalInfo: '', password: '', confirmPassword: '' },
  })

  const clearAuthError = () => { if (authError) dispatch(clearError()) }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setAvatar(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser({
      name:            `${data.firstName} ${data.lastName}`.trim(),
      email:           data.email,
      password:        data.password,
      confirmPassword: data.confirmPassword,
    }))
    if (registerUser.fulfilled.match(result)) navigate('/dashboard')
  }

  const EyeBtn = ({ show, toggle }) => (
    <button type="button" onClick={toggle} className="text-[#4677d9]/60 hover:text-[#2d3e86] transition-colors">
      {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
    </button>
  )

  return (
    <div>
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative group">
          <button
            type="button" onClick={() => fileRef.current?.click()}
            className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-md shadow-[#2d3e86]/20 bg-gradient-to-br from-[#4677d9]/20 to-[#2d3e86]/30 flex items-center justify-center hover:scale-105 transition-transform focus:outline-none"
            aria-label="Upload profile photo"
          >
            {avatar
              ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              : <User className="w-7 h-7 text-[#4677d9]/50" />
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
              <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#4677d9] border-2 border-white flex items-center justify-center shadow">
            <Camera className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        <p className="text-[9px] text-[#4677d9] font-semibold mt-1.5">
          {avatar ? 'Photo uploaded ✓' : 'Upload Profile Photo'}
        </p>
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#4677d9] mb-0.5">Begin your adventure</p>
        <h2 className="text-lg font-display font-bold text-[#2d3e86]">Create Your Account</h2>
      </div>

      {/* Error */}
      {authError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3" role="alert">
          <p>{authError}</p>
          {authError.toLowerCase().includes('already registered') && (
            <Link to="/login" className="inline-block mt-0.5 font-semibold text-[#2d3e86] underline text-[10px]">Sign in instead →</Link>
          )}
        </div>
      )}

      <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Row 1: First + Last */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="First Name" icon={User} placeholder="John" error={errors.firstName?.message} onFocus={clearAuthError} {...register('firstName')} />
          <Field label="Last Name" placeholder="Doe" error={errors.lastName?.message} onFocus={clearAuthError} {...register('lastName')} />
        </div>

        {/* Row 2: Email + Phone */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="Email Address" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message} onFocus={clearAuthError} {...register('email')} />
          <Field label="Phone Number" type="tel" icon={Phone} placeholder="+91 98765 43210" error={errors.phone?.message} onFocus={clearAuthError} {...register('phone')} />
        </div>

        {/* Row 3: City + Country */}
        <div className="grid grid-cols-2 gap-2">
          <Field label="City" icon={MapPin} placeholder="Mumbai" error={errors.city?.message} onFocus={clearAuthError} {...register('city')} />
          <Field label="Country" icon={Globe} placeholder="India" error={errors.country?.message} onFocus={clearAuthError} {...register('country')} />
        </div>

        {/* Additional Info */}
        <div className="space-y-0.5">
          <label className="text-[9px] font-bold uppercase tracking-widest text-[#2d3e86]">Additional Information</label>
          <div className="relative">
            <FileText className="absolute left-2.5 top-2.5 w-3 h-3 text-[#4677d9]/60 pointer-events-none" />
            <textarea
              rows={2}
              placeholder="Travel style, preferences, anything else…"
              onFocus={clearAuthError}
              className="w-full pl-8 pr-2.5 py-2 rounded-lg border-2 bg-[#f0f7ff] text-surface-900 text-xs placeholder:text-surface-400 outline-none transition-all focus:border-[#4677d9] focus:bg-white focus:shadow-[0_0_0_3px_rgba(70,119,217,0.1)] border-transparent resize-none"
              {...register('additionalInfo')}
            />
          </div>
        </div>

        {/* Row 4: Password + Confirm */}
        <div className="grid grid-cols-2 gap-2">
          <Field
            label="Password" type={showPwd ? 'text' : 'password'} icon={Lock} placeholder="Min. 6 chars"
            error={errors.password?.message} onFocus={clearAuthError}
            right={<EyeBtn show={showPwd} toggle={() => setShowPwd(v => !v)} />}
            {...register('password')}
          />
          <Field
            label="Confirm Password" type={showCPwd ? 'text' : 'password'} icon={Lock} placeholder="Re-enter"
            error={errors.confirmPassword?.message} onFocus={clearAuthError}
            right={<EyeBtn show={showCPwd} toggle={() => setShowCPwd(v => !v)} />}
            {...register('confirmPassword')}
          />
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isLoading}
          className="relative w-full py-2.5 mt-1 rounded-xl bg-gradient-to-r from-[#4677d9] to-[#2d3e86] text-white text-sm font-bold tracking-wide shadow-md shadow-[#2d3e86]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group"
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all" />
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creating account…
            </span>
          ) : 'Register Users'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px bg-surface-200" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-surface-400">or</span>
        <div className="flex-1 h-px bg-surface-200" />
      </div>

      <p className="text-center text-xs text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#4677d9] hover:text-[#2d3e86] underline underline-offset-2 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}
