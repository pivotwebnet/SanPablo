import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdAttachMoney,
  MdEmojiEvents,
  MdFileDownload,
  MdReceiptLong,
} from 'react-icons/md'
import {
  downloadOrdersExcel,
  fetchSalesOverTime,
  fetchSummary,
  fetchTopProducts,
} from '../../../api/metrics'
import type { MetricsSummary, SalesPoint, TopProduct } from '../../../api/types'
import { presetToRange, type DateRange, type RangePreset } from '../../../lib/dateRange'
import { formatCurrency } from '../../../lib/format'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { KpiCard } from '../components/KpiCard'
import { PaymentBreakdown } from '../components/PaymentBreakdown'
import { SalesChart } from '../components/SalesChart'
import { TopProducts } from '../components/TopProducts'

export default function DashboardPage() {
  // Por defecto: resumen del día de hoy
  const [preset, setPreset] = useState<RangePreset>('today')
  const [range, setRange] = useState<DateRange>(() => presetToRange('today'))

  const [summary, setSummary] = useState<MetricsSummary | null>(null)
  const [top, setTop] = useState<TopProduct[]>([])
  const [sales, setSales] = useState<SalesPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    const q = { from: range.from, to: range.to }
    Promise.all([fetchSummary(q), fetchTopProducts(q), fetchSalesOverTime(q)])
      .then(([s, t, sl]) => {
        if (!alive) return
        setSummary(s)
        setTop(t)
        setSales(sl)
      })
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [range])

  async function handleExport() {
    setExporting(true)
    try {
      await downloadOrdersExcel({ from: range.from, to: range.to })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <h1 className="text-xl font-extrabold text-brand">Métricas</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold disabled:bg-gray-300 inline-flex items-center gap-2"
            >
              <MdFileDownload className="w-4 h-4" aria-hidden />
              {exporting ? 'Generando…' : 'Excel'}
            </button>
            <Link
              to="/historial"
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold"
            >
              Historial
            </Link>
            <Link
              to="/pos"
              className="px-4 py-2 rounded-xl bg-brand text-white font-semibold"
            >
              Tomar pedido
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        <DateRangeFilter
          preset={preset}
          range={range}
          onChange={(p, r) => {
            setPreset(p)
            setRange(r)
          }}
        />

        {loading || !summary ? (
          <div className="grid place-items-center h-64 text-gray-400">Cargando métricas…</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard label="Pedidos" value={String(summary.totalOrders)} Icon={MdReceiptLong} />
              <KpiCard
                label="Recaudado"
                value={formatCurrency(summary.totalRevenue)}
                Icon={MdAccountBalanceWallet}
                accent="text-brand"
              />
              <KpiCard
                label="Efectivo"
                value={formatCurrency(summary.byPaymentMethod.efectivo)}
                Icon={MdAttachMoney}
                accent="text-green-600"
              />
              <KpiCard
                label="Transferencia"
                value={formatCurrency(summary.byPaymentMethod.transferencia)}
                Icon={MdAccountBalance}
                accent="text-blue-600"
              />
            </div>

            {/* Producto destacado */}
            {summary.topProduct && (
              <div className="bg-brand/10 border border-brand/20 rounded-2xl p-4 flex items-center gap-3">
                <MdEmojiEvents className="w-8 h-8 text-brand shrink-0" aria-hidden />
                <div>
                  <p className="text-sm text-gray-500">Producto más vendido del período</p>
                  <p className="font-bold text-lg text-brand">
                    {summary.topProduct.name}{' '}
                    <span className="text-gray-500 font-normal text-base">
                      ({summary.topProduct.quantitySold} unidades)
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Gráfico + métodos de pago */}
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <SalesChart data={sales} />
              </div>
              <PaymentBreakdown
                efectivo={summary.byPaymentMethod.efectivo}
                transferencia={summary.byPaymentMethod.transferencia}
              />
            </div>

            <TopProducts products={top} />
          </>
        )}
      </main>
    </div>
  )
}
