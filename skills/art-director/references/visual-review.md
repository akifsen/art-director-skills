# Visual review

Read this in REVIEW mode, and when checking work after DESIGN or REFINE.

## Default to read-only

If the user asked to review, critique, audit, or inspect the UI, do not
edit source files. Report findings and recommended fixes. Apply changes
only after they ask.

## Two ledgers (neither replaces the other)

Keep these separate. Passing one does not prove the other.

**Functional / accessible / semantic**

- Heading order and landmarks
- Keyboard path and focus visibility
- Form names, errors, and states
- Overflow, clipping, and broken stacking
- Missing assets, dead links, failed CSS/font loads you can see
- Automated accessibility or screenshot-diff results, if you ran them

**Visual craft**

- What the first viewport actually communicates, and whether it looks
  *finished* (type, crop, surfaces) rather than sketched
- Whether hierarchy matches the real content
- Distinctiveness versus a generic layout — without treating every
  structural cousin as a fail
- Type, color/surface relations, imagery integration, component states
- Whether contemporary references (if used) were seen and translated, not
  copied
- Small-screen task completion as its own composition
- Consistency with the existing brand when that brand should persist

A clean lint run is not evidence of better design. Shadow count, gradient
presence, CSS length, and animation count are not craft scores.

## Evidence

Say what you used:

- Source and component reading
- Running the app and using a browser tool
- Looking at screenshots (who looked, which viewport and state)
- Automated checks
- CSS/font/asset load checks

Capturing a screenshot is not the same as inspecting it. If no browser or
image tool is available, report that visual verification did not happen.
Do not write a visual score you did not earn by looking.

Name the picture you opened: route or state, which source produced it, and
the viewport. An older capture is not proof of the code in front of you.
If you cannot open the image or the live page, mark visual acceptance
unverified. Do not approve from a file path you never viewed.

Do not claim a finding you cannot point to. "The hero feels weak" is only
useful with the content role it fails: buried proof, equal-weight sections,
a first screen that could belong to any product, or a skeleton with no
material decisions.

## In-scope actions and states

The opening view is not the whole review. For every control and state in
the requested scope, look at the current render:

- Can heading, helper, link, and button labels actually be read on their
  surface — not only found in the DOM or matched by `toBeVisible`?
- If a control is visible, is it sized as a control — not stretched into
  leftover grid or flex space so it reads as a panel?
- If a control is visible, is its purpose and what happens next obvious?
- Are form, detail, closing, dialog/sheet, and error states finished to
  the same standard as the main view?
- Did the intended faces and assets load, not only appear in CSS?
- On a narrow screen, are text, focus, and the primary action unclipped?

A contrast or accessibility pass on a flat pair is evidence for that pair.
It is not approval of the whole design. Do not save a new snapshot that
still shows the defect and call the defect expected.

## Measure, do not read the comment

Stylesheet headers that say "strict 44×44 touch targets", "asymmetric
hero", or "hairline borders" are intentions. Check the render:

- At a phone width (~390): `document.documentElement.scrollWidth` must not
  exceed `innerWidth`. If it does, name the element whose right edge
  overflows.
- Bounding boxes of `a, button, input` in the requested scope: list the
  ones under the floor with their size and label. Zero is the report you
  want; "min-height is set" is not.
- Hover-only presentation without `@media (hover: hover)` is a defect on a
  touch review, even when the desktop render looks right.
- `<img>` without intrinsic `width`/`height` (or a CSS `aspect-ratio`)
  shifts layout on load; note it under the functional ledger.
- A theme toggle whose stored value is applied only from a deferred script
  paints the wrong theme first. Reload with the non-default theme stored
  and watch the first frame.

Report the numbers you measured, not the values the CSS promised.

## Scope

Stay inside the user's request. A review of the mobile menu does not become
a brand critique. A review of a dashboard table does not require a new
illustration style.

## After implementation

When you did change code, re-check the current result, not the first
screenshot. List what you re-checked and what you still could not. Confirm
the stylesheet and fonts you intended are the ones in use.

## Decision examples

### Read-only homepage review

The user asks whether the studio homepage is clear. You find a hero
headline that restates the company name, three equal service cards, and a
real installation photograph in the third section. Report: the distinctive
proof is below the first viewport; the cards imply sameness; the first
screen is still kit-default type on a gradient. Recommend moving the
installation up and finishing that stage. Do not edit files in this mode.

### Post-change check

You fixed a mobile menu. Technical: the button now toggles `aria-expanded`,
Escape closes, focus returns. Visual: you could not open a browser in this
session, so stacking against the hero is unverified. Say that plainly.
Do not mark the task as visually confirmed.
For implementation delivery this is partial delivery if the required visual
check is blocked, not complete. A known significant defect means incomplete.
