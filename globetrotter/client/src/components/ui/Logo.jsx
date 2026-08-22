import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn.js'

export default function Logo({
  variant = 'full', // 'full' | 'icon' | 'white'
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', gap: 'gap-2' },
    md: { icon: 36, text: 'text-xl', gap: 'gap-2.5' },
    lg: { icon: 44, text: 'text-2xl', gap: 'gap-3' },
  }

  const currentSize = sizeMap[size] || sizeMap.md
  const isWhite = variant === 'white'

  const pinColor = isWhite ? '#ffffff' : '#18223c'
  const planeColor = isWhite ? '#89c7e2' : '#38bdf8'
  const textColor = isWhite ? 'text-white' : 'text-[#18223c] dark:text-white'

  return (
    <div className={cn('inline-flex items-center', currentSize.gap, className)}>
      {/* Vector Icon */}
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 85"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        {/* Location Pin Outline */}
        <path
          d="M 32,32 C 32,18 42,8 55,8 C 68,8 78,18 78,32 C 78,44 68,56 55,70 C 42,56 32,44 32,32 Z"
          stroke={pinColor}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Center Circuit Node Dot */}
        <circle cx="55" cy="32" r="4.5" fill={pinColor} />

        {/* Swooping Flight Path */}
        <path
          d="M 55,32 C 55,50 74,50 80,40 C 84,33 90,22 93,17"
          stroke={planeColor}
          strokeWidth="3.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Connecting Dot */}
        <circle cx="80" cy="40" r="3" fill={planeColor} />

        {/* Flying Airplane */}
        <g transform="translate(93, 17) rotate(42) scale(0.48)">
          <path
            d="M 0,-18 L 6,-6 L 22,0 L 6,6 L 4,16 L 0,14 L -4,16 L -6,6 L -22,0 L -6,-6 Z"
            fill={planeColor}
          />
        </g>
      </svg>

      {/* Brand Text */}
      {variant !== 'icon' && (
        <span
          className={cn(
            'font-display font-extrabold tracking-wider leading-none',
            currentSize.text,
            textColor
          )}
        >
          TRIPLY
        </span>
      )}
    </div>
  )
}
