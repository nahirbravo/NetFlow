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

// Get first and last day of current month as YYYY-MM-DD
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

export function DashboardPage() {
  const { transactions, fetchTransactions, loading } = useTransactionStore()
  const { fetchCategories } = useCategoryStore()
  const { user } = useAuthStore()
  const [dateRange, setDateRange] = useState<DateRange>(currentMonthRange)

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [fetchTransactions, fetchCategories])

  // Filter transactions by selected date range
  const filtered = useMemo(() => {
    return transactions.filter(
      (t) => t.date >= dateRange.from && t.date <= dateRange.to
    )
  }, [transactions, dateRange])

  // Compute summary values
  const totalIncome = useMemo(
    () => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  const totalExpenses = useMemo(
    () => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [filtered]
  )
  const balance = totalIncome - totalExpenses

  // Compute pie chart data (expenses grouped by category)
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
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <ExportPDFButton
          transactions={filtered}
          dateRange={dateRange}
          userEmail={user?.email ?? ''}
        />
      </div>

      {/* Date range picker */}
      <DateRangePicker value={dateRange} onChange={setDateRange} />

      {/* Balance summary */}
      <BalanceCard
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      {/* Charts + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ExpensePieChart data={pieData} />
        <RecentTransactions transactions={filtered} />
      </div>
    </div>
  )
}
