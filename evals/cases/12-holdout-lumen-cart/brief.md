# Brief — Lumen Cart (holdout)

You are designing a **product UI** for a neighborhood **bookmobile**
stop log. Drivers mark whether today’s stops happened. There is **no
theme pack** and no component library.

Real stops (do not invent patrons, circulation counts, or GPS tracks):

- LC-04 · Cedar Stairs · 09:30 · due
- LC-11 · Quarry Loft · 11:00 · on site
- LC-02 · Weir School yard · 14:15 · done

Primary task: find a stop, read it, then either **complete** it (minutes
on site, 5–90) or **skip** it (reason required). Completing or skipping
must change that stop in session state and show on the list when you
return.

Mode: **DESIGN**. Platform: **web**. Foundation: **starter / no system**.

Required scope (not a marketing page, not a map product):

1. Stop list with a filter
2. Stop detail
3. Complete / skip form with validation
4. Empty-filter and unknown-stop states, plus an honest session save

Do not ship a single static HTML mock. Do not use `dangerouslySetInnerHTML`
as the UI. Do not add a commercial theme or a second React UI kit.

Do not invent reader photos. Unknown remaining minutes stay unknown.

This brief is not Tide Bindery, Kiln Queue, Nadir Desk, or Closeout.
Do not reuse those products’ palettes, type, hash routers, or `?fixture=`
query APIs unless this app’s own tests need them.
