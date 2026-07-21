# Signal Descent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Apollo-inspired transmission surface whose draggable scan beam resolves noisy lunar relief into a crisp signal lock.

**Architecture:** Keep deterministic scan calculations in `signal-math.js`, rendering and input orchestration in `signal-descent.js`, and layout in the shared fixed experiment shell. Add gallery metadata only after the isolated page passes the critique gate.

**Tech Stack:** HTML, CSS, Canvas 2D, vanilla JavaScript modules, Node test runner, Playwright.

## Global Constraints

- Preserve the fixed playground detail layout.
- Support pointer, touch, keyboard, and reduced motion.
- Add no runtime dependencies.
- Use date `2026-07-20` and slug `signal-descent`.

---

### Task 1: Scan model and isolated interaction

**Files:**
- Create: `experiments/signal-descent/signal-math.js`
- Create: `experiments/signal-descent/signal-descent.js`
- Create: `experiments/signal-descent/index.html`
- Modify: `experiments/experiment.css`
- Test: `test/experiments.test.js`
- Test: `test/site.test.js`

**Interfaces:**
- Produces: `clampBeam(value)`, `signalStrength(beam, point)`, `scanShear(velocity, strength)`, and the accessible canvas interaction.

- [ ] Write tests asserting beam bounds, monotonic signal resolution, bounded shear, required page hooks, pointer/keyboard input, and reduced-motion handling.
- [ ] Run `node --test test/experiments.test.js test/site.test.js` and confirm failure because Signal Descent does not exist.
- [ ] Implement the pure math module, page shell, responsive canvas renderer, input controls, lock pulse, and reduced-motion branch.
- [ ] Run `node --test test/experiments.test.js test/site.test.js` and confirm the isolated interaction tests pass.

### Task 2: Critique and gallery integration

**Files:**
- Modify: `src/experiments.js`
- Modify: `styles.css`
- Modify: `index.html`
- Test: `test/experiments.test.js`
- Test: `test/site.test.js`

**Interfaces:**
- Consumes: the completed `./experiments/signal-descent/` route.
- Produces: a `signal-descent` gallery record and `data-preview="signal"` card art.

- [ ] Inspect desktop and mobile renders; record critique answers and improve the weakest visible detail before integration.
- [ ] Add failing gallery tests for nine records, Signal Descent metadata, static fallback copy, and preview styling.
- [ ] Run `node --test` and confirm the new gallery assertions fail.
- [ ] Add the metadata record, fallback title, and authored gallery preview.
- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run a local server and inspect desktop, mobile, keyboard interaction, reduced motion, and console output with Playwright.
