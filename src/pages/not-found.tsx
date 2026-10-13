import { Link } from "react-router"

import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-start justify-center gap-4 px-6 py-16">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-3xl font-medium tracking-tight">This page does not exist</h1>
      <Button asChild variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </main>
  )
}
