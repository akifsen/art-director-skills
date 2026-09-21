# Design method

Read this for DESIGN work. A named REFINE control remains bounded even when
the surrounding product needs a redesign. Skip it for a one-control fix.

## Start from the current surface

List, briefly:

- Primary visitor task
- Real content you must keep, including awkward or uneven items
- Brand materials that are *in force* (see Preserve vs replace)
- Technical limits: framework, styling system, routing, SSR, i18n, assets

The distinctive fact is usually in the content, not in a mood word. A studio
that sells three unlike services is not a SaaS onboarding page. A researcher
who writes long notes is not a "personal brand" template.

If the user already named a direction, treat that as the thesis seed. Do not
reopen a bake-off.

## Job vs domain

Write the **job of this screen** (portfolio / product workspace / native)
before a look. The organization's field is a separate input.

Do not produce an editorial ledger because the brief says photographer, or a
neon terminal because it says technology. Archive, typewriter, dark glass,
equal rounded cards, cool-gray sharp system chrome, warm paper, serif,
sans: each is a valid tool for some product. Choosing one because it is
the current default — or because it inverts the last default — is the
failure, not the tool. Justify it from task, content, brand in force,
audience, and platform.

Keep what the user stated: a named direction, a rejected look, a brand in
force. Do not assume preferences the brief did not give.

A REFINE of one control does not authorize a new identity for the whole app.

## Design direction

On a broad DESIGN, write a short direction as decisions to implement — not
a meeting, not an inner monologue. Decide in this order: first the tone in
three words tied to task and audience ("quiet, exact, warm" for a
photographer's tracker; not "clean, modern, minimal"); then the type regime
and the surface/contrast regime; then the focal anchor and the composition
around it. The six items below record those decisions and the rest:

1. **Main task and content priority** — what the user does first, which
   content carries it, what is secondary. **First look**: what occupies the
   opening viewport, in what material.
2. **Composition and density** — how title, media, navigation, and actions
   share one weight, not four decorated boxes; how many records or ideas
   are visible at once and why that amount serves the task.
3. **Type roles and readability** — display / heading / body / meta /
   control; scale, weight, measure, leading, language coverage, and that
   faces actually load.
4. **Color, surfaces, and states** — canvas, working surface, text
   priority, separators, interaction, semantic status; the selected,
   hover, focus, error, and loading pairs that must stay readable; radius,
   border, and shadow from one family.
5. **Imagery's real role** — proof, product, or absent (then diagram /
   type, not a gray box). Data-dense tools do not need a hero photograph.
6. **Interaction on this platform** — navigation model, control sizes,
   keyboard or touch path, small-screen order; what is reordered, cropped,
   or disclosed, not a shrunk desktop.

Turn adjectives into decisions. "Bold" says nothing; "the delivery date is
the largest text in the row, the client name a step below, the ID mono and
muted" is a decision someone can implement and check. One or two
distinctive decisions carry a direction. If every component tries to be
the event, none is.

Type values and CSS in this skill's references are starting options, not
required measures for every face and screen.

Reject a thesis that would still fit any other product after swapping the
name. "Clean layout, strong type, plenty of whitespace" is not a thesis.
"Navy accent, Inter, three cards" is a kit, not a thesis.

On a **product workspace**, do not push the main task below a marketing
billboard. On a **portfolio**, do not fill the first viewport with generic
copy while the work sits in section three.

**Gotcha:** the product name can dominate the first viewport while the
*object of the work* is missing. A lockup and a color rail on a dark field
is a poster. Finish the artifact: a crop, a diagram, a working surface, a
caption — something a visitor could point at. Do not "fix" this by adding
numbered filler cards under the poster.

## Two readings, not a catalog

When the content supports two structural readings, name both in a few
lines, state the tradeoff, pick one, and implement it. If one reading is
clearly right, do not stage a comparison.

Useful contrasts are structural, not decorative:

- Proof-first vs narrative-first
- Index of work vs one featured piece plus a list
- Tool density vs guided explanation
- Typographic poster vs object/media stage

Do not generate three page mockups, six palettes, or a pack matrix. Do not
force asymmetry, a split hero, a giant display word, a gradient, or a
three-card row because they are common — including as *anti*-patterns you
then invert the same way every time.

## Preserve vs replace

**Keep** unless the user replaces them:

- Real copy, prices, names, dates, and claims
- Existing routes and information architecture
- A real brand system: documented tokens, logo usage, chosen faces, a
  palette the product already ships
- Components that already encode the product

**Not a brand system** (safe to replace on DESIGN / explicit redesign):

- Starter-kit or framework demo look
- An unconsidered starter type hierarchy. A system font can be a deliberate
  choice; native platform fonts are not web starter leftovers
- Temporary gray boxes, "lorem" bands, or a theme the user already rejected
- Equal dummy cards that only exist to look like a landing page

On redesign: keep function and content; you may change visual decisions.

Replace when they block the thesis: generic stock sections, invented social
proof, decorative assets with no license, and layout that gives every block
the same weight.

## Decision examples

### Studio with unlike offerings

A lighting studio sells photography, installations and equipment rental.
For visitors choosing a service, a compact service index with one real
specimen and a direct inquiry path per service supports comparison. For
visitors arriving from an exhibition announcement, a current-installation
stage with date, access and secondary service paths supports that intent.
Both retain all services and inquiries; choose from entry context and
available proof, not a rule that grids are bad or stages are always better.

### Ops tool used daily

A dispatch board shows jobs, SLA risk and assignee load. A sortable table
with an adjacent inspector helps compare many records without losing place.
A risk-grouped list with inline actions helps an operator clear a small
urgent set in order. Both support retrieval, assignment and record detail.
Choose the table when comparison across attributes dominates; choose groups
when priority sequence dominates. On narrow screens preserve identity and
the next action; move the inspector into a reachable detail view. Test that
returning preserves the filter and position. Neither needs a marketing hero.

### Personal site with one long text

A developer has three tools and a long memoir. An annotated work index gives
recruiters a quick route to shipped evidence, with the memoir as a clear
reading path. An opening excerpt with a contents rail suits readers arriving
for the essay, while a compact tools index keeps the work discoverable.
Choose from the intended visit; both must retain the same reading and tool
destinations. Type, measure and spacing can finish either without a headshot.
