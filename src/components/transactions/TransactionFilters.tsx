import { useState } from 'react'
import { TrendingUp, TrendingDown, LayoutList } from 'lucide-react'
import { useCategoryStore } from '@/stores/category.store'
import { useTransactionStore } from '@/stores/transaction.store'
import type { TransactionType } from '@/types/database.types'

export function TransactionFilters() {
  const { categories } = useCategoryStore()
  const { filters, setFilters } = useTransactionStore()
  const [dateError, setDateError] = useState<string | null>(null)

  const handleTypeChange = (type: TransactionType | 'all') => {
    setFilters({ type })
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ category_id: e.target.value })
  }

  const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const from = e.target.value
    setDateError(null)
    if (filters.date_to && from > filters.date_to) {
      setDateError('La fecha "desde" no puede ser mayor que la fecha "hasta"')
      return
    }
    setFilters({ date_from: from || null })
  }

  const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const to = e.target.value
    setDateError(null)
    if (filters.date_from && to < filters.date_from) {
      setDateError('La fecha "hasta" no puede ser menor que la fecha "desde"')
      return
    }
    setFilters({ date_to: to || null })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      {/* Type filter */}
      <div className="flex gap-2">
        {(['all', 'income', 'expense'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`flex-1 min-h-[44px] rounded-xl text-sm font-medium transition-colors ${
              filters.type === type
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {type === 'all' ? (
              <span className="flex items-center justify-center gap-1.5"><LayoutList size={14} />Todos</span>
            ) : type === 'income' ? (
              <span className="flex items-center justify-center gap-1.5"><TrendingUp size={14} />Ingresos</span>
            ) : (
              <span className="flex items-center justify-center gap-1.5"><TrendingDown size={14} />Gastos</span>
            )}
          </button>
        ))}
      </div>

      {/* Category + date row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Category */}
        <select
          value={filters.category_id}
          onChange={handleCategoryChange}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Date from */}
        <input
          type="date"
          value={filters.date_from ?? ''}
          onChange={handleDateFromChange}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="Desde"
          aria-label="Fecha desde"
        />

        {/* Date to */}
        <input
          type="date"
          value={filters.date_to ?? ''}
          onChange={handleDateToChange}
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="Hasta"
          aria-label="Fecha hasta"
        />
      </div>

      {/* Date validation error */}
      {dateError && (
        <p className="text-xs text-red-600">{dateError}</p>
      )}
    </div>
  )
}
