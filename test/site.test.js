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
  assert.match(html, /id="tagRail"/);
  assert.doesNotMatch(html, /id="galleryCount"/);
  assert.match(html, /Always Cooking/);
  assert.doesNotMatch(html, /Ongoing Accession/);
  assert.doesNotMatch(html, /class="header-note"/);
  assert.doesNotMatch(html, /class="cook-loop"/);
  assert.doesNotMatch(html, /class="cook-pan"/);
  assert.doesNotMatch(html, /class="cook-flame"/);
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
  assert.match(html, /src="\.\/src\/app\.js\?v=20260721-2"/);
});

test('every page exposes the persistent Archive and Arcade theme switch', async () => {
  const pagePaths = [
    'index.html',
    ...experiments.map((experiment) => `experiments/${experiment.slug}/index.html`),
  ];

  for (const pagePath of pagePaths) {
    const html = await readFile(pagePath, 'utf8');
    const initializerIndex = html.indexOf('always-cooking-theme');
    const stylesheetIndex = html.indexOf('rel="stylesheet"');

    assert.notEqual(initializerIndex, -1, `${pagePath} initializes the saved theme`);
    assert.ok(initializerIndex < stylesheetIndex, `${pagePath} initializes before CSS`);
    assert.match(html, /class="theme-toggle"/);
    assert.match(html, /data-theme-toggle/);
    assert.match(html, /role="switch"/);
    assert.match(html, /aria-checked="false"/);
    assert.match(html, />Archive</);
    assert.match(html, />Arcade</);
    assert.doesNotMatch(html, />Studio Archive</);
    assert.doesNotMatch(html, />Dossier</);

    if (pagePath === 'index.html') {
      assert.match(html, /src="\.\/src\/theme\.js"/);
    } else {
      assert.match(html, /src="\.\.\/\.\.\/src\/theme\.js"/);
    }
  }
});

test('gallery and detail navigation request the current themed shell', async () => {
  const homepage = await readFile('index.html', 'utf8');

  for (const experiment of experiments) {
    assert.match(experiment.href, /\?v=20260721$/);
    assert.match(
      homepage,
      new RegExp(`href="\\.\\/experiments\\/${experiment.slug}\\/\\?v=20260721"`),
    );

    const detail = await readFile(`experiments/${experiment.slug}/index.html`, 'utf8');
    assert.match(detail, /href="\.\.\/\.\.\/\?v=20260721"/);
  }
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

  assert.match(app, /from '\.\/experiments\.js\?v=20260721-2'/);
  assert.match(app, /function renderGallery/);
  assert.match(app, /searchExperiments/);
  assert.doesNotMatch(app, /createFilterButton/);
  assert.doesNotMatch(app, /className = 'tags'/);
  assert.doesNotMatch(app, /galleryCount/);
  assert.match(app, /href/);
});

test('styles define a responsive visual gallery', async () => {
  const css = await readFile('styles.css', 'utf8');

  assert.match(css, /--bg: #5a4698/);
  assert.match(css, /--surface: #f3e4ff/);
  assert.match(css, /--ink: #261638/);
  assert.match(css, /--on-purple: #fff3d6/);
  assert.match(css, /--accent-ink: #ff9f1c/);
  assert.match(css, /repeating-linear-gradient\(90deg/);
  assert.match(css, /repeating-linear-gradient\(0deg/);
  assert.match(css, /\.toolbar\s*{[^}]*display: grid;/s);
  assert.doesNotMatch(css, /\.cook-loop\s*{/);
  assert.doesNotMatch(css, /@keyframes pan-toss/);
  assert.doesNotMatch(css, /@keyframes toss-arc/);
  assert.doesNotMatch(css, /@keyframes flame-pulse/);
  assert.match(css, /ArcadeClassic V1/);
  assert.match(css, /Nippo/);
  assert.match(css, /h1\s*{[^}]*font-family: var\(--serif\);[^}]*line-height: 0\.82;/s);
  assert.match(css, /\.folio h2\s*{[^}]*font-family: var\(--sans\);[^}]*line-height: 1\.08;/s);
  assert.match(css, /\.brand-mark\s*{[^}]*border-radius: 2px;[^}]*box-shadow: 4px 4px 0 var\(--panel\);[^}]*font-family: var\(--sans\);/s);
  assert.doesNotMatch(css, /\.header-note\s*{/);
  assert.match(css, /\.folio-number\s*{[^}]*font-family: var\(--sans\);/s);
  assert.match(css, /\.search-control\s*{[^}]*width: 100%;/s);
  assert.match(css, /\.search-control input\s*{[^}]*border: 3px solid var\(--panel\);[^}]*border-radius: 0;[^}]*box-shadow:[^}]*inset 3px 3px 0/s);
  assert.match(css, /\.tag-chip\s*{[^}]*border: 2px solid[^}]*border-radius: 0;/s);
  assert.match(css, /\.folio\s*{[^}]*border: 3px solid var\(--panel\);[^}]*border-radius: 0;[^}]*box-shadow: 6px 6px 0 var\(--panel\);/s);
  assert.match(css, /\.preview\s*{[^}]*border: 2px solid[^}]*border-radius: 0;/s);
  assert.match(css, /\.folio-body\s*{[^}]*border-top: 2px solid var\(--panel\);/s);
  assert.match(css, /\.date\s*{[^}]*background: var\(--panel\);[^}]*color: var\(--on-purple\);/s);
  assert.match(css, /\.folio-stamp\s*{[^}]*background: var\(--accent-ink\);[^}]*color: var\(--ink\);/s);
  assert.match(css, /\.gallery/);
  assert.match(css, /grid-template-columns: repeat\(auto-fill, minmax\(min\(100%, 270px\), 270px\)\)/);
  assert.doesNotMatch(css, /grid-template-columns: repeat\(auto-fit, minmax\(min\(100%, 270px\), 1fr\)\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /data-preview="crease"/);
  assert.match(css, /data-preview="contour"/);
  assert.match(css, /data-preview="press"/);
  assert.match(css, /data-preview="slit"/);
  assert.match(css, /data-preview="signal"/);
  assert.match(css, /data-preview="lenticular"/);
});

