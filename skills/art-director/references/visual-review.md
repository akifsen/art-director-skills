# Visual review

Read this in REVIEW mode, and when checking work after DESIGN or REFINE.

## Default to read-only

If the user asked to review, critique, audit, or inspect the UI, do not
edit source files. Report findings and recommended fixes. Apply changes
only after they ask.

## Two ledgers

Keep these separate. Passing one does not prove the other.

**Technical / structural**

- Heading order and landmarks
- Keyboard path and focus visibility
- Form names, errors, and states
- Overflow, clipping, and broken stacking
- Missing assets, dead links, and console-visible failures you can see
- Automated accessibility or screenshot-diff results, if you ran them

**Visual / editorial**

- What the first viewport actually communicates
- Whether hierarchy matches the real content
- Distinctiveness versus a generic layout
- Whether type, color, and imagery support the thesis
- Small-screen task completion
- Consistency with the existing brand when that brand should persist

A clean lint run, a screenshot diff, or an accessibility score is not
evidence of better design.

## Evidence

Say what you used:

- Source and component reading
- Running the app and using a browser tool
- Looking at screenshots (who looked, which viewport and state)
- Automated checks

Capturing a screenshot is not the same as inspecting it. If no browser or
image tool is available, report that visual verification did not happen.

Do not claim a finding you cannot point to. "The hero feels weak" is only
useful with the content role it fails: buried proof, equal-weight sections,
or a first screen that could belong to any product.

## Scope

Stay inside the user's request. A review of the mobile menu does not become
a brand critique. A review of a dashboard table does not require a new
illustration style.

## After implementation

When you did change code, re-check the current result, not the first
screenshot. List what you re-checked and what you still could not.

## Decision examples

### Read-only homepage review

The user asks whether the studio homepage is clear. You find a hero
headline that restates the company name, three equal service cards, and a
real installation photograph in the third section. Report: the distinctive
proof is below the first viewport; the cards imply sameness. Recommend
moving the installation up. Do not edit files in this mode.

### Post-change check

You fixed a mobile menu. Technical: the button now toggles `aria-expanded`,
Escape closes, focus returns. Visual: you could not open a browser in this
session, so stacking against the hero is unverified. Say that plainly.
Do not mark the task as visually confirmed.
