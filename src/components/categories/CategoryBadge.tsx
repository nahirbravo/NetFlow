import type { Category } from '@/types/database.types'

interface CategoryBadgeProps {
  category: Pick<Category, 'name' | 'color' | 'icon'>
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${paddingClass}`}
      style={{ backgroundColor: `${category.color}22`, color: category.color }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{ backgroundColor: category.color, width: size === 'sm' ? 6 : 8, height: size === 'sm' ? 6 : 8 }}
      />
      {category.name}
    </span>
  )
}
