import { useEffect, useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"

import { AppShell } from "@/components/app-shell"
import { HabitDetail } from "@/components/habit-detail"
import { HabitForm } from "@/components/habit-form"
import { HabitRow } from "@/components/habit-row"
import { ReminderBell } from "@/components/reminder-bell"
import { UserButton } from "@/components/user-button"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useLive } from "@/hooks/use-live"
import { useUser } from "@/hooks/use-user"
import { boot, refusalMessage, signIn, signInAsGuest } from "@/lib/bounded"
import { checkinId, dayKey, greeting, streakInfo, type Checkin, type Habit } from "@/lib/habits"

type CheckinRow = Checkin & { id: string }

/** Shared empty set for habits without any check-ins yet. */
const NO_DAYS: ReadonlySet<string> = new Set()

/** The Today screen: today's check-ins, streaks and quiet nudges, all live from Bounded. */
export function Home() {
  const { user, loading: userLoading } = useUser()
  const ownerId = user?.id ?? null
  const habitsLive = useLive<Habit[]>(ownerId ? `users/${ownerId}/habits` : null, { sort: { createdAt: 1 } })
  const checkinsLive = useLive<CheckinRow[]>(ownerId ? `users/${ownerId}/checkins` : null)

  const [now, setNow] = useState(() => new Date())
  const [formOpen, setFormOpen] = useState(false)
  const [formHabit, setFormHabit] = useState<Habit | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  // A local clock tick keeps greeting, due nudges and the day rollover fresh without re-reading anything.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  const habits = habitsLive.data ?? []
  const checkins = checkinsLive.data ?? []
  const today = dayKey(now)
  const daysByHabit = new Map<string, Set<string>>()
  for (const row of checkins) {
    const days = daysByHabit.get(row.habitId) ?? new Set<string>()
    days.add(row.day)
    daysByHabit.set(row.habitId, days)
  }
  const doneToday = new Set(habits.filter((habit) => daysByHabit.get(habit.id)?.has(today)).map((habit) => habit.id))
  const selected = habits.find((habit) => habit.id === selectedId) ?? null

  async function toggle(habit: Habit) {
    if (!ownerId || busyId) return
    setBusyId(habit.id)
    try {
      const { set, serverTimestamp } = await boot()
      const path = `users/${ownerId}/checkins/${checkinId(habit.id, today)}`
      await set(path, doneToday.has(habit.id) ? null : { habitId: habit.id, day: today, createdAt: serverTimestamp() })
    } catch (cause) {
      toast.error(refusalMessage(cause))
    } finally {
      setBusyId(null)
    }
  }

  async function remove(habit: Habit) {
    if (!ownerId) return
    try {
      const { setMany } = await boot()
      const gone = checkins.filter((row) => row.habitId === habit.id)
      await setMany([
        { path: `users/${ownerId}/habits/${habit.id}`, document: null },
        ...gone.map((row) => ({ path: `users/${ownerId}/checkins/${row.id}`, document: null })),
      ])
      setSelectedId(null)
      toast(`Removed “${habit.name}”.`)
    } catch (cause) {
      toast.error(refusalMessage(cause))
    }
  }

  const actions = (
    <>
      {ownerId ? <ReminderBell habits={habits} doneHabitIds={doneToday} /> : null}
      <UserButton />
    </>
  )

  return (
    <AppShell title="Speed Probe" width="narrow" actions={actions}>
      {userLoading || (ownerId && habitsLive.loading) ? (
        <TodaySkeleton />
      ) : !ownerId ? (
        <Empty className="my-16">
          <EmptyHeader>
            <EmptyTitle>A quiet daily check-in</EmptyTitle>
            <EmptyDescription>
              Keep a short list of habits, tap them off each day and watch the streaks grow. Gentle
              nudges arrive at the times you choose.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={() => void signIn().catch(() => undefined)}>Sign in</Button>
              <Button
                variant="outline"
                onClick={() => void signInAsGuest().catch((cause) => toast.error(refusalMessage(cause)))}
              >
                Continue as guest
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl sm:text-4xl">{greeting(now)}</h1>
            <p className="mt-1 text-muted-foreground">
              {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </header>
          {habitsLive.error ? (
            <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Couldn't reach your habits just now. The page keeps trying on its own.
            </p>
          ) : null}
          {habits.length > 0 ? (
            <>
              <section aria-label="Today's progress">
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-sm font-medium text-muted-foreground">Today</h2>
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {doneToday.size} of {habits.length} done
                  </span>
                </div>
                <Progress value={(doneToday.size / habits.length) * 100} aria-label={`${doneToday.size} of ${habits.length} habits done today`} />
                {doneToday.size === habits.length ? (
                  <p className="mt-2 text-sm text-success">All done today. See you tomorrow.</p>
                ) : null}
              </section>
              <section aria-label="Your habits" className="divide-y">
                {habits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    days={daysByHabit.get(habit.id) ?? NO_DAYS}
                    streak={streakInfo(daysByHabit.get(habit.id) ?? [], today)}
                    doneToday={doneToday.has(habit.id)}
                    now={now}
                    busy={busyId === habit.id}
                    onToggle={() => void toggle(habit)}
                    onOpen={() => setSelectedId(habit.id)}
                  />
                ))}
              </section>
              <Button variant="outline" className="w-full" onClick={() => { setFormHabit(null); setFormOpen(true) }}>
                <PlusIcon /> Add a habit
              </Button>
            </>
          ) : (
            <Empty className="my-8">
              <EmptyHeader>
                <EmptyTitle>Nothing here yet</EmptyTitle>
                <EmptyDescription>Start with one small thing you can do today, and again tomorrow.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => { setFormHabit(null); setFormOpen(true) }}>
                  <PlusIcon /> Add your first habit
                </Button>
              </EmptyContent>
            </Empty>
          )}
          <HabitForm userId={ownerId} habit={formHabit} open={formOpen} onOpenChange={setFormOpen} />
          <HabitDetail
            habit={selected}
            checkinDays={[...(daysByHabit.get(selected?.id ?? "") ?? [])]}
            busy={busyId !== null}
            onClose={() => setSelectedId(null)}
            onEdit={() => {
              setFormHabit(selected)
              setSelectedId(null)
              setFormOpen(true)
            }}
            onDelete={() => selected && void remove(selected)}
          />
        </div>
      )}
    </AppShell>
  )
}

function TodaySkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-hidden>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-52" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="h-2 w-full" />
      <div className="flex flex-col gap-5 pt-2">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-2/3" />
      </div>
    </div>
  )
}
