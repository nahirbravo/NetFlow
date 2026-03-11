import { Link } from 'react-router-dom'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Transaction } from '@/types/database.types'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Últimos movimientos</h3>
        <Link
          to="/transactions"
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Ver todos →
        </Link>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="Sin movimientos"
          description="Aún no registraste ningún movimiento."
          icon="📋"
        />
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2">
              {t.category ? (
                <CategoryBadge category={t.category} size="sm" />
              ) : (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Sin cat.
                </span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">
                  {t.description ?? '—'}
                </p>
                <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
              </div>
              <span
                className={`text-sm font-semibold flex-shrink-0 ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
