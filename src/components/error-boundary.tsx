import { Component, type ErrorInfo, type ReactNode } from "react"

import { Button } from "@/components/ui/button"

type Props = { children: ReactNode }
type State = { error: Error | null }

/** Shows a recoverable screen instead of a blank page when a component throws while rendering. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <main role="alert" className="mx-auto flex min-h-svh w-full max-w-md flex-col items-start justify-center gap-4 px-6 py-16">
        <h1 className="text-2xl font-medium tracking-tight">Something went wrong</h1>
        <p className="text-muted-foreground">Reload the page to try again.</p>
        <Button onClick={() => location.reload()}>Reload</Button>
      </main>
    )
  }
}
