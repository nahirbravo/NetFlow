import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TrendingUp, LayoutDashboard, ArrowLeftRight, Tag } from 'lucide-react'
import { useAuthStore } from '@/stores/auth.store'

const NAV_LINKS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/app/transactions', label: 'Movimientos', icon: ArrowLeftRight, exact: false },
  { to: '/app/categories', label: 'Categorías', icon: Tag, exact: false },
]

export function AppLayout() {
  const { signOut, user } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const isActive = (to: string, exact: boolean) =>
    exact ? pathname === to : pathname.startsWith(to)

  const initials = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 shadow-sm shadow-gray-100/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Brand */}
            <Link to="/app" className="flex items-center gap-2 text-base font-semibold text-gray-900 tracking-tight">
              <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp size={14} className="text-emerald-400" />
              </div>
              <span className="hidden sm:inline">NetFlow</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => {
                const active = isActive(to, exact)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-2 rounded-lg min-h-[40px] flex items-center gap-1.5 transition-colors ${
                      active
                        ? 'text-white bg-gray-900'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={15} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                )
              })}
            </div>

            {/* User + logout */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <span className="text-xs text-gray-400 truncate max-w-[120px]">
                  {user?.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs sm:text-sm text-gray-400 hover:text-red-500 px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50 transition-colors min-h-[40px] flex items-center font-medium"
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
