# Implementation

Read this before changing code, unless the change is a copy-only edit in an
already understood stack.

## Stay in the current system

Implement with the project's framework, templates, and styling approach.

Examples in this skill are patterns, not templates to paste. HTML and CSS
snippets here do not mean the target should become a static page or a React
app. Blade, Vue, FreeMarker, Liquid, ERB, and similar systems stay.

Reuse existing layout primitives, design tokens, and components when they
can express the thesis. Add a new primitive when the current one cannot;
do not add a second spacing scale "for the redesign."

Name **platform** (web vs native) and **UI foundation** (existing theme,
local primitives, or starter) before you write styles.
Then open the matching guides from `SKILL.md`. A native task does not
follow web CSS recipes. A React product app does not ship as one static
HTML file or as `dangerouslySetInnerHTML` mockups.

Do not add a second UI kit beside a working one. Read the lockfile; do not
assume a primitive version. Complex overlays (dialog, select, calendar):
use an accessible primitive already in the project.

## Semantics and behavior

Keep heading order honest. Do not skip levels to get a visual size.
Do not replace a heading with a styled `div` to match a mock.

Preserve routing and SSR:

- Do not convert a server-rendered list into client-only cards without a
  reason the user accepted.
- Do not flatten distinct routes into one scroll of fake sections.
- Keep real URLs, form methods, and progressive enhancement when they exist.

Preserve real content. Do not invent testimonials, logos, user counts, quotes,
calendar dates, or measurements the brief left unknown (unknown seats stay
unknown; "two Saturdays" is not a license to pick days).

## CSS, fonts, and assets

Prefer the project's existing approach: files, CSS modules, utility classes,
styled-components, or whatever is already there. Mixing a new utility
framework into a tokenized stylesheet needs an explicit user request.

Keep images and fonts loadable offline if the project already works that
way. Record new asset licenses near the files.

Before you treat the design as done, confirm:

- The document actually loads the stylesheet you edited
- Intended `font-family` is the computed face, not an un-loaded fallback
- Image `src` values resolve (no silent 404)

A missing `@import` or a wrong relative CSS path is a failed implementation,
not a taste problem. See [polish-pass.md](polish-pass.md).

For a starter React app, build a small shared system first
([product-ui-system.md](product-ui-system.md),
[react-web.md](react-web.md)). For an existing theme or local primitives,
enhance that system ([existing-ui-system.md](existing-ui-system.md)). For React
Native / Expo, use native layout and a11y
([native-mobile.md](native-mobile.md)).

## What "implemented" means

The user asked for a designed interface: the running UI should change, and
the requested scope should look directed, not like a wireframe — unless they
asked for a wireframe.

Not sufficient on their own:

- A token list
- A markdown design spec
- A component inventory
- Suggestions for a human designer

REVIEW mode is the exception: then do not edit sources.

## Decision examples

### Vue marketing site

The user wants a clearer product proof on the home view. Edit the existing
Vue view and its scoped styles. Do not scaffold Vite+React because a skill
example used HTML. Keep the current router and i18n keys.

### Strong brand, new Careers route

Marrow & Co has a layout shell, color tokens, and a job data source. Add a
Careers view that uses the shell and tokens, and render the real jobs.
Do not introduce a one-off landing with different fonts. If the jobs API is
empty, show an honest empty state, not fabricated openings.
