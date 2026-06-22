import type { Category } from './types'

// Menú de ejemplo para desarrollar el front sin backend.
// La estructura es idéntica a la respuesta de GET /api/menu.
export const mockMenu: Category[] = [
  {
    id: 'cat-mila',
    name: 'Milanesas',
    displayOrder: 1,
    products: [
      {
        id: 'prod-mila-carne',
        name: 'Milanesa de carne',
        variants: [
          { id: 'v1', name: 'A la clásica', price: 4500, tracksStock: false, isActive: true },
          { id: 'v2', name: 'A la napolitana', price: 5800, tracksStock: false, isActive: true },
          { id: 'v3', name: 'Completa (papas)', price: 6900, tracksStock: false, isActive: true },
        ],
      },
      {
        id: 'prod-mila-pollo',
        name: 'Milanesa de pollo',
        variants: [
          { id: 'v4', name: 'A la clásica', price: 4300, tracksStock: false, isActive: true },
          { id: 'v5', name: 'A la napolitana', price: 5600, tracksStock: false, isActive: true },
        ],
      },
    ],
  },
  {
    id: 'cat-pizza',
    name: 'Pizzas',
    displayOrder: 2,
    products: [
      {
        id: 'prod-pizza',
        name: 'Pizza',
        variants: [
          { id: 'v6', name: 'Muzzarella', price: 7000, tracksStock: false, isActive: true },
          { id: 'v7', name: 'Especial', price: 9500, tracksStock: false, isActive: true },
          { id: 'v8', name: 'Napolitana', price: 8200, tracksStock: false, isActive: true },
        ],
      },
    ],
  },
  {
    id: 'cat-tartas',
    name: 'Tartas',
    displayOrder: 3,
    products: [
      {
        id: 'prod-tarta',
        name: 'Tarta',
        variants: [
          { id: 'v9', name: 'Jamón y queso', price: 3800, tracksStock: true, stockQuantity: 6, isActive: true },
          { id: 'v10', name: 'Verdura', price: 3500, tracksStock: true, stockQuantity: 4, isActive: true },
          { id: 'v11', name: 'Calabaza', price: 3900, tracksStock: true, stockQuantity: 0, isActive: true },
        ],
      },
    ],
  },
  {
    id: 'cat-hamb',
    name: 'Hamburguesas',
    displayOrder: 4,
    products: [
      {
        id: 'prod-hamb',
        name: 'Hamburguesa',
        variants: [
          { id: 'v12', name: 'Simple', price: 4000, tracksStock: false, isActive: true },
          { id: 'v13', name: 'Completa', price: 5200, tracksStock: false, isActive: true },
          { id: 'v14', name: 'Doble', price: 6500, tracksStock: false, isActive: true },
        ],
      },
    ],
  },
]
