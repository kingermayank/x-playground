# Experiment Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static minimal visual gallery for daily experiments with date and tag metadata.

**Architecture:** The site uses `index.html` for structure, `styles.css` for the visual system, and JavaScript modules for data plus rendering/filter helpers. Experiments are stored in `src/experiments.js` so new entries can be added without editing layout code.

**Tech Stack:** Plain HTML, CSS, JavaScript modules, Node built-in test runner.

## Global Constraints

- The first version must be a minimal visual gallery.
- Every experiment card must include a date and tags.
- The gallery must be easy to extend with daily experiments.
- No external runtime dependencies are required.

---

### Task 1: Content Model And Filtering

**Files:**
- Create: `package.json`
- Create: `src/experiments.js`
- Create: `test/experiments.test.js`

**Interfaces:**
- Produces: `experiments`, `getAllTags(items)`, `filterExperiments(items, tag)`, and `formatDisplayDate(dateString)`.

- [x] **Step 1: Write failing tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  experiments,
  filterExperiments,
  formatDisplayDate,
  getAllTags,
} from '../src/experiments.js';

test('experiments include required gallery metadata', () => {
  assert.ok(experiments.length >= 6);
  for (const item of experiments) {
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(item.title.length > 0);
    assert.ok(item.summary.length > 0);
    assert.ok(item.tags.length > 0);
  }
});

test('getAllTags returns unique alphabetized tags', () => {
  assert.deepEqual(getAllTags([
    { tags: ['motion', 'canvas'] },
    { tags: ['canvas', 'sound'] },
  ]), ['canvas', 'motion', 'sound']);
});

test('filterExperiments returns all items for the all tag', () => {
  assert.equal(filterExperiments(experiments, 'all').length, experiments.length);
});

test('filterExperiments returns matching tag items only', () => {
  const filtered = filterExperiments(experiments, 'motion');
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((item) => item.tags.includes('motion')));
});

test('formatDisplayDate formats dates compactly', () => {
  assert.equal(formatDisplayDate('2026-07-07'), 'Jul 7, 2026');
});
```

- [x] **Step 2: Run tests to verify failure**

Run: `npm test`
Expected: FAIL because `src/experiments.js` does not exist.

- [x] **Step 3: Implement the model**

Create `src/experiments.js` with sample experiment entries and helper functions.

- [x] **Step 4: Run tests to verify pass**

Run: `npm test`
Expected: PASS.

### Task 2: Static Gallery Interface

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/app.js`
- Create: `test/site.test.js`

**Interfaces:**
- Consumes: `experiments`, `getAllTags`, `filterExperiments`, and `formatDisplayDate`.
- Produces: A keyboard-accessible gallery with tag filters and count text.

- [x] **Step 1: Write failing structure tests**

Check that `index.html`, `styles.css`, and `src/app.js` include the required hooks and imports.

- [x] **Step 2: Run tests to verify failure**

Run: `npm test`
Expected: FAIL because the site files do not exist.

- [x] **Step 3: Implement static UI**

Create the page shell, visual styling, and browser rendering script.

- [x] **Step 4: Run tests to verify pass**

Run: `npm test`
Expected: PASS.

### Task 3: Manual Verification

**Files:**
- No new files.

**Interfaces:**
- Consumes: the completed static site.
- Produces: a working local preview.

- [x] **Step 1: Start local server**

Run: `python3 -m http.server 4173`
Expected: Site available at `http://localhost:4173`.

- [x] **Step 2: Inspect first screen**

Open the page and verify the title, filters, cards, dates, and tags render without layout overlap.

