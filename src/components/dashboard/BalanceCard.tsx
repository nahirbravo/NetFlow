import { TrendingUp, TrendingDown } from 'lucide-react'

interface BalanceCardProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function BalanceCard({ totalIncome, totalExpenses, balance }: BalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-7 sm:p-8 ring-1 ring-white/5">
      {/* Subtle top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${isPositive ? 'bg-emerald-400/60' : 'bg-red-400/60'}`} />

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">

        {/* Balance principal */}
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em] mb-3">
            Balance del período
          </p>
          <p className={`text-4xl sm:text-6xl font-bold tracking-tight leading-none tabular-nums ${isPositive ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
          <p className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {isPositive ? 'en positivo' : 'en negativo'}
          </p>
        </div>

        {/* Divisor */}
        <div className="hidden sm:block w-px h-16 bg-white/10" />

        {/* Métricas secundarias */}
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1 sm:flex-none sm:min-w-[120px]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.12em] mb-2">Ingresos</p>
            <p className="text-base sm:text-xl font-bold text-white tracking-tight">{formatCurrency(totalIncome)}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">Entradas</span>
            </div>
          </div>
          <div className="w-px bg-white/10 sm:hidden" />
          <div className="flex-1 sm:flex-none sm:min-w-[120px]">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.12em] mb-2">Gastos</p>
            <p className="text-base sm:text-xl font-bold text-white tracking-tight">{formatCurrency(totalExpenses)}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingDown size={12} className="text-red-400" />
              <span className="text-[10px] text-red-400 font-medium">Salidas</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
