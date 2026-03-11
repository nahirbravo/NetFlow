import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  session: Session | null
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<() => void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true, // true until initialize() completes
  error: null,

  signIn: async (email, password) => {
    set({ error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({ session: data.session, user: data.user })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      set({ error: message })
      throw err
    }
  },

  signUp: async (email, password) => {
    set({ error: null })
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      set({ session: data.session, user: data.user })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear cuenta'
      set({ error: message })
      throw err
    }
  },

  signOut: async () => {
    set({ error: null })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ session: null, user: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión'
      set({ error: message })
    }
  },

  initialize: async () => {
    // Restore existing session from storage
    const { data: { session } } = await supabase.auth.getSession()
    set({ session, user: session?.user ?? null, loading: false })

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null })
    })

    // Return cleanup function
    return () => subscription.unsubscribe()
  },

  clearError: () => set({ error: null }),
}))
