import test from 'node:test';
import assert from 'node:assert/strict';
import {
  experiments,
  filterExperiments,
  formatDisplayDate,
  searchExperiments,
} from '../src/experiments.js';
import {
  clampFold,
  getFoldGeometry,
  nearestFoldSnap,
} from '../experiments/crease-memory/fold-geometry.js';
import {
  clampEnergy,
  influenceAt,
  sampleField,
} from '../experiments/contour-chorus/contour-field.js';
import {
  clampOffset,
  plateTargets,
  stepPlate,
} from '../experiments/chromatic-press/plate-physics.js';
import {
  clampScan,
  historyIndexForSlice,
  sliceShear,
} from '../experiments/temporal-slit/temporal-buffer.js';
import {
  clampBeam,
  signalStrength,
  scanShear,
} from '../experiments/signal-descent/signal-math.js';
import {
  angleForPosition,
  clampPosition,
  faceForPosition,
  stepAngle,
} from '../experiments/lenticular-index/lenticular-math.js';

test('lenticular index maps bounded position into an authored viewing angle', () => {
  assert.equal(clampPosition(-1), 0);
  assert.equal(clampPosition(2), 1);
  assert.equal(clampPosition(0.42), 0.42);
  assert.equal(angleForPosition(0), -58);
  assert.equal(angleForPosition(0.5), 0);
  assert.equal(angleForPosition(1), 58);
});

test('lenticular index names stable faces and its spring remains finite', () => {
  assert.equal(faceForPosition(0.2), 'NEAR');
  assert.equal(faceForPosition(0.5), 'SHIFT');
  assert.equal(faceForPosition(0.8), 'FAR');

  let state = { value: -40, velocity: 0 };
  for (let index = 0; index < 80; index += 1) {
    state = stepAngle(state, 44);
  }
  assert.ok(Math.abs(state.value - 44) < 0.1);
  assert.ok(Number.isFinite(state.value));
  assert.ok(Number.isFinite(state.velocity));
});

test('signal descent bounds the beam and resolves points behind it', () => {
  assert.equal(clampBeam(-1), 0.06);
  assert.equal(clampBeam(2), 0.94);
  assert.equal(clampBeam(0.42), 0.42);
  assert.equal(signalStrength(0.2, 0.8), 0);
  assert.ok(signalStrength(0.8, 0.2) > signalStrength(0.5, 0.2));
  assert.equal(signalStrength(0.94, 0.06), 1);
});

test('signal descent shear responds to velocity and remains bounded', () => {
  assert.equal(scanShear(0, 0.5), 0);
  assert.ok(scanShear(80, 0.3) > scanShear(20, 0.3));
  assert.ok(Math.abs(scanShear(1000, 1)) <= 22);
  assert.ok(Math.abs(scanShear(-1000, 1)) <= 22);
});

test('temporal slit keeps the scan head bounded and maps slices into history', () => {
  assert.equal(clampScan(-0.2), 0.08);
  assert.equal(clampScan(1.4), 0.92);
  assert.equal(clampScan(0.44), 0.44);
  assert.equal(historyIndexForSlice(0, 8, 12), 0);
  assert.equal(historyIndexForSlice(7, 8, 12), 11);
});

test('temporal slit shear responds to velocity while remaining bounded', () => {
  assert.equal(sliceShear(0, 0.5), 0);
  assert.ok(sliceShear(18, 0.8) > sliceShear(18, 0.2));
  assert.ok(Math.abs(sliceShear(200, 1)) <= 28);
  assert.ok(Math.abs(sliceShear(-200, 1)) <= 28);
});

test('press offsets stay bounded and produce distinct plate targets', () => {
  assert.equal(clampOffset(-80, 36), -36);
  assert.equal(clampOffset(48, 36), 36);
  assert.equal(clampOffset(12, 36), 12);

  const targets = plateTargets({ x: 30, y: -18 });
  assert.deepEqual(Object.keys(targets), ['cyan', 'magenta', 'yellow', 'black']);
  assert.notDeepEqual(targets.cyan, targets.magenta);
  assert.deepEqual(targets.black, { x: 0, y: 0 });
});

test('plate spring converges toward its target without producing invalid values', () => {
  let plate = { x: 0, y: 0, vx: 0, vy: 0 };
  const target = { x: 24, y: -12 };

  for (let index = 0; index < 80; index += 1) {
    plate = stepPlate(plate, target, { stiffness: 0.12, damping: 0.76 });
  }

  assert.ok(Math.abs(plate.x - target.x) < 0.1);
  assert.ok(Math.abs(plate.y - target.y) < 0.1);
  assert.ok(Object.values(plate).every(Number.isFinite));
});

test('contour field stays bounded and falls off with distance', () => {
  const source = { x: 0, y: 0, energy: 1, radius: 120, phase: 0 };

  assert.equal(clampEnergy(-2), 0);
  assert.equal(clampEnergy(2), 1);
  assert.ok(influenceAt({ x: 10, y: 0 }, source) > influenceAt({ x: 90, y: 0 }, source));
  assert.equal(influenceAt({ x: 140, y: 0 }, source), 0);
});

test('contour sampling is deterministic and combines sources', () => {
  const sources = [
    { x: 20, y: 20, energy: 0.8, radius: 180, phase: 0.2 },
    { x: 80, y: 70, energy: 0.4, radius: 120, phase: 1.1 },
  ];
  const point = { x: 42, y: 38 };

  assert.equal(sampleField(point, sources, 1200), sampleField(point, sources, 1200));
  assert.ok(Number.isFinite(sampleField(point, sources, 1200)));
});

