import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Spinner } from '@/components/ui/Spinner'

const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (values: Pick<RegisterFormValues, 'email' | 'password'>) => Promise<void>
  serverError?: string | null
}

export function RegisterForm({ onSubmit, serverError }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const handleFormSubmit = ({ email, password }: RegisterFormValues) =>
    onSubmit({ email, password })

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {/* Server-level error */}
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Email */}
      <div>
        <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="reg-email"
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
        <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar contraseña
        </label>
        <input
          id="reg-confirm"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-medium rounded-xl px-4 min-h-[44px] text-sm transition-colors"
      >
        {isSubmitting && <Spinner size="sm" />}
        {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  )
}
