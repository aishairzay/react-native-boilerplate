// The Bounded client, set up for this app.
// Ordinary starter loads do not initialize auth; OAuth returns boot explicitly.
// Components use it through the hooks in src/hooks (useUser, useLive);
// anything else comes from `const sdk = await boot()`.
import { Buffer } from "buffer"
import type { User } from "@bounded-sh/client"

// Must be assigned before any @bounded-sh/client module evaluates.
Object.assign(globalThis, { Buffer })

// index.html binds the MAIN app id at creation. A release build can also set
// VITE_APP_ID; a preview build passes its own id to override the committed main id:
//   VITE_APP_ID=<previewAppId> npm run build
const APP_ID = import.meta.env.VITE_APP_ID || document.querySelector<HTMLMetaElement>('meta[name="bounded-app-id"]')?.content || ""

// Staging apps, previews and local dev talk to the staging network; everything else is production.
const STAGING_HOST = /(^|[-.])staging\.|^localhost$|^127\.0\.0\.1$/

export type Sdk = typeof import("@bounded-sh/client")
export type { User }

let client: Promise<Sdk> | undefined

/** Load and initialise the SDK once; every caller gets the same ready client. */
export function boot(): Promise<Sdk> {
  client ??= import("@bounded-sh/client").then(async (sdk) => {
    const config = {
      appId: APP_ID,
      ...(STAGING_HOST.test(location.hostname) ? { network: "bounded-staging" as const } : {}),
    }
    await sdk.init(config)
    signInFailure = sdk.getLoginReturnError()
    return sdk
  })
  return client
}

let signInFailure: Error | null = null

/** Why a hosted sign-in that returned to this page could not be finished; null until one fails, cleared by the next signIn(). */
export function lastSignInFailure(): Error | null {
  return signInFailure
}

/** Hosted sign-in card (email and Google). Resolves with the user; rejects with Error("cancelled"). Google returns through boot(). */
export async function signIn(): Promise<User> {
  signInFailure = null
  return (await boot()).openBoundedWidget({ methods: ["email", "google"] })
}

/** One-tap guest account. The policy must carry "auth": { "anonymous": true }. */
export async function signInAsGuest(): Promise<User | null> {
  return (await boot()).signInAnonymously()
}

export async function signOut(): Promise<void> {
  return (await boot()).logout()
}

/** Calls back with the user, or null, now and on every change. Resolves to an unsubscribe function. */
export async function onUser(callback: (user: User | null) => void): Promise<() => void> {
  return (await boot()).onAuthStateChanged(callback)
}

/** The message to show when a write is refused: the policy's own words when it gave some. */
export function refusalMessage(error: unknown): string {
  const decline = (error as { decline?: { message?: string } } | null)?.decline
  if (decline?.message) return decline.message
  return error instanceof Error && error.message ? error.message : "That did not save. Try again."
}
