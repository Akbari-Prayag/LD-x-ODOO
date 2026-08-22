import { cn } from '../../utils/cn.js'

export default function SkeletonBlock({ className = '', variant = 'rect' }) {
  const variantStyles = {
    rect: 'rounded-xl',
    circle: 'rounded-full',
    pill: 'rounded-full',
    card: 'rounded-2xl',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-200/60 dark:bg-surface-800/60 animate-pulse',
        'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent',
        variantStyles[variant] || 'rounded-xl',
        className
      )}
    />
  )
}
