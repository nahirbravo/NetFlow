import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from '@/components/ui/Spinner'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>
  serverError?: string | null
}

export function LoginForm({ onSubmit, serverError }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Server-level error */}
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="tu@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-medium rounded-xl px-4 min-h-[44px] text-sm transition-colors"
      >
        {isSubmitting && <Spinner size="sm" />}
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
