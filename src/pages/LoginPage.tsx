import { useNavigate, Link } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthStore } from '@/stores/auth.store'

export function LoginPage() {
  const { signIn, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: { email: string; password: string }) => {
    clearError()
    await signIn(values.email, values.password)
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f2f3f5]">
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-gray-900/20">
            <TrendingUp size={22} className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">NetFlow</h1>
          <p className="mt-1 text-sm text-gray-400">Iniciá sesión para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-0 p-7">
          <LoginForm onSubmit={handleSubmit} serverError={error} />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="text-gray-900 hover:text-gray-700 font-semibold transition-colors">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  )
}
