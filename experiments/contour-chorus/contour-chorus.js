import { sampleField } from './contour-field.js';

const canvas = document.querySelector('#contourCanvas');
const ctx = canvas.getContext('2d');
const status = document.querySelector('#contourStatus');
const energyLabel = document.querySelector('#contourEnergy');
const reset = document.querySelector('#contourReset');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const conductor = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, energy: 0.18, targetEnergy: 0.18, phase: 0 };
let echoes = [];
let last = { x: 0, y: 0, time: performance.now() };
let frame = 0;

function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  draw(performance.now());
}

function sources(width, height) {
  return [{ x: conductor.x * width, y: conductor.y * height, radius: Math.min(width, height) * 0.58, energy: conductor.energy, phase: conductor.phase }, ...echoes.map((echo) => ({ ...echo, x: echo.x * width, y: echo.y * height, radius: Math.min(width, height) * 0.38 }))];
}

function draw(time) {
  const { width, height } = canvas.getBoundingClientRect();
  ctx.fillStyle = '#0d0e0d';
  ctx.fillRect(0, 0, width, height);
  const fieldSources = sources(width, height);
  const gap = Math.max(18, Math.min(28, height / 25));
  const step = Math.max(7, width / 130);

  for (let baseY = -gap; baseY < height + gap; baseY += gap) {
    ctx.beginPath();
    for (let x = -step; x <= width + step; x += step) {
      const field = sampleField({ x, y: baseY }, fieldSources, reduceMotion ? 0 : time);
      const y = baseY + field * gap * 1.9;
      if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const active = Math.abs(baseY - conductor.y * height) < gap * 2.4;
    ctx.strokeStyle = active ? `rgba(255, 103, 76, ${0.42 + conductor.energy * 0.5})` : 'rgba(244, 239, 224, 0.28)';
    ctx.lineWidth = active ? 1.35 : 0.8;
    ctx.stroke();
  }

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.font = `900 ${Math.max(58, Math.min(width * 0.19, 190))}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CHORUS', width / 2, height / 2);
  ctx.restore();
  ctx.font = `900 ${Math.max(58, Math.min(width * 0.19, 190))}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = 'rgba(244, 239, 224, 0.86)';
  ctx.lineWidth = 1.2;
  ctx.strokeText('CHORUS', width / 2, height / 2);

  const cx = conductor.x * width;
  const cy = conductor.y * height;
  ctx.strokeStyle = '#ff674c';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, 8 + conductor.energy * 11, 0, Math.PI * 2);
  ctx.moveTo(cx - 22, cy); ctx.lineTo(cx - 12, cy);
  ctx.moveTo(cx + 12, cy); ctx.lineTo(cx + 22, cy);
  ctx.stroke();
}

function animate(time) {
  conductor.x += (conductor.tx - conductor.x) * (reduceMotion ? 1 : 0.16);
  conductor.y += (conductor.ty - conductor.y) * (reduceMotion ? 1 : 0.16);
  conductor.energy += (conductor.targetEnergy - conductor.energy) * (reduceMotion ? 1 : 0.1);
  conductor.targetEnergy += (0.16 - conductor.targetEnergy) * 0.018;
  conductor.phase += 0.012;
  echoes = echoes.map((echo) => ({ ...echo, energy: echo.energy * (reduceMotion ? 0.985 : 0.992) })).filter((echo) => echo.energy > 0.035);
  energyLabel.textContent = conductor.energy > 0.72 ? 'FORTE' : conductor.energy > 0.36 ? 'RISING' : 'QUIET';
  draw(time);
  frame = requestAnimationFrame(animate);
}

function move(event) {
  const rect = canvas.getBoundingClientRect();
  const now = performance.now();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const speed = Math.hypot(event.clientX - last.x, event.clientY - last.y) / Math.max(8, now - last.time);
  conductor.tx = Math.max(0.04, Math.min(0.96, x));
  conductor.ty = Math.max(0.06, Math.min(0.94, y));
  conductor.targetEnergy = Math.min(1, 0.24 + speed * 0.9);
  last = { x: event.clientX, y: event.clientY, time: now };
  status.textContent = 'Conducting the contour field. Click to pin this resonance.';
}

function pinEcho() {
  echoes.push({ x: conductor.tx, y: conductor.ty, energy: Math.max(0.48, conductor.energy), phase: conductor.phase + 1.4 });
  echoes = echoes.slice(-4);
  status.textContent = `Echo pinned. ${echoes.length} ${echoes.length === 1 ? 'resonance' : 'resonances'} fading.`;
}

canvas.addEventListener('pointermove', move);
canvas.addEventListener('pointerdown', (event) => { canvas.setPointerCapture(event.pointerId); move(event); pinEcho(); });
canvas.addEventListener('keydown', (event) => {
  const delta = event.shiftKey ? 0.1 : 0.04;
  if (event.key === 'ArrowLeft') conductor.tx -= delta;
  else if (event.key === 'ArrowRight') conductor.tx += delta;
  else if (event.key === 'ArrowUp') conductor.ty -= delta;
  else if (event.key === 'ArrowDown') conductor.ty += delta;
  else if (event.key === ' ' || event.key === 'Enter') pinEcho();
  else if (event.key === 'Home') echoes = [];
  else return;
  event.preventDefault();
  conductor.tx = Math.max(0.04, Math.min(0.96, conductor.tx));
  conductor.ty = Math.max(0.06, Math.min(0.94, conductor.ty));
  conductor.targetEnergy = 0.62;
  status.textContent = 'Keyboard conductor moved. Press Space to pin an echo.';
});
reset.addEventListener('click', () => { echoes = []; conductor.targetEnergy = 0.18; status.textContent = 'Echoes cleared. Field is returning to quiet.'; canvas.focus({ preventScroll: true }); });
window.addEventListener('resize', resize);
resize();
cancelAnimationFrame(frame);
frame = requestAnimationFrame(animate);
