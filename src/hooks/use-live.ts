import { useEffect, useState } from "react"
import { boot } from "@/lib/bounded"

export type LiveOptions = {
  /** MongoDB-style filter, e.g. `{ status: "open" }`. */
  filter?: Record<string, unknown>
  /** Server-side sort, e.g. `{ createdAt: -1 }`. */
  sort?: Record<string, number>
  /** Cap how many documents the live feed tracks. */
  limit?: number
}

export type LiveResult<T> = {
  /** The full current value: an array for a collection path, the document (or null) for a document path. */
  data: T | undefined
  /** True until the first delivery. */
  loading: boolean
  /** The last subscription error. A reconnect after sign-in clears itself on the next delivery. */
  error: Error | null
}

/**
 * Live data from a Bounded path that re-renders whenever any writer changes it.
 *
 *   const { data: posts, loading } = useLive<Post[]>("posts", { sort: { createdAt: -1 }, limit: 50 })
 *
 * Pass null to wait (for example until the user is known).
 */
export function useLive<T = unknown>(path: string | null | undefined, options?: LiveOptions): LiveResult<T> {
  const [result, setResult] = useState<LiveResult<T>>({ data: undefined, loading: !!path, error: null })
  const optionsKey = options ? JSON.stringify(options) : ""

  useEffect(() => {
    if (!path) {
      setResult({ data: undefined, loading: false, error: null })
      return
    }
    let active = true
    let unsubscribe: (() => Promise<void>) | undefined
    setResult((previous) => ({ ...previous, loading: true, error: null }))
    const fail = (error: unknown) => {
      if (active) setResult((previous) => ({ ...previous, loading: false, error: error instanceof Error ? error : new Error(String(error)) }))
    }
    boot()
      .then((sdk) =>
        sdk.subscribe(path, {
          ...(optionsKey ? JSON.parse(optionsKey) : {}),
          onData: (data: T) => {
            if (active) setResult({ data, loading: false, error: null })
          },
          onError: fail,
        })
      )
      .then((stop) => {
        if (active) unsubscribe = stop
        else void stop()
      })
      .catch(fail)
    return () => {
      active = false
      void unsubscribe?.()
    }
  }, [path, optionsKey])

  return result
}
