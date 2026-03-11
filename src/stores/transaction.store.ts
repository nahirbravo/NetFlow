import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Transaction, TransactionFilters, TransactionFormValues } from '@/types/database.types'

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  filters: TransactionFilters
  fetchTransactions: () => Promise<void>
  addTransaction: (values: TransactionFormValues) => Promise<void>
  updateTransaction: (id: string, values: TransactionFormValues) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setFilters: (filters: Partial<TransactionFilters>) => void
  getFiltered: () => Transaction[]
}

const defaultFilters: TransactionFilters = {
  type: 'all',
  category_id: 'all',
  date_from: null,
  date_to: null,
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  filters: defaultFilters,

  fetchTransactions: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(id, name, color, icon)
        `)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ transactions: (data ?? []) as Transaction[] })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cargar transacciones' })
    } finally {
      set({ loading: false })
    }
  },

  addTransaction: async (values) => {
    set({ error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      // Round to 2 decimals before saving
      const amount = parseFloat(values.amount.toFixed(2))

      const { data, error } = await supabase
        .from('transactions')
        .insert({ ...values, amount, user_id: user.id })
        .select(`*, category:categories(id, name, color, icon)`)
        .single()

      if (error) throw error
      set((state) => ({
        transactions: [data as Transaction, ...state.transactions],
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al crear transacción' })
      throw err
    }
  },

  updateTransaction: async (id, values) => {
    set({ error: null })
    try {
      const amount = parseFloat(values.amount.toFixed(2))

      const { data, error } = await supabase
        .from('transactions')
        .update({ ...values, amount })
        .eq('id', id)
        .select(`*, category:categories(id, name, color, icon)`)
        .single()

      if (error) throw error
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? (data as Transaction) : t
        ),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al actualizar transacción' })
      throw err
    }
  },

  deleteTransaction: async (id) => {
    set({ error: null })
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al eliminar transacción' })
      throw err
    }
  },

  setFilters: (partial) => {
    set((state) => ({ filters: { ...state.filters, ...partial } }))
  },

  // Apply filters in-memory on the full transactions array
  getFiltered: () => {
    const { transactions, filters } = get()
    return transactions.filter((t) => {
      if (filters.type !== 'all' && t.type !== filters.type) return false
      if (filters.category_id !== 'all' && t.category_id !== filters.category_id) return false
      if (filters.date_from && t.date < filters.date_from) return false
      if (filters.date_to && t.date > filters.date_to) return false
      return true
    })
  },
}))
