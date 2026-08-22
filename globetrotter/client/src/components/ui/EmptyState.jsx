import { cn } from '../../utils/cn.js'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('empty-state', className)}>
      {Icon && (
        <div className="empty-state-icon">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-desc mt-1">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
