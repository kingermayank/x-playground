# Crease Memory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, recordable paper-fold interaction and add it to the experiment gallery only after critique.

**Architecture:** Pure geometry functions define the fold and snap behavior. A canvas module renders the two-sided poster and translates pointer or keyboard input into fold state, while the existing gallery remains data-driven.

**Tech Stack:** HTML, CSS, Canvas 2D, pointer events, ES modules, Node test runner, Playwright for browser inspection.

## Global Constraints

- Keep the detail page inside the existing fixed playground layout.
- Use one direct-manipulation interaction, no external visual dependencies, and no Figma or Pencil.
- Support keyboard input, 44px controls, responsive sizing, and `prefers-reduced-motion`.
- Add the gallery entry only after the isolated interaction passes the critique gate.

---

### Task 1: Fold geometry contract

**Files:**
- Create: `experiments/crease-memory/fold-geometry.js`
- Modify: `test/experiments.test.js`

**Interfaces:**
- Produces: `clampFold(value)`, `nearestFoldSnap(value)`, and `getFoldGeometry(width, height, progress)`.

- [ ] Write tests proving clamping, deterministic snap points, and bounded responsive geometry.
- [ ] Run `node --test test/experiments.test.js` and confirm failure because the module is absent.
- [ ] Implement only the geometry needed by the tests.
- [ ] Re-run the focused test and confirm it passes.

### Task 2: Isolated interaction

**Files:**
- Create: `experiments/crease-memory/index.html`
- Create: `experiments/crease-memory/crease-memory.js`
- Modify: `experiments/experiment.css`
- Modify: `test/site.test.js`

**Interfaces:**
- Consumes: fold geometry functions from Task 1.
- Produces: `#creaseCanvas`, `#creaseReset`, `#creaseStatus`, pointer capture, arrow/Home keyboard input, spring settling, and reduced-motion behavior.

- [ ] Write structural tests for fixed-shell markup, canvas controls, pointer capture, keyboard input, animation, and reduced motion.
- [ ] Run `node --test test/site.test.js` and confirm failure because the page is absent.
- [ ] Build the canvas poster, direct manipulation, snap motion, reset control, status copy, and responsive styles.
- [ ] Re-run the focused test and confirm it passes.

### Task 3: Critique and gallery integration

**Files:**
- Modify: `src/experiments.js`
- Modify: `styles.css`
- Modify: `index.html`
- Modify: `test/experiments.test.js`
- Modify: `test/site.test.js`

**Interfaces:**
- Produces: gallery metadata with slug `crease-memory`, route, date, tags, summary, concept, accent, and preview style.

- [ ] Run the critique checklist against the isolated first screen and interaction.
- [ ] Improve the weakest visual detail before integration.
- [ ] Write failing gallery metadata and preview tests.
- [ ] Add the experiment metadata and authored gallery preview.
- [ ] Re-run the focused tests and confirm they pass.

### Task 4: Verification

**Files:**
- Verify all changed files without adding new product scope.

**Interfaces:**
- Consumes: the complete experiment and gallery.
- Produces: fresh test, browser, and console evidence for the daily report.

- [ ] Run `npm test` and confirm zero failures.
- [ ] Start `npm run dev` and inspect the gallery and Crease Memory route in a real browser.
- [ ] Exercise pointer drag, reset, keyboard movement, reduced viewport layout, and check for console errors.
- [ ] Record critique results and verification evidence in automation memory.

