import { useState } from 'react'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import type { Transaction } from '@/types/database.types'

interface TransactionItemProps {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

// Format date as dd/MM/yyyy
function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

// Format amount as currency
function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function TransactionItem({ transaction, onEdit, onDelete }: TransactionItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isIncome = transaction.type === 'income'

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors min-h-[44px]">
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
        <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
      </div>

      {/* Amount */}
      <div
        className={`text-sm font-semibold flex-shrink-0 ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isIncome ? '+' : '-'}{formatAmount(transaction.amount)}
      </div>

      {/* Kebab menu */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400"
          aria-label="Opciones"
        >
          ⋮
        </button>

        {menuOpen && (
          <>
            {/* Backdrop to close */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onEdit(transaction) }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 min-h-[44px] flex items-center"
              >
                ✏️ Editar
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onDelete(transaction.id) }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 min-h-[44px] flex items-center"
              >
                🗑️ Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
