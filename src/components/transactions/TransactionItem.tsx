import { Pencil, Trash2 } from 'lucide-react'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import type { Transaction } from '@/types/database.types'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === 'income'

  return (
    <div className="relative flex items-center gap-3 px-4 py-3 hover:bg-gray-50/70 transition-colors min-h-[56px] group">
      {/* Left type indicator */}
      <span
        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full transition-opacity opacity-40 group-hover:opacity-100 ${
          isIncome ? 'bg-emerald-400' : 'bg-red-400'
        }`}
      />

      {/* Category badge */}
      <div className="flex-shrink-0">
        {transaction.category ? (
          <CategoryBadge category={transaction.category} size="sm" />
        ) : (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            Sin categoría
          </span>
        )}
      </div>

      {/* Description + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate font-medium">
          {transaction.description ?? '—'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
      </div>

      {/* Amount */}
      <span className={`text-sm font-semibold flex-shrink-0 tabular-nums ${isIncome ? 'text-emerald-600' : 'text-gray-700'}`}>
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </span>

      {/* Inline actions */}
      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          className="text-gray-400 hover:text-indigo-600 p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors"
          aria-label="Editar movimiento"
        >
          <Pencil size={13} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-red-500 p-1.5 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Eliminar movimiento"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
