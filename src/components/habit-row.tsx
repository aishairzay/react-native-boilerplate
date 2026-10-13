import { BellIcon, CheckIcon, FlameIcon } from "lucide-react"

import { WeekStrip } from "@/components/week-strip"
import { cn } from "@/lib/utils"
import { dayKey, reminderLabel, reminderPassed, type Habit, type StreakInfo } from "@/lib/habits"

type HabitRowProps = {
  habit: Habit
  streak: StreakInfo
  /** Every day key this habit has a check-in for; the row's strip shows its week. */
  days: ReadonlySet<string>
  doneToday: boolean
  now: Date
  busy?: boolean
  onToggle: () => void
  onOpen: () => void
}

/** One habit on the Today list: a check circle, its quiet status line, its week strip and its streak. */
export function HabitRow({ habit, streak, days, doneToday, now, busy, onToggle, onOpen }: HabitRowProps) {
  const label = reminderLabel(habit)
  const due = label !== null && !doneToday && reminderPassed(habit, now)

  return (
    <div className="flex items-start gap-4 py-3.5">
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        aria-pressed={doneToday}
        aria-label={doneToday ? `Undo today's check-in for ${habit.name}` : `Check in ${habit.name} for today`}
        className={cn(
          "mt-1 flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150",
          "focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60",
          doneToday
            ? "border-primary bg-primary text-primary-foreground"
            : "border-input bg-card text-transparent hover:border-primary/50 hover:bg-primary/5"
        )}
      >
        <CheckIcon className="size-5" strokeWidth={3} />
      </button>
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 py-1 text-left">
        <span className={cn("block truncate font-medium", doneToday && "text-muted-foreground")}>
          {habit.name}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          {due ? (
            <>
              <BellIcon className="size-3.5 shrink-0 text-warning" aria-hidden />
              <span className="text-foreground/80">waiting since {label}</span>
            </>
          ) : doneToday ? (
            <span className="text-success">done today</span>
          ) : label !== null ? (
            <span>nudges you around {label}</span>
          ) : (
            <span>not yet today</span>
          )}
        </span>
        <WeekStrip days={days} today={dayKey(now)} />
      </button>
      {streak.current > 0 && (
        <span
          title={streak.current === 1 ? "1-day streak" : `${streak.current}-day streak`}
          className="mt-1 flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm tabular-nums"
        >
          <FlameIcon className="size-3.5 text-warning" aria-hidden />
          {streak.current}
        </span>
      )}
    </div>
  )
}
