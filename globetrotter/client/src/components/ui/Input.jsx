import { forwardRef } from 'react'
import { cn } from '../../utils/cn.js'

const Input = forwardRef(function Input(
  { label, error, hint, className, wrapperClassName, leftIcon, rightIcon, ...props },
  ref
) {
  return (
    <div className={cn('space-y-1.5', wrapperClassName)}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'input',
            leftIcon  && 'pl-9',
            rightIcon && 'pr-9',
            error && 'input-error',
            className,
          )}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="input-error-msg">{error}</p>}
      {hint && !error && <p className="input-hint">{hint}</p>}
    </div>
  )
})

export default Input
