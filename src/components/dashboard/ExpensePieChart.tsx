import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartPie } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import type { PieChartEntry } from '@/types/database.types'

interface ExpensePieChartProps {
  data: PieChartEntry[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(value)
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm p-7">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Gastos por categoría</h3>
        <EmptyState
          title="Sin datos"
          description="No hay gastos en este período."
          icon={<ChartPie size={48} strokeWidth={1.25} />}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm p-7">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              formatCurrency(typeof value === 'number' ? value : 0),
              'Total',
            ]}
            labelFormatter={(label) => String(label)}
          />
          <Legend
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
