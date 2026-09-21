# Brief — Tide Bindery (holdout)

You are designing a **product UI** for a small book-conservation bindery’s
internal ticket app. There is **no theme pack** and no component library.

Real tickets (do not invent clients, prices, or “books restored” counts):

- B-19 · Brine Psalter · sewing repair · due 22 Sep · status waiting
- B-12 · Harbor ledger (1838) · leather reback · due 18 Sep · status on bench
- B-07 · School atlas · tissue mend · due 30 Sep · status ready

Primary task: find a ticket, read it, log a bench hold when the book must
wait on adhesive.

Mode: **DESIGN**. Platform: **web**. Foundation: **starter / no system**.

Required scope (not a marketing page):

1. Ticket list with filter
2. Ticket detail
3. Form to log a hold (reason required; hours 1–72)
4. Loading or empty-filter state, validation errors, and a success return
   to the ticket — demo/local state is fine if labeled

Do not ship a single static HTML mock. Do not use `dangerouslySetInnerHTML`
as the UI. Do not add a commercial theme or a second React UI kit.

Do not invent restoration photos. Unknown remaining hours stay unknown.

This brief is not derived from Northglass, Ada, or Harbor evals. Do not
restyle it as a ceramics kiln, a clinic, or a dispatch board.
