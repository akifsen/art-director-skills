# Existing theme and component-system enhancement

Read this when the repo already has a **theme**, a **vendor admin
template**, or **local primitives** such as shadcn/ui.

Inspect the real tree. Do not guess paths, Tailwind versions, or APIs.

The job is a reasoned improvement of *this* system: clearer hierarchy,
more consistent surfaces, better density, component craft, completed
flows. A primary-color swap is not the job.

## First, read what is actually installed

Find, as they exist:

- Theme provider, CSS variables, Tailwind theme, SCSS maps
- Component variants and their state styles
- Layout / route shell
- Form and table stacks
- `components.json` (shadcn/ui) and the **local** component sources
- Package versions in the lockfile — not a remembered default

Do not edit `node_modules` or caches as a lasting fix.

Do not copy licensed vendor sources into a public skill, an eval fixture,
or a new repo. If you lack rights to a commercial theme, enhance only
what the user may change, or use an original adaptation fixture. Never
report that work as “tested on Ecme” unless you used Ecme with
authorization.

## shadcn/ui (and similar local primitives)

Public theming model (shadcn docs, not a dumped theme): semantic pairs
such as `background`/`foreground`, `primary`/`primary-foreground`,
`muted`, `accent`, `destructive`, `border`, `input`, `ring`, optional
`sidebar-*` and `chart-*`. Components consume those tokens.

Do:

- Confirm `components.json` (style, rsc, css file, `cssVariables`,
  base color) and the actual primitive (Radix, Base UI, or other — do
  not assume one).
- Evolve semantic tokens **and** variants the product needs (radius
  scale, sidebar, density, status colors). Changing `--primary` alone
  is not enhancement.
- Carry the same decisions through shell, header, toolbar, tables,
  forms, menus, dialogs, and in-scope charts.
- Keep keyboard path, focus, open/close/selected, and form errors that
  the primitives already implement. If the local Dialog is a `div` plus
  `aria-modal`, restore a real primitive (`<dialog showModal()>`, Radix,
  Base UI) rather than polishing the broken overlay.

Do not:

- Replace working primitives with unmarked `<div>`s for a new look
- Install a second UI kit
- Add a parallel token file that fights `:root`
- Restyle one dashboard home and leave dialogs/forms on defaults

Worked method: [examples/component-system.md](examples/component-system.md).
That example is original; it is not shadcn source.

## Vendor / house templates (Ecme-like)

Discover the project’s real configuration and shared style entry points.

Preserve routing, permission-gated chrome, data bindings, and component
behavior. Improve identity through the **supported** extension points
(layout tokens, theme config, wrapper classes the template documents).

Avoid:

- Global `!important` piles and colliding selectors
- Copying the entire vendor tree so updates become impossible
- Unrelated marketing-site recipes on an admin shell

If you cannot find a documented hook, say so. A small, local override
file is better than silently patching minified CSS.

## What “better” has to mean here

Show a concrete delta against the starting screen of **this** product:
hierarchy, surfaces, density, craft, completed in-scope flows. Do not
claim a percent win over Ecme or shadcn/ui as products.
