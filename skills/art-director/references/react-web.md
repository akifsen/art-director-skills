# React and related web apps

Read this for React, Next.js, Remix, Vite+React, or a similar component
SPA/SSR app on the **web**. For React Native, use
[native-mobile.md](native-mobile.md) instead.

## Stay in this app

Keep the router, layout, data layer, and styling approach already in use
(CSS modules, files, Tailwind, styled-components, etc.). HTML/CSS studies
in this skill are not a request to abandon React.

Do not deliver the product as a lone static HTML document, a poster, or
markup injected with `dangerouslySetInnerHTML` unless the repo is already
that kind of page.

## Foundation split

- No product system: [product-ui-system.md](product-ui-system.md)
- shadcn/ui or other local primitives / vendor theme:
  [theme-enhancement.md](theme-enhancement.md)

Use existing primitives first. Check the lockfile before adding a package.
Do not add MUI beside shadcn, or Chakra beside a house DS.

## Routes are the product

If the brief asks for list, detail, and edit, those are routes (or
equivalent URL states), linked with real navigation, not in-page theater
that forgets the back path.

Next.js / Remix: keep server rendering and loaders where they exist. Do
not flatten distinct routes into one client scroll of fake sections.

## Shared tokens, shared screens

A token or Button change should move every in-scope consumer. Grep before
you declare consistency. Settings, dialogs, and empty states are in scope
when they use the same family — do not leave them on browser defaults
while the home view is styled.

## Forms and overlays

Prefer the project’s Form library and dialog primitive. If the overlay is
a `div` with `aria-modal`, switch to `<dialog showModal()>`, Radix/Base UI
Dialog, or the kit already in the repo — do not teach a homemade trap.
Implement visible actions: submit, cancel, validation errors, busy, success
that returns to the list (or the path the brief named). Empty `onClick` is
not a complete screen. A success message is only honest after the named
record in state (or the real store) changed.

If the write is asynchronous, abort it on Cancel, unmount, and record
change when the request is still pending. Do not navigate away and let a
late callback mutate the previous row.

Backdrop close belongs to clicks outside the panel’s box, not to padding
or inner empty area. Prefer `showModal()` plus a geometry check (or the
library’s overlay primitive); do not homegrow a focus trap.

## Web small screens

This is viewport work: source order, disclosure, focus, a website mobile
**menu**. See [responsive-interaction.md](responsive-interaction.md).
That is not a native app.
