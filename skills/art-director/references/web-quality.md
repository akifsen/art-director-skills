# Web interaction and quality

Read this for **web** REVIEW, or when a REFINE changes web controls,
forms, navigation, motion, lists, or shareable URL state. Skip for native
([native-mobile.md](native-mobile.md)). Do not duplicate
[responsive-interaction.md](responsive-interaction.md) (layout, menu,
touch/focus recipes) or [visual-review.md](visual-review.md) (evidence
ledger, read-only default). Offline only — no remote rule fetches.

## Findings format

Each finding: **severity** (blocker / major / minor / nit), **ledger**
(source / run / visual / unverified), **problem**, **fix**, **evidence**.
When you read source, cite `path:line` if known. Render-only findings must
not invent line numbers. Distinguish what you saw in code, in a run, in a
picture, and what you could not verify.

## Actions and navigation

- Primary **actions** use `button` or `input[type=submit]` — not inert
  divs, not `#` for requested work. **Navigation** to another route or
  document uses a real link (`a[href]` with a meaningful URL); do not treat
  every `a[href]` as the primary action on the current task.
- Current location and nav labels match the route; skip links and landmarks
  when the shell is more than a single view.
- Destructive or irreversible actions are visually and verbally distinct.

## Forms

- Every field has a visible label (or an accessible name that matches the
  visible hint); `autocomplete` and `inputmode` fit the data.
- Paste and autofill are not blocked without reason.
- Errors are inline, associated with the field (`aria-describedby` or
  wrapping `label`), and name the fix — not color alone.
- While submit is in flight: disable or guard against duplicate submission;
  optional `aria-busy` on the form or control when loading is not otherwise
  announced. Success only after state actually changed.

## Keyboard and focus

- Tab order follows reading order; focus is visible on every interactive
  control you can reach.
- Modals/menus: Escape closes; focus returns to the trigger unless a better
  target is obvious.
- Sticky headers/footers must not hide focused fields or primary actions.
- Gestures (swipe, drag) need touch/click **and** a keyboard or button path
  when the action is required.

## Content stress

- Long titles, URLs, and localized strings wrap without clipping controls.
- Empty states explain the next step; loading does not look like finished
  data unless intentional.

## URL and UI state

- Shareable filters, tabs, and record selection belong in the **router URL**
  when users expect a link to restore context — not `localStorage` alone.
- Ephemeral UI (open menu, toast) should not pollute shareable URLs unless
  asked.

## Hydration and motion

- First paint matches stored theme and critical text where SSR/SSG applies;
  note flash-of-wrong-theme, locale, or clock skew between server and client.
- Honor `prefers-reduced-motion`; motion has a purpose or is off. Zero
  motion is valid. Prefer explicit properties (`opacity`, `transform`) —
  avoid `transition: all`. Layout shift on load is a defect when dimensions
  were knowable.

## Media and lists

- Images reserve space (`width`/`height` or `aspect-ratio`). For critical vs
  below-fold loading, follow the same rules as
  [responsive-interaction.md](responsive-interaction.md) — do not open that
  file unless layout or loading depth is in question.
- Long lists: report rendering cost (virtualization, memoization, key
  stability) — do not cap item count arbitrarily to hide sluggishness.

## After REFINE

Re-check only the changed control and its states; say what stayed unverified.
