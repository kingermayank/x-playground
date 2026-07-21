import { clampBeam, scanShear, signalStrength } from './signal-math.js';

const canvas = document.querySelector('#signalCanvas');
const context = canvas.getContext('2d');
const resetButton = document.querySelector('#signalReset');
const readout = document.querySelector('#signalReadout');
const status = document.querySelector('#signalStatus');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const state = { beam: 0.22, target: 0.22, velocity: 0, dragging: false, locked: false, lockTime: 0, width: 0, height: 0 };
const craters = Array.from({ length: 30 }, (_, index) => ({
  x: ((index * 47) % 101) / 100,
  y: ((index * 71 + 13) % 97) / 100,
  r: 7 + ((index * 19) % 32),
}));

function resize() {
  const bounds = canvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  state.width = bounds.width;
  state.height = bounds.height;
  canvas.width = Math.round(bounds.width * scale);
  canvas.height = Math.round(bounds.height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function setTarget(clientX) {
  const bounds = canvas.getBoundingClientRect();
  const next = clampBeam((clientX - bounds.left) / bounds.width);
  state.velocity = (next - state.target) * bounds.width;
  state.target = next;
  state.locked = next > 0.88;
  if (state.locked) state.lockTime = performance.now();
}

function drawRelief() {
  const { width, height, beam, velocity } = state;
  context.fillStyle = '#090b09';
  context.fillRect(0, 0, width, height);
  const beamX = beam * width;

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#121612');
  sky.addColorStop(0.62, '#20241e');
  sky.addColorStop(1, '#77776b');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  for (const crater of craters) {
    const x = crater.x * width;
    const y = height * 0.52 + crater.y * height * 0.48;
    const strength = signalStrength(beam, crater.x);
    const shear = scanShear(velocity, strength);
    context.beginPath();
    context.ellipse(x + shear, y, crater.r * 1.7, crater.r * 0.42, -0.12, 0, Math.PI * 2);
    context.strokeStyle = `rgba(219, 220, 194, ${0.08 + strength * 0.36})`;
    context.lineWidth = 1 + strength;
    context.stroke();
    context.beginPath();
    context.ellipse(x + 3 + shear, y + 3, crater.r * 1.35, crater.r * 0.26, -0.12, 0, Math.PI * 2);
    context.strokeStyle = `rgba(3, 5, 3, ${0.35 + strength * 0.3})`;
    context.stroke();
  }

  context.save();
  context.globalAlpha = 0.1;
  context.strokeStyle = '#dce7c8';
  context.lineWidth = 1;
  context.textAlign = 'center';
  context.font = `800 ${Math.min(width * 0.135, 118)}px Arial Narrow, sans-serif`;
  context.setLineDash([3, 7]);
  context.strokeText('TRANQUILITY', width * 0.5 + scanShear(velocity, 0), height * 0.45);
  context.restore();

  context.save();
  context.beginPath();
  context.rect(0, 0, beamX, height);
  context.clip();
  context.fillStyle = '#dce7c8';
  context.textAlign = 'center';
  context.font = `800 ${Math.min(width * 0.135, 118)}px Arial Narrow, sans-serif`;
  context.fillText('TRANQUILITY', width * 0.5, height * 0.45);
  context.font = '700 12px ui-monospace, SFMono-Regular, monospace';
  context.letterSpacing = '3px';
  context.fillStyle = '#a8ff76';
  context.fillText('LAT 00°41′15″ N  ·  LONG 23°26′00″ E', width * 0.5, height * 0.52);
  context.restore();

  context.save();
  context.globalCompositeOperation = 'screen';
  const glow = context.createLinearGradient(beamX - 72, 0, beamX + 10, 0);
  glow.addColorStop(0, 'rgba(145,255,97,0)');
  glow.addColorStop(0.78, 'rgba(145,255,97,.16)');
  glow.addColorStop(1, 'rgba(214,255,189,.9)');
  context.fillStyle = glow;
  context.fillRect(beamX - 72, 0, 84, height);
  context.restore();

  context.strokeStyle = '#b8ff85';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(beamX, 0);
  context.lineTo(beamX, height);
  context.stroke();

  for (let y = 0; y < height; y += 5) {
    const noise = Math.sin(y * 9.73 + beam * 41) * (1 - beam) * 18;
    context.fillStyle = `rgba(190, 218, 177, ${0.025 + (1 - beam) * 0.045})`;
    context.fillRect(0, y, width, 1);
    if (y % 25 === 0 && beam < 0.8) context.fillRect(beamX + noise, y, width - beamX, 2);
  }

  const elapsed = performance.now() - state.lockTime;
  if (state.locked && elapsed < 700 && !reducedMotion.matches) {
    const pulse = Math.sin((elapsed / 700) * Math.PI);
    context.strokeStyle = `rgba(184,255,133,${pulse * 0.8})`;
    context.lineWidth = 2;
    context.strokeRect(12 + pulse * 12, 12 + pulse * 12, width - 24 - pulse * 24, height - 24 - pulse * 24);
  }
}

function updateReadout() {
  const percent = Math.round(state.beam * 100);
  readout.textContent = state.locked ? 'LOCKED · TRANQUILITY' : `ACQUIRING · ${percent}%`;
}

function frame() {
  if (reducedMotion.matches) {
    state.beam = state.target;
  } else {
    const delta = state.target - state.beam;
    state.beam += delta * (state.dragging ? 0.34 : 0.13);
    state.velocity *= 0.82;
  }
  drawRelief();
  updateReadout();
  requestAnimationFrame(frame);
}

canvas.addEventListener('pointerdown', (event) => {
  state.dragging = true;
  canvas.setPointerCapture(event.pointerId);
  setTarget(event.clientX);
});
canvas.addEventListener('pointermove', (event) => {
  if (state.dragging) setTarget(event.clientX);
});
canvas.addEventListener('pointerup', () => {
  state.dragging = false;
  status.textContent = state.locked ? 'Transmission locked on Tranquility Base.' : `Signal acquired at ${Math.round(state.target * 100)} percent.`;
});
canvas.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    state.target = clampBeam(state.target + direction * (event.shiftKey ? 0.1 : 0.025));
    state.velocity = direction * 22;
    state.locked = state.target > 0.88;
    if (state.locked) state.lockTime = performance.now();
  }
  if (event.key === 'Home') reset();
});

function reset() {
  state.target = 0.22;
  state.velocity = -24;
  state.locked = false;
  status.textContent = 'Signal reset to 22 percent.';
  canvas.focus();
}

resetButton.addEventListener('click', reset);
window.addEventListener('resize', resize);
resize();
frame();
