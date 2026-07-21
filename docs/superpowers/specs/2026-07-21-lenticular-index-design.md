# Lenticular Index — Design

## Creative territory

A one-viewport typographic artifact that turns the viewer's horizontal position into the viewing angle of a lenticular print.

## References

- Codrops' Proximity Scale Grid: a single pointer coordinate can orchestrate many elements without direct dragging.
- Imagiam's lenticular-printing explainer: narrow interlaced vertical strips and a cylindrical lens array create a convincing flip between images.
- MDN's CSS transform guide: perspective origin can act like the viewer's position, while backface visibility controls which face is readable.
- MDN's `backdrop-filter` reference: restrained blur and saturation on translucent surfaces can suggest optical material.

## Directions considered

### Lenticular Index — selected

- **What if** a browser poster behaved like a tilt card?
- **Central interaction:** moving horizontally turns 24 vertical ribs from `NEAR` to `FAR`; click or Space pins the current angle.
- **10-second proof:** sweep left to right, pause at the shimmering midpoint, lock on the opposite message.
- **Technique:** DOM-generated CSS 3D ribs, perspective-origin tracking, spring-smoothed angle, specular CSS layers.
- **Smallest convincing version:** one poster, two faces, pointer/keyboard control, lock/reset, responsive and reduced-motion states.

### Proximity Choir

- **What if** an editorial index inhaled around the reader's attention?
- **Central interaction:** type tiles scale and tighten in concentric proximity bands.
- **10-second proof:** cursor crosses the grid and a readable phrase travels with it.
- **Technique:** DOM grid, distance field, CSS custom properties.
- **Smallest convincing version:** 7×7 tiles and one phrase.

### Elastic Aperture

- **What if** a circular lens revealed the emotional opposite of a poster?
- **Central interaction:** a lens follows the pointer and refracts a hidden alternate composition.
- **10-second proof:** trace the lens over the headline, then enlarge it.
- **Technique:** clipped duplicate layers, backdrop filters, spring radius.
- **Smallest convincing version:** two poster layers and one controllable lens.

## Why Lenticular Index wins

It has the clearest material thesis, the most legible ten-second transformation, and adds CSS 3D/DOM craft to a gallery dominated by canvas scrubbers. The interaction remains understandable on touch and keyboard without adding a second feature system.

## Architecture

- `lenticular-math.js` owns clamping, angle mapping, face selection, and spring stepping as pure testable functions.
- `lenticular-index.js` generates the ribs, translates pointer/keyboard input into target position, and updates CSS variables/readouts.
- The detail page keeps the shared title/header/stage layout. The stage itself is a focusable semantic region with explicit instructions, a lock button, reset button, and polite status announcements.
- Reduced motion maps input directly rather than continuously springing and removes shimmer/sweep transitions.

## Visual system

The first screen is a warm black framed artifact on a pale gallery page. Acid yellow and mineral blue form the two opposing faces. Fine vertical highlights make the rib array legible before interaction; oversized condensed words supply the immediate read. Controls sit in a compact optical-instrument rail rather than covering the poster.

## Testing

- Unit tests cover input clamping, position-to-angle mapping, face labels, and finite spring convergence.
- Structure tests cover fixed layout, focusability, pointer and keyboard behavior, live status, and reduced-motion handling.
- Full `npm test` plus desktop/mobile browser inspection gates gallery integration.

## Self-review

No placeholders or unresolved decisions. The scope is one bounded interaction, and the DOM/CSS approach is explicit. Browser fallback is a flat but still legible two-face poster when 3D transforms are unavailable.
