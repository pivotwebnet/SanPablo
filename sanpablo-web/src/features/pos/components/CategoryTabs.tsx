import type { Category } from '../../../api/types'
import { foodIcon } from '../../../lib/foodIcon'

interface Props {
  categories: Category[]
  selectedId: string
  onSelect: (id: string) => void
}

// Chips horizontales scrollables — cómodos para tocar con el pulgar.
export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {categories.map((cat) => {
        const active = cat.id === selectedId
        const Icon = foodIcon(cat.name)
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`btn-touch shrink-0 px-7 gap-2.5 ${
              active
                ? 'bg-brand text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <Icon className="w-7 h-7" aria-hidden />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
