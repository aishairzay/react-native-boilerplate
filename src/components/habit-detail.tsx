import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { addDays, reminderLabel, streakInfo, todayKey, type Habit } from "@/lib/habits"

type HabitDetailProps = {
  habit: Habit | null
  checkinDays: string[]
  busy: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

/** A habit's whole story: streak stats, the last two weeks, edit and remove. */
export function HabitDetail({ habit, checkinDays, busy, onClose, onEdit, onDelete }: HabitDetailProps) {
  const [confirming, setConfirming] = useState(false)
  if (!habit) return null

  const today = todayKey()
  const streak = streakInfo(checkinDays, today)
  const label = reminderLabel(habit)
  const days = Array.from({ length: 14 }, (_, index) => addDays(today, index - 13))
  const done = new Set(checkinDays)

  const stats = [
    { name: "Current streak", value: `${streak.current} ${streak.current === 1 ? "day" : "days"}` },
    { name: "Best streak", value: `${streak.best} ${streak.best === 1 ? "day" : "days"}` },
    { name: "Total check-ins", value: String(streak.total) },
  ]

  return (
    <Sheet open={habit !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{habit.name}</SheetTitle>
          <SheetDescription>
            {label ? `Nudges you around ${label} once it has passed.` : "No nudge time set."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-4 pb-8">
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.name} className="rounded-lg bg-muted p-3 text-center">
                <div className="font-heading text-xl font-medium tabular-nums">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.name}</div>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Last two weeks</h3>
            <div className="mt-2 flex flex-wrap gap-1.5" aria-hidden>
              {days.map((day) => (
                <span
                  key={day}
                  title={day}
                  className={`size-6 rounded-full ${done.has(day) ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={() => setConfirming(true)}
            >
              Remove
            </Button>
            <Button className="flex-1" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      </SheetContent>
      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove “{habit.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              Its check-ins go with it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirming(false)
                onDelete()
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  )
}
