# OpenApps app

A React app on Bounded, started from the OpenApps starter.
The app's agent and its owner shape it together; releases reach the live app through governance.

## What is here

- `src/pages/home.tsx` is the starter page.
  Replace it with the app, and add pages as routes in `src/App.tsx`.
- `src/components/ui/` holds ready shadcn/ui components (Button, Card, Field, Input, Dialog, Sheet, DropdownMenu, Tabs, Empty, Skeleton, Toaster and more).
  More: `npx shadcn@latest add <name>`.
- `src/components/app-shell.tsx`, `user-button.tsx` and `error-boundary.tsx` are the app frame, the sign-in button with its account menu, and the crash screen.
- `src/lib/bounded.ts` is the Bounded client, already set up.
  It loads the SDK only when something first uses it.
- `src/hooks/use-user.ts` and `src/hooks/use-live.ts` give components the signed-in user and live data.
- `src/index.css` holds the design tokens, and `DESIGN.md` describes the design system they come from.
- `policy.json` declares the app's data, rules and boundaries.
  `bounded.json` configures deploys.
- `OPENAPPS.md` is the app's manual for its agent and its owner: what the app is for, how work is split between the app and its agent, and the working agreement.
  The agent reads it from the latest published release at the start of every run, so keep it current.

## Using Bounded from components

```tsx
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import { useLive } from "@/hooks/use-live"
import { boot, refusalMessage } from "@/lib/bounded"

const { user, loading } = useUser()
const { data: notes } = useLive<Note[]>(user ? `notes/${user.id}/items` : null, { sort: { createdAt: -1 } })

async function save(text: string) {
  const { set, serverTimestamp } = await boot()
  try {
    await set(`notes/${user!.id}/items/${crypto.randomUUID()}`, { text, createdAt: serverTimestamp() })
  } catch (error) {
    toast.error(refusalMessage(error))
  }
}
```

`REPLACE_WITH_MAIN_APP_ID` in the `bounded-app-id` meta tag in `index.html` is bound to the app's main app id when the app is created; a release build sets `VITE_APP_ID` to the main id as well and refuses a bundle that still carries the placeholder.
A preview build uses its own id: `VITE_APP_ID=<previewAppId> npm run build`.

## Run locally

Use Node.js 22.14 or newer.

```sh
npm ci
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # typecheck, then the deployable site in dist/
```

Fonts, images and icons are bundled with the app; do not load them from a CDN.
Remove the `robots` `noindex` tag in `index.html` when the app should appear in search results.
