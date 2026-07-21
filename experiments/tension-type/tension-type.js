const canvas = document.querySelector('#tensionCanvas');
const ctx = canvas.getContext('2d');
const forceControl = document.querySelector('#forceControl');
const resetButton = document.querySelector('#resetTension');
const status = document.querySelector('#tensionStatus');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const phrase = ['PULL', 'THE', 'SIGNAL'];
const letters = [];
const pointer = {
  active: false,
  id: null,
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0,
  velocity: 0,
};

let width = 0;
let height = 0;
let scale = 1;
let lastTime = performance.now();
let animationFrame = null;
let fieldIsSettling = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function spring(letter, delta) {
  const stiffness = reduceMotion ? 1 : 0.075;
  const damping = reduceMotion ? 0 : 0.79;
  const frame = clamp(delta / 16.67, 0.3, 2);

  letter.vx += (letter.homeX - letter.x) * stiffness * frame;
  letter.vy += (letter.homeY - letter.y) * stiffness * frame;
  letter.vx *= Math.pow(damping, frame);
  letter.vy *= Math.pow(damping, frame);
  letter.x += letter.vx * frame;
  letter.y += letter.vy * frame;

  const offsetX = letter.x - letter.homeX;
  const offsetY = letter.y - letter.homeY;
  const displacement = Math.hypot(offsetX, offsetY);
  const maxDisplacement = Math.min(150, width * 0.18);

  if (displacement > maxDisplacement) {
    const boundary = maxDisplacement / displacement;
    letter.x = letter.homeX + offsetX * boundary;
    letter.y = letter.homeY + offsetY * boundary;
    letter.vx *= 0.54;
    letter.vy *= 0.54;
  }
}

function layoutLetters() {
  letters.length = 0;
  const compact = width < 620;
  const fontSize = compact ? clamp(width * 0.185, 52, 92) : clamp(width * 0.128, 96, 138);
  const lineHeight = fontSize * 0.78;
  const startY = height / 2 - lineHeight;

  ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  phrase.forEach((word, row) => {
    const spacing = compact ? fontSize * 0.015 : fontSize * 0.035;
    const widths = [...word].map((character) => ctx.measureText(character).width);
    const wordWidth = widths.reduce((sum, value) => sum + value, 0) + spacing * (word.length - 1);
    let cursor = width / 2 - wordWidth / 2;

    [...word].forEach((character, column) => {
      const characterWidth = widths[column];
      const homeX = cursor + characterWidth / 2;
      const homeY = startY + row * lineHeight;
      letters.push({
        character,
        row,
        column,
        homeX,
        homeY,
        x: homeX,
        y: homeY,
        vx: 0,
        vy: 0,
        fontSize,
      });
      cursor += characterWidth + spacing;
    });
  });
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  scale = window.devicePixelRatio || 1;
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  layoutLetters();
  draw();
}

function pointFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function pullLetters() {
  const radius = Number(forceControl.value) * (width < 620 ? 1.18 : 1.7);
  const speed = clamp(pointer.velocity, 2, 38);

  letters.forEach((letter) => {
    const dx = pointer.x - letter.x;
    const dy = pointer.y - letter.y;
    const distance = Math.hypot(dx, dy);

    if (distance >= radius) {
      return;
    }

    const influence = Math.pow(1 - distance / radius, 2);
    const pull = reduceMotion ? 0.16 : 0.1 + speed * 0.004;
    letter.vx += dx * influence * pull;
    letter.vy += dy * influence * pull;
  });
}

function drawGuides() {
  ctx.strokeStyle = 'rgba(23, 23, 19, 0.12)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);

  [...new Set(letters.map((letter) => letter.homeY))].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(width * 0.08, y + 12);
    ctx.lineTo(width * 0.92, y + 12);
    ctx.stroke();
  });
  ctx.setLineDash([]);
}

function drawConnections() {
  ctx.strokeStyle = 'rgba(255, 77, 36, 0.36)';
  ctx.lineWidth = 1;

  for (let index = 1; index < letters.length; index += 1) {
    const previous = letters[index - 1];
    const current = letters[index];
    if (previous.row !== current.row) continue;

    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }
}

