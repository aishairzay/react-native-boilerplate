// Habit math: local day keys, streaks and reminder times.
// Pure functions, no SDK; the page keeps all state in Bounded collections.

export type Habit = {
  id: string
  name: string
  reminderHour: number | null
  reminderMinute: number | null
  createdAt: number
}

export type Checkin = {
  habitId: string
  day: string
}

/** Local calendar day as YYYY-MM-DD, wherever the person is. */
export function dayKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}-${month}-${day}`
}

export function todayKey(): string {
  return dayKey(new Date())
}

/** dayKey plus or minus whole days, staying a calendar day. */
export function addDays(key: string, delta: number): string {
  const [year, month, day] = key.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + delta)
  return dayKey(date)
}

/** One check-in per habit per day: the same day always maps to the same record id. */
export function checkinId(habitId: string, day: string): string {
  return `${habitId}_${day}`
}

/** The last `count` local day keys ending with `today`, oldest first. */
export function lastDays(today: string, count = 7): string[] {
  return Array.from({ length: count }, (_, index) => addDays(today, index - count + 1))
}

/** The date a day key names; for display only, never for math. */
function dateFromKey(day: string): Date {
  const [year, month, date] = day.split("-").map(Number)
  return new Date(year, month - 1, date)
}

/** A day key's single weekday letter in the person's own locale. */
export function weekdayInitial(day: string): string {
  return dateFromKey(day).toLocaleDateString(undefined, { weekday: "narrow" })
}

/** A day key's short human label, like "Fri, Sep 26". */
export function dayLabel(day: string): string {
  return dateFromKey(day).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export type StreakInfo = { current: number; best: number; total: number }

/**
 * Streaks from a set of check-in days. The current streak counts back from today,
 * or from yesterday while today is still open, so a streak is not lost until the day ends.
 */
export function streakInfo(days: Iterable<string>, today: string): StreakInfo {
  const set = new Set(days)
  let best = 0
  let run = 0
  let previous: string | null = null
  for (const day of [...set].sort()) {
    run = previous !== null && addDays(previous, 1) === day ? run + 1 : 1
    if (run > best) best = run
    previous = day
  }
  let current = 0
  let cursor = set.has(today) ? today : addDays(today, -1)
  while (set.has(cursor)) {
    current += 1
    cursor = addDays(cursor, -1)
  }
  return { current, best, total: set.size }
}

/** Whether the habit's gentle reminder time has already passed today. */
export function reminderPassed(
  habit: Pick<Habit, "reminderHour" | "reminderMinute">,
  now: Date
): boolean {
  if (habit.reminderHour == null) return false
  const minute = habit.reminderMinute ?? 0
  return (
    now.getHours() > habit.reminderHour ||
    (now.getHours() === habit.reminderHour && now.getMinutes() >= minute)
  )
}

/** "09:30" for display, or null when no reminder is set. */
export function reminderLabel(
  habit: Pick<Habit, "reminderHour" | "reminderMinute">
): string | null {
  if (habit.reminderHour == null) return null
  const hours = String(habit.reminderHour).padStart(2, "0")
  const minutes = String(habit.reminderMinute ?? 0).padStart(2, "0")
  return `${hours}:${minutes}`
}

/** The greeting for the hour of the day. */
export function greeting(now: Date): string {
  const hour = now.getHours()
  if (hour < 5) return "Up late or up early?"
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}
