import type { TopProduct } from '../../../api/types'
import { foodIcon } from '../../../lib/foodIcon'
import { formatCurrency } from '../../../lib/format'

export function TopProducts({ products }: { products: TopProduct[] }) {
  const max = products[0]?.quantitySold ?? 1

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-700 mb-4">Más vendidos</h3>
      <ol className="space-y-3">
        {products.map((p, i) => {
          const Icon = foodIcon(p.name)
          return (
          <li key={p.name} className="flex items-center gap-3">
            <span
              className={`w-7 h-7 shrink-0 grid place-items-center rounded-full text-sm font-bold ${
                i === 0 ? 'bg-brand text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {i + 1}
            </span>
            <Icon className="w-5 h-5 text-gray-400 shrink-0" aria-hidden />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <span className="font-medium truncate">{p.name}</span>
                <span className="text-sm text-gray-400 shrink-0">
                  {p.quantitySold} u · {formatCurrency(p.revenue)}
                </span>
              </div>
              <div className="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full"
                  style={{ width: `${(p.quantitySold / max) * 100}%` }}
                />
              </div>
            </div>
          </li>
          )
        })}
      </ol>
    </div>
  )
}
