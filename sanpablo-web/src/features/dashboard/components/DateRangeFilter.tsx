import { useState } from 'react'
import { MdArrowForward } from 'react-icons/md'
import {
  dateInputToRange,
  presetToRange,
  toDateInputValue,
  type DateRange,
  type RangePreset,
} from '../../../lib/dateRange'

interface Props {
  preset: RangePreset
  range: DateRange
  onChange: (preset: RangePreset, range: DateRange) => void
}

const PRESETS: { key: Exclude<RangePreset, 'custom'>; label: string }[] = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
]

export function DateRangeFilter({ preset, range, onChange }: Props) {
  const [from, setFrom] = useState(toDateInputValue(range.from))
  const [to, setTo] = useState(toDateInputValue(range.to))

  function applyCustom(nextFrom: string, nextTo: string) {
    setFrom(nextFrom)
    setTo(nextTo)
    if (nextFrom && nextTo) {
      onChange('custom', dateInputToRange(nextFrom, nextTo))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.key}
          onClick={() => onChange(p.key, presetToRange(p.key))}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            preset === p.key
              ? 'bg-brand text-white shadow'
              : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          {p.label}
        </button>
      ))}

      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border ${
          preset === 'custom' ? 'border-brand bg-brand/5' : 'border-gray-200 bg-white'
        }`}
      >
        <input
          type="date"
          value={from}
          max={to}
          onChange={(e) => applyCustom(e.target.value, to)}
          className="bg-transparent text-sm outline-none"
        />
        <MdArrowForward className="w-4 h-4 text-gray-400" aria-hidden />
        <input
          type="date"
          value={to}
          min={from}
          onChange={(e) => applyCustom(from, e.target.value)}
          className="bg-transparent text-sm outline-none"
        />
      </div>
    </div>
  )
}
