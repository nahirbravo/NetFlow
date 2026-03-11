interface EmptyStateProps {
  title: string
  description?: string
  icon?: string
}

export function EmptyState({ title, description, icon = '📭' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl mb-4" role="img" aria-label={title}>
        {icon}
      </span>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-xs">{description}</p>
      )}
    </div>
  )
}
