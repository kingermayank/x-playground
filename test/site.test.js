import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { experiments } from '../src/experiments.js';

test('package exposes a simple local preview command', async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'));

  assert.equal(pkg.scripts.dev, 'python3 -m http.server 8123 --bind 127.0.0.1');
  assert.equal(pkg.scripts.start, 'npm run dev');
});

test('index page contains gallery landmarks and app hooks', async () => {
  const html = await readFile('index.html', 'utf8');

  assert.match(html, /<main/);
  assert.match(html, /id="experimentSearch"/);
  assert.doesNotMatch(html, /id="tagFilters"/);
  assert.match(html, /id="gallery"/);
  assert.match(html, /id="galleryCount"/);
  assert.match(html, /Studio Archive/);
  assert.doesNotMatch(html, /Catalog, Vol/);
  assert.doesNotMatch(html, /Cataloguing Method/);
  assert.doesNotMatch(html, /Recently Accessioned/);
  assert.doesNotMatch(html, /id="ledgerHoldings"/);
  assert.match(html, /Config Signal Loom/);
  assert.match(html, /Civic Burst Field/);
  assert.match(html, /Command Gravity/);
  assert.match(html, /Crease Memory/);
  assert.match(html, /Tension Type/);
  assert.match(html, /Contour Chorus/);
  assert.match(html, /Chromatic Press/);
  assert.match(html, /Temporal Slit/);
  assert.match(html, /Signal Descent/);
  assert.match(html, /Lenticular Index/);
  assert.match(html, /src="\.\/src\/app\.js"/);
});

