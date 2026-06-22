import type { IconType } from 'react-icons'
import { MdAccountBalance, MdAttachMoney } from 'react-icons/md'
import type { PaymentMethod } from '../../../api/types'

interface Props {
  value: PaymentMethod | null
  onChange: (method: PaymentMethod) => void
}

const options: { method: PaymentMethod; label: string; Icon: IconType }[] = [
  { method: 'Efectivo', label: 'Efectivo', Icon: MdAttachMoney },
  { method: 'Transferencia', label: 'Transferencia', Icon: MdAccountBalance },
]

// Dos botones grandes en vez de un dropdown — más rápido de tocar.
export function PaymentSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map(({ method, label, Icon }) => {
        const active = value === method
        return (
          <button
            key={method}
            onClick={() => onChange(method)}
            className={`btn-touch flex-col gap-1 py-4 border-2 ${
              active
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <Icon className="w-9 h-9" aria-hidden />
            <span className="text-base font-semibold">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