function drawLetters() {
  letters.forEach((letter) => {
    const displacement = Math.hypot(letter.x - letter.homeX, letter.y - letter.homeY);
    const angle = clamp((letter.x - letter.homeX) * 0.0035, -0.22, 0.22);
    const stretch = 1 + clamp(displacement / 260, 0, 0.22);
    const warm = displacement > 10;

    ctx.save();
    ctx.translate(letter.x, letter.y);
    ctx.rotate(angle);
    ctx.scale(stretch, 1 / Math.sqrt(stretch));
    ctx.font = `900 ${letter.fontSize}px Arial, Helvetica, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = warm ? '#ff4d24' : '#171713';
    ctx.fillText(letter.character, 0, 0);
    ctx.restore();
  });
}

function drawPointer() {
  if (!pointer.active) return;

  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, 13, 0, Math.PI * 2);
  ctx.strokeStyle = '#ff4d24';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pointer.x, pointer.y, Number(forceControl.value) * 0.72, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 77, 36, 0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function draw() {
  ctx.fillStyle = '#edebe4';
  ctx.fillRect(0, 0, width, height);
  drawGuides();
  drawConnections();
  drawLetters();
  drawPointer();
}

function animate(time = performance.now()) {
  const delta = time - lastTime;
  lastTime = time;

  if (pointer.active) pullLetters();
  letters.forEach((letter) => spring(letter, delta));
  pointer.velocity *= 0.84;
  draw();

  if (fieldIsSettling) {
    const settled = letters.every((letter) =>
      Math.hypot(letter.x - letter.homeX, letter.y - letter.homeY) < 0.7
      && Math.hypot(letter.vx, letter.vy) < 0.08
    );

    if (settled) {
      fieldIsSettling = false;
      status.textContent = 'Field returned to baseline.';
    }
  }

  if (!reduceMotion) {
    animationFrame = requestAnimationFrame(animate);
  }
}

canvas.addEventListener('pointerdown', (event) => {
  const point = pointFromEvent(event);
  pointer.active = true;
  pointer.id = event.pointerId;
  pointer.x = point.x;
  pointer.y = point.y;
  pointer.previousX = point.x;
  pointer.previousY = point.y;
  pointer.velocity = 0;
  fieldIsSettling = false;
  canvas.setPointerCapture(event.pointerId);
  status.textContent = 'Tension applied. Move faster for a stronger pull.';
  if (reduceMotion) animate();
});

canvas.addEventListener('pointermove', (event) => {
  if (!pointer.active || event.pointerId !== pointer.id) return;
  const point = pointFromEvent(event);
  pointer.velocity = Math.hypot(point.x - pointer.previousX, point.y - pointer.previousY);
  pointer.previousX = pointer.x;
  pointer.previousY = pointer.y;
  pointer.x = point.x;
  pointer.y = point.y;
  if (reduceMotion) animate();
});

function releasePointer(event) {
  if (event.pointerId !== pointer.id) return;
  pointer.active = false;
  fieldIsSettling = !reduceMotion;
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
  pointer.id = null;
  status.textContent = reduceMotion
    ? 'Field returned without spring animation.'
    : 'Released. The field is settling.';
  if (reduceMotion) {
    letters.forEach((letter) => {
      letter.x = letter.homeX;
      letter.y = letter.homeY;
      letter.vx = 0;
      letter.vy = 0;
    });
    draw();
  }
}

canvas.addEventListener('pointerup', releasePointer);
canvas.addEventListener('pointercancel', releasePointer);

forceControl.addEventListener('input', () => {
  status.textContent = `Elastic force set to ${forceControl.value}.`;
  draw();
});

resetButton.addEventListener('click', () => {
  fieldIsSettling = false;
  letters.forEach((letter) => {
    letter.x = letter.homeX;
    letter.y = letter.homeY;
    letter.vx = 0;
    letter.vy = 0;
  });
  status.textContent = 'Field reset to its baseline.';
  draw();
});

window.addEventListener('resize', resize);
window.addEventListener('pagehide', () => cancelAnimationFrame(animationFrame));

resize();
animate();
