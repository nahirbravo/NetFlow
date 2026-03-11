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
    <div className="bg-gray-900 rounded-3xl p-7 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12">

        {/* Balance principal */}
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-3">
            Balance del período
          </p>
          <p className={`text-3xl sm:text-5xl font-bold tracking-tight leading-none ${isPositive ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
          <p className={`mt-3 text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '▲ en positivo' : '▼ en negativo'}
          </p>
        </div>

        {/* Métricas secundarias */}
        <div className="flex gap-3">
          <div className="bg-white/5 rounded-2xl px-4 py-4 flex-1">
            <p className="text-xs text-gray-500 mb-2">Ingresos</p>
            <p className="text-base sm:text-xl font-bold text-white tracking-tight">{formatCurrency(totalIncome)}</p>
            <p className="mt-1 text-xs text-emerald-400">▲</p>
          </div>
          <div className="bg-white/5 rounded-2xl px-4 py-4 flex-1">
            <p className="text-xs text-gray-500 mb-2">Gastos</p>
            <p className="text-base sm:text-xl font-bold text-white tracking-tight">{formatCurrency(totalExpenses)}</p>
            <p className="mt-1 text-xs text-red-400">▼</p>
          </div>
        </div>

      </div>
    </div>
  )
}
