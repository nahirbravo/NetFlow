import { Pencil, Trash2, Tag } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Category } from '@/types/database.types'

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

function CategoryCard({
  cat,
  onEdit,
  onDelete,
}: {
  cat: Category
  onEdit: (c: Category) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between min-h-[56px] hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: cat.color }}
        />
        <span className="text-sm font-semibold text-gray-800 truncate">{cat.name}</span>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(cat)}
          className="text-gray-400 hover:text-indigo-600 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors"
          aria-label={`Editar ${cat.name}`}
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(cat.id)}
          className="text-gray-400 hover:text-red-600 p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
          aria-label={`Eliminar ${cat.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
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

  const systemCats = categories.filter((c) => c.is_system)
  const userCats = categories.filter((c) => !c.is_system)

  return (
    <div className="space-y-6">
      {userCats.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Mis categorías
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userCats.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}

      {systemCats.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Sistema
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {systemCats.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
