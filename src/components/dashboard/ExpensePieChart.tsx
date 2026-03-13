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

interface LegendPayloadItem {
  value: string
  payload: PieChartEntry
}

function CustomLegend({ payload, total }: { payload?: LegendPayloadItem[]; total: number }) {
  const items = payload ?? []
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
      {items.map((item, index) => {
        const pct = total > 0 ? Math.round((item.payload.value / total) * 100) : 0
        return (
          <li key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.payload.color }}
            />
            {item.value}
            <span className="text-gray-400 tabular-nums">({pct}%)</span>
          </li>
        )
      })}
    </ul>
  )
}

export function ExpensePieChart({ data }: ExpensePieChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0)

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-7 h-full">
        <h3 className="text-sm font-semibold text-gray-800 tracking-tight mb-3">Gastos por categoría</h3>
        <EmptyState
          title="Sin datos"
          description="No hay gastos en este período."
          icon={<ChartPie size={48} strokeWidth={1.25} />}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-7">
      <h3 className="text-sm font-semibold text-gray-800 tracking-tight mb-3">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height={340}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={115}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, props) => [
              formatCurrency(typeof value === 'number' ? value : 0),
              props.payload?.name ?? 'Categoría',
            ]}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #f3f4f6',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              fontSize: '12px',
            }}
          />
          <Legend content={(props) => <CustomLegend payload={props.payload as LegendPayloadItem[]} total={total} />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
