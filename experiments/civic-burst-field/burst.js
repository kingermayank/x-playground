const canvas = document.querySelector('#burstCanvas');
const ctx = canvas.getContext('2d');
const buttons = [...document.querySelectorAll('.material-button')];
const intensityControl = document.querySelector('#intensityControl');
const burstCount = document.querySelector('#burstCount');
const burstStatus = document.querySelector('#burstStatus');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const palettes = {
  heat: ['#ff5d2e', '#ffc857', '#ffe8a3'],
  echo: ['#4d7cff', '#92b4ff', '#f4f8ff'],
  light: ['#fff7b0', '#f789c8', '#7bf5d7'],
};

const labels = {
  heat: 'Heat blooms outward with slow ember gravity',
  echo: 'Echo draws crisp civic rings across the field',
  light: 'Light scatters faster, softer neighborhood glints',
};

let mode = 'heat';
let intensity = 2;
let totalBursts = 0;
let particles = [];
let shockwaves = [];
let trails = [];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function setMode(nextMode) {
  mode = nextMode;
  buttons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  });
  renderTelemetry();
}

function setIntensity(value) {
  intensity = Number(value);
  renderTelemetry();
}

function renderTelemetry() {
  burstCount.textContent = String(totalBursts);
  burstStatus.textContent = `${labels[mode]} · level ${intensity}`;
}

function point(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function burst(x, y) {
  const colors = palettes[mode];
  const count = (mode === 'echo' ? 34 : 48) * intensity;
  const spread = mode === 'light' ? 5.4 : 3.8;
  totalBursts += 1;

  shockwaves.push({
    x,
    y,
    radius: 8,
    life: 1,
    color: colors[0],
    speed: 5 + intensity * 1.4,
  });

  trails.push({
    x,
    y,
    life: 1,
    color: colors[1],
  });

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.22;
    const speed = 0.9 + Math.random() * spread;
    const sparkSize = 1.6 + Math.random() * (mode === 'echo' ? 2.8 : 4.8);
    particles.push({
      x,
      y,
      px: x,
      py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.006 + Math.random() * 0.012,
      color: colors[i % colors.length],
      size: sparkSize,
    });
  }

  renderTelemetry();
}

function drawBackground(width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#14101a');
  gradient.addColorStop(0.54, '#1d1530');
  gradient.addColorStop(1, '#081725');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let x = 36; x < width; x += 56) {
    ctx.beginPath();
    ctx.moveTo(x, height * 0.72);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function drawTrails() {
  trails = trails.filter((trail) => trail.life > 0);
  trails.forEach((trail) => {
    ctx.globalAlpha = trail.life * 0.24;
    ctx.fillStyle = trail.color;
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, 54 * (1.1 - trail.life), 0, Math.PI * 2);
    ctx.fill();
    trail.life -= 0.01;
  });
}

function drawShockwaves() {
  shockwaves = shockwaves.filter((wave) => wave.life > 0);
  shockwaves.forEach((wave) => {
    ctx.globalAlpha = wave.life * 0.72;
    ctx.strokeStyle = wave.color;
    ctx.lineWidth = mode === 'echo' ? 2.4 : 1.4;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
    ctx.stroke();
    wave.radius += reduceMotion ? 0 : wave.speed;
    wave.life -= 0.018;
  });
}

function drawParticles() {
  particles = particles.filter((particle) => particle.life > 0);
  particles.forEach((particle) => {
    particle.px = particle.x;
    particle.py = particle.y;
    particle.x += reduceMotion ? 0 : particle.vx;
    particle.y += reduceMotion ? 0 : particle.vy;
    particle.vy += mode === 'heat' ? 0.012 : 0.02;
    particle.vx *= mode === 'echo' ? 0.992 : 0.986;
    particle.life -= particle.decay;

    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = Math.max(1, particle.size * particle.life);
    ctx.beginPath();
    ctx.moveTo(particle.px, particle.py);
    ctx.lineTo(particle.x, particle.y);
    ctx.stroke();

    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
    ctx.fill();
  });
}

function tick() {
  const rect = canvas.getBoundingClientRect();
  drawBackground(rect.width, rect.height);
  drawTrails();
  drawShockwaves();
  drawParticles();
  ctx.globalAlpha = 1;
  requestAnimationFrame(tick);
}

canvas.addEventListener('pointerdown', (event) => {
  const location = point(event);
  burst(location.x, location.y);
});

buttons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});

intensityControl.addEventListener('input', () => setIntensity(intensityControl.value));
window.addEventListener('resize', resizeCanvas);

resizeCanvas();
setMode(mode);
setIntensity(intensityControl.value);
burst(180, 180);
burst(520, 330);
tick();
