# Signal Descent Design

## Thesis

Signal Descent turns the Apollo 11 moonwalk broadcast into a tactile transmission surface. Scrubbing a vertical beam across noisy lunar relief resolves fragmented telemetry and embossed typography into a crisp signal lock.

## Central interaction

The canvas is the control. Pointer drag, touch drag, or arrow keys move a scan beam across the surface. Content behind the beam becomes progressively more coherent; moving quickly introduces brief horizontal scan displacement, while releasing near the landing coordinate triggers an authored lock pulse. Home resets the transmission.

## Visual system

Use phosphor green, warm lunar gray, broadcast black, mono telemetry, and one oversized condensed wordmark. Relief is built from deterministic crater contours, scan lines, and composited type rather than generic particles. The fixed playground title bar and centered stage remain unchanged.

## Motion and accessibility

The beam follows direct input with a short eased tail, velocity controls signal shear, and lock uses a 700ms three-part pulse: aperture close, bright hold, quiet settle. Reduced motion removes the tail and pulse, applying positions immediately. The canvas is keyboard focusable, instructions are visible, status changes are announced, and controls have visible focus states.

## Scope and verification

The smallest convincing version is one responsive transmission surface, one scan interaction, and one reset control. Pure scan math lives in a small testable module; page structure and gallery metadata receive contract tests. Browser verification covers desktop, mobile, and reduced motion with no runtime errors.
