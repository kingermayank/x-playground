import { clampScan, historyIndexForSlice, sliceShear } from './temporal-buffer.js';

const canvas = document.querySelector('#slitCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.querySelector('#slitReset');
const status = document.querySelector('#slitStatus');
const depthReadout = document.querySelector('#slitDepth');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const frames = Array.from({ length: reduceMotion ? 2 : 12 }, () => document.createElement('canvas'));
const pointer = { active: false, id: null, previousX: 0 };

let width = 0;
let height = 0;
let scale = 1;
let scan = 0.58;
let targetScan = scan;
let velocity = 0;
let time = 0;
let animationFrame = null;

function drawSignal(context, frameTime) {
  context.fillStyle = '#11110f';
  context.fillRect(0, 0, width, height);
  const margin = width * 0.075;
  const headline = width < 620 ? ['NOW', 'LEAVES', 'A TRACE'] : ['NOW LEAVES', 'A TRACE'];
  const size = width < 620 ? width * 0.17 : width * 0.125;
  const pulse = reduceMotion ? 0 : Math.sin(frameTime * 0.0022) * size * 0.055;

  context.fillStyle = '#f1eee2';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = `900 ${size}px Arial, Helvetica, sans-serif`;
  headline.forEach((line, index) => {
    const y = height * 0.38 + index * size * 0.86;
    context.save();
    context.translate(margin + (index ? pulse : -pulse), y);
    context.transform(1, 0, Math.sin(frameTime * 0.0017 + index) * 0.07, 1, 0, 0);
    context.fillText(line, 0, 0);
    context.restore();
  });

  context.fillStyle = '#dfff37';
  context.fillRect(margin, height * 0.16, Math.max(42, width * 0.07), 7);
  context.font = `700 ${Math.max(11, width * 0.012)}px Arial, sans-serif`;
  context.letterSpacing = '2px';
  context.fillText('LIVE / BUFFERED', margin, height * 0.21);

  context.strokeStyle = 'rgba(241,238,226,.18)';
  context.lineWidth = 1;
  for (let y = 28; y < height; y += 28) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function captureFrame(frameTime) {
  const frame = frames.pop();
  frame.width = Math.floor(width * scale);
  frame.height = Math.floor(height * scale);
  const frameContext = frame.getContext('2d');
  frameContext.setTransform(scale, 0, 0, scale, 0, 0);
  drawSignal(frameContext, frameTime);
  frames.unshift(frame);
}

function render() {
  const current = frames[0];
  if (!current) return;
  ctx.drawImage(current, 0, 0, current.width, current.height, 0, 0, width, height);

  const scanX = scan * width;
  const speed = Math.min(1, Math.abs(velocity) / 34);
  const fieldWidth = Math.max(76, width * (0.12 + speed * 0.24));
  const sliceCount = frames.length;
  const sliceWidth = fieldWidth / sliceCount;

  frames.forEach((frame, index) => {
    const historyIndex = historyIndexForSlice(index, sliceCount, frames.length);
    const source = frames[historyIndex];
    const depth = index / Math.max(1, sliceCount - 1);
    const x = scanX - fieldWidth / 2 + index * sliceWidth;
    const shear = sliceShear(velocity, depth);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 0, sliceWidth + 1, height);
    ctx.clip();
    ctx.globalAlpha = 0.96 - depth * 0.24;
    ctx.drawImage(source, 0, 0, source.width, source.height, shear, depth * 10, width, height);
    ctx.restore();
  });

  ctx.fillStyle = '#dfff37';
  ctx.fillRect(scanX - 2, 0, 4, height);
  ctx.fillRect(scanX - 19, height * 0.12, 38, 38);
  ctx.fillStyle = '#11110f';
  ctx.font = '900 18px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('↔', scanX, height * 0.12 + 19);
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  frames.forEach((frame) => {
    frame.width = canvas.width;
    frame.height = canvas.height;
  });
  captureFrame(time);
  render();
}

function setScan(next, announced = false) {
  targetScan = clampScan(next);
  if (reduceMotion) scan = targetScan;
  if (announced) status.textContent = `Scan position ${Math.round(targetScan * 100)} percent.`;
  if (reduceMotion) render();
}

function pointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return (event.clientX - rect.left) / rect.width;
}

canvas.addEventListener('pointerdown', (event) => {
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.previousX = event.clientX;
  canvas.setPointerCapture(event.pointerId);
  setScan(pointFromEvent(event));
  status.textContent = 'Scanning. Gesture velocity is writing the temporal width.';
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointer.active || event.pointerId !== pointer.id) return;
  velocity = event.clientX - pointer.previousX;
  pointer.previousX = event.clientX;
  setScan(pointFromEvent(event));
});

function release(event) {
  if (event.pointerId !== pointer.id) return;
  pointer.active = false;
  pointer.id = null;
  status.textContent = 'Scan captured. Drag again or use the arrow keys.';
}

canvas.addEventListener('pointerup', release);
canvas.addEventListener('pointercancel', release);
canvas.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const direction = event.key === 'ArrowLeft' ? -1 : 1;
  velocity = direction * 12;
  setScan(targetScan + direction * 0.035, true);
});

resetButton.addEventListener('click', () => {
  velocity = 0;
  scan = 0.58;
  targetScan = scan;
  status.textContent = 'Scan reset to the live signal.';
  render();
});

function animate(now) {
  const delta = Math.min(32, now - time || 16);
  time = now;
  scan += (targetScan - scan) * Math.min(1, delta * 0.018);
  velocity *= Math.pow(0.86, delta / 16.67);
  captureFrame(now);
  render();
  animationFrame = requestAnimationFrame(animate);
}

depthReadout.textContent = `${frames.length} FRAMES`;
window.addEventListener('resize', resize);
window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));
resize();
if (reduceMotion) render();
else animationFrame = requestAnimationFrame(animate);
