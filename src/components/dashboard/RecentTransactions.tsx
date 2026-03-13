import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardList } from 'lucide-react'
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

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'expense', label: 'Debe' },
  { key: 'income', label: 'Haber' },
] as const

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [tab, setTab] = useState<'all' | 'expense' | 'income'>('all')

  const visible = (
    tab === 'all' ? transactions : transactions.filter((t) => t.type === tab)
  ).slice(0, 8)

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 tracking-tight">Movimientos</h3>
        <Link
          to="/app/transactions"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors"
        >
          Ver todos
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
              tab === key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
        <EmptyState
          title="Sin movimientos"
          description="Aún no registraste ningún movimiento."
          icon={<ClipboardList size={40} strokeWidth={1.25} />}
        />
        </div>
      ) : (
        <div className="divide-y divide-gray-50 flex-1 overflow-y-auto min-h-0">
          {visible.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="flex-shrink-0">
                {t.category ? (
                  <CategoryBadge category={t.category} size="sm" />
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Sin cat.
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate font-medium">
                  {t.description ?? '—'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(t.date)}</p>
              </div>
              <span
                className={`text-sm font-semibold flex-shrink-0 tabular-nums ${
                  t.type === 'income' ? 'text-emerald-600' : 'text-red-500'
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
