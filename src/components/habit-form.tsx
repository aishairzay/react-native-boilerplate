import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { boot, refusalMessage } from "@/lib/bounded"
import { reminderLabel, type Habit } from "@/lib/habits"

type HabitFormProps = {
  userId: string
  habit: Habit | null
  initialName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Add or edit one habit: a name and an optional daily nudge time. */
export function HabitForm({ userId, habit, initialName, open, onOpenChange }: HabitFormProps) {
  const [name, setName] = useState("")
  const [time, setTime] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    setName(habit ? habit.name : (initialName ?? ""))
    setTime(habit ? (reminderLabel(habit) ?? "") : "")
    setError(null)
  }, [open, habit, initialName])

  async function save() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError("Give it a name first.")
      return
    }
    setSaving(true)
    try {
      const { set, serverTimestamp } = await boot()
      const id = habit?.id ?? crypto.randomUUID()
      const [hour, minute] = time ? (time.split(":").map(Number) as [number, number]) : [null, null]
      const path = `users/${userId}/habits/${id}`
      if (habit) {
        await set(path, { name: trimmed, reminderHour: hour, reminderMinute: minute })
      } else {
        await set(path, {
          name: trimmed,
          reminderHour: hour,
          reminderMinute: minute,
          createdAt: serverTimestamp()
        })
      }
      onOpenChange(false)
    } catch (cause) {
      toast.error(refusalMessage(cause))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{habit ? "Edit habit" : "New habit"}</DialogTitle>
          <DialogDescription>
            {habit
              ? "Rename it or change its nudge time."
              : "One small thing you can do today, and again tomorrow."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="habit-name">Habit</FieldLabel>
            <Input
              id="habit-name"
              value={name}
              maxLength={60}
              autoFocus
              placeholder="Read 20 minutes"
              onChange={(event) => {
                setName(event.target.value)
                setError(null)
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") void save()
              }}
            />
            <FieldError>{error}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="habit-time">Gentle nudge</FieldLabel>
            <Input
              id="habit-time"
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
            />
            <FieldDescription>
              Optional. Once this time passes, the page nudges you quietly. Leave it empty for no
              nudge.
            </FieldDescription>
          </Field>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" disabled={saving} onClick={() => void save()}>
            {saving ? <Spinner className="size-4" /> : null}
            {habit ? "Save changes" : "Add habit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
