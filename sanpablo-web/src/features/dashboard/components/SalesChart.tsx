import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SalesPoint } from '../../../api/types'
import { formatCurrency } from '../../../lib/format'

export function SalesChart({ data }: { data: SalesPoint[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-700 mb-4">Recaudación en el tiempo</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 4, right: 8, top: 4 }}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c1272d" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#c1272d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} tickMargin={8} />
            <YAxis
              tick={{ fontSize: 12 }}
              width={70}
              tickFormatter={(v: number) =>
                v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${v}`
              }
            />
            <Tooltip
              formatter={(v: number) => [formatCurrency(v), 'Recaudado']}
              labelFormatter={(l) => `Día ${l}`}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#c1272d"
              strokeWidth={2}
              fill="url(#rev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
