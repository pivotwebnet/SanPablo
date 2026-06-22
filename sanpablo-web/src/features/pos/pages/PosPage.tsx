import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdBarChart, MdReceiptLong, MdShoppingCart } from 'react-icons/md'
import { fetchMenu } from '../../../api/menu'
import { createOrder } from '../../../api/orders'
import type { Category, PaymentMethod } from '../../../api/types'
import { formatCurrency } from '../../../lib/format'
import { printTicket } from '../../../lib/ticket'
import { useCart } from '../hooks/useCart'
import { CategoryTabs } from '../components/CategoryTabs'
import { ProductGrid } from '../components/ProductGrid'
import { CartPanel } from '../components/CartPanel'

export default function PosPage() {
  const [menu, setMenu] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false) // hoja inferior en pantallas chicas

  const cart = useCart()

  useEffect(() => {
    fetchMenu()
      .then((data) => {
        setMenu(data)
        setSelectedCat(data[0]?.id ?? '')
      })
      .catch(() => setError('No se pudo cargar el menú'))
      .finally(() => setLoading(false))
  }, [])

  const currentCategory = useMemo(
    () => menu.find((c) => c.id === selectedCat),
    [menu, selectedCat],
  )

  async function handleConfirm() {
    // El nombre/apellido del cliente es obligatorio para confirmar
    if (cart.lines.length === 0 || !payment || customerName.trim().length < 2) return
    setSubmitting(true)
    try {
      const trimmedName = customerName.trim()
      const result = await createOrder({
        customerName: trimmedName,
        paymentMethod: payment,
        items: cart.lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
      })

      // Imprime la comanda para la cocina apenas se confirma el pedido
      printTicket({
        orderNumber: result.orderNumber,
        customerName: trimmedName,
        createdAt: result.createdAt,
        paymentMethod: payment,
        total: cart.total,
        items: cart.lines.map((l) => ({
          quantity: l.quantity,
          productName: l.productName,
          variantName: l.variantName,
          lineTotal: l.unitPrice * l.quantity,
        })),
      })

      setConfirmation(`Pedido #${result.orderNumber} de ${trimmedName} registrado`)
      cart.clear()
      setPayment(null)
      setCustomerName('')
      setCartOpen(false)
      setTimeout(() => setConfirmation(null), 2500)
    } catch {
      setError('No se pudo guardar el pedido. Reintentá.')
      setTimeout(() => setError(null), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  // Props compartidos por el carrito (panel lateral y hoja inferior)
  const cartProps = {
    lines: cart.lines,
    total: cart.total,
    payment,
    customerName,
    submitting,
    onIncrement: cart.increment,
    onDecrement: cart.decrement,
    onPaymentChange: setPayment,
    onNameChange: setCustomerName,
    onConfirm: handleConfirm,
    onClear: cart.clear,
  }

  if (loading) {
    return (
      <div className="grid place-items-center h-screen text-gray-400 text-xl">Cargando menú…</div>
    )
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-gray-100 overflow-hidden">
      {/* Columna de productos */}
      <main className="flex-1 flex flex-col min-h-0 p-3 md:p-5 pb-28 lg:pb-5">
        <header className="mb-3 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-brand">Rotisería San Pablo</h1>
          <div className="flex items-center gap-2">
            <Link
              to="/historial"
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-base inline-flex items-center gap-2"
            >
              <MdReceiptLong className="w-5 h-5" aria-hidden />
              <span className="hidden sm:inline">Historial</span>
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-semibold text-base inline-flex items-center gap-2"
            >
              <MdBarChart className="w-5 h-5" aria-hidden />
              <span className="hidden sm:inline">Métricas</span>
            </Link>
          </div>
        </header>

        <CategoryTabs categories={menu} selectedId={selectedCat} onSelect={setSelectedCat} />

        <div className="flex-1 overflow-y-auto mt-3">
          <ProductGrid category={currentCategory} onPick={cart.add} />
        </div>
      </main>

      {/* Carrito lateral fijo: solo en pantallas grandes (iPad horizontal / desktop) */}
      <div className="hidden lg:block lg:w-[23rem] xl:w-[26rem] p-5 pl-0 shrink-0">
        <CartPanel {...cartProps} />
      </div>

      {/* Barra inferior (celular / iPad vertical): total + abrir carrito */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t px-4 py-3 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400">{cart.itemCount} ítems</p>
          <p className="text-2xl font-extrabold leading-tight">{formatCurrency(cart.total)}</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="btn-touch bg-brand text-white px-8 gap-2"
        >
          <MdShoppingCart className="w-6 h-6" aria-hidden />
          Ver pedido
        </button>
      </div>

      {/* Hoja inferior con el carrito (pantallas chicas) */}
      {cartOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setCartOpen(false)}
            aria-hidden
          />
          <div className="relative bg-white rounded-t-3xl h-[90vh] flex flex-col shadow-2xl">
            {/* Handle para deslizar/cerrar (toda la franja superior es tocable) */}
            <button
              onClick={() => setCartOpen(false)}
              className="shrink-0 py-3 flex justify-center"
              aria-label="Cerrar"
            >
              <span className="w-12 h-1.5 rounded-full bg-gray-300" />
            </button>
            <div className="flex-1 min-h-0">
              <CartPanel {...cartProps} />
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {confirmation && <Toast text={confirmation} variant="success" />}
      {error && <Toast text={error} variant="error" />}
    </div>
  )
}

function Toast({ text, variant }: { text: string; variant: 'success' | 'error' }) {
  return (
    <div
      className={`fixed bottom-28 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 px-7 py-4 rounded-full
        text-white text-lg font-semibold shadow-lg ${
          variant === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}
    >
      {text}
    </div>
  )
}
