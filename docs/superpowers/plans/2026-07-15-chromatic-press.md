# Chromatic Press Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and gallery-integrate a tactile CMYK plate-registration experiment.

**Architecture:** Keep deterministic registration math in `plate-physics.js`; keep rendering and interaction orchestration in `chromatic-press.js`. Reuse the fixed detail-page shell and add experiment-specific CSS plus gallery metadata and preview styling.

**Tech Stack:** Vanilla JavaScript modules, Canvas 2D, CSS, Node test runner, Playwright.

## Global Constraints

- Build the central interaction before gallery integration.
- Keep the fixed playground detail layout.
- Support pointer, touch, keyboard, responsive layouts, and reduced motion.
- Add no dependencies and do not use Figma or Pencil.

---

### Task 1: Plate physics

**Files:** Create `experiments/chromatic-press/plate-physics.js`; modify `test/experiments.test.js`.

**Interfaces:** Produce `clampOffset(value, limit)`, `plateTargets(offset)`, and `stepPlate(plate, target, options)`.

- [ ] Write tests proving offsets clamp, plate targets remain distinct, and spring steps converge.
- [ ] Run `node --test test/experiments.test.js` and confirm failure because the module is absent.
- [ ] Implement the minimal pure functions.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Isolated interaction and craft pass

**Files:** Create `experiments/chromatic-press/index.html` and `experiments/chromatic-press/chromatic-press.js`; modify `experiments/experiment.css` and `test/site.test.js`.

**Interfaces:** Consume the plate-physics exports; expose `#pressCanvas`, `#pressToggle`, `#pressReset`, and `#pressStatus`.

- [ ] Write a page contract test for fixed layout, canvas, direct manipulation, keyboard control, status, and reduced motion.
- [ ] Run `node --test test/site.test.js` and confirm failure because the page is absent.
- [ ] Build responsive poster rendering, pointer capture, keyboard controls, authored spring motion, register/reset controls, focus states, and reduced-motion behavior.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Critique and gallery integration

**Files:** Modify `src/experiments.js`, `styles.css`, `index.html`, `test/experiments.test.js`, and `test/site.test.js`.

**Interfaces:** Add slug `chromatic-press`, date `2026-07-15`, route `./experiments/chromatic-press/`, and preview `press`.

- [ ] Run the critique gate against the isolated page and improve its weakest visible detail.
- [ ] Write failing gallery count, metadata, index-copy, and preview-style assertions.
- [ ] Run `npm test` and confirm the new expectations fail.
- [ ] Add gallery metadata, fallback copy, and a custom CMYK preview.
- [ ] Run `npm test`; then inspect desktop, mobile, and reduced-motion views with Playwright and capture the final frame.
