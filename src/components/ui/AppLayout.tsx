import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'

export function AppLayout() {
  const { signOut, user } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <Link to="/app" className="text-base font-semibold text-gray-900 tracking-tight">
              NetFlow
            </Link>

            {/* Nav links */}
            <div className="flex items-center">
              <Link
                to="/app"
                className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] flex items-center"
              >
                <span className="sm:hidden">Inicio</span>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to="/app/transactions"
                className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] flex items-center"
              >
                <span className="sm:hidden">Movim.</span>
                <span className="hidden sm:inline">Movimientos</span>
              </Link>
              <Link
                to="/app/categories"
                className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] flex items-center"
              >
                <span className="sm:hidden">Categ.</span>
                <span className="hidden sm:inline">Categorías</span>
              </Link>
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-1">
              <span className="hidden sm:block text-xs text-gray-400 truncate max-w-[140px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs sm:text-sm text-gray-500 hover:text-red-600 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50 transition-colors min-h-[44px] flex items-center"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
