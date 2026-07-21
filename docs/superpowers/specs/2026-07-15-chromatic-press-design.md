# Chromatic Press Design

## Thesis

Chromatic Press treats print registration as a direct-manipulation instrument. Dragging one registration target separates four simulated ink plates with distinct lag and weight; releasing it settles the plates into a sharply aligned editorial poster.

## Central interaction

The canvas is the control. Pointer drag, touch drag, or arrow keys move a registration target. Cyan, magenta, yellow, and black layers follow at authored ratios and spring back on release. Space toggles between an intentionally offset proof and a registered proof; Home resets.

## Visual system

Use an off-white paper field, dense black typography, geometric crops, crop marks, and saturated process colors. Misregistration is visible only where layered shapes and type overlap, keeping the effect legible rather than noisy. The fixed playground title bar and centered stage remain unchanged.

## Motion and accessibility

Plate response uses a damped spring with different per-plate weights. Reduced motion removes continuous settling and updates plate positions directly. The canvas is keyboard focusable, instructions are available to assistive technology, status changes are announced, and controls expose visible focus states.

## Scope and verification

The smallest convincing version is one responsive poster, one direct manipulation, and one register toggle. Pure plate physics live in a small testable module; page structure and gallery metadata receive contract tests. Browser verification covers desktop, mobile, and reduced motion with no runtime errors.
