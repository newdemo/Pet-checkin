export function formatDate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${Number(m)}月${Number(d)}日`
}

export function getRecentDates(days = 7) {
  const list = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    list.push(formatDate(d))
  }
  return list
}

export function getWeekdayLabel(dateStr) {
  const labels = ['日', '一', '二', '三', '四', '五', '六']
  const d = new Date(dateStr.replace(/-/g, '/'))
  return labels[d.getDay()]
}
