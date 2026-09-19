# Existing UI system enhancement

Read this when the repo already has a **theme**, a **design system**, an
**application UI**, a **template**, or **local component primitives**.

Inspect the real tree. Do not guess paths, token names, config filenames,
or APIs. Do not apply another product’s folder layout or token vocabulary
as this project’s default.

The job is a reasoned improvement of *this* system: clearer hierarchy,
more consistent surfaces, better density, component craft, completed
flows. A primary-color swap is not the job. Do not install a named kit
the user did not ask for.

## First, read what is actually installed

Find, as they exist:

- Theme provider, CSS variables, Tailwind/theme config, SCSS maps
- Component variants and their state styles
- Layout / route shell
- Form and table stacks
- Whatever registry, barrel, or config the project already uses
- Package versions in the lockfile — not a remembered default

Do not edit `node_modules` or caches as a lasting fix.

Do not copy licensed vendor sources into a public skill, an eval fixture,
or a new repo. If you lack rights to a commercial theme, enhance only
what the user may change, or use an original adaptation fixture. Never
report that work as tested on a product you did not run with
authorization.

Do not rip out working primitives to look original. Brand independence is
not a rewrite of every accessible control.

## Local primitives

Discover the token names and variant API **this** project uses. Evolve
semantic tokens **and** the variants the product needs (radius, density,
status, shell). Changing one brand color alone is not enhancement.

Carry the same decisions through shell, header, toolbar, tables, forms,
menus, dialogs, and in-scope charts.

Keep keyboard path, focus, open/close/selected, and form errors that the
primitives already implement. If the local Dialog is a `div` plus
`aria-modal`, restore a real primitive already in the repo or the
platform (`<dialog showModal()>`) rather than polishing the broken
overlay.

Do not:

- Replace working primitives with unmarked `<div>`s for a new look
- Install a second UI kit
- Add a parallel token file that fights the live root tokens
- Restyle one dashboard home and leave dialogs/forms on defaults
- Teach a filename, alias map, or token list as universal

Worked method: [examples/component-system.md](examples/component-system.md).
That example is original to this skill.

## Existing templates and house systems

Discover the project’s real configuration and shared style entry points.

Preserve routing, permission-gated chrome, data bindings, and component
behavior. Improve identity through the **supported** extension points
(layout tokens, theme config, wrapper classes the project documents).

Avoid:

- Global `!important` piles and colliding selectors
- Copying an entire vendor tree so updates become impossible
- Unrelated marketing-site recipes on an admin shell

If you cannot find a documented hook, say so. A small, local override
file is better than silently patching minified CSS.

## What “better” has to mean here

Show a concrete delta against the starting screen of **this** product:
hierarchy, surfaces, density, craft, completed in-scope flows. Do not
claim a percent win over an unrelated commercial theme.

For a dense record view, compare a compact table plus persistent inspector
with a roomier table opening full detail. The first supports repeated
cross-record edits; the second gives long notes space and simpler narrow
navigation. Both can use the existing Table, Button and Dialog variants.
Review one representative record and its edit state before propagating new
density/surface tokens; then inspect every affected in-scope consumer.
