import type { ReactNode } from "react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

type AppShellProps = {
  /** The app's name or wordmark; links home. */
  title: ReactNode
  /** Right side of the header, for example <UserButton />. */
  actions?: ReactNode
  /** Width of the content column: "narrow" for reading and forms, "wide" for grids and dashboards. */
  width?: "narrow" | "default" | "wide"
  children: ReactNode
}

const widths = { narrow: "max-w-2xl", default: "max-w-4xl", wide: "max-w-6xl" }

/** A sticky header and one centered content column that works from 360px phones up. */
export function AppShell({ title, actions, width = "default", children }: AppShellProps) {
  const column = cn("mx-auto w-full px-4 sm:px-6", widths[width])
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className={cn(column, "flex h-14 items-center justify-between gap-4")}>
          <Link to="/" className="truncate text-base font-semibold tracking-tight">
            {title}
          </Link>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>
      </header>
      <main className={cn(column, "flex-1 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-10")}>{children}</main>
    </div>
  )
}
