import { useEffect } from "react"
import { LogOutIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/hooks/use-user"
import { signIn, signOut } from "@/lib/bounded"

/** "Sign in" when signed out; an avatar menu with the account and "Sign out" when signed in. */
export function UserButton() {
  const { user, loading, signInError } = useUser()

  // A sign-in that returned to this page and failed lands here, not in a rejected signIn().
  useEffect(() => {
    if (signInError) toast.error("Sign-in did not finish. Try again.")
  }, [signInError])

  if (loading) return <Skeleton className="size-9 rounded-full" />

  if (!user) {
    const start = () =>
      signIn().catch((error: unknown) => {
        if (error instanceof Error && error.message === "cancelled") return
        toast.error("Sign-in did not finish. Try again.")
      })
    return <Button onClick={start}>Sign in</Button>
  }

  const label = user.email || (user.isAnonymous ? "Guest" : "Your account")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Account">
          <Avatar className="size-8">
            <AvatarFallback>{label.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut().catch(() => toast.error("Sign-out did not finish. Try again."))}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
