import { useEffect, useRef, useState } from "react"
import { BellIcon, BellOffIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { reminderPassed, todayKey, type Habit } from "@/lib/habits"

type ReminderBellProps = {
  habits: Habit[]
  /** Habit ids already checked in today; those get no browser nudge. */
  doneHabitIds: Set<string>
}

/**
 * Browser nudges: one quiet notification per habit per day, only while a tab is
 * open. The in-page notes work without it; this is the optional louder cousin.
 */
export function ReminderBell({ habits, doneHabitIds }: ReminderBellProps) {
  const supported = typeof Notification !== "undefined"
  const [permission, setPermission] = useState<NotificationPermission | null>(
    supported ? Notification.permission : null
  )
  const [muted, setMuted] = useState(false)
  const sent = useRef(new Set<string>())

  useEffect(() => {
    if (!supported || permission !== "granted" || muted) return
    const tick = () => {
      const today = todayKey()
      const now = new Date()
      for (const habit of habits) {
        if (!reminderPassed(habit, now)) continue
        if (doneHabitIds.has(habit.id)) continue
        const key = `${today}:${habit.id}`
        if (sent.current.has(key)) continue
        sent.current.add(key)
        try {
          new Notification("A gentle nudge", {
            body: `“${habit.name}” is still open today.`,
            tag: key,
          })
        } catch {
          // Some browsers want a service worker for this; the in-page nudge still covers it.
        }
      }
    }
    tick()
    const timer = window.setInterval(tick, 30_000)
    return () => window.clearInterval(timer)
  }, [habits, doneHabitIds, permission, muted, supported])

  if (!supported) return null

  async function press() {
    if (permission === "granted") {
      setMuted((value) => !value)
      return
    }
    if (permission === "denied") {
      toast.info("Notifications are blocked for this site. Allow them in your browser settings.")
      return
    }
    const result = await Notification.requestPermission()
    setPermission(result)
    if (result === "granted") {
      toast.success("Browser nudges on. They arrive only while a Speed Probe tab is open.")
    } else if (result === "denied") {
      toast.info("No problem. The page still shows quiet nudges.")
    }
  }

  const on = permission === "granted" && !muted
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={on ? "Browser nudges on" : "Browser nudges off"}
      onClick={() => void press()}
    >
      {on ? <BellIcon /> : <BellOffIcon />}
    </Button>
  )
}
