import { clampFold, getFoldGeometry, nearestFoldSnap } from './fold-geometry.js';

const canvas = document.querySelector('#creaseCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.querySelector('#creaseReset');
const status = document.querySelector('#creaseStatus');
const value = document.querySelector('#creaseValue');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const snapPoints = [0.22, 0.5, 0.78];

let progress = 0.78;
let target = progress;
let velocity = 0;
let dragging = false;
let animationFrame = 0;
let poster = { x: 0, y: 0, width: 1, height: 1 };

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const side = Math.max(24, Math.min(72, rect.width * 0.075));
  poster = {
    x: side,
    y: Math.max(34, rect.height * 0.075),
    width: rect.width - side * 2,
    height: rect.height - Math.max(152, rect.height * 0.24),
  };
  draw();
}

function frontPath(geometry) {
  ctx.beginPath();
  ctx.moveTo(poster.x, poster.y);
  ctx.lineTo(poster.x + geometry.topX, poster.y);
  ctx.lineTo(poster.x + geometry.bottomX, poster.y + poster.height);
  ctx.lineTo(poster.x, poster.y + poster.height);
  ctx.closePath();
}

function drawReverse() {
  ctx.fillStyle = '#d9ff57';
  ctx.fillRect(poster.x, poster.y, poster.width, poster.height);
  ctx.save();
  ctx.beginPath();
  ctx.rect(poster.x, poster.y, poster.width, poster.height);
  ctx.clip();
  ctx.translate(poster.x, poster.y);
  ctx.fillStyle = '#111612';
  ctx.font = `800 ${Math.max(42, poster.width * 0.09)}px Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText('SECOND', poster.width * 0.29, poster.height * 0.12);
  ctx.fillText('READING', poster.width * 0.29, poster.height * 0.32);
  ctx.font = `700 ${Math.max(12, poster.width * 0.018)}px Arial, sans-serif`;
  ctx.fillText('THE REVERSE IS PART OF THE MESSAGE', poster.width * 0.29, poster.height * 0.78);
  ctx.strokeStyle = 'rgba(17, 22, 18, 0.24)';
  for (let x = 0; x < poster.width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, poster.height);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFront(geometry) {
  ctx.save();
  frontPath(geometry);
  ctx.clip();
  ctx.fillStyle = '#f1ede2';
  ctx.fillRect(poster.x, poster.y, poster.width, poster.height);
  ctx.translate(poster.x, poster.y);
  ctx.fillStyle = '#111612';
  ctx.font = `800 ${Math.max(46, poster.width * 0.12)}px Arial, sans-serif`;
  ctx.textBaseline = 'top';
  ctx.fillText('CREASE', poster.width * 0.075, poster.height * 0.12);
  ctx.fillText('MEMORY', poster.width * 0.075, poster.height * 0.34);
  ctx.font = `700 ${Math.max(11, poster.width * 0.016)}px Arial, sans-serif`;
  ctx.fillText('A STUDY IN TWO-SIDED INTERFACES', poster.width * 0.08, poster.height * 0.79);
  ctx.fillText('13 / 07 / 26', poster.width * 0.79, poster.height * 0.79);
  ctx.strokeStyle = 'rgba(17, 22, 18, 0.18)';
  ctx.beginPath();
  ctx.moveTo(poster.width * 0.08, poster.height * 0.72);
  ctx.lineTo(poster.width * 0.92, poster.height * 0.72);
  ctx.stroke();
  ctx.restore();
}

function drawFold(geometry) {
  const topX = poster.x + geometry.topX;
  const bottomX = poster.x + geometry.bottomX;
  const width = geometry.flapWidth;
  const foldPath = () => {
    ctx.beginPath();
    ctx.moveTo(topX, poster.y);
    ctx.lineTo(bottomX, poster.y + poster.height);
    ctx.lineTo(bottomX - width, poster.y + poster.height);
    ctx.lineTo(topX - width, poster.y);
    ctx.closePath();
  };

  ctx.save();
  ctx.shadowColor = 'rgba(4, 8, 5, 0.42)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetX = 13;
  foldPath();
  ctx.fillStyle = '#d6d0c2';
  ctx.fill();
  ctx.restore();

  ctx.save();
  foldPath();
  ctx.clip();
  ctx.strokeStyle = 'rgba(17, 22, 18, 0.16)';
  for (let y = poster.y - poster.width; y < poster.y + poster.height + poster.width; y += 16) {
    ctx.beginPath();
    ctx.moveTo(topX - width - 120, y);
    ctx.lineTo(bottomX + 120, y + 220);
    ctx.stroke();
  }
  ctx.restore();

  ctx.strokeStyle = '#111612';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(topX, poster.y);
  ctx.lineTo(bottomX, poster.y + poster.height);
  ctx.stroke();

  const handleX = (topX + bottomX) / 2;
  const handleY = poster.y + poster.height * 0.5;
  ctx.fillStyle = '#f1ede2';
  ctx.beginPath();
  ctx.arc(handleX, handleY, 19, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#111612';
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(handleX - 6, handleY);
  ctx.lineTo(handleX + 6, handleY);
  ctx.moveTo(handleX - 2, handleY - 4);
  ctx.lineTo(handleX - 6, handleY);
  ctx.lineTo(handleX - 2, handleY + 4);
  ctx.moveTo(handleX + 2, handleY - 4);
  ctx.lineTo(handleX + 6, handleY);
  ctx.lineTo(handleX + 2, handleY + 4);
  ctx.stroke();
}

function drawMarks() {
  ctx.save();
  ctx.strokeStyle = 'rgba(241, 237, 226, 0.5)';
  snapPoints.forEach((point) => {
    const x = poster.x + poster.width * point;
    ctx.beginPath();
    ctx.moveTo(x, poster.y - 12);
    ctx.lineTo(x, poster.y - 4);
    ctx.moveTo(x, poster.y + poster.height + 4);
    ctx.lineTo(x, poster.y + poster.height + 12);
    ctx.stroke();
  });
  ctx.restore();
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = '#111612';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = 'rgba(217, 255, 87, 0.08)';
  for (let x = -rect.height; x < rect.width; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + rect.height, rect.height);
    ctx.stroke();
  }

  const geometry = getFoldGeometry(poster.width, poster.height, progress);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.34)';
  ctx.shadowBlur = 38;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#d9ff57';
  ctx.fillRect(poster.x, poster.y, poster.width, poster.height);
  ctx.shadowColor = 'transparent';
  drawReverse();
  drawFront(geometry);
  drawFold(geometry);
  drawMarks();
  value.textContent = `${Math.round((1 - progress) * 100)}%`;
}

function eventX(event) {
  return event.clientX - canvas.getBoundingClientRect().left;
}

function settle(nextTarget, message) {
  target = nextTarget;
  status.textContent = message;
  cancelAnimationFrame(animationFrame);
  if (reduceMotion) {
    progress = target;
    velocity = 0;
    draw();
    return;
  }

  function spring() {
    velocity += (target - progress) * 0.16;
    velocity *= 0.74;
    progress += velocity;
    draw();
    if (Math.abs(target - progress) > 0.0005 || Math.abs(velocity) > 0.0005) {
      animationFrame = requestAnimationFrame(spring);
    } else {
      progress = target;
      velocity = 0;
      draw();
      status.textContent = `Fold settled. ${Math.round((1 - progress) * 100)}% of the reverse is exposed.`;
    }
  }
  animationFrame = requestAnimationFrame(spring);
}

function moveToSnap(direction) {
  const current = nearestFoldSnap(progress);
  const index = snapPoints.indexOf(current);
  const nextIndex = Math.max(0, Math.min(snapPoints.length - 1, index + direction));
  settle(snapPoints[nextIndex], `Fold moved to registration mark ${nextIndex + 1} of 3.`);
}

canvas.addEventListener('pointerdown', (event) => {
  dragging = true;
  velocity = 0;
  cancelAnimationFrame(animationFrame);
  canvas.setPointerCapture(event.pointerId);
  progress = clampFold((eventX(event) - poster.x) / poster.width);
  status.textContent = 'Crease grabbed. Drag horizontally to reveal the reverse.';
  draw();
});

canvas.addEventListener('pointermove', (event) => {
  if (!dragging) return;
  progress = clampFold((eventX(event) - poster.x) / poster.width);
  status.textContent = `Dragging. ${Math.round((1 - progress) * 100)}% of the reverse is exposed.`;
  draw();
});

canvas.addEventListener('pointerup', () => {
  if (!dragging) return;
  dragging = false;
  settle(nearestFoldSnap(progress), 'Crease released and settling to the nearest registration mark.');
});

canvas.addEventListener('pointercancel', () => {
  dragging = false;
  settle(nearestFoldSnap(progress), 'Fold returned to the nearest registration mark.');
});

canvas.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveToSnap(-1);
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveToSnap(1);
  }
  if (event.key === 'Home') {
    event.preventDefault();
    settle(0.78, 'Fold reset to the right registration mark.');
  }
});

resetButton.addEventListener('click', () => {
  settle(0.78, 'Fold reset to the right registration mark.');
  canvas.focus({ preventScroll: true });
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
