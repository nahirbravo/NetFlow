import { Tag, Pencil, Trash2 } from 'lucide-react'
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
        icon={<Tag size={48} strokeWidth={1.25} />}
      />
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-50 overflow-hidden">
      {categories.map((cat) => (
        <div key={cat.id} className="flex items-center justify-between px-4 py-3 min-h-[56px]">
          <CategoryBadge category={cat} size="md" />
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(cat)}
              className="text-gray-400 hover:text-indigo-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors"
              aria-label={`Editar ${cat.name}`}
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(cat.id)}
              className="text-gray-400 hover:text-red-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
              aria-label={`Eliminar ${cat.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
