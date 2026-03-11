import type { Transaction, DateRange } from '@/types/database.types'

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount)
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export async function generatePDF(
  transactions: Transaction[],
  dateRange: DateRange,
  userEmail: string
): Promise<void> {
  // Lazy load jsPDF to avoid impacting the initial bundle
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // ─── Header ────────────────────────────────────────────────────────────────
  doc.setFontSize(18)
  doc.setTextColor(79, 70, 229) // indigo-600
  doc.text('Registro de Gastos', 14, 20)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Usuario: ${userEmail}`, 14, 30)
  doc.text(`Período: ${formatDate(dateRange.from)} al ${formatDate(dateRange.to)}`, 14, 36)
  doc.text(`Generado: ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 42)

  // ─── Summary ───────────────────────────────────────────────────────────────
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpenses

  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text('Resumen', 14, 54)

  doc.setFontSize(10)
  doc.setTextColor(22, 163, 74)  // green-600
  doc.text(`Ingresos:   ${formatCurrency(totalIncome)}`, 14, 62)
  doc.setTextColor(220, 38, 38)  // red-600
  doc.text(`Gastos:     ${formatCurrency(totalExpenses)}`, 14, 68)
  doc.setTextColor(balance >= 0 ? 22 : 220, balance >= 0 ? 163 : 38, balance >= 0 ? 74 : 38)
  doc.text(`Balance:    ${formatCurrency(balance)}`, 14, 74)

  // ─── Transactions table ────────────────────────────────────────────────────
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(`Movimientos (${transactions.length})`, 14, 86)

  const tableBody = transactions.map((t) => [
    formatDate(t.date),
    t.description ?? '—',
    t.category?.name ?? 'Sin categoría',
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    formatCurrency(t.amount),
  ])

  autoTable(doc, {
    startY: 90,
    head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']],
    body: tableBody,
    headStyles: {
      fillColor: [79, 70, 229], // indigo-600
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 255],
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: 22 },
      4: { cellWidth: 30, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
    // All rows included — no hidden pagination (Principio IV)
    showHead: 'everyPage',
    pageBreak: 'auto',
  })

  // ─── Footer on each page ───────────────────────────────────────────────────
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } })
    .internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  // ─── Save ──────────────────────────────────────────────────────────────────
  const fileName = `gastos-${dateRange.from}_al_${dateRange.to}.pdf`
  doc.save(fileName)
}
