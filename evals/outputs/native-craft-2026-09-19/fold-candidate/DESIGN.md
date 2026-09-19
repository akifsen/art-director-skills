# Design notes
Mode: DESIGN. Platform: web React. Foundation: starter; shared tokens, Button, Badge, craft Illustration, workshop rows and field styles.

Thesis: A studio programme with oversized ink-blue headings and an acid-yellow notice strip. The opening viewport contains actual workshop titles, time commitments and original conceptual craft diagrams. Tight bold Arial headings feel like a printed workshop poster; quiet body text and ruled rows make comparison easy. On phones the programme becomes a single column and detail leads with a compact identity before session selection.

Alternative: a large gallery of craft objects would emphasize inspiration but bury session availability. Chosen: an illustrated programme, because visitors need to choose an available weekend activity.

Research limit: no external visual browsing undertaken in this bounded attempt. Loaded original two-readings study: archive structure supports comparison; object stage supports material identity. Applied those as a compact programme plus small conceptual diagrams, not copied visual styling.

| Screen | Task | Components | States | Navigation | Check |
|---|---|---|---|---|---|
| Programme | Browse / filter | filter buttons, workshop rows | all / filtered | workshop URL | each craft |
| Workshop | Inspect / reserve | summary, session radios, name, quantity | full / missing / capacity / valid | back preserves craft | form flow |
| Reservation | Review / cancel | confirmation, summary, action | reserved / cancelled | choose again | record / availability |
