# Product UI system (no theme pack)

Read this when the project has **no** mature theme and **no** reusable
product language — typical Vite/CRA/Next starters, unstyled React, or a
folder of unrelated page CSS.

This is a design method, not a kit to paste. Do not install a commercial
theme. Do not add a second component library if the project already has
one (then use [existing-ui-system.md](existing-ui-system.md)).

The goal: a small system that this product can actually run on, then
screens built from it. “Does not need a purchased theme” does not mean
“avoid accessible primitives.”

## What to build (only what the scope needs)

### 1. Visual foundations (tokens)

One source of truth, referenced by components — not hex codes sprinkled
in every file.

Define, with names the product can speak:

- Color: canvas, surface, raised, text, text-muted, hairline, brand,
  brand-contrast, danger, warning, success, info
- Type: family + a short scale (display / title / body / meta / control)
- Space, radius, border width, elevation (or a flat equivalent)
- Density (comfortable vs compact — pick one default)
- Icon size aligned with control height
- Interaction: hover (web), pressed, focus-visible, disabled, busy

Theme-less is not a requirement to look sparse. It is a requirement that
decisions are shared.

### 2. Component family

Same size, variant, and state language. Scope decides the set. Typical
product UI:

- Button (primary / secondary / ghost / danger; sm / md)
- Field (label, control, hint, error)
- Select (use a real accessible select; native `<select>` is allowed)
- Checkbox / radio
- Tabs
- Badge
- Tooltip (only if you can do focus + escape)
- Dialog or sheet
- Feedback (inline alert)
- Skeleton
- Empty and error panels

Do not generate a catalog the product will not use.

### 3. Composite patterns

Assemble from the family, still in the product’s language:

- PageHeader (title, meta, primary action)
- Filter / search bar
- Result list or table
- Detail summary
- Form section
- Action bar
- Settings group

### 4. Application shell

If the product has more than one destination: navigation, sidebar or
topbar, content width, breadcrumb or back affordance, page title, and
small-screen behavior that match each other.

### 5. Pages and flows

Real screens, real routes or native navigation, real interactions. Built
from the shell + patterns + family.

In React, that means components and routes — not one static HTML file and
not markup stuffed through `dangerouslySetInnerHTML`.

## Order of work

1. Inventory primitives already in the repo or lockfile. Use them.
2. If a dependency is missing and the project allows it, add **one**
   justified library (for example a focus-complete dialog), not a new
   design system. Prefer the platform primitive (`<dialog showModal()>`)
   over a `div` with `aria-modal`.
3. Tokens → minimal family → representative working screen. Check loading,
   visually inspect hierarchy and the primary action, correct that screen,
   then extend the shell and remaining screens. Do not build a complete
   component catalog first, and do not copy the marketing intro onto every
   operational view.
4. Change a token once and confirm related in-scope screens follow.

## Failures

- Each page invents its own colors, radii, and spacing
- Buttons that look related but use different padding and type
- A pretty first screen; settings/forms still browser-default
- Skeleton “cards” with no shared type roles
- Rewriting dialog/select/calendar as unmarked `<div>`s
- A success toast when the record in state did not change
- Reusing Kiln / Nadir / Closeout color, type, or URL shape on an unrelated product

Worked files: list/detail method in
[examples/themeless-react.md](examples/themeless-react.md) (kiln paper is
that product); workspace chrome in
[examples/component-system.md](examples/component-system.md). Media-led
marketing is [examples/media-portfolio.md](examples/media-portfolio.md),
not a substitute for an ops shell. Do not copy any example's look, hash
routes, or `?fixture=` helper onto a different brief.
