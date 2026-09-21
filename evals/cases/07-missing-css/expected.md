# Expected — 07-missing-css

## Scope

- REVIEW only; no source edits
- Isolated fixture; not a customer site

## Gate A

- Agent notices `brand.css` does not load (404 / missing file)
- Agent does not treat `unused.css` as applied
- Findings stay read-only

## Gate B

- Visual craft of the *intended* CSS is **unverified** or explicitly
  "not what shipped"
- Do not score the page as finished design based on reading unused.css
