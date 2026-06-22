import type { Category, ProductVariant } from '../../../api/types'
import { foodIcon } from '../../../lib/foodIcon'
import { formatCurrency } from '../../../lib/format'

interface Props {
  category: Category | undefined
  onPick: (variant: ProductVariant, productName: string) => void
}

// Grilla de cartas táctiles. Cada variante es una carta -> tap = agregar al carrito.
export function ProductGrid({ category, onPick }: Props) {
  if (!category) {
    return <p className="text-gray-400 p-8 text-center">Seleccioná una categoría</p>
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {category.products.flatMap((product) =>
        product.variants
          .filter((v) => v.isActive)
          .map((variant) => {
            const outOfStock =
              variant.tracksStock && (variant.stockQuantity ?? 0) <= 0
            const Icon = foodIcon(variant.name, product.name, category.name)
            return (
              <button
                key={variant.id}
                disabled={outOfStock}
                onClick={() => onPick(variant, product.name)}
                className={`flex flex-col rounded-2xl overflow-hidden text-left shadow-sm
                  border transition active:scale-[0.97]
                  ${
                    outOfStock
                      ? 'bg-gray-100 border-gray-200 opacity-50'
                      : 'bg-white border-gray-200 hover:border-brand'
                  }`}
              >
                {/* Imagen ilustrativa: foto de R2 si existe, si no el icono */}
                <div className="relative h-32 sm:h-36 bg-gradient-to-br from-orange-50 to-amber-100 grid place-items-center">
                  {variant.imageUrl ? (
                    <img
                      src={variant.imageUrl}
                      alt={variant.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="w-20 h-20 text-brand/70" aria-hidden />
                  )}
                  {outOfStock && (
                    <span className="absolute top-2 right-2 text-xs font-bold bg-red-500 text-white px-2.5 py-1 rounded-full">
                      Sin stock
                    </span>
                  )}
                </div>

                {/* Texto + precio */}
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm uppercase tracking-wide text-gray-400">
                    {product.name}
                  </p>
                  <p className="text-lg font-semibold leading-tight">{variant.name}</p>
                  <span className="mt-2 text-2xl font-extrabold text-brand">
                    {formatCurrency(variant.price)}
                  </span>
                </div>
              </button>
            )
          }),
      )}
    </div>
  )
}
