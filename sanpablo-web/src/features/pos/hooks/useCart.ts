import { useCallback, useMemo, useReducer } from 'react'
import type { ProductVariant } from '../../../api/types'

export interface CartLine {
  variantId: string
  productName: string
  variantName: string
  unitPrice: number
  quantity: number
}

type CartState = CartLine[]

type CartAction =
  | { type: 'add'; variant: ProductVariant; productName: string }
  | { type: 'increment'; variantId: string }
  | { type: 'decrement'; variantId: string }
  | { type: 'remove'; variantId: string }
  | { type: 'clear' }

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const existing = state.find((l) => l.variantId === action.variant.id)
      if (existing) {
        return state.map((l) =>
          l.variantId === action.variant.id ? { ...l, quantity: l.quantity + 1 } : l,
        )
      }
      return [
        ...state,
        {
          variantId: action.variant.id,
          productName: action.productName,
          variantName: action.variant.name,
          unitPrice: action.variant.price,
          quantity: 1,
        },
      ]
    }
    case 'increment':
      return state.map((l) =>
        l.variantId === action.variantId ? { ...l, quantity: l.quantity + 1 } : l,
      )
    case 'decrement':
      return state
        .map((l) =>
          l.variantId === action.variantId ? { ...l, quantity: l.quantity - 1 } : l,
        )
        .filter((l) => l.quantity > 0)
    case 'remove':
      return state.filter((l) => l.variantId !== action.variantId)
    case 'clear':
      return []
    default:
      return state
  }
}

export function useCart() {
  const [lines, dispatch] = useReducer(reducer, [])

  const add = useCallback(
    (variant: ProductVariant, productName: string) =>
      dispatch({ type: 'add', variant, productName }),
    [],
  )
  const increment = useCallback((variantId: string) => dispatch({ type: 'increment', variantId }), [])
  const decrement = useCallback((variantId: string) => dispatch({ type: 'decrement', variantId }), [])
  const remove = useCallback((variantId: string) => dispatch({ type: 'remove', variantId }), [])
  const clear = useCallback(() => dispatch({ type: 'clear' }), [])

  // Total calculado en vivo (el backend lo revalida al confirmar)
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0),
    [lines],
  )
  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  )

  return { lines, total, itemCount, add, increment, decrement, remove, clear }
}
