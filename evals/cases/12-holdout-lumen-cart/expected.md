# Expected — 12-holdout-lumen-cart

## Scope

- DESIGN, web, starter foundation
- Keep LC-04, LC-11, LC-02 and their real fields
- List, detail, complete/skip, empty filter, unknown stop
- Shared tokens + components; not one-off CSS per page
- Isolated fixture; not a customer site
- Not a renamed Kiln Queue or Tide Bindery

## Gate A

- App mounts as React (Vite or equivalent), not a lone HTML poster
- All three stops remain; no invented patrons or photo galleries
- Skip rejects an empty reason; complete rejects minutes outside 5–90
- Demo save is labeled if there is no backend
- Completing LC-04 does not rewrite LC-11

## Gate B

- Bookmobile / street-stop material, not kiln oxide, bindery flax, or
  clinic navy by default
- Type, surfaces, and controls share one language on list, detail, and form

## Gate C

- Filter empty state exists
- List → detail → form → error → success → back, with the list showing
  the new status
- Visible actions work or are honestly disabled

## Gate D

- Desktop and ~390px web viewports
- Keyboard focus on filter, links/buttons, and fields
- Not a native-app checklist
