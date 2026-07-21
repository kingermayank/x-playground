import { clampOffset, plateTargets, stepPlate } from './plate-physics.js';

const canvas = document.querySelector('#pressCanvas');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#pressStatus');
const stateLabel = document.querySelector('#pressState');
const toggle = document.querySelector('#pressToggle');
const reset = document.querySelector('#pressReset');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const plateColors = { cyan: '#00a9ce', magenta: '#ef3f78', yellow: '#f5d547', black: '#171717' };
const plateMotion = {
  cyan: { stiffness: 0.105, damping: 0.77 },
  magenta: { stiffness: 0.085, damping: 0.79 },
  yellow: { stiffness: 0.12, damping: 0.72 },
  black: { stiffness: 0.18, damping: 0.68 },
};
const plates = Object.fromEntries(Object.keys(plateColors).map((name) => [name, { x: 0, y: 0, vx: 0, vy: 0 }]));
let desiredOffset = { x: 0, y: 0 };
let dragging = false;
let dragOrigin = null;
let frame = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw();
}

function posterBox(width, height) {
  const horizontal = width >= 700;
  const posterWidth = Math.min(width * (horizontal ? 0.66 : 0.84), 620);
  const posterHeight = Math.min(height * 0.72, posterWidth * 1.05);
  return { x: (width - posterWidth) / 2, y: Math.max(32, (height - posterHeight) / 2 - 18), width: posterWidth, height: posterHeight };
}

function drawCropMarks(box, color, offset) {
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const gap = 8;
  const length = 16;
  const points = [[box.x, box.y, -1, -1], [box.x + box.width, box.y, 1, -1], [box.x, box.y + box.height, -1, 1], [box.x + box.width, box.y + box.height, 1, 1]];
  for (const [x, y, sx, sy] of points) {
    ctx.beginPath();
    ctx.moveTo(x + sx * gap, y); ctx.lineTo(x + sx * (gap + length), y);
    ctx.moveTo(x, y + sy * gap); ctx.lineTo(x, y + sy * (gap + length));
    ctx.stroke();
  }
  ctx.restore();
}

