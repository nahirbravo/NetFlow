import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Spinner } from '@/components/ui/Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading } = useAuthStore()

  // Wait for the auth store to initialize (restore session from storage)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />

  }

  return <>{children}</>
}
