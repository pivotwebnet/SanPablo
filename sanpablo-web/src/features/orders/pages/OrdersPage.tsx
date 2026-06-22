import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdArrowBack, MdPrint, MdReceiptLong } from 'react-icons/md'
import { fetchOrders } from '../../../api/orders'
import type { Order } from '../../../api/types'
import { formatCurrency, formatDateTime } from '../../../lib/format'
import { printTicket } from '../../../lib/ticket'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold text-brand flex items-center gap-2">
            <MdReceiptLong className="w-7 h-7" aria-hidden />
            Historial de pedidos
          </h1>
          <Link
            to="/pos"
            className="px-4 py-2.5 rounded-xl bg-brand text-white font-semibold inline-flex items-center gap-2"
          >
            <MdArrowBack className="w-5 h-5" aria-hidden />
            Volver
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-3">
        {loading ? (
          <div className="grid place-items-center h-64 text-gray-400 text-xl">Cargando…</div>
        ) : orders.length === 0 ? (
          <div className="grid place-items-center h-64 text-gray-400 text-lg text-center">
            Todavía no hay pedidos registrados.
          </div>
        ) : (
          orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xl font-bold">
                    Pedido #{order.orderNumber}
                    <span className="ml-2 text-base font-normal text-gray-500">
                      {order.customerName}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</p>
                </div>
                <button
                  onClick={() => printTicket(order)}
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-gray-900 text-white font-semibold inline-flex items-center gap-2"
                >
                  <MdPrint className="w-5 h-5" aria-hidden />
                  Reimprimir
                </button>
              </div>

              <ul className="mt-3 space-y-1 text-gray-700">
                {order.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between gap-3">
                    <span>
                      <b>{it.quantity}x</b> {it.productName} {it.variantName}
                    </span>
                    <span className="text-gray-400">{formatCurrency(it.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    order.paymentMethod === 'Efectivo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {order.paymentMethod}
                </span>
                <span className="text-xl font-extrabold">{formatCurrency(order.total)}</span>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  )
}
