import { useEffect, useState } from 'react'
import { CategoryList } from '@/components/categories/CategoryList'
import { CategoryForm } from '@/components/categories/CategoryForm'
import { useCategoryStore } from '@/stores/category.store'
import type { Category, CategoryFormValues } from '@/types/database.types'

export function CategoriesPage() {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, error } =
    useCategoryStore()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleOpenCreate = () => {
    setEditingCategory(undefined)
    setFormError(null)
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormError(null)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (!confirm(`¿Eliminar la categoría "${cat?.name}"?`)) return
    setDeleteError(null)
    try {
      await deleteCategory(id)
    } catch {
      setDeleteError('No se pudo eliminar la categoría. Intenta de nuevo.')
    }
  }

  const handleFormSubmit = async (values: CategoryFormValues) => {
    setFormError(null)
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, values)
      } else {
        await addCategory(values)
      }
      setShowForm(false)
      setEditingCategory(undefined)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categorías</h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 min-h-[44px] rounded-xl transition-colors"
        >
          + Nueva
        </button>
      </div>

      {/* Errors */}
      {(error ?? deleteError) && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error ?? deleteError}
        </div>
      )}

      {/* List */}
      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
            </h2>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              serverError={formError}
            />
          </div>
        </div>
      )}
    </div>
  )
}
