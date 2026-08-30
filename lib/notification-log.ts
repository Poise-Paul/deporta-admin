// Tracks how many broadcasts (push + email) have been sent today, purely on
// this browser — there's no backend endpoint yet for a real cross-admin
// send count, so this is a local, best-effort stand-in.
const STORAGE_KEY = "deporta-admin:notifications-sent-today"

type LogEntry = {
  date: string
  count: number
}

function todayKey(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`
}

export function getSentTodayCount(): number {
  if (typeof window === "undefined") return 0
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return 0
    const entry = JSON.parse(raw) as LogEntry
    return entry.date === todayKey() ? entry.count : 0
  } catch {
    return 0
  }
}

export function recordSentToday(): number {
  if (typeof window === "undefined") return 0
  const today = todayKey()
  const current = getSentTodayCount()
  const next = current + 1
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: next } satisfies LogEntry))
  } catch {
    // ignore storage failures (e.g. private browsing) — count just won't persist
  }
  return next
}
