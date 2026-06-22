import { api, USE_MOCK } from './client'
import { mockMenu } from './mockMenu'
import type { CreateOrderRequest, Order, OrderLine, OrderResult } from './types'

const MOCK_KEY = 'sanpablo_mock_orders'

// Lookup variantId -> nombre del producto/variante y precio (desde el menú mock)
function variantLookup() {
  const map = new Map<string, { productName: string; variantName: string; price: number }>()
  for (const cat of mockMenu) {
    for (const p of cat.products) {
      for (const v of p.variants) {
        map.set(v.id, { productName: p.name, variantName: v.name, price: v.price })
      }
    }
  }
  return map
}

function loadMockOrders(): Order[] {
  try {
    const raw = localStorage.getItem(MOCK_KEY)
    return raw ? (JSON.parse(raw) as Order[]) : []
  } catch {
    return []
  }
}

function saveMockOrders(orders: Order[]) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(orders))
}

// POST /api/orders -> crea el pedido. El backend revalida precios y total.
export async function createOrder(req: CreateOrderRequest): Promise<OrderResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300))
    const lookup = variantLookup()

    const items: OrderLine[] = req.items.map((i) => {
      const v = lookup.get(i.variantId)
      const unitPrice = v?.price ?? 0
      return {
        productName: v?.productName ?? 'Producto',
        variantName: v?.variantName ?? '',
        unitPrice,
        quantity: i.quantity,
        lineTotal: unitPrice * i.quantity,
      }
    })
    const total = items.reduce((s, l) => s + l.lineTotal, 0)

    const existing = loadMockOrders()
    const nextNumber =
      existing.reduce((max, o) => Math.max(max, o.orderNumber), 100) + 1

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: nextNumber,
      customerName: req.customerName,
      paymentMethod: req.paymentMethod,
      total,
      createdAt: new Date().toISOString(),
      items,
    }
    saveMockOrders([order, ...existing])

    return { id: order.id, orderNumber: order.orderNumber, total, createdAt: order.createdAt }
  }

  const { data } = await api.post<OrderResult>('/orders', req)
  return data
}

// GET /api/orders -> historial de pedidos (más recientes primero)
export async function fetchOrders(): Promise<Order[]> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200))
    return loadMockOrders()
  }
  const { data } = await api.get<Order[]>('/orders')
  return data
}
