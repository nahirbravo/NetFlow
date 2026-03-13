import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Category, CategoryFormValues } from '@/types/database.types'

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
  fetchCategories: () => Promise<void>
  addCategory: (values: CategoryFormValues) => Promise<void>
  updateCategory: (id: string, values: CategoryFormValues) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('is_system', { ascending: false })
        .order('name', { ascending: true })

      if (error) throw error
      // Deduplicar por nombre: prioriza categorías del usuario sobre las del sistema
      const seen = new Map<string, Category>()
      for (const cat of (data ?? [])) {
        const existing = seen.get(cat.name)
        if (!existing || existing.is_system) seen.set(cat.name, cat)
      }
      set({ categories: Array.from(seen.values()) })
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al cargar categorías' })
    } finally {
      set({ loading: false })
    }
  },

  addCategory: async (values) => {
    set({ error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')

      const { data, error } = await supabase
        .from('categories')
        .insert({ ...values, icon: '', user_id: user.id, is_system: false })
        .select()
        .single()

      if (error) throw error
      set((state) => ({ categories: [...state.categories, data] }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al crear categoría' })
      throw err
    }
  },

  updateCategory: async (id, values) => {
    set({ error: null })
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c)),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al actualizar categoría' })
      throw err
    }
  },

  deleteCategory: async (id) => {
    set({ error: null })
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) throw error
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error al eliminar categoría' })
      throw err
    }
  },
}))
