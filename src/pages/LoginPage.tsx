import { useNavigate, Link } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthStore } from '@/stores/auth.store'

export function LoginPage() {
  const { signIn, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: { email: string; password: string }) => {
    clearError()
    await signIn(values.email, values.password)
    // signIn throws on error, so if we reach here it succeeded
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">NetFlow</h1>
          <p className="mt-1 text-sm text-gray-400">Iniciá sesión para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-7">
          <LoginForm onSubmit={handleSubmit} serverError={error} />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}
