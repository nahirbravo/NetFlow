import { useNavigate, Link } from 'react-router-dom'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAuthStore } from '@/stores/auth.store'

export function RegisterPage() {
  const { signUp, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (values: { email: string; password: string }) => {
    clearError()
    await signUp(values.email, values.password)
    // signUp throws on error, so if we reach here it succeeded
    navigate('/app')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f2f3f5]">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">NetFlow</h1>
          <p className="mt-1 text-sm text-gray-400">Creá tu cuenta gratuita</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-0 p-7">
          <RegisterForm onSubmit={handleSubmit} serverError={error} />
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
