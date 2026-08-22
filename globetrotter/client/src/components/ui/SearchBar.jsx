import { Search, X } from 'lucide-react'
import { cn } from '../../utils/cn.js'

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  size = 'md',
}) {
  const sizeMap = {
    sm: 'py-1.5 text-sm',
    md: 'py-2.5 text-sm',
    lg: 'py-3 text-base',
  }

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-surface-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn('input pl-9 pr-8', sizeMap[size])}
      />
      {value && (
        <button
          onClick={() => { onChange(''); onClear?.() }}
          className="absolute right-3 text-surface-400 hover:text-surface-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
