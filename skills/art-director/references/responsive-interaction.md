# Responsive behavior and interaction (web)

Read this for **web** small-screen layout, website navigation (including a
mobile menu), UI states, or motion. Skip it when the work is print-like
and static. For component family and materials see
[visual-craft.md](visual-craft.md).

A **native** mobile app is a different platform. Do not apply these CSS
viewport recipes, `rem`/`vh` rules, or ARIA-first menus there. Use
[native-mobile.md](native-mobile.md).

## Small screens are a different order

**When.** The page has more than one band, or a desktop aside.

**How.** Decide a mobile source order:

- What must appear first to complete the task
- What can wait behind a disclosure
- How images crop, defer, or drop (`object-position` is part of the design)

If a desktop aside is an index, it often becomes a disclosure *before* the
article, not after. If a desktop stage shows a product beside an
explanation, the explanation usually precedes the stage on a phone — unless
the product *is* the explanation, in which case show a tighter crop of the
same object (see the Linear note in [visual-research.md](visual-research.md)).

**Failure.** `transform: scale` of the desktop; type at `10px`; a table
squeezed until SLA minutes wrap into noise; captions that say "on the
right" after you stacked the diagram under the title.

## Navigation

**When.** There is more than one destination, or a header that must work
on a phone.

**How.** Match the nav to the number of destinations and the task. A
labeled control that expands a list is usually clearer than a mystery
icon. Use a real `button`, `aria-expanded`, Escape to close, and restore
focus to the trigger. Do not trap focus unless you are building a modal
and can implement it completely.

REFINE on "the mobile menu is broken" means: fix discovery, hit targets,
focus, overlay vs push, and scroll lock as needed. It does not mean a new
type scale or homepage. It *does* still mean the button, panel, and links
share the site's material (hairline, type, spacing)—not an unstyled dump.

**Failure.** A `<span onclick>` burger; panel `z-index` under the hero;
no visible selected/open state.

## Touch, pointer, and focus

Assume both a coarse pointer and a keyboard.

- Keep hit areas usable; do not rely on hover-only actions.
- Show a visible focus ring that is not clipped by `overflow: hidden`.
- Do not remove outlines without an equivalent (`:focus-visible` is a
  starting pattern).
- Align icon and label to one baseline.

Useful starting floors (not laws): ~24px pointer target; ~44px on coarse
pointers; input font-size at least `16px` on small screens if you must
avoid iOS zoom.

## States

Design these as part of the control, not as afterthoughts:

- **Default / hover / active / selected**
- **Loading:** keep the layout from jumping; keep the original label;
  say that the region is busy
- **Empty:** say why it is empty and offer a relevant next step
- **Error:** keep the user's input; put the message next to the field
- **Success:** confirm without yanking focus to the top of the page
- **Disabled:** prefer native `disabled` and explain why
- **Menu:** see navigation above

Tabs, filters, and table row selection need a selected state that is not
color alone.

## Motion

Motion is optional. Modernity does not require it. Do not ban it, and do
not sprinkle fade-up on every section.

**When.** The user did something (open a menu, select a tab, expand a
row) and a short move would explain where the new thing came from — or a
single, quiet opening of the proof (one crop or one fade of the stage).

**How.**

- Prefer `opacity` and `transform`; list those properties (avoid
  `transition: all`).
- Duration/easing as starting points: `120–200ms` for hover/focus,
  `200–320ms` for panels; ease-out for entrance, ease-in for exit.
- Interruptible: user input cancels the move (`hover`/`focus` can cut it).
- `prefers-reduced-motion: reduce` — essential state still happens, travel
  animations drop.
- Keep content visible if motion fails (no `opacity: 0` with no fallback).
- Do not autoplay decorative motion; do not animate counters as a greeting.

**Failure.** Every band `animation: fadeUp 0.8s` on scroll; or a menu that
snaps with no open/close at all when a 150ms height/opacity would explain it.

**Applied fragment:**

```css
.panel {
  transition: opacity 200ms ease, transform 200ms ease;
  transform-origin: top right;
}
@media (prefers-reduced-motion: reduce) {
  .panel { transition: none; }
}
```

## Decision examples

### Broken mobile nav on a working site

The desktop header already has the right links. The small-screen control
toggles a panel that cannot receive focus and sits under the hero. Fix the
control, stacking order, and keyboard path. Keep brand, fonts, and desktop
layout. Finish the panel: spacing, focus, and a real button.

### Data-dense dashboard

Harbor Ops has a filter rail and a job table. On a phone, shrinking both
into tiny columns makes rows unreadable. Better: filters become a
disclosure above the table; the table scrolls inside a named region with
sticky identity columns if they exist; job detail is a follow-up view, not
a third squeezed column. Overdue remains a word plus a cue, not only red
text.