function drawPlate(name, box) {
  const offset = plates[name];
  const color = plateColors[name];
  ctx.save();
  ctx.translate(offset.x, offset.y);
  ctx.globalCompositeOperation = name === 'black' ? 'source-over' : 'multiply';
  ctx.fillStyle = color;
  const pad = box.width * 0.085;
  const left = box.x + pad;
  const top = box.y + pad;
  const innerWidth = box.width - pad * 2;
  const innerHeight = box.height - pad * 2;

  if (name === 'cyan') {
    ctx.fillRect(left, top + innerHeight * 0.59, innerWidth, innerHeight * 0.18);
    ctx.beginPath(); ctx.arc(left + innerWidth * 0.76, top + innerHeight * 0.26, innerWidth * 0.2, 0, Math.PI * 2); ctx.fill();
  } else if (name === 'magenta') {
    ctx.fillRect(left + innerWidth * 0.08, top + innerHeight * 0.2, innerWidth * 0.2, innerHeight * 0.68);
    ctx.beginPath(); ctx.moveTo(left + innerWidth * 0.42, top); ctx.lineTo(left + innerWidth, top); ctx.lineTo(left + innerWidth, top + innerHeight * 0.34); ctx.closePath(); ctx.fill();
  } else if (name === 'yellow') {
    ctx.beginPath(); ctx.arc(left + innerWidth * 0.29, top + innerHeight * 0.28, innerWidth * 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(left + innerWidth * 0.52, top + innerHeight * 0.48, innerWidth * 0.48, innerHeight * 0.4);
  } else {
    ctx.fillRect(left, top + innerHeight * 0.86, innerWidth, 2);
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 ${Math.max(58, innerWidth * 0.23)}px Arial, sans-serif`;
    ctx.letterSpacing = '-0.06em';
    ctx.fillText('MAKE', left - innerWidth * 0.01, top + innerHeight * 0.52);
    ctx.fillText('MARKS', left - innerWidth * 0.01, top + innerHeight * 0.77);
    ctx.font = `700 ${Math.max(11, innerWidth * 0.028)}px Arial, sans-serif`;
    ctx.letterSpacing = '0.14em';
    ctx.fillText('CHROMATIC PRESS — PROOF 07', left, top + innerHeight * 0.06);
    ctx.letterSpacing = '0';
    ctx.textAlign = 'right';
    ctx.fillText('15 / 07 / 26', left + innerWidth, top + innerHeight * 0.93);
  }
  ctx.restore();
  drawCropMarks(box, color, offset);
}

function drawTarget(box) {
  const stageWidth = canvas.getBoundingClientRect().width;
  const anchorX = stageWidth < 700 ? box.x + box.width - 24 : box.x + box.width + Math.min(44, box.width * 0.09);
  const x = anchorX + desiredOffset.x;
  const y = box.y + box.height * 0.5 + desiredOffset.y;
  ctx.save();
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.moveTo(x - 22, y); ctx.lineTo(x + 22, y); ctx.moveTo(x, y - 22); ctx.lineTo(x, y + 22); ctx.stroke();
  ctx.fillStyle = '#171717'; ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.fill();
  ctx.font = '700 10px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(dragging ? 'HOLD' : 'PULL', x, y + 39);
  ctx.restore();
}

function draw() {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#d8d2c4'; ctx.fillRect(0, 0, width, height);
  const box = posterBox(width, height);
  ctx.save(); ctx.shadowColor = 'rgba(41, 34, 20, 0.18)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 14; ctx.fillStyle = '#f5f0e4'; ctx.fillRect(box.x, box.y, box.width, box.height); ctx.restore();
  ['yellow', 'cyan', 'magenta', 'black'].forEach((name) => drawPlate(name, box));
  drawTarget(box);
}

function updateLabels() {
  const distance = Math.hypot(desiredOffset.x, desiredOffset.y);
  stateLabel.textContent = distance > 3 ? 'PROOF PULLED' : 'REGISTERED';
  toggle.textContent = distance > 3 ? 'Register plates' : 'Pull proof';
}

function animate() {
  const targets = plateTargets(desiredOffset);
  for (const name of Object.keys(plates)) {
    plates[name] = reducedMotion ? { ...targets[name], vx: 0, vy: 0 } : stepPlate(plates[name], targets[name], plateMotion[name]);
  }
  updateLabels();
  draw();
  frame = requestAnimationFrame(animate);
}

function setOffset(x, y) {
  const limit = Math.max(24, Math.min(46, canvas.getBoundingClientRect().width * 0.05));
  desiredOffset = { x: clampOffset(x, limit), y: clampOffset(y, limit) };
}

function pointerPosition(event) {
  return { x: event.clientX, y: event.clientY };
}

canvas.addEventListener('pointerdown', (event) => {
  canvas.setPointerCapture(event.pointerId);
  dragging = true;
  dragOrigin = { ...pointerPosition(event), offset: { ...desiredOffset } };
  status.textContent = 'Proof pulled. Release to register the four plates.';
});
canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  const point = pointerPosition(event);
  setOffset(dragOrigin.offset.x + point.x - dragOrigin.x, dragOrigin.offset.y + point.y - dragOrigin.y);
});
canvas.addEventListener('pointerup', () => {
  dragging = false;
  setOffset(0, 0);
  status.textContent = 'Plates released. The impression is settling into register.';
});
canvas.addEventListener('pointercancel', () => { dragging = false; setOffset(0, 0); });
canvas.addEventListener('keydown', (event) => {
  const step = event.shiftKey ? 12 : 5;
  if (event.key === 'ArrowLeft') setOffset(desiredOffset.x - step, desiredOffset.y);
  else if (event.key === 'ArrowRight') setOffset(desiredOffset.x + step, desiredOffset.y);
  else if (event.key === 'ArrowUp') setOffset(desiredOffset.x, desiredOffset.y - step);
  else if (event.key === 'ArrowDown') setOffset(desiredOffset.x, desiredOffset.y + step);
  else if (event.key === ' ' || event.key === 'Enter' || event.key === 'Home') setOffset(0, 0);
  else return;
  event.preventDefault();
  status.textContent = Math.hypot(desiredOffset.x, desiredOffset.y) ? 'Keyboard proof offset. Press Space to register.' : 'Plates aligned by keyboard.';
});
toggle.addEventListener('click', () => {
  const pulled = Math.hypot(desiredOffset.x, desiredOffset.y) > 3;
  setOffset(pulled ? 0 : 34, pulled ? 0 : -22);
  status.textContent = pulled ? 'Plates returning to register.' : 'Proof pulled to show the four process layers.';
  canvas.focus({ preventScroll: true });
});
reset.addEventListener('click', () => {
  setOffset(0, 0);
  for (const name of Object.keys(plates)) plates[name] = { x: 0, y: 0, vx: 0, vy: 0 };
  status.textContent = 'Press reset. All four plates are precisely aligned.';
  canvas.focus({ preventScroll: true });
});
window.addEventListener('resize', resize);
resize();
cancelAnimationFrame(frame);
frame = requestAnimationFrame(animate);
