import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../../lib/format'

interface Props {
  efectivo: number
  transferencia: number
}

const COLORS = ['#16a34a', '#2563eb'] // verde efectivo, azul transferencia

export function PaymentBreakdown({ efectivo, transferencia }: Props) {
  const total = efectivo + transferencia
  const data = [
    { name: 'Efectivo', value: efectivo },
    { name: 'Transferencia', value: transferencia },
  ]
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-700 mb-2">Ingresos por método de pago</h3>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={36}
                outerRadius={60}
                paddingAngle={2}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-3">
          <Row color={COLORS[0]} label="Efectivo" amount={efectivo} pct={pct(efectivo)} />
          <Row
            color={COLORS[1]}
            label="Transferencia"
            amount={transferencia}
            pct={pct(transferencia)}
          />
        </div>
      </div>
    </div>
  )
}

function Row({
  color,
  label,
  amount,
  pct,
}: {
  color: string
  label: string
  amount: number
  pct: number
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <div className="text-right">
        <p className="font-bold">{formatCurrency(amount)}</p>
        <p className="text-xs text-gray-400">{pct}%</p>
      </div>
    </div>
  )
}
