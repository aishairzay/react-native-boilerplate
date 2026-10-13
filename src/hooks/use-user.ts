import { useSyncExternalStore } from "react"
import { lastSignInFailure, onUser, type User } from "@/lib/bounded"

type AuthState = { user: User | null; loading: boolean; signInError: Error | null }

// One listener for the whole app, started by the first component that asks.
let state: AuthState = { user: null, loading: true, signInError: null }
const listeners = new Set<() => void>()
let started = false

function publish(next: AuthState) {
  state = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  if (!started) {
    started = true
    onUser((user) => publish({ user, loading: false, signInError: lastSignInFailure() })).catch(() => publish({ user: null, loading: false, signInError: null }))
  }
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * The signed-in user (`{ id, address, email }`, use `id` for ownership) or null.
 * `loading` is true until the SDK has restored any saved session, so render a
 * skeleton rather than a sign-in prompt while it is true. `signInError` is set when a
 * hosted sign-in returned to this page and could not be finished; tell the person.
 */
export function useUser(): AuthState {
  return useSyncExternalStore(subscribe, () => state)
}
