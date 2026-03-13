import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCategoryStore } from '@/stores/category.store'
import { Spinner } from '@/components/ui/Spinner'
import type { Transaction, TransactionFormValues } from '@/types/database.types'

const transactionSchema = z.object({
  amount: z
    .number({ error: 'El monto debe ser un número' })
    .positive('El monto debe ser mayor a 0'),
  type: z.enum(['income', 'expense']),
  category_id: z.string().min(1, 'Seleccioná una categoría'),
  date: z.string().min(1, 'La fecha es obligatoria'),
  description: z.string().max(255, 'Máximo 255 caracteres').optional(),
})

interface TransactionFormProps {
  transaction?: Transaction
  onSubmit: (values: TransactionFormValues) => Promise<void>
  onCancel: () => void
  serverError?: string | null
}

// Get today's date in YYYY-MM-DD format (local time)
function todayString() {
  return new Date().toISOString().split('T')[0]
}

export function TransactionForm({ transaction, onSubmit, onCancel, serverError }: TransactionFormProps) {
  const { categories } = useCategoryStore()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount ?? undefined,
      type: transaction?.type ?? 'expense',
      category_id: transaction?.category_id ?? '',
      date: transaction?.date ?? todayString(),
      description: transaction?.description ?? '',
    },
  })

  const selectedType = watch('type')

  // Re-initialize if editing a different transaction
  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        type: transaction.type,
        category_id: transaction.category_id ?? '',
        date: transaction.date,
        description: transaction.description ?? '',
      })
    }
  }, [transaction, reset])

  const isEditing = !!transaction

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Server-level error */}
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Type toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
        <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
          <button
            type="button"
            onClick={() => setValue('type', 'expense')}
            className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium transition-all ${
              selectedType === 'expense'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💸 Gasto
          </button>
          <button
            type="button"
            onClick={() => setValue('type', 'income')}
            className={`flex-1 min-h-[40px] rounded-lg text-sm font-medium transition-all ${
              selectedType === 'income'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            💵 Ingreso
          </button>
        </div>
        {errors.type && (
          <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Monto
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          {...register('amount', { valueAsNumber: true })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="0.00"
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría
        </label>
        <select
          id="category_id"
          {...register('category_id')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
        >
          <option value="">Seleccioná una categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1 text-xs text-red-600">{errors.category_id.message}</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          id="date"
          type="date"
          {...register('date')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
        />
        {errors.date && (
          <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
        )}
      </div>

      {/* Description (optional) */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-gray-400 font-normal">(opcional)</span>
        </label>
        <textarea
          id="description"
          rows={2}
          {...register('description')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors resize-none"
          placeholder="Ej: Almuerzo con cliente"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
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
          {isEditing ? 'Guardar cambios' : 'Crear movimiento'}
        </button>
      </div>
    </form>
  )
}
