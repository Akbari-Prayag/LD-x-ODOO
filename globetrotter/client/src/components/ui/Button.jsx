import { forwardRef } from 'react'
import { cn } from '../../utils/cn.js'
import LoadingSpinner from './LoadingSpinner.jsx'

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    className,
    disabled,
    ...props
  },
  ref
) {
  const variantMap = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    outline:   'btn-outline',
    accent:    'btn-accent',
    danger:    'btn-danger',
    ghost:     'btn-ghost',
    success:   'btn-success',
  }
  const sizeMap = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  }

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn('btn', variantMap[variant], sizeMap[size], className)}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" className="text-current" />
      ) : leftIcon ? (
        leftIcon
      ) : null}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

export default Button
