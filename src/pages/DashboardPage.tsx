import { useEffect, useMemo, useState } from 'react'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { ExpensePieChart } from '@/components/dashboard/ExpensePieChart'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { DateRangePicker } from '@/components/dashboard/DateRangePicker'
import { ExportPDFButton } from '@/components/dashboard/ExportPDFButton'
import { useTransactionStore } from '@/stores/transaction.store'
import { useCategoryStore } from '@/stores/category.store'
import { useAuthStore } from '@/stores/auth.store'
import { Spinner } from '@/components/ui/Spinner'
import type { DateRange, PieChartEntry } from '@/types/database.types'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function currentMonthRange(): DateRange {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  return {
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${String(lastDay).padStart(2, '0')}`,
  }
}

function monthLabel(range: DateRange): string {
  const [year, month] = range.from.split('-')
  const toYear = range.to.split('-')[0]
  const toMonth = range.to.split('-')[1]
  if (month === toMonth && year === toYear) {
    return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`
  }
  return `${range.from} → ${range.to}`
}

export function DashboardPage() {
  const { transactions, fetchTransactions, loading } = useTransactionStore()
  const { fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const [dateRange, setDateRange] = useState<DateRange>(currentMonthRange)

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [fetchTransactions, fetchCategories])

  const filtered = useMemo(() => {
    return transactions.filter(
      (t) => t.date >= dateRange.from && t.date <= dateRange.to
    )
  }, [transactions, dateRange])

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  const totalExpenses = useMemo(
    () => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  const balance = totalIncome - totalExpenses

  const pieData = useMemo<PieChartEntry[]>(() => {
    const map = new Map<string, { name: string; value: number; color: string }>()
    filtered
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        const key = t.category_id ?? 'uncategorized'
        const existing = map.get(key)
        const name = t.category?.name ?? 'Sin categoría'
        const color = t.category?.color ?? '#9ca3af'
        if (existing) {
          existing.value += t.amount
        } else {
          map.set(key, { name, value: t.amount, color })
        }
      })
    return Array.from(map.values())
  }, [filtered])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header row: título | DateRange compact + Export */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Resumen
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {monthLabel(dateRange)}
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:block">
            <DateRangePicker value={dateRange} onChange={setDateRange} compact />
          </div>
          <ExportPDFButton
            transactions={filtered}
            dateRange={dateRange}
            userEmail={user?.email ?? ''}
          />
        </div>
      </div>

      {/* DateRangePicker en mobile (full width) */}
      <div className="sm:hidden">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Balance — card oscuro full width */}
      <BalanceCard
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      {/* Bento — gráfico 3/5 + movimientos recientes 2/5 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ExpensePieChart data={pieData} />
        </div>
        <div className="lg:col-span-2">
          <RecentTransactions transactions={filtered} />
        </div>
      </div>
    </div>
  )
}
