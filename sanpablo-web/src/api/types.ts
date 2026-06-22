// Tipos compartidos con el backend .NET (espejo de los DTOs)

export type PaymentMethod = 'Efectivo' | 'Transferencia'

export interface ProductVariant {
  id: string
  name: string
  description?: string | null
  price: number
  tracksStock: boolean
  stockQuantity?: number | null
  imageUrl?: string | null // URL firmada de R2, ya resuelta por la API
  isActive: boolean
}

export interface Product {
  id: string
  name: string
  description?: string | null
  variants: ProductVariant[]
}

export interface Category {
  id: string
  name: string
  displayOrder: number
  products: Product[]
}

// ---- Toma de pedidos ----

export interface CreateOrderItem {
  variantId: string
  quantity: number
}

export interface CreateOrderRequest {
  customerName: string // nombre o apellido del cliente (obligatorio)
  paymentMethod: PaymentMethod
  notes?: string
  items: CreateOrderItem[]
}

export interface OrderResult {
  id: string
  orderNumber: number
  total: number
  createdAt: string
}

// Línea de un pedido ya registrado (con snapshot de nombres y precios)
export interface OrderLine {
  productName: string
  variantName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

// Pedido completo, tal como se lee del historial / backend
export interface Order {
  id: string
  orderNumber: number
  customerName: string
  paymentMethod: PaymentMethod
  total: number
  createdAt: string
  items: OrderLine[]
}

// ---- Métricas / Dashboard ----

export interface MetricsSummary {
  rangeFrom: string
  rangeTo: string
  totalOrders: number
  totalRevenue: number
  byPaymentMethod: {
    efectivo: number
    transferencia: number
  }
  topProduct: { name: string; quantitySold: number } | null
}

export interface TopProduct {
  name: string
  quantitySold: number
  revenue: number
}

export interface SalesPoint {
  // etiqueta del período (día/semana/mes) ya formateada por el backend
  label: string
  total: number
  orders: number
}

export type GroupBy = 'day' | 'week' | 'month'

export interface MetricsQuery {
  from: string // ISO
  to: string // ISO
}
