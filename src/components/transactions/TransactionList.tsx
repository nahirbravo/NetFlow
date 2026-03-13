import { useState } from 'react'
import { ReceiptText } from 'lucide-react'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import type { Transaction } from '@/types/database.types'

const PAGE_SIZE = 25

interface TransactionListProps {
  transactions: Transaction[]
  loading: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({ transactions, loading, onEdit, onDelete }: TransactionListProps) {
  const [page, setPage] = useState(1)

  // Reset to page 1 when transactions list changes (filter applied)
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = transactions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[60px] bg-gray-100/60 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title="Sin movimientos"
        description="No hay transacciones que coincidan con los filtros seleccionados."
        icon={<ReceiptText size={48} strokeWidth={1.25} />}
      />
    )
  }

  return (
    <div>
      {/* List */}
      <div className="divide-y divide-gray-50 bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden">
        {paginated.map((t) => (
          <TransactionItem
            key={t.id}
            transaction={t}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="min-h-[44px] px-4 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          <span className="text-sm text-gray-500">
            Página {safePage} de {totalPages}
            <span className="ml-2 text-gray-400">({transactions.length} registros)</span>
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="min-h-[44px] px-4 rounded-xl border border-gray-200 bg-white shadow-sm text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Loading inline indicator */}
      {loading && (
        <div className="flex justify-center mt-4">
          <Spinner size="sm" />
        </div>
      )}
    </div>
  )
}