test('crease geometry clamps progress and chooses authored snap points', () => {
  assert.equal(clampFold(-1), 0.14);
  assert.equal(clampFold(2), 0.86);
  assert.equal(clampFold(0.5), 0.5);
  assert.equal(nearestFoldSnap(0.24), 0.22);
  assert.equal(nearestFoldSnap(0.44), 0.5);
  assert.equal(nearestFoldSnap(0.75), 0.78);
});

test('crease geometry stays bounded and scales with the poster', () => {
  const geometry = getFoldGeometry(900, 560, 0.5);

  assert.equal(geometry.progress, 0.5);
  assert.ok(geometry.topX > 0 && geometry.topX < 900);
  assert.ok(geometry.bottomX > geometry.topX);
  assert.ok(geometry.flapWidth >= 54 && geometry.flapWidth <= 150);
  assert.equal(geometry.posterWidth, 900);
  assert.equal(geometry.posterHeight, 560);
});

test('experiments include required gallery metadata', () => {
  assert.equal(experiments.length, 10);

  for (const item of experiments) {
    assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(item.href, /^\.\/experiments\/[a-z0-9-]+\/$/);
    assert.ok(item.slug.length > 0);
    assert.ok(item.title.length > 0);
    assert.ok(item.concept.length > 0);
    assert.ok(item.summary.length > 0);
    assert.ok(item.tags.length > 0);
  }
});

test('signal descent is included as a tactile broadcast interaction', () => {
  const signal = experiments.find((item) => item.slug === 'signal-descent');

  assert.ok(signal);
  assert.equal(signal.title, 'Signal Descent');
  assert.equal(signal.date, '2026-07-20');
  assert.ok(signal.tags.includes('canvas'));
  assert.ok(signal.tags.includes('interaction'));
  assert.equal(signal.preview, 'signal');
});

test('lenticular index is included as a CSS optical interaction', () => {
  const lenticular = experiments.find((item) => item.slug === 'lenticular-index');

  assert.ok(lenticular);
  assert.equal(lenticular.title, 'Lenticular Index');
  assert.equal(lenticular.date, '2026-07-21');
  assert.ok(lenticular.tags.includes('css'));
  assert.ok(lenticular.tags.includes('interaction'));
  assert.equal(lenticular.preview, 'lenticular');
});

test('temporal slit is included as a time-buffered canvas interaction', () => {
  const temporalSlit = experiments.find((item) => item.slug === 'temporal-slit');

  assert.ok(temporalSlit);
  assert.equal(temporalSlit.title, 'Temporal Slit');
  assert.equal(temporalSlit.date, '2026-07-16');
  assert.ok(temporalSlit.tags.includes('canvas'));
  assert.ok(temporalSlit.tags.includes('interaction'));
  assert.equal(temporalSlit.preview, 'slit');
});

test('chromatic press is included as a tactile CMYK registration study', () => {
  const press = experiments.find((item) => item.slug === 'chromatic-press');

  assert.ok(press);
  assert.equal(press.title, 'Chromatic Press');
  assert.equal(press.date, '2026-07-15');
  assert.ok(press.tags.includes('canvas'));
  assert.ok(press.tags.includes('interaction'));
  assert.equal(press.preview, 'press');
});

test('contour chorus is included as a conducted canvas field', () => {
  const contour = experiments.find((item) => item.slug === 'contour-chorus');

  assert.ok(contour);
  assert.equal(contour.title, 'Contour Chorus');
  assert.equal(contour.date, '2026-07-14');
  assert.ok(contour.tags.includes('canvas'));
  assert.ok(contour.tags.includes('interaction'));
  assert.equal(contour.preview, 'contour');
});

test('crease memory is included as a tactile canvas interaction', () => {
  const creaseMemory = experiments.find((item) => item.slug === 'crease-memory');

  assert.ok(creaseMemory);
  assert.equal(creaseMemory.title, 'Crease Memory');
  assert.equal(creaseMemory.date, '2026-07-13');
  assert.ok(creaseMemory.tags.includes('interaction'));
  assert.ok(creaseMemory.tags.includes('canvas'));
  assert.equal(creaseMemory.preview, 'crease');
});

test('tension type is included as a typography and canvas experiment', () => {
  const tensionType = experiments.find((item) => item.slug === 'tension-type');

  assert.ok(tensionType);
  assert.equal(tensionType.title, 'Tension Type');
  assert.equal(tensionType.date, '2026-07-11');
  assert.ok(tensionType.tags.includes('typography'));
  assert.ok(tensionType.tags.includes('canvas'));
});

test('command gravity is included as a motion-forward design experiment', () => {
  const commandGravity = experiments.find((item) => item.slug === 'command-gravity');

  assert.ok(commandGravity);
  assert.equal(commandGravity.title, 'Command Gravity');
  assert.ok(commandGravity.tags.includes('interaction'));
  assert.ok(commandGravity.tags.includes('motion'));
});

test('filterExperiments returns all items for the all tag', () => {
  assert.equal(filterExperiments(experiments, 'all').length, experiments.length);
});

test('filterExperiments returns matching tag items only', () => {
  const filtered = filterExperiments(experiments, 'motion');

  assert.ok(filtered.length > 0);
  assert.ok(filtered.every((item) => item.tags.includes('motion')));
});

test('searchExperiments matches title, summary, date, and hidden tags', () => {
  assert.deepEqual(searchExperiments(experiments, 'gravity').map((item) => item.slug), ['command-gravity']);
  assert.deepEqual(searchExperiments(experiments, 'fourth').map((item) => item.slug), ['civic-burst-field']);
  assert.deepEqual(searchExperiments(experiments, '2026-07-07').map((item) => item.slug), ['config-signal-loom']);
  assert.ok(searchExperiments(experiments, 'motion').length >= 2);
});

test('formatDisplayDate formats dates compactly', () => {
  assert.equal(formatDisplayDate('2026-07-07'), 'Jul 7, 2026');
});
