# Example — media-led catalog (Rail Still)

**When:** the proof is visual work the visitor must see first (catalog,
portfolio, product stills). **Not:** a job tracker, a cream ledger, or a
look to paste onto an ops tool.

Copy the *method*: the still sets the opening geometry; type is a caption
with a job; the next band changes density. Do not copy the cool-gray canvas,
copper rule, or these generated stills onto another product.

## Run (this repository, maintainer)

After `npm ci`:

```sh
npm run example:rail
```

Open `http://127.0.0.1:5176/`. Vite compiles this folder.

```sh
npm run test:examples:build
```

## What this is teaching

| Decision | This page | Not a default |
|---|---|---|
| First look | Current fixture still, title as display | Studio name as a serif poster |
| Type | Grotesque, sentence-case nav, tight display | Tracked small-caps metadata |
| Surface | Cool stone canvas, photos unrounded | Warm paper panel, 2px “archive” radius |
| Media | Generated stills, captioned as demo | Gray boxes or fake client photography |
| Next band | Uneven crops (yard / arm) | Three equal cards |

Narrow: type stacks above the crop; the hero shortens; work stacks. Do not
keep a desktop overlay that fails contrast.

Assets and license: [media-portfolio/ASSETS.md](media-portfolio/ASSETS.md).

## Files

- [media-portfolio/App.jsx](media-portfolio/App.jsx)
- [media-portfolio/data.js](media-portfolio/data.js)
- [media-portfolio/styles.css](media-portfolio/styles.css)
- [media-portfolio/main.jsx](media-portfolio/main.jsx)
- [media-portfolio/index.html](media-portfolio/index.html)
