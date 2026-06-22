import type { IconType } from 'react-icons'
import {
  MdBakeryDining,
  MdDinnerDining,
  MdFastfood,
  MdIcecream,
  MdLocalDrink,
  MdLocalPizza,
  MdLunchDining,
  MdOutdoorGrill,
  MdRestaurant,
  MdSetMeal,
} from 'react-icons/md'

// Icono ilustrativo (Material Icons de Google) de cada comida cuando todavía
// no hay foto real en R2. Se elige por palabra clave del nombre.
// Orden = prioridad (gana el primero).
const KEYWORDS: { match: string[]; icon: IconType }[] = [
  { match: ['pollo'], icon: MdSetMeal },
  { match: ['milanesa', 'mila'], icon: MdDinnerDining },
  { match: ['pizza', 'muzza', 'muzzarella', 'napolitana', 'especial'], icon: MdLocalPizza },
  {
    match: ['hamburguesa', 'hambur', 'burger', 'pancho', 'choripan', 'sandwich', 'sándwich'],
    icon: MdLunchDining,
  },
  { match: ['tarta'], icon: MdBakeryDining },
  { match: ['ensalada'], icon: MdRestaurant },
  { match: ['gaseosa', 'bebida', 'agua', 'coca', 'jugo'], icon: MdLocalDrink },
  { match: ['postre', 'flan', 'helado', 'torta'], icon: MdIcecream },
  { match: ['carne', 'asado', 'costilla', 'parrilla'], icon: MdOutdoorGrill },
]

// Devuelve el componente de icono a partir del nombre del producto/categoría.
export function foodIcon(...names: (string | undefined | null)[]): IconType {
  const haystack = names.filter(Boolean).join(' ').toLowerCase()
  for (const { match, icon } of KEYWORDS) {
    if (match.some((m) => haystack.includes(m))) return icon
  }
  return MdFastfood
}
