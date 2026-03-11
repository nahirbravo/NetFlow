interface BalanceCardProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function BalanceCard({ totalIncome, totalExpenses, balance }: BalanceCardProps) {
  const isPositive = balance >= 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Balance — card destacado oscuro */}
      <div className="bg-gray-900 rounded-2xl p-5 sm:order-first">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Balance</p>
        <p className={`text-3xl font-bold mt-2 tracking-tight ${isPositive ? 'text-white' : 'text-red-400'}`}>
          {formatCurrency(balance)}
        </p>
        <p className={`mt-2 text-xs font-medium ${isPositive ? 'text-gray-400' : 'text-red-400'}`}>
          {isPositive ? '▲ positivo' : '▼ negativo'}
        </p>
      </div>

      {/* Income */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Ingresos</p>
        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{formatCurrency(totalIncome)}</p>
        <p className="mt-2 text-xs font-medium text-emerald-500">▲ ingresos</p>
      </div>

      {/* Expenses */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Gastos</p>
        <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">{formatCurrency(totalExpenses)}</p>
        <p className="mt-2 text-xs font-medium text-red-400">▼ gastos</p>
      </div>
    </div>
  )
}
