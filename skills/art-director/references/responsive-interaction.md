# Responsive behavior and interaction

Read this for small-screen layout, navigation, or UI states. Skip it when
the work is print-like and static.

## Small screens are a different order

Do not only shrink the desktop. Decide a mobile source order:

- What must appear first to complete the task
- What can wait behind a disclosure
- What images crop, defer, or drop

If a desktop aside is an index, it often becomes a disclosure *before* the
article, not after. If a desktop stage shows a product beside an
explanation, the explanation usually precedes the stage on a phone.

Cropping is a decision: faces, UI chrome, and text-in-image need different
focal points. `object-fit: cover` without a focal point often hides the
proof.

## Navigation

Match the nav to the number of destinations and the task.

A labeled control that expands a list is usually clearer than a mystery
icon. Use a real button, `aria-expanded`, Escape to close, and restore
focus to the trigger. Do not trap focus unless you are building a modal
and can implement it completely.

REFINE on "the mobile menu is broken" means: fix discovery, hit targets,
focus, overlay vs push, and scroll lock as needed. It does not mean a new
type scale or homepage.

## Touch, pointer, and focus

Assume both a coarse pointer and a keyboard.

- Keep hit areas usable; do not rely on hover-only actions.
- Show a visible focus ring that is not clipped by `overflow: hidden`.
- Do not remove outlines without an equivalent.

## States

Design these as part of the control, not as afterthoughts:

- **Loading:** keep the layout from jumping; say that the region is busy;
  do not trap focus in an empty box.
- **Empty:** say why it is empty and offer a relevant next step.
- **Error:** keep the user's input; put the message next to the field;
  offer retry where it can work.
- **Success:** confirm without yanking focus to the top of the page.
- **Disabled:** prefer native `disabled` (or `aria-disabled` with a real
  reason) and explain why the action is unavailable.
- **Menu:** see navigation above.

## Motion

Honor `prefers-reduced-motion`. Essential state changes can still happen
without travel animations. Do not auto-play decorative motion, and do not
animate counters or reorder lists as a greeting.

## Decision examples

### Broken mobile nav on a working site

The desktop header already has the right links. The small-screen control
toggles a panel that cannot receive focus and sits under the hero. Fix the
control, stacking order, and keyboard path. Do not replace the header
brand, fonts, or desktop layout while doing that.

### Data-dense dashboard

Harbor Ops has a filter rail and a job table. On a phone, shrinking both
into tiny columns makes rows unreadable. Better: filters become a
disclosure above the table; the table scrolls inside a named region with
sticky identity columns if they exist; job detail is a follow-up view, not
a third squeezed column.
