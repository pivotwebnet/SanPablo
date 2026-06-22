// Helpers de rangos de fecha para el filtro del dashboard.
// Todo se maneja en hora local y se envía al backend como ISO.

export type RangePreset = 'today' | 'week' | 'month' | 'custom'

export interface DateRange {
  from: string // ISO
  to: string // ISO
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function endOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

export function presetToRange(preset: Exclude<RangePreset, 'custom'>): DateRange {
  const now = new Date()
  const to = endOfDay(now)
  let from: Date

  switch (preset) {
    case 'today':
      from = startOfDay(now)
      break
    case 'week': {
      const d = new Date(now)
      d.setDate(d.getDate() - 6) // últimos 7 días incluyendo hoy
      from = startOfDay(d)
      break
    }
    case 'month': {
      const d = new Date(now)
      d.setDate(d.getDate() - 29) // últimos 30 días
      from = startOfDay(d)
      break
    }
  }
  return { from: from.toISOString(), to: to.toISOString() }
}

// Para los <input type="date"> (formato YYYY-MM-DD en local)
export function toDateInputValue(iso: string): string {
  const d = new Date(iso)
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60_000)
  return local.toISOString().slice(0, 10)
}

export function dateInputToRange(fromDate: string, toDate: string): DateRange {
  return {
    from: startOfDay(new Date(fromDate + 'T00:00:00')).toISOString(),
    to: endOfDay(new Date(toDate + 'T00:00:00')).toISOString(),
  }
}
