export type ExhibitionStatus = 'upcoming' | 'ongoing' | 'ended' | 'unknown'

export function exhibitionStatus(startDate: string | null, endDate: string | null): ExhibitionStatus {
  if (!startDate && !endDate) return 'unknown'
  const today = todayDate()
  if (startDate && today < startDate) return 'upcoming'
  if (endDate && today > endDate) return 'ended'
  return 'ongoing'
}

function todayDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatPeriod(startDate: string | null, endDate: string | null): string {
  const s = formatDate(startDate)
  const e = formatDate(endDate)
  if (s && e) return `${s} ~ ${e}`
  if (s) return `${s} ~`
  if (e) return `~ ${e}`
  return '미정'
}

export function formatDate(date: string | null): string | null {
  if (!date) return null
  return new Date(date)
    .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    .replace(/\.$/, '')
}
