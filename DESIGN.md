---
version: alpha
name: OpenApps Starter
description: A calm, warm-neutral base for a new OpenApps app. Each app re-hues the primary color and sets its own voice before its first release; the structure, scale and rules stay.
colors:
  primary: "oklch(0.24 0.01 85)"
  on-primary: "oklch(0.985 0.004 85)"
  background: "oklch(0.985 0.004 85)"
  on-background: "oklch(0.21 0.008 85)"
  surface: "oklch(1 0 0)"
  on-surface: "oklch(0.21 0.008 85)"
  muted: "oklch(0.955 0.006 85)"
  on-muted: "oklch(0.5 0.012 85)"
  accent: "oklch(0.945 0.008 85)"
  border: "oklch(0.91 0.006 85)"
  input: "oklch(0.88 0.007 85)"
  ring: "oklch(0.62 0.012 85)"
  error: "oklch(0.56 0.2 27)"
  success: "oklch(0.52 0.13 155)"
  warning: "oklch(0.72 0.15 70)"
  chart-1: "oklch(0.62 0.16 40)"
  chart-2: "oklch(0.6 0.1 185)"
  chart-3: "oklch(0.48 0.09 255)"
  chart-4: "oklch(0.78 0.13 85)"
  chart-5: "oklch(0.55 0.12 320)"
typography:
  display:
    fontFamily: system-ui
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: system-ui
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.025em
  headline-md:
    fontFamily: system-ui
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  title:
    fontFamily: system-ui
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: system-ui
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label-md:
    fontFamily: system-ui
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.25
  label-sm:
    fontFamily: system-ui
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
  numeric:
    fontFamily: system-ui
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.2
    fontFeature: "\"tnum\" 1"
rounded:
  sm: 7px
  md: 10px
  lg: 12px
  xl: 17px
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  touch-target: 44px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 12px
  button-primary-hover:
    backgroundColor: "oklch(0.24 0.01 85 / 0.8)"
  button-secondary:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.primary}"
    typography: "{typography.label-md}"
    rounded: "{rounded.md}"
    height: 36px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    rounded: "{rounded.md}"
    height: 36px
  button-mobile-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    height: 44px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-background}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: 24px
  badge:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.on-background}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 8px
  list-row:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 12px
  list-row-hover:
    backgroundColor: "{colors.accent}"
  toast:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  input-edge:
    backgroundColor: "{colors.input}"
    height: 1px
  focus-ring:
    backgroundColor: "{colors.ring}"
    size: 3px
  status-success:
    backgroundColor: "{colors.background}"
    textColor: "{colors.success}"
  status-warning:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.on-background}"
  chart-series-1:
    backgroundColor: "{colors.chart-1}"
  chart-series-2:
    backgroundColor: "{colors.chart-2}"
  chart-series-3:
    backgroundColor: "{colors.chart-3}"
  chart-series-4:
    backgroundColor: "{colors.chart-4}"
  chart-series-5:
    backgroundColor: "{colors.chart-5}"
---

# OpenApps Starter design system

This file is the app's design system: the tokens above are the normative values and the sections below say how to use them.
The same values live in `src/index.css` as CSS variables, which every component reads through Tailwind classes such as `bg-primary`, `text-muted-foreground` and `rounded-lg`.
Change a value in both places in the same commit, and rewrite the prose when the character of the app changes.
The starter look is deliberately quiet so that it can become any app; "Making it yours" at the end says what to decide before the first release.

## Overview

Steady, gentle, warm: a habit tracker that feels like a soft morning ritual, not a drill sergeant.
The interface is warm off-white paper and near-black ink with one ember voice color, set in Fraunces headings that give the Today screen the feel of a well-kept journal.
Hierarchy comes from type size, weight and space rather than from boxes, colors and shadows.
Screens open straight into the thing the app does; the interface explains itself through clear labels and good empty states, not through a marketing page in front of it.
It works first on a 375px phone held in one hand, then scales up to a comfortable reading column on a laptop.
Light and dark themes both follow the visitor's system setting automatically, so every screen must read well in both.

## Colors

The palette is a warm neutral ramp plus one voice color and three status colors.

