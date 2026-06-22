import { api, USE_MOCK } from './client'
import type {
  MetricsQuery,
  MetricsSummary,
  SalesPoint,
  TopProduct,
} from './types'

// ---------- Mock determinístico según el rango ----------

const MOCK_PRODUCTS = [
  'Milanesa Napolitana',
  'Pizza Muzzarella',
  'Hamburguesa Completa',
  'Milanesa Clásica',
  'Tarta J&Q',
  'Pizza Especial',
]

// "Aleatorio" reproducible para que los números no cambien en cada render
function seeded(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

function daysBetween(from: string, to: string): number {
  const ms = new Date(to).getTime() - new Date(from).getTime()
  return Math.max(1, Math.ceil(ms / 86_400_000))
}

function buildMock(q: MetricsQuery) {
  const days = daysBetween(q.from, q.to)
  const rand = seeded(new Date(q.from).getDate() + days * 31)

  const points: SalesPoint[] = []
  let totalRevenue = 0
  let totalOrders = 0

  const start = new Date(q.from)
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const orders = 20 + Math.floor(rand() * 40)
    const total = orders * (3500 + Math.floor(rand() * 3000))
    totalOrders += orders
    totalRevenue += total
    points.push({
      label: d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }),
      orders,
      total,
    })
  }

  const efectivo = Math.round(totalRevenue * (0.45 + rand() * 0.1))
  const transferencia = totalRevenue - efectivo

  const top: TopProduct[] = MOCK_PRODUCTS.map((name) => ({
    name,
    quantitySold: 10 + Math.floor(rand() * 90),
    revenue: 0,
  }))
    .map((p) => ({ ...p, revenue: p.quantitySold * (3500 + Math.floor(rand() * 3000)) }))
    .sort((a, b) => b.quantitySold - a.quantitySold)

  const summary: MetricsSummary = {
    rangeFrom: q.from,
    rangeTo: q.to,
    totalOrders,
    totalRevenue,
    byPaymentMethod: { efectivo, transferencia },
    topProduct: { name: top[0].name, quantitySold: top[0].quantitySold },
  }

  return { summary, points, top }
}

// ---------- API ----------

export async function fetchSummary(q: MetricsQuery): Promise<MetricsSummary> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return buildMock(q).summary
  }
  const { data } = await api.get<MetricsSummary>('/metrics/summary', { params: q })
  return data
}

export async function fetchTopProducts(
  q: MetricsQuery,
  limit = 5,
): Promise<TopProduct[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return buildMock(q).top.slice(0, limit)
  }
  const { data } = await api.get<TopProduct[]>('/metrics/top-products', {
    params: { ...q, limit },
  })
  return data
}

export async function fetchSalesOverTime(q: MetricsQuery): Promise<SalesPoint[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return buildMock(q).points
  }
  const { data } = await api.get<SalesPoint[]>('/metrics/sales-over-time', {
    params: { ...q, groupBy: 'day' },
  })
  return data
}

// Descarga el Excel filtrado (GET /api/reports/orders.xlsx)
export async function downloadOrdersExcel(q: MetricsQuery): Promise<void> {
  if (USE_MOCK) {
    alert('Exportar a Excel estará disponible al conectar el backend.')
    return
  }
  const res = await api.get('/reports/orders.xlsx', {
    params: q,
    responseType: 'blob',
  })
  const url = URL.createObjectURL(res.data as Blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pedidos_${q.from.slice(0, 10)}_${q.to.slice(0, 10)}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}
