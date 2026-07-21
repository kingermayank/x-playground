# Persistent Theme Switch Design

## Goal

Add one persistent theme switch to Always Cooking that lets visitors move between the deployed cream Studio Archive visual language and the current purple arcade visual language. Content, layout, gallery behavior, and experiment interactions remain shared.

## Themes

### Archive

- Cream paper background and warm ink palette from the existing Studio Archive direction.
- Newsreader for display headings and Gabarito for interface and supporting text.
- Fine rules, restrained corners, and soft shadows.
- The product name is Always Cooking.

### Arcade

- Current purple grid background, lavender surfaces, orange accents, pixel borders, and block shadows.
- Arcade Classic for homepage and experiment-page display titles.
- Nippo for card titles, controls, metadata, and supporting text.

## Interaction

- A compact, accessible switch appears at the top right of the homepage header and experiment title bars.
- The control explicitly names both destinations: Archive and Arcade.
- The initial theme is Archive when no saved preference exists.
- Activating the switch updates the document theme immediately and stores the choice in `localStorage`.
- The stored choice applies across the homepage and all experiment detail pages.
- A small inline head script applies the stored theme before styles paint to avoid a visible flash during navigation.
- If storage is unavailable, the site continues with Archive and the switch still works for the current page.

## Content Constraints

- Always Cooking remains the title in both themes.
- Do not restore Studio Archive, Est. 2026, Ongoing Accession, or Dossier labels.
- Dates and the Filed status remain part of experiment metadata.
- Theme changes must not alter experiment canvases or their internal controls.

## Architecture

- `src/theme.js` owns theme validation, persistence, DOM updates, and switch events.
- Both stylesheet entry points define the shared Arcade base plus scoped `[data-theme="archive"]` overrides.
- Each HTML page includes the early theme initializer and the shared theme module.
- The switch uses a native button with `role="switch"`, `aria-checked`, an accessible label, and visible theme names.

## Verification

- Unit tests cover defaulting, stored preference handling, persistence, and switch state.
- Site tests verify every page includes the early initializer, shared controller, and switch.
- Browser captures cover both themes on the homepage and one detail page at desktop and mobile widths.
- Existing experiment tests continue to pass.
