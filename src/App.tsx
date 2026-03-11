import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/ui/AppLayout'
import { ProtectedRoute } from '@/components/ui/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'

const router = createBrowserRouter([
  // Public routes
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // Protected routes
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/transactions', element: <TransactionsPage /> },
      { path: '/categories', element: <CategoriesPage /> },
    ],
  },
])

export function App() {
  return <RouterProvider router={router} />
}
