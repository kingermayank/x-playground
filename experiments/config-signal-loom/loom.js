const canvas = document.querySelector('#loomCanvas');
const ctx = canvas.getContext('2d');
const nodeLayer = document.querySelector('#loomNodes');
const briefTitle = document.querySelector('#briefTitle');
const briefText = document.querySelector('#briefText');
const briefRecipe = document.querySelector('#briefRecipe');
const status = document.querySelector('#loomStatus');

const signals = [
  {
    label: 'Code Layers',
    x: 20,
    y: 26,
    color: '#8a63ff',
    behavior: 'inspect implementation drift',
    output: 'Prototype Reconciler',
    motion: 'stacked layer parallax',
  },
  {
    label: 'AI Motion',
    x: 68,
    y: 22,
    color: '#ff75c8',
    behavior: 'critique transition intent',
    output: 'Motion Critic',
    motion: 'timeline scrub with annotated easing',
  },
  {
    label: 'Shader Effects',
    x: 54,
    y: 68,
    color: '#66e8ff',
    behavior: 'sample brand materiality',
    output: 'Material Sampler',
    motion: 'responsive light sweep',
  },
  {
    label: 'Workflow Weave',
    x: 82,
    y: 58,
    color: '#f8ff75',
    behavior: 'braid critique into build steps',
    output: 'Workflow Loom',
    motion: 'thread tension and snap points',
  },
  {
    label: 'Token Drift',
    x: 32,
    y: 76,
    color: '#7bf5d7',
    behavior: 'show visual-system entropy',
    output: 'Token Weather Map',
    motion: 'pressure-map ripples',
  },
];

let activeSignal = signals[0];
let dragSignal = null;
let dragOffset = { x: 0, y: 0 };

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function toPixels(signal) {
  const rect = nodeLayer.getBoundingClientRect();
  return {
    x: (signal.x / 100) * rect.width,
    y: (signal.y / 100) * rect.height,
  };
}

function pointFromEvent(event) {
  const rect = nodeLayer.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
    y: clamp(((event.clientY - rect.top) / rect.height) * 100, 12, 88),
  };
}

function distance(a, b) {
  const first = toPixels(a);
  const second = toPixels(b);
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function closestPair() {
  let best = null;

  for (let i = 0; i < signals.length; i += 1) {
    for (let j = i + 1; j < signals.length; j += 1) {
      const value = distance(signals[i], signals[j]);
      if (!best || value < best.distance) {
        best = { a: signals[i], b: signals[j], distance: value };
      }
    }
  }

  return best;
}

function composeBrief() {
  const pair = closestPair();
  const tension = Math.max(0, Math.round(100 - pair.distance / 4.8));
  const title = `${pair.a.output} x ${pair.b.output}`;
  const text = `A design-engineering prototype that combines ${pair.a.behavior} with ${pair.b.behavior}. The main interaction should feel like ${pair.a.motion}, then resolve through ${pair.b.motion}.`;
  const recipe = `Thread tension ${tension}% · Build a direct-manipulation canvas, one replayable motion moment, and a critique panel that explains why the result works.`;

  briefTitle.textContent = title;
  briefText.textContent = text;
  briefRecipe.textContent = recipe;
  status.textContent = `${pair.a.label} and ${pair.b.label} are the strongest recombination.`;
}

function drawField() {
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = '#111113';
  ctx.fillRect(0, 0, rect.width, rect.height);

  const pair = closestPair();

  for (let i = 0; i < signals.length; i += 1) {
    for (let j = i + 1; j < signals.length; j += 1) {
      const a = signals[i];
      const b = signals[j];
      const start = toPixels(a);
      const end = toPixels(b);
      const closeness = Math.max(0, 1 - distance(a, b) / 620);
      const isStrongest = pair.a === a && pair.b === b;

      ctx.strokeStyle = isStrongest
        ? `rgba(248, 255, 117, ${0.38 + closeness * 0.4})`
        : `rgba(255, 255, 255, ${0.06 + closeness * 0.22})`;
      ctx.lineWidth = isStrongest ? 2.4 + closeness * 5 : 1 + closeness * 3;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.bezierCurveTo(
        (start.x + end.x) / 2,
        start.y - 64,
        (start.x + end.x) / 2,
        end.y + 64,
        end.x,
        end.y,
      );
      ctx.stroke();
    }
  }
}

function renderSignalNodes() {
  signals.forEach((signal) => {
    let button = [...nodeLayer.querySelectorAll('.loom-node')]
      .find((candidate) => candidate.dataset.label === signal.label);

    if (!button) {
      button = document.createElement('button');
      button.className = 'loom-node';
      button.type = 'button';
      button.dataset.label = signal.label;
      button.style.setProperty('--node-color', signal.color);
      button.innerHTML = `
        <strong>${signal.label}</strong>
        <span>${signal.output}</span>
      `;
      button.addEventListener('click', () => {
        activeSignal = signal;
        status.textContent = `${signal.label} selected. Drag it toward another signal to recombine.`;
        renderSignalNodes();
      });
      button.addEventListener('pointerdown', (event) => {
        const point = pointFromEvent(event);
        activeSignal = signal;
        dragSignal = signal;
        dragOffset = { x: signal.x - point.x, y: signal.y - point.y };
        button.setPointerCapture(event.pointerId);
        status.textContent = `${signal.label} grabbed.`;
        renderSignalNodes();
      });
      button.addEventListener('pointermove', (event) => {
        if (dragSignal !== signal) {
          return;
        }

        const point = pointFromEvent(event);
        signal.x = clamp(point.x + dragOffset.x, 8, 92);
        signal.y = clamp(point.y + dragOffset.y, 12, 88);
        drawField();
        renderSignalNodes();
        composeBrief();
      });
      button.addEventListener('pointerup', () => {
        dragSignal = null;
        composeBrief();
      });
      button.addEventListener('pointercancel', () => {
        dragSignal = null;
      });
      nodeLayer.append(button);
    }

    button.dataset.active = String(signal === activeSignal);
    button.style.left = `${signal.x}%`;
    button.style.top = `${signal.y}%`;
  });
}

function render() {
  resizeCanvas();
  drawField();
  renderSignalNodes();
  composeBrief();
}

window.addEventListener('resize', render);
render();
