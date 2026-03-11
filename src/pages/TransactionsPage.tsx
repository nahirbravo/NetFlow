import { useEffect, useState } from 'react'
import { TransactionList } from '@/components/transactions/TransactionList'
import { TransactionFilters } from '@/components/transactions/TransactionFilters'
import { TransactionForm } from '@/components/transactions/TransactionForm'
import { useTransactionStore } from '@/stores/transaction.store'
import { useCategoryStore } from '@/stores/category.store'
import type { Transaction, TransactionFormValues } from '@/types/database.types'

export function TransactionsPage() {
  const { fetchTransactions, addTransaction, updateTransaction, deleteTransaction, loading, error, getFiltered } =
    useTransactionStore()
  const { fetchCategories } = useCategoryStore()

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>()
  const [formError, setFormError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este movimiento?')) return
    setDeleteError(null)
    try {
      await deleteTransaction(id)
    } catch {
      setDeleteError('No se pudo eliminar el movimiento. Intenta de nuevo.')
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

      {/* Store-level error */}
      {(error ?? deleteError) && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error ?? deleteError}
        </div>
      )}

      {/* Filters */}
      <TransactionFilters />

      {/* List */}
      <TransactionList
        transactions={filtered}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
