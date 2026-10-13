import { cn } from "@/lib/utils"
import { dayLabel, lastDays, weekdayInitial } from "@/lib/habits"

type WeekStripProps = {
  /** Every day key the habit has a check-in for. */
  days: ReadonlySet<string>
  /** Today's day key; the strip ends on it. */
  today: string
}

/**
 * A habit's last seven days as one compact strip: a weekday letter under each
 * small dot, ember when the day was checked, today ringed while it is still
 * open. The dots are visual only; the hidden line carries the count.
 */
export function WeekStrip({ days, today }: WeekStripProps) {
  const week = lastDays(today, 7)
  const checked = week.filter((day) => days.has(day)).length

  return (
    <>
      <span className="sr-only">Checked {checked} of the last 7 days.</span>
      <span aria-hidden className="mt-2.5 flex w-fit gap-1">
        {week.map((day) => {
          const done = days.has(day)
          const isToday = day === today
          const label = done
            ? `${dayLabel(day)}, checked`
            : isToday
              ? `${dayLabel(day)}, today`
              : dayLabel(day)
          return (
            <span key={day} title={label} className="flex w-4 flex-col items-center gap-1">
              <span
                className={cn(
                  "size-3 rounded-full",
                  done ? "bg-primary" : isToday ? "border-2 border-primary/60" : "bg-muted"
                )}
              />
              <span
                className={cn(
                  "text-[10px] leading-none",
                  isToday ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {weekdayInitial(day)}
              </span>
            </span>
          )
        })}
      </span>
    </>
  )
}
