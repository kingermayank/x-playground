# Contour Chorus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Canvas experiment where pointer motion conducts a precise, decaying topographic field.

**Architecture:** Pure field math lives in `contour-field.js`; DOM input, animation, rendering, and accessibility live in `contour-chorus.js`. The detail page follows the existing fixed playground shell, and gallery integration happens after the critique gate.

**Tech Stack:** HTML, shared CSS, Canvas 2D, vanilla ES modules, Node test runner, Playwright inspection

## Global Constraints

- Keep one memorable interaction in one viewport.
- Support pointer, keyboard, responsive sizing, and reduced motion.
- Do not add gallery metadata until the isolated interaction passes critique.

---

### Task 1: Field model

**Files:**
- Create: `experiments/contour-chorus/contour-field.js`
- Modify: `test/experiments.test.js`

**Interfaces:**
- Produces: `clampEnergy(value)`, `influenceAt(point, source)`, and `sampleField(point, sources, time)`.

- [ ] Write tests asserting bounded energy, distance falloff, and deterministic sampling.
- [ ] Run `node --test test/experiments.test.js` and confirm failure because the module is missing.
- [ ] Implement the three pure functions with radial falloff and a sinusoidal ridge.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Isolated interaction

**Files:**
- Create: `experiments/contour-chorus/index.html`
- Create: `experiments/contour-chorus/contour-chorus.js`
- Modify: `experiments/experiment.css`
- Modify: `test/site.test.js`

**Interfaces:**
- Consumes: field-model functions from Task 1.
- Produces: `#contourCanvas`, `#contourReset`, and `#contourStatus` with pointer and keyboard behavior.

- [ ] Add structural tests for the fixed layout, accessible Canvas, input events, animation, and reduced motion.
- [ ] Run `node --test test/site.test.js` and confirm failure because the page is absent.
- [ ] Build the page, Canvas renderer, damped conductor state, pinned echoes, and controls.
- [ ] Run the focused test and confirm it passes.

### Task 3: Craft and gallery integration

**Files:**
- Modify: `src/experiments.js`
- Modify: `styles.css`
- Modify: `test/experiments.test.js`
- Modify: `test/site.test.js`

**Interfaces:**
- Produces: a searchable gallery entry and authored `contour` preview.

- [ ] Critique first-screen intent, memorable interaction, motion, engineering signal, recording value, and weakest visual detail.
- [ ] Add failing expectations for the sixth gallery item and contour preview.
- [ ] Add metadata and preview styling only after the critique passes.
- [ ] Run `npm test`, inspect the browser at desktop and mobile widths, and run final `npm test` again.