- **Background (oklch 0.985 0.004 50, warm paper #fcf9f8):** The page itself.
  Softer than pure white and easier on the eyes over long sessions.
- **Surface (white):** Cards, popovers, sheets and toasts sit one step brighter than the page, which is enough lift without shadows.
- **On-background (near-black ink #1a1814):** All primary text.
  Never pure black.
- **On-muted (#66635c):** Secondary text: metadata, timestamps, descriptions, placeholders.
  It passes 4.5:1 on both background and muted.
- **Muted and accent (#f2f0ec, #efece7):** Quiet fills for secondary buttons, hovered rows, selected tabs and skeletons.
- **Primary (ember oklch 0.52 0.12 50, #9e511e):** The voice color.
  It fills the one primary action per screen, marks today's completed check-ins and draws focus rings.
  White text passes 4.5:1 on it.
- **Error (#d02c2a), success (#007e46):** Status text and icons; both pass 4.5:1 on the background.
  Use error only for failures and destructive actions.
- **Warning (#df911a):** A fill and icon color only.
  It is too light for text on paper, so pair it with ink text.
- **Border and input (#e3e1dd, #d9d7d2):** Hairlines between regions and the edges of form fields.
- **Chart 1 to 5:** Terracotta, teal, slate blue, ochre and plum, tuned to sit together in one chart.
  Use them in order for categories; never use them for interface chrome.

Dark theme keeps the same roles with warm charcoal surfaces (#120f0d page) and a light ember primary (oklch 0.75 0.11 55) with dark text on it; the values are in `src/index.css`.
Components use role tokens only (`bg-card`, `text-muted-foreground`, `border-border`, `text-destructive`), never raw hex values or Tailwind palette colors such as `bg-blue-500`, because raw colors break dark mode and re-theming.

## Typography

The app speaks in the platform's own interface font (San Francisco on Apple devices, Segoe UI on Windows, Roboto on Android): native, fast and legible at every size.
One family, three weights: 400 for reading, 500 for headings and labels, 600 for small titles that must hold their own.

- **Display (48px, 72px from 640px wide):** Only for a screen's single hero statement.
  Tight tracking and a 1.05 line height.
- **Headlines (36px, 24px):** Page and section titles.
  Negative tracking scales with size.
- **Title (18px/600):** Card titles, dialog titles, list-group headers.
- **Body (16px, with 18px for reading-heavy screens and 14px for dense lists):** Line height 1.5 to 1.6, line length 45 to 75 characters (`max-w-prose`).
- **Labels (14px and 12px, 500):** Buttons, form labels, badges, tabs.
- **Numeric:** Any number that changes or lines up in a column (scores, prices, counts, timers) uses tabular figures (`tabular-nums`) so it does not jitter.

Headings balance their lines and paragraphs avoid orphans automatically (`text-wrap` in the base styles).
Use sentence case everywhere, including buttons and titles.
The display face is Fraunces Variable (bundled from npm via `@fontsource-variable/fraunces`, set as `--font-heading`): warm and editorial, it carries the Today screen's greeting and streak numbers while the body stays in the platform font.

## Layout

Mobile first on a 4px grid.
Content lives in one centered column: `max-w-2xl` for reading and forms, `max-w-4xl` by default, `max-w-6xl` for grids and dashboards (the `AppShell` component's `width` prop).
Side margins are 16px on phones and 24px from 640px wide.

- Related items sit 8 to 12px apart, groups 16 to 24px, sections 40 to 64px.
- One column on phones; two or three columns from `md` (768px) only when the content is a grid of peers.
- Primary actions sit where the thumb reaches: full-width at the bottom of forms and sheets on phones, inline on larger screens.
- Respect the device safe areas (`env(safe-area-inset-*)`); `AppShell` already pads the sticky header and the bottom of the page.
- Nothing scrolls sideways at 360px wide except deliberate carousels and tables inside a `ScrollArea`.

## Elevation & Depth

The system is almost flat.
Depth comes from tonal layers (paper page, white surface, muted fills) and 1px hairlines, not from shadows.
Cards carry a hairline ring and at most an extra-small shadow.
Real shadows are reserved for things that float above the page and can be dismissed: popovers, menus, dialogs, sheets and toasts.
A dimmed backdrop (black at 50%) sits behind modal dialogs and sheets only.

## Shapes

Friendly but precise: a 14px base radius (`--radius: 0.875rem`), a touch softer than the starter default to match the app's gentle tone.
Buttons and inputs use 10px, cards 17px, badges and avatars are fully round.
Nested corners shrink by the padding between them so inner and outer curves stay concentric.
Never mix sharp and rounded corners on one screen.

## Components

The components live in `src/components/ui` (shadcn/ui on Radix, "vega" style) and already read these tokens.
Compose them; restyle through tokens or a `className` on the instance rather than editing their files.

- **Button:** `default` is the primary action, one per screen.
  `secondary` and `outline` for the rest, `ghost` for toolbar and icon buttons, `destructive` for delete, `link` for inline navigation.
  On phones make the main action `size="lg"` (40px) or `h-11` (44px) and full width.
  A button's label is a verb phrase ("Save note", "Invite friend"), never "Submit" or "OK".
  Show a `Spinner` inside the button while it works and disable it.
- **Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider:** Every control has a visible label (`FieldLabel`); helper text goes in `FieldDescription` and errors in `FieldError` directly under the control, in the policy's own words.
  A `Switch` applies immediately; a `Checkbox` waits for the form's button.
- **Card:** Groups one object or one task.
  Never nest cards; use a `Separator` or spacing inside.
- **Item:** Rows in a list (leading media, title, description, trailing action).
  Prefer a list of items over a grid of cards for anything people scan.
- **Dialog and Sheet:** A dialog is one focused task with at most one form.
  A sheet slides in for filters, details and mobile navigation; use `side="bottom"` on phones.
  **AlertDialog** confirms destructive or irreversible actions and names the thing ("Delete this list?").
- **DropdownMenu and Popover:** Secondary and overflow actions.
  Never hide the primary action in a menu.
- **Tabs and ToggleGroup:** Tabs switch between peer views of the same object; a ToggleGroup is a segmented control for a filter or mode.
- **Badge:** Short status or category, one or two words.
  **Avatar:** People, with initials as the fallback.
- **Tooltip:** Only to name an icon-only button.
  Never put essential information in a tooltip; touch screens cannot hover.
- **Skeleton:** Loading placeholders shaped like the content that will arrive.
  **Spinner:** Inline progress inside a button or next to a short label.
- **Empty:** Every list and screen that can be empty says what belongs there and offers the one action that fills it.
- **Alert:** A persistent inline message about the current screen.
  **Toast** (`toast()` from `sonner`): brief confirmation of something that already happened ("Saved", "Invite sent"), with Undo where possible.
  Errors that block the user stay inline, not in a toast.
- **Progress, ScrollArea, Separator:** As their names say.
- **Icons:** `lucide-react` at 16px in controls and 20px standalone, stroke width unchanged.
  Never emoji as interface icons.
- **App parts in `src/components`:** `AppShell` (sticky header and content column), `UserButton` (sign in, and the account menu once signed in), `ErrorBoundary`.

## Do's and Don'ts

- Do open straight into the app's core action; a first-time visitor should be able to do the main thing within one tap of arriving.
- Do give every screen that loads data its three other states: a skeleton while loading, an empty state with a next action, and an inline error with a way to retry.
- Do keep exactly one primary button per screen or dialog.
- Do make touch targets at least 44px on phones and keep 8px between them.
- Do use real, specific copy written for this app's people; label things by what they are, not by what the database calls them.
- Do check every screen at 375px and 1280px wide, in light and dark.
- Do keep motion short and purposeful: 150 to 200ms ease-out for state changes, up to 300ms for things entering the screen.
  Reduced-motion settings are already respected.
- Do bundle every font, image and icon with the app (npm packages or `public/`); hosted apps can run under a content security policy that blocks other origins.
- Don't use gradients, glassmorphism, glows, neon or purple-to-blue "AI" palettes unless the app's identity is built on them.
- Don't put a hero section and three feature cards in front of a tool; that is a brochure, not an app.
- Don't use lorem ipsum, invented statistics, fake testimonials or fake user counts.
  Show real data or an honest empty state.
- Don't use more than two typefaces or more than three font weights on a screen.
- Don't center body text longer than two lines.
- Don't put shadows on static content, borders around every element, or cards inside cards.
- Don't rely on color alone to carry meaning; pair it with an icon or a word.
- Don't load fonts or assets from Google Fonts or any other CDN.

## Making it yours

Before the first release, give the app its own identity in this order, and write the decisions back into this file.

1. **Name the feeling in three words** that come from the app's purpose and people, for example "brisk, trustworthy, sunny" for a neighborhood swap board or "focused, quiet, exact" for a study timer.
   Put them in the Overview.
2. **Pick one voice hue** and set `--primary`, `--primary-foreground` and `--ring` in both the light and dark blocks of `src/index.css`.
   In light, keep the primary's OKLCH lightness between 0.45 and 0.6 with white text on it; in dark, raise it to 0.7 to 0.8 with dark text.
   Check 4.5:1 contrast for text on it.
3. **Tint the neutrals** toward that hue only if it helps: keep the same hue angle on `--background`, `--muted`, `--accent` and `--border` with chroma at 0.012 or less.
4. **Set the shape** with `--radius`: 0.375rem reads crisp and tool-like, 0.75rem friendly (the default), 1rem or more soft and playful.
5. **Optionally add one display face** for headings, bundled from npm: `npm i @fontsource-variable/<name>`, import it in `src/main.tsx`, and set `--font-heading` in the `@theme inline` block.
   Good pairings with the system body font: Fraunces (warm, editorial), Instrument Serif (elegant), Bricolage Grotesque (playful), Space Grotesk (technical), Geist or Inter (neutral).
6. **Update the favicon** in `public/favicon.svg`, the `<title>` and the theme colors in `index.html`.

Keep everything else in this file unless the app has a reason to differ, and say what the reason is when it does.
