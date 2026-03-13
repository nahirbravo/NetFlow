import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from '@/components/ui/Spinner'
import type { Category, CategoryFormValues } from '@/types/database.types'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color inválido'),
})

interface CategoryFormProps {
  category?: Category
  onSubmit: (values: CategoryFormValues) => Promise<void>
  onCancel: () => void
  serverError?: string | null
}

export function CategoryForm({ category, onSubmit, onCancel, serverError }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      color: category?.color ?? '#6366f1',
    },
  })

  useEffect(() => {
    if (category) {
      reset({ name: category.name, color: category.color })
    }
  }, [category, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          id="cat-name"
          type="text"
          {...register('name')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="Ej: Mascota"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Color */}
      <div>
        <label htmlFor="cat-color" className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <input
          id="cat-color"
          type="color"
          {...register('color')}
          className="rounded-xl border border-gray-200 bg-gray-50 min-h-[44px] w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400/30 transition-colors"
        />
        {errors.color && (
          <p className="mt-1 text-xs text-red-600">{errors.color.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 min-h-[44px] rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 min-h-[44px] rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {isSubmitting && <Spinner size="sm" />}
          {category ? 'Guardar cambios' : 'Crear categoría'}
        </button>
      </div>
    </form>
  )
}
