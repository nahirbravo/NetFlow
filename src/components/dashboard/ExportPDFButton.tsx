import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { generatePDF } from '@/lib/pdf'
import { Spinner } from '@/components/ui/Spinner'
import type { Transaction, DateRange } from '@/types/database.types'

interface ExportPDFButtonProps {
  transactions: Transaction[]
  dateRange: DateRange
  userEmail: string
}

export function ExportPDFButton({ transactions, dateRange, userEmail }: ExportPDFButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasTransactions = transactions.length > 0

  const handleExport = async () => {
    if (!hasTransactions) return
    setError(null)
    setLoading(true)
    try {
      await generatePDF(transactions, dateRange, userEmail)
    } catch (err) {
      setError('No se pudo generar el PDF. Intenta de nuevo.')
      console.error('PDF generation error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleExport}
        disabled={!hasTransactions || loading}
        className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 text-sm font-medium px-4 min-h-[44px] rounded-xl transition-colors"
        title={!hasTransactions ? 'No hay movimientos en este período' : 'Exportar PDF'}
      >
        {loading ? (
          <>
            <Spinner size="sm" />
            Generando...
          </>
        ) : (
          <>
            <FileDown size={16} />
            Exportar PDF
          </>
        )}
      </button>
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
