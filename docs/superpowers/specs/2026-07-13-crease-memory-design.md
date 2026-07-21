# Crease Memory Design

## Creative territory

An editorial interaction study where a digital surface behaves like a printed sheet with a second reading on its reverse.

## Selected direction

Crease Memory presents one oversized poster inside the playground's fixed experiment shell. Dragging a diagonal crease reveals a high-contrast reverse side while a narrow folded flap, contact shadow, registration marks, and live readout make the material state legible. Releasing the crease settles it to one of three authored positions.

The first screen must already look composed: warm paper, ink-black typography, a small acid-green reverse-side reveal, and one obvious crease handle. The ten-second proof is a drag from right to left, a release into a snap point, one keyboard nudge, and a reset.

## Interaction and motion

- Pointer drag is the primary behavior; the canvas captures the pointer so the gesture survives leaving the handle.
- Arrow keys move between three fold positions. Home resets the poster.
- The fold follows the pointer directly, then settles with a damped spring after release.
- Reduced-motion users get direct state changes with no spring or ambient animation.
- A visible reset control and polite status text expose the same state without relying on color or motion.

## Architecture

- `fold-geometry.js` owns clamp, snap selection, and responsive fold geometry as pure functions.
- `crease-memory.js` owns canvas rendering, pointer/keyboard input, spring state, and accessible status updates.
- The detail page reuses `experiments/experiment.css`; Crease Memory additions stay scoped to `.crease-*` selectors.
- Gallery integration is metadata-driven through `src/experiments.js` and one new preview selector in `styles.css`.

## Testing

Node tests cover fold clamping, snap selection, geometry shape, required interaction hooks, metadata, fixed-shell markup, keyboard input, pointer capture, reduced motion, and gallery preview styling. Browser inspection checks the first screen, drag response, reset state, responsive layout, and console errors.

