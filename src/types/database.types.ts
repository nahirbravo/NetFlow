// ─── Core domain types ────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  color: string // hex: #RRGGBB
  icon: string  // emoji
  is_system: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category_id: string | null
  date: string // 'YYYY-MM-DD'
  description: string | null
  created_at: string
  updated_at: string
  // Joined field when fetching with category
  category?: Pick<Category, 'id' | 'name' | 'color' | 'icon'>
}

// ─── Filter / form value types ─────────────────────────────────────────────────

export interface TransactionFilters {
  type: TransactionType | 'all'
  category_id: string | 'all'
  date_from: string | null // 'YYYY-MM-DD'
  date_to: string | null   // 'YYYY-MM-DD'
}

export interface TransactionFormValues {
  amount: number
  type: TransactionType
  category_id: string
  date: string // 'YYYY-MM-DD'
  description?: string
}

export interface CategoryFormValues {
  name: string
  color: string
}

// ─── Computed dashboard values ─────────────────────────────────────────────────

export interface DateRange {
  from: string // 'YYYY-MM-DD'
  to: string   // 'YYYY-MM-DD'
}

export interface PieChartEntry {
  name: string
  value: number
  color: string
}
