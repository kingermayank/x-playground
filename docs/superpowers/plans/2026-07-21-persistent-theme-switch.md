# Persistent Theme Switch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent Archive/Arcade theme switch to the homepage and every experiment detail page.

**Architecture:** A small dependency-free ES module owns validation, persistence, DOM state, and toggle events. An inline head initializer sets `data-theme` before CSS paints. Existing Arcade CSS remains the base and scoped Archive overrides reproduce the cream Newsreader/Gabarito direction without duplicating page structure.

**Tech Stack:** Static HTML, CSS custom properties, browser ES modules, Node test runner, Playwright.

## Global Constraints

- Default to Archive when no valid saved preference exists.
- Persist the selected theme in `localStorage` and share it across all pages.
- Keep Always Cooking as the product name in both themes.
- Do not restore Studio Archive, Est. 2026, Ongoing Accession, or Dossier.
- Do not alter experiment canvas behavior or internal controls.
- Preserve accessible keyboard and screen-reader operation.

---

### Task 1: Theme State Controller

**Files:**
- Create: `src/theme.js`
- Create: `test/theme.test.js`

**Interfaces:**
- Produces: `THEMES`, `DEFAULT_THEME`, `normalizeTheme(value)`, `readStoredTheme(storage)`, `writeStoredTheme(storage, theme)`, `applyTheme(root, theme)`, and `initializeThemeSwitches(document, storage)`.

- [ ] **Step 1: Write failing unit tests**

Test Archive fallback, valid Arcade storage, invalid storage, persistence failure tolerance, root dataset updates, and switch `aria-checked`/label synchronization using small DOM-like fakes.

- [ ] **Step 2: Verify the tests fail**

Run: `node --test test/theme.test.js`

Expected: FAIL because `src/theme.js` does not exist.

- [ ] **Step 3: Implement the controller**

Use the storage key `always-cooking-theme`. Treat the switch as checked when Arcade is active. On click, alternate Archive and Arcade, update every `[data-theme-toggle]` control, and persist without allowing storage exceptions to break interaction.

- [ ] **Step 4: Verify the controller tests pass**

Run: `node --test test/theme.test.js`

Expected: all theme tests pass.

### Task 2: Shared Page Controls

**Files:**
- Modify: `index.html`
- Modify: `experiments/*/index.html`
- Modify: `test/site.test.js`

**Interfaces:**
- Consumes: `src/theme.js` and the `always-cooking-theme` storage key.
- Produces: one `.theme-toggle[data-theme-toggle]` button per page and pre-paint `data-theme` initialization.

- [ ] **Step 1: Add failing page-contract tests**

Assert that the homepage and all experiment pages include `data-theme-toggle`, `role="switch"`, an inline initializer before their stylesheet, and the shared theme module. Continue asserting that forbidden archive labels are absent.

- [ ] **Step 2: Verify the contract fails**

Run: `node --test test/site.test.js`

Expected: FAIL because the controls and theme scripts are absent.

- [ ] **Step 3: Add the controls and scripts**

Place the switch at the homepage header's right edge and at the detail title bar's top right. Use visible `Archive` and `Arcade` labels, `role="switch"`, `aria-checked="false"`, and `aria-label="Use Arcade theme"`. Import the shared controller as a module after page content.

- [ ] **Step 4: Verify page contracts pass**

Run: `node --test test/site.test.js`

Expected: all site tests pass.

### Task 3: Archive Visual Overrides

**Files:**
- Modify: `styles.css`
- Modify: `experiments/experiment.css`
- Modify: `test/site.test.js`

**Interfaces:**
- Consumes: `html[data-theme="archive"]` and current Arcade component rules.
- Produces: Archive-specific tokens and component overrides while preserving shared dimensions and layout.

- [ ] **Step 1: Add failing CSS assertions**

Assert both stylesheets import Newsreader/Gabarito and contain Archive-scoped cream tokens, typography, paper background, fine borders, soft shadows, and switch styling.

- [ ] **Step 2: Verify CSS assertions fail**

Run: `node --test test/site.test.js`

Expected: FAIL because Archive overrides do not exist.

- [ ] **Step 3: Implement Archive overrides**

Recover the palette and type tokens from commit `1689498`. Override the body, header, switch, hero/detail headings, card chrome, search field, chips, metadata, stage wrapper, Back button, and Filed treatment under `[data-theme="archive"]`. Keep experiment media surfaces untouched.

- [ ] **Step 4: Run the complete suite**

Run: `npm test`

Expected: 42 existing tests plus the new theme tests pass.

### Task 4: Browser Verification

**Files:**
- Modify only files required by visual defects found during verification.

**Interfaces:**
- Consumes: live site at `http://127.0.0.1:8123/`.
- Produces: visually verified Archive and Arcade pages at desktop and mobile widths.

- [ ] **Step 1: Capture both homepage themes**

Use Playwright at `1440x1000` and `390x844`, switching themes through the visible control.

- [ ] **Step 2: Capture both detail-page themes**

Use Signal Descent to verify switch placement, metadata alignment, and that the experiment surface remains unchanged.

- [ ] **Step 3: Verify persistence and no flash**

Select Arcade, reload, navigate to Signal Descent, and confirm `document.documentElement.dataset.theme === "arcade"` before and after navigation.

- [ ] **Step 4: Run final checks**

Run: `npm test` and `git diff --check`.

Expected: all tests pass and no whitespace errors are reported.
