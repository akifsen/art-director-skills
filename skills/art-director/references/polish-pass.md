# Polish pass

Read this on a **large DESIGN** task before you declare the page done, and
whenever the first render looks like a skeleton. Skip it for a one-control
REFINE; there, mature the named piece directly.

The goal is a finished slice, then the same language everywhere in scope.
It is not a three-mockup review, and not an infinite self-critique loop.

## Sequence

1. **Thesis** — four concrete answers (first look, distinctive material,
   support, small screen). See [design-method.md](design-method.md).
2. **References** — if you can see pages, take 2–4 notes. See
   [visual-research.md](visual-research.md). If you cannot, use a study
   from this skill and say live research did not happen.
3. **One slice in real files**
   - Marketing / studio / portfolio: navigation + opening viewport + the
     beginning of the next band (enough to prove the rhythm).
   - Dashboard / tool: the primary working surface (filters + records, or
     the canvas operators actually use).
4. **Load check** — before you talk about the design, confirm the
   stylesheet ran, the intended faces are in use, and images/fonts are not
   404. A correct thesis with a missing CSS link is still an unstyled page.
5. **Look** — if a browser or image tool exists, inspect a desktop width
   and a small width (~390px is a useful starting point, not a law). Check
   hover/focus/open states you shipped. If you cannot look, mark visual
   verification **missing**. Do not write "it looks premium."
6. **Extend** — copy the slice's type roles, surfaces, edge rhythm, and
   component language through the rest of the requested scope. Do not
   invent a second system for the footer.
7. **Highest-impact fix** — one short pass: the worst hierarchy miss, the
   broken crop, the unloaded font, the control with no focus. Then stop.

Host decides and continues unless the user asked to see options.

## Load check (do this)

In the running page or with a quick inspection of the network/CSSOM:

- The stylesheet you edited is the one the document loads (href, bundler
  entry, or scoped block actually emitted).
- Computed `font-family` on heading and body matches the thesis, including
  fallbacks. If a webfont is still `system-ui` or Times, the face did not
  apply — fix loading, do not praise the intended pairing.
- Images have real dimensions or reserved space; broken `src` is a craft
  failure, not a "placeholder vibe."
- `@import` and extra font stylesheets that 404 count as broken, even when
  the HTML structure is right.

If you cannot run the page, say that the load check did not happen.

## How much iteration

Two reasoned passes after the first slice is enough for most DESIGN tasks
(load/visual check, then one craft pass). A third pass only if a concrete
defect remains (overlap, unreadable overdue state, missing jobs). Do not
install a standing "improve until beautiful" loop.

## Honest stopping

Done: the slice and its extension match the thesis, content is real, both
ledgers were considered, and missing tools are named.

Not done: "I did not see it but the CSS should feel expensive."

Not done: hierarchy is correct but the distinctive artifact is still only
a word (installation without a stage, tool without a working surface,
memoir without a reading composition).
