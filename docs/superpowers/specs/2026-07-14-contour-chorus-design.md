# Contour Chorus Design

## Thesis

Pointer motion becomes an editorial topography: a restrained field of contour lines swells, intersects, and briefly retains the gesture around a central typographic monument.

## Central interaction

Moving or dragging across the canvas conducts two damped influence sources. Speed controls contour amplitude while pointer position controls their focus. Clicking pins a short-lived echo; keyboard users move the conductor with arrow keys and press Space to pin it.

## Visual system

The fixed playground header leads into one near-black stage. Fine warm-white contour lines form the base field; acid coral marks active interference and a large condensed-feeling word provides scale. Motion uses fast input response with a slower 600–900ms decay. The stage remains legible at narrow widths and becomes static but interactive under reduced motion.

## Architecture

`contour-field.js` owns pure influence and contour sampling math. `contour-chorus.js` owns pointer/keyboard state, Canvas rendering, timing, and accessible status. The detail page reuses the fixed shared layout. Gallery metadata and preview styling are added only after the isolated interaction passes critique.

## Testing

Node tests cover influence falloff, bounded energy, and gallery metadata. Structural tests cover Canvas, controls, pointer/keyboard support, animation, and reduced-motion handling. Final verification runs the full Node suite and inspects a real browser render.

## Scope

One canvas, one conductor, transient pinned echoes, reset control, keyboard equivalence, and gallery integration. No audio, WebGL, image assets, or persistent storage.