test('signal descent exposes an accessible transmission scrubber', async () => {
  const html = await readFile('experiments/signal-descent/index.html', 'utf8');
  const js = await readFile('experiments/signal-descent/signal-descent.js', 'utf8');

  assert.match(html, /<title>Signal Descent/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /id="signalCanvas"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="signalReset"/);
  assert.match(html, /id="signalStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /pointerdown/);
  assert.match(js, /pointermove/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /signalStrength/);
  assert.match(js, /scanShear/);
});

test('temporal slit exposes an accessible time-scrubbing interaction', async () => {
  const html = await readFile('experiments/temporal-slit/index.html', 'utf8');
  const js = await readFile('experiments/temporal-slit/temporal-slit.js', 'utf8');

  assert.match(html, /<title>Temporal Slit/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /id="slitCanvas"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="slitReset"/);
  assert.match(html, /id="slitStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /pointerdown/);
  assert.match(js, /pointermove/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /historyIndexForSlice/);
  assert.match(js, /sliceShear/);
});

test('tension type page exposes an elastic typographic interaction', async () => {
  const html = await readFile('experiments/tension-type/index.html', 'utf8');
  const js = await readFile('experiments/tension-type/tension-type.js', 'utf8');

  assert.match(html, /<title>Tension Type/);
  assert.match(html, /id="tensionCanvas"/);
  assert.match(html, /id="forceControl"/);
  assert.match(html, /id="tensionStatus"/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(js, /pointerdown/);
  assert.match(js, /pointermove/);
  assert.match(js, /pointerup/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /spring/);
  assert.match(js, /velocity/);
  assert.match(js, /maxDisplacement/);
  assert.match(js, /Field returned to baseline/);
});

test('browser app imports experiment helpers and renders cards', async () => {
  const app = await readFile('src/app.js', 'utf8');

  assert.match(app, /from '\.\/experiments\.js'/);
  assert.match(app, /function renderGallery/);
  assert.match(app, /searchExperiments/);
  assert.doesNotMatch(app, /createFilterButton/);
  assert.doesNotMatch(app, /className = 'tags'/);
  assert.match(app, /href/);
  assert.match(app, /galleryCount/);
});

test('styles define a responsive visual gallery', async () => {
  const css = await readFile('styles.css', 'utf8');

  assert.match(css, /\.gallery/);
  assert.match(css, /grid-template-columns/);
  assert.match(css, /minmax/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /data-preview="crease"/);
  assert.match(css, /data-preview="contour"/);
  assert.match(css, /data-preview="press"/);
  assert.match(css, /data-preview="slit"/);
  assert.match(css, /data-preview="signal"/);
  assert.match(css, /data-preview="lenticular"/);
});

test('each real experiment has a preview page with an interactive surface', async () => {
  for (const experiment of experiments) {
    const html = await readFile(`experiments/${experiment.slug}/index.html`, 'utf8');

    assert.match(html, new RegExp(`<title>${experiment.title}`));
    assert.match(html, /(<canvas|class="lenticular-artifact")/);
    assert.match(html, /Back to Experiments/);
    assert.match(html, /class="project-title-bar"/);
    assert.match(html, /class="project-title-row"/);
    assert.match(html, /class="project-date"/);
    assert.match(html, /class="project-description"/);
    assert.match(html, /class="experiment-stage-wrap"/);
    assert.match(html, /type="module"/);
  }
});

test('lenticular index exposes an accessible optical viewing interaction', async () => {
  const html = await readFile('experiments/lenticular-index/index.html', 'utf8');
  const js = await readFile('experiments/lenticular-index/lenticular-index.js', 'utf8');

  assert.match(html, /<title>Lenticular Index/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /class="lenticular-artifact"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="lenticularLock"/);
  assert.match(html, /id="lenticularReset"/);
  assert.match(html, /id="lenticularStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /pointermove/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /angleForPosition/);
  assert.match(js, /stepAngle/);
});

test('command gravity page includes search, keyboard, and visual-field hooks', async () => {
  const html = await readFile('experiments/command-gravity/index.html', 'utf8');
  const js = await readFile('experiments/command-gravity/command-gravity.js', 'utf8');

  assert.match(html, /id="commandSearch"/);
  assert.match(html, /id="commandCanvas"/);
  assert.match(html, /id="gravityNodes"/);
  assert.match(html, /class="command-shell"/);
  assert.match(html, /class="gravity-chip"/);
  assert.match(html, /id="gravityStatus"/);
  assert.match(html, /Drag nodes/);
  assert.match(js, /keydown/);
  assert.match(js, /pointerdown/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /dragNode/);
  assert.match(js, /nearestNode/);
  assert.match(js, /moveActiveNodeTo/);
  assert.match(js, /renderNodeOverlay/);
  assert.match(js, /gravity-node/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
});

test('crease memory exposes a direct, accessible fold interaction', async () => {
  const html = await readFile('experiments/crease-memory/index.html', 'utf8');
  const js = await readFile('experiments/crease-memory/crease-memory.js', 'utf8');

  assert.match(html, /<title>Crease Memory/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="project-title-row"/);
  assert.match(html, /class="project-date"/);
  assert.match(html, /class="project-description"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /id="creaseCanvas"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="creaseReset"/);
  assert.match(html, /id="creaseStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /type="module"/);
  assert.match(js, /pointerdown/);
  assert.match(js, /pointermove/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /ArrowRight/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /nearestFoldSnap/);
  assert.match(js, /getFoldGeometry/);
});

test('contour chorus exposes an accessible conducted field', async () => {
  const html = await readFile('experiments/contour-chorus/index.html', 'utf8');
  const js = await readFile('experiments/contour-chorus/contour-chorus.js', 'utf8');

  assert.match(html, /<title>Contour Chorus/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /id="contourCanvas"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="contourReset"/);
  assert.match(html, /id="contourStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /pointermove/);
  assert.match(js, /pointerdown/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /sampleField/);
});

test('chromatic press exposes an accessible plate registration interaction', async () => {
  const html = await readFile('experiments/chromatic-press/index.html', 'utf8');
  const js = await readFile('experiments/chromatic-press/chromatic-press.js', 'utf8');

  assert.match(html, /<title>Chromatic Press/);
  assert.match(html, /class="project-title-bar"/);
  assert.match(html, /class="experiment-stage-wrap"/);
  assert.match(html, /id="pressCanvas"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /id="pressToggle"/);
  assert.match(html, /id="pressReset"/);
  assert.match(html, /id="pressStatus"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(js, /pointerdown/);
  assert.match(js, /pointermove/);
  assert.match(js, /pointerup/);
  assert.match(js, /setPointerCapture/);
  assert.match(js, /keydown/);
  assert.match(js, /ArrowLeft/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /prefers-reduced-motion/);
  assert.match(js, /plateTargets/);
  assert.match(js, /stepPlate/);
});

test('config signal loom exposes visible recombination controls', async () => {
  const html = await readFile('experiments/config-signal-loom/index.html', 'utf8');
  const js = await readFile('experiments/config-signal-loom/loom.js', 'utf8');

  assert.match(html, /id="loomNodes"/);
  assert.match(html, /id="loomStatus"/);
  assert.match(html, /id="briefRecipe"/);
  assert.match(js, /renderSignalNodes/);
  assert.match(js, /closestPair/);
  assert.match(js, /composeBrief/);
  assert.match(js, /setPointerCapture/);
});

test('civic burst field exposes material telemetry and richer burst controls', async () => {
  const html = await readFile('experiments/civic-burst-field/index.html', 'utf8');
  const js = await readFile('experiments/civic-burst-field/burst.js', 'utf8');

  assert.match(html, /id="burstStatus"/);
  assert.match(html, /id="burstCount"/);
  assert.match(html, /id="intensityControl"/);
  assert.match(js, /shockwaves/);
  assert.match(js, /trails/);
  assert.match(js, /setIntensity/);
  assert.match(js, /renderTelemetry/);
});

test('command gravity recorder avoids server binding by default', async () => {
  const script = await readFile('scripts/record-command-gravity.mjs', 'utf8');

  assert.match(script, /pathToFileURL/);
  assert.match(script, /RECORD_COMMAND_GRAVITY_SERVER/);
  assert.doesNotMatch(script, /executablePath:\s*chromePath/);
});

test('experiment detail styles use an archival fixed light layout', async () => {
  const css = await readFile('experiments/experiment.css', 'utf8');

  assert.match(css, /--bg: #f2ead9/);
  assert.match(css, /--serif:/);
  assert.match(css, /\.project-title-bar/);
  assert.match(css, /content: "Dossier"/);
  assert.match(css, /content: "Filed"/);
  assert.match(css, /\.project-date/);
  assert.match(css, /\.experiment-stage-wrap/);
  assert.match(css, /content: "Live dossier"/);
  assert.doesNotMatch(css, /\.loom-page\s*{[^}]*radial-gradient/s);
  assert.doesNotMatch(css, /\.burst-page\s*{[^}]*radial-gradient/s);
});
