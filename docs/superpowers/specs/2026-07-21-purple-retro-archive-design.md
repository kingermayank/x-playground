# Purple Retro Archive Design

## Intent

Reframe Always Cooking as a playful retro game archive without changing the gallery structure or the experiments themselves. The interface should feel inspired by late-1990s game menus and printed game-night ephemera: saturated purple fields, pale lavender surfaces, pink secondary accents, orange interaction highlights, pixel-grid structure, and blocky shadows.

## Visual System

- Purple is the page canvas on the homepage and every experiment detail page.
- Aubergine provides borders, shadows, and high-contrast structure.
- Pale lavender surfaces hold cards, form controls, and the live experiment frame.
- Cream text is used directly on purple; dark plum text is used on light surfaces.
- Pink is a supporting decorative color. Orange is reserved for active filters, focus, status stamps, and the cooking loop.
- A low-contrast square grid sits in the purple page field. It is structural, not a decorative gradient.
- Corners remain compact and mostly square. Offset shadows create the pixel-game character.

## Scope

The shared homepage shell, search and filter controls, folio cards, header, footer, detail title bars, and live-dossier frame receive the new system. Individual experiment canvases and their internal palettes remain unchanged so each project keeps its identity.

## Interaction And Accessibility

Hover states use small vertical movement and block shadows. Focus remains visible with an orange ring. Cream-on-purple and plum-on-lavender text combinations must remain readable, and the reduced-motion behavior already in the site remains intact.

## Verification

Automated tests assert the shared tokens and their application on both shell stylesheets. The homepage and one detail route are visually checked at desktop and mobile widths.
