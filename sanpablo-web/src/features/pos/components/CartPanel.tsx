import { MdAdd, MdRemove } from 'react-icons/md'
import type { PaymentMethod } from '../../../api/types'
import { foodIcon } from '../../../lib/foodIcon'
import { formatCurrency } from '../../../lib/format'
import type { CartLine } from '../hooks/useCart'
import { PaymentSelector } from './PaymentSelector'

interface Props {
  lines: CartLine[]
  total: number
  payment: PaymentMethod | null
  customerName: string
  submitting: boolean
  onIncrement: (variantId: string) => void
  onDecrement: (variantId: string) => void
  onPaymentChange: (method: PaymentMethod) => void
  onNameChange: (name: string) => void
  onConfirm: () => void
  onClear: () => void
}

// Panel del carrito: lista + total fijo + nombre + método de pago + confirmar.
// Lateral en tablet (md+), hoja inferior en teléfono.
export function CartPanel({
  lines,
  total,
  payment,
  customerName,
  submitting,
  onIncrement,
  onDecrement,
  onPaymentChange,
  onNameChange,
  onConfirm,
  onClear,
}: Props) {
  const nameOk = customerName.trim().length >= 2
  const canConfirm = lines.length > 0 && payment !== null && nameOk && !submitting

  return (
    <aside className="flex flex-col h-full bg-white md:rounded-2xl md:shadow-lg">
      <header className="flex items-center justify-between p-4 border-b">
        <h2 className="text-2xl font-bold">Pedido actual</h2>
        {lines.length > 0 && (
          <button onClick={onClear} className="text-base text-red-500 font-medium px-2 py-1">
            Vaciar
          </button>
        )}
      </header>

      {/* Lista de ítems (scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {lines.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-lg">
            Tocá un producto para agregarlo
          </p>
        ) : (
          lines.map((line) => {
            const Icon = foodIcon(line.variantName, line.productName)
            return (
              <div
                key={line.variantId}
                className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3"
              >
                <Icon className="w-8 h-8 text-gray-400 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold truncate">{line.variantName}</p>
                  <p className="text-sm text-gray-400 truncate">{line.productName}</p>
                  <p className="text-lg text-brand font-bold">
                    {formatCurrency(line.unitPrice * line.quantity)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDecrement(line.variantId)}
                    className="btn-touch w-14 h-14 bg-gray-200"
                    aria-label="Quitar uno"
                  >
                    <MdRemove className="w-7 h-7" aria-hidden />
                  </button>
                  <span className="w-8 text-center font-bold text-2xl">{line.quantity}</span>
                  <button
                    onClick={() => onIncrement(line.variantId)}
                    className="btn-touch w-14 h-14 bg-brand text-white"
                    aria-label="Agregar uno"
                  >
                    <MdAdd className="w-7 h-7" aria-hidden />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pie fijo: total + nombre + pago + confirmar */}
      <footer className="border-t p-4 space-y-4 bg-white">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-500 font-medium text-xl">TOTAL</span>
          <span className="text-4xl font-extrabold">{formatCurrency(total)}</span>
        </div>

        {/* Nombre/apellido del cliente (obligatorio) */}
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">
            Nombre o apellido del cliente
          </label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ej: Juan / Pérez"
            autoComplete="off"
            className={`w-full h-14 px-4 rounded-2xl border-2 text-xl outline-none
              focus:border-brand ${
                customerName.length > 0 && !nameOk ? 'border-red-300' : 'border-gray-200'
              }`}
          />
        </div>

        <PaymentSelector value={payment} onChange={onPaymentChange} />

        <button
          disabled={!canConfirm}
          onClick={onConfirm}
          className={`btn-touch w-full h-16 text-2xl text-white ${
            canConfirm ? 'bg-brand active:bg-brand-dark' : 'bg-gray-300'
          }`}
        >
          {submitting ? 'Guardando…' : 'Confirmar pedido'}
        </button>
      </footer>
    </aside>
  )
}
