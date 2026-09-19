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

Do not claim a finding you cannot point to. "The hero feels weak" is only
useful with the content role it fails: buried proof, equal-weight sections,
a first screen that could belong to any product, or a skeleton with no
material decisions.

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