test('homepage styles include the cream Archive theme and shared switch', async () => {
  const css = await readFile('styles.css', 'utf8');

  assert.match(css, /family=Gabarito/);
  assert.match(css, /family=Newsreader/);
  assert.match(css, /\.theme-toggle\s*{/);
  assert.match(css, /\.theme-toggle-track\s*{/);
  assert.match(css, /\[data-theme="archive"\]\s*{/);
  assert.match(css, /\[data-theme="archive"\]\s*{[^}]*--bg: #f2ead9;[^}]*--surface: #fbf6e9;[^}]*--ink: #241d14;/s);
  assert.match(css, /\[data-theme="archive"\]\s*{[^}]*--serif: "Newsreader"[^}]*--sans: "Gabarito"/s);
  assert.match(css, /\[data-theme="archive"\] body\s*{[^}]*radial-gradient\(circle at top left/s);
  assert.match(css, /\[data-theme="archive"\] \.brand-mark\s*{[^}]*border-radius: 50%;[^}]*box-shadow: none;/s);
  assert.match(css, /\[data-theme="archive"\] \.folio\s*{[^}]*border: 1px solid var\(--line\);[^}]*box-shadow: var\(--shadow\);/s);
  assert.match(css, /\[data-theme="archive"\] h1\s*{[^}]*line-height: 0\.98;/s);
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

test('experiment detail styles use the shared purple retro layout', async () => {
  const css = await readFile('experiments/experiment.css', 'utf8');

  assert.match(css, /--bg: #5a4698/);
  assert.match(css, /--surface: #f3e4ff/);
  assert.match(css, /--ink: #261638/);
  assert.match(css, /--on-purple: #fff3d6/);
  assert.match(css, /--accent-ink: #ff9f1c/);
  assert.match(css, /repeating-linear-gradient\(90deg/);
  assert.match(css, /repeating-linear-gradient\(0deg/);
  assert.match(css, /ArcadeClassic V1/);
  assert.match(css, /Nippo/);
  assert.match(css, /\.project-title-bar/);
  assert.match(css, /\.project-title-bar\s*{[^}]*grid-template-columns: minmax\(0, 1fr\) auto;[^}]*padding: 36px 0 40px;/s);
  assert.match(css, /h1\s*{[^}]*font-family: var\(--serif\);/s);
  assert.match(css, /\.back-link\s*{[^}]*grid-column: 1;[^}]*border: 2px solid var\(--panel\);[^}]*background: var\(--surface\);[^}]*font-family: var\(--sans\);/s);
  assert.match(css, /\.theme-toggle\s*{[^}]*grid-column: 2;[^}]*grid-row: 1;[^}]*justify-self: end;/s);
  assert.match(css, /\.back-link\s*{[^}]*border-radius: 0;/s);
  assert.match(css, /\.project-title-bar::after\s*{[^}]*border-radius: 0;/s);
  assert.match(css, /\.experiment-stage-wrap::before\s*{[^}]*font-family: var\(--sans\);/s);
  assert.doesNotMatch(css, /content: "Dossier"/);
  assert.match(css, /\.project-title-bar::after\s*{[^}]*position: static;[^}]*grid-column: 2;[^}]*justify-self: end;[^}]*content: "Filed";[^}]*transform: none;/s);
  assert.match(css, /\.project-title-row\s*{[^}]*display: grid;[^}]*grid-template-columns: minmax\(0, 1fr\) auto;/s);
  assert.doesNotMatch(css, /\.project-title-row\s*{[^}]*padding-right:/s);
  assert.match(css, /\.project-date\s*{[^}]*justify-self: end;[^}]*text-align: right;/s);
  assert.match(css, /\.experiment-stage-wrap\s*{[^}]*background: var\(--surface\);/s);
  assert.match(css, /\.experiment-stage-wrap\s*{[^}]*border-radius: 0;/s);
  assert.doesNotMatch(css, /\.experiment-stage-wrap\s*{[^}]*repeating-linear-gradient/s);
  assert.match(css, /content: "Live dossier"/);
  assert.doesNotMatch(css, /\.loom-page\s*{[^}]*radial-gradient/s);
  assert.doesNotMatch(css, /\.burst-page\s*{[^}]*radial-gradient/s);
});

test('experiment detail styles include the cream Archive shell', async () => {
  const css = await readFile('experiments/experiment.css', 'utf8');

  assert.match(css, /family=Gabarito/);
  assert.match(css, /family=Newsreader/);
  assert.match(css, /\.theme-toggle\s*{/);
  assert.match(css, /\[data-theme="archive"\]\s*{[^}]*--bg: #f2ead9;[^}]*--surface: #fbf6e9;[^}]*--ink: #241d14;/s);
  assert.match(css, /\[data-theme="archive"\] \.project-title-bar\s*{[^}]*border-bottom: 1px solid var\(--line\);/s);
  assert.match(css, /\[data-theme="archive"\] \.back-link\s*{[^}]*border: 1px solid var\(--line\);[^}]*box-shadow: none;/s);
  assert.match(css, /\[data-theme="archive"\] h1\s*{[^}]*font-family: var\(--serif\);/s);
  assert.match(css, /\[data-theme="archive"\] \.experiment-stage-wrap\s*{[^}]*border: 1px solid var\(--line\);[^}]*box-shadow: var\(--shadow\);/s);
});
