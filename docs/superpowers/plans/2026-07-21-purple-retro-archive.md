# Purple Retro Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved purple retro-game visual system to the shared playground shell.

**Architecture:** Define the palette as CSS custom properties in both shared stylesheets, then apply semantic light-on-purple and dark-on-lavender combinations at component boundaries. Preserve all experiment-specific stage styling and JavaScript behavior.

**Tech Stack:** Static HTML, CSS custom properties, Node test runner

## Global Constraints

- Keep Arcade Classic limited to the hero and experiment titles.
- Keep Nippo for interface and supporting text.
- Do not change experiment canvas artwork or interaction logic.
- Keep the existing responsive gallery sizing and reduced-motion behavior.

---

### Task 1: Encode The Theme Contract

**Files:**
- Modify: `test/site.test.js`
- Test: `test/site.test.js`

- [x] Add assertions for the purple canvas, lavender surface, plum ink, cream on-purple text, orange accent, and pixel-grid background in both shared stylesheets.
- [x] Run `npm test` and confirm the new assertions fail against the old cream theme.

### Task 2: Restyle The Homepage Shell

**Files:**
- Modify: `styles.css`
- Test: `test/site.test.js`

- [x] Replace the cream archive tokens with the approved semantic palette.
- [x] Apply the purple grid field, light header and hero text, lavender cards and inputs, orange active/focus states, and block shadows.
- [x] Run `npm test` and confirm the homepage theme assertions pass.

### Task 3: Restyle The Detail Shell

**Files:**
- Modify: `experiments/experiment.css`
- Test: `test/site.test.js`

- [x] Mirror the shared semantic tokens and purple grid field.
- [x] Apply light title-bar text and a lavender framed experiment surface while leaving each stage unchanged.
- [x] Run `npm test` and confirm the complete suite passes.

### Task 4: Visual Verification

**Files:**
- Verify: `index.html`
- Verify: `experiments/signal-descent/index.html`

- [x] Check the homepage and Signal Descent route at desktop and mobile widths.
- [x] Confirm contrast, card sizing, focus treatment, content overflow, and that the experiment remains interactive.
