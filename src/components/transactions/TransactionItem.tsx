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
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors min-h-[56px]">
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
        <p className="text-sm text-gray-900 truncate">
          {transaction.description ?? '—'}
        </p>
        <p className="text-xs text-gray-400">{formatDate(transaction.date)}</p>
      </div>

      {/* Amount */}
      <span className={`text-sm font-semibold flex-shrink-0 ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </span>

      {/* Inline actions */}
      <div className="flex gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          className="text-gray-400 hover:text-indigo-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-indigo-50 transition-colors"
          aria-label="Editar movimiento"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-red-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Eliminar movimiento"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
