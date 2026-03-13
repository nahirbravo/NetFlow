import { CategoryBadge } from '@/components/categories/CategoryBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Category } from '@/types/database.types'

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        title="Sin categorías"
        description="Creá tu primera categoría."
        icon="🏷️"
      />
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          <CategoryBadge category={cat} size="md" />
          {!cat.is_system && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onEdit(cat)}
                className="text-sm text-gray-500 hover:text-indigo-600 px-3 min-h-[44px] flex items-center rounded-lg hover:bg-indigo-50 transition-colors"
                aria-label={`Editar ${cat.name}`}
              >
                ✏️
              </button>
              <button
                type="button"
                onClick={() => onDelete(cat.id)}
                className="text-sm text-gray-500 hover:text-red-600 px-3 min-h-[44px] flex items-center rounded-lg hover:bg-red-50 transition-colors"
                aria-label={`Eliminar ${cat.name}`}
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
