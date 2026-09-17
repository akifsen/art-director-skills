# Typography, color, and assets

Read this when type, color, imagery, or licenses matter. Skip it for
structure-only or copy-only edits.

## Type roles

Assign roles before picking families:

- **Display:** rare, for the lead. Not for every heading.
- **Heading:** section structure. Keep a clear step down in size and weight.
- **Body:** the reading text. Target a comfortable measure, often near 60–70
  characters for articles; shorter for UI chrome.
- **Meta:** dates, labels, captions, table headers. Smaller, not weaker in
  contrast.

Do not ban a family. Serif, sans, mono, and display faces are all valid when
the role is clear. Loading a display face for every label wastes weight and
flattens hierarchy.

If the project already loads fonts, reuse them. Add a face only when a role
is missing. Provide fallbacks that preserve script coverage.

## Language and fallbacks

If the UI includes Turkish, or any language with letters beyond a basic
Latin subset, verify the chosen face actually contains those glyphs
(`ğüşıöçĞÜŞİÖÇ` and the project's other needed marks). A fallback that
changes x-height or weight mid-word is a defect.

Self-hosted and platform fonts are both acceptable. Prefer the project's
existing loading method. Do not introduce a new CDN because an example used
one.

## Color roles

Name colors by job, not by hue:

- Surface and text for reading
- Accent for action or highlight, not for large fields of text
- Status (danger, warning, success) with a non-color cue
- Borders and muted text that still meet contrast in context

Do not equate dark canvases, neon accents, or glassmorphism with quality.
Do not forbid a color. If a brand already defines a palette, map roles onto
it instead of inventing a parallel system.

Accent-only status (red vs green with no text or icon) fails for many
readers. Keep status in words.

## Imagery

Choose media that the product can actually supply:

- **Product screen:** software, dashboards, tools.
- **Photograph:** places, people, objects the brand owns or licenses.
- **Illustration:** when the subject is abstract or the photo would mislead.
- **Type-as-image:** editorial or word-led brands, used sparingly.
- **Diagram:** processes, relationships, and systems.

Do not cover missing assets with random gradients or decorative 3D objects.
If there is no image, design a strong typographic or data-led composition
and label any placeholder as a placeholder.

Do not invent screenshots, customer faces, logos, or metrics.

If the host has no image-generation tool, do not pretend assets were
produced. Describe what is needed and proceed with licensed existing files
or honest placeholders.

## Licenses

Prefer assets already in the project with a known right to use. When adding
a new external file, prefer CC0 or another license the project can keep, and
record the license next to the file (comment, README note, or design notes).
Do not copy a competitor's layout, brand, or images. Pull abstract
principles from references, then apply them to this content.

## Decision examples

### Content-led publication

Field Notes Weekly runs 1,200-word reported pieces. Display type on every
heading and a neon dark theme would fight the reading task. Better: a
reliable body face with full Turkish glyph coverage, restrained headings,
and a surface that keeps a stable measure. Color marks section, not mood.

### Existing brand, new section

Marrow & Co already uses a warm off-white, iron text, and a single red for
actions. A new Careers section should reuse those roles. Introducing a
separate "modern" purple and a geometric display face would look like a
second product. Hierarchy can still change: job posts as a list with
location and type, not a marketing grid of perks.
