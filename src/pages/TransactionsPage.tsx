import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useTransactionStore } from '@/stores/transaction.store'
import { useCategoryStore } from '@/stores/category.store'
import type { Transaction, TransactionFormValues } from '@/types/database.types'

export function TransactionsPage() {
  const { fetchTransactions, addTransaction, updateTransaction, deleteTransaction, loading, error, getFiltered } =
    useTransactionStore()
  const { fetchCategories } = useCategoryStore()

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'expense' | 'income'>('all')

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [fetchTransactions, fetchCategories])

  const handleOpenCreate = () => {
    setEditingTransaction(undefined)
    setFormError(null)
    setShowForm(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormError(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setDeletingId(id)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      await deleteTransaction(deletingId)
      toast.success('Movimiento eliminado')
    } catch {
      toast.error('No se pudo eliminar el movimiento')
    } finally {
      setDeletingId(null)
    }
  }

  const handleFormSubmit = async (values: TransactionFormValues) => {
    setFormError(null)
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, values)
      } else {
        await addTransaction(values)
      }
      setShowForm(false)
      setEditingTransaction(undefined)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ocurrió un error')
    }
  }

  const filtered = getFiltered()
  const incomeCount = filtered.filter((t) => t.type === 'income').length
  const expenseCount = filtered.filter((t) => t.type === 'expense').length
  const tabFiltered =
    activeTab === 'all' ? filtered : filtered.filter((t) => t.type === activeTab)

  const TABS = [
    { key: 'all' as const, label: `Todos (${filtered.length})` },
    { key: 'expense' as const, label: `Gastos (${expenseCount})` },
    { key: 'income' as const, label: `Ingresos (${incomeCount})` },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Movimientos</h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 min-h-[44px] rounded-xl transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-100">
        <div className="flex gap-0">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                activeTab === key
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Store-level error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters (category + dates only) */}
      <TransactionFilters />

      {/* List — filtrada por tab */}
      <TransactionList
        transactions={tabFiltered}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={!!deletingId}
        title="¿Eliminar movimiento?"
        description="Esta acción no se puede deshacer."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* Modal overlay */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingTransaction ? 'Editar movimiento' : 'Nuevo movimiento'}
            </h2>
            <TransactionForm
              transaction={editingTransaction}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              serverError={formError}
            />
          </div>
        </div>
      )}
    </div>
  )
}
