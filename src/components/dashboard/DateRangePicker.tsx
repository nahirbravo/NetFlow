import { useState } from 'react'
import type { DateRange } from '@/types/database.types'

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [error, setError] = useState<string | null>(null)

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const from = e.target.value
    setError(null)
    if (value.to && from > value.to) {
      setError('La fecha inicial no puede ser mayor que la final')
      return
    }
    onChange({ ...value, from })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const to = e.target.value
    setError(null)
    if (value.from && to < value.from) {
      setError('La fecha final no puede ser menor que la inicial')
      return
    }
    onChange({ ...value, to })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={value.from}
            onChange={handleFromChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
            aria-label="Fecha desde"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={value.to}
            onChange={handleToChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 min-h-[44px] text-sm focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:border-gray-400 focus:bg-white transition-colors"
            aria-label="Fecha hasta"
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
