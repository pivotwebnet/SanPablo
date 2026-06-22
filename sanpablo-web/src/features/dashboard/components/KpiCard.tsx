import type { IconType } from 'react-icons'

interface Props {
  label: string
  value: string
  Icon?: IconType
  accent?: string // clase de color tailwind para el valor
}

export function KpiCard({ label, value, Icon, accent = 'text-gray-900' }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
        {Icon && <Icon className="w-5 h-5" aria-hidden />}
        {label}
      </div>
      <p className={`mt-2 text-2xl md:text-3xl font-extrabold ${accent}`}>{value}</p>
    </div>
  )
}
