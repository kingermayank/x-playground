const canvas = document.querySelector('#commandCanvas');
const ctx = canvas.getContext('2d');
const search = document.querySelector('#commandSearch');
const results = document.querySelector('#commandResults');
const status = document.querySelector('#gravityStatus');
const nodeLayer = document.querySelector('#gravityNodes');
const chips = [...document.querySelectorAll('.gravity-chip')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const commands = [
  { title: 'Tune spring curve', tag: 'motion', shortcut: 'S', x: 22, y: 24 },
  { title: 'Reveal layout rails', tag: 'layout', shortcut: 'R', x: 58, y: 18 },
  { title: 'Cluster token drift', tag: 'tokens', shortcut: 'T', x: 72, y: 58 },
  { title: 'Export motion trace', tag: 'export', shortcut: 'E', x: 28, y: 72 },
  { title: 'Balance focus ring', tag: 'layout', shortcut: 'F', x: 54, y: 78 },
  { title: 'Preview reduced motion', tag: 'motion', shortcut: 'M', x: 82, y: 32 },
];

let activeIndex = 0;
let pinnedTitle = '';
let dragNode = null;
let dragOffset = { x: 0, y: 0 };

const nodes = commands.map((command) => ({ ...command }));

function query() {
  return search.value.trim().toLowerCase();
}

function matches(command) {
  const value = query();
  return !value || command.title.toLowerCase().includes(value) || command.tag.includes(value);
}

function visibleNodes() {
  return nodes.filter(matches);
}

function activeNode() {
  const visible = visibleNodes();
  activeIndex = Math.max(0, Math.min(activeIndex, visible.length - 1));
  return visible[activeIndex] ?? null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function pointFromEvent(event) {
  const rect = nodeLayer.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / rect.width) * 100, 8, 92),
    y: clamp(((event.clientY - rect.top) / rect.height) * 100, 10, 90),
  };
}

function nearestNode(point) {
  return visibleNodes()
    .map((node) => ({
      node,
      distance: Math.hypot(node.x - point.x, node.y - point.y),
    }))
    .sort((a, b) => a.distance - b.distance)[0] ?? null;
}

function setActiveNode(node, message = '') {
  const visible = visibleNodes();
  const index = visible.indexOf(node);

  if (index >= 0) {
    activeIndex = index;
  }

  pinnedTitle = node.title;
  status.textContent = message || `${node.title} is active. Drag its card or choose another command.`;
  renderResults();
  renderNodeOverlay();
}

function moveActiveNodeTo(point) {
  const node = activeNode();

  if (!node) {
    status.textContent = 'No matching commands. Try motion, tokens, layout, or export.';
    return;
  }

  node.x = point.x;
  node.y = point.y;
  pinnedTitle = node.title;
  status.textContent = `${node.title} moved. The visible command cards updated immediately.`;
  renderResults();
  renderNodeOverlay();
}

function renderResults() {
  const visible = visibleNodes();
  activeIndex = Math.max(0, Math.min(activeIndex, visible.length - 1));

  if (!visible.length) {
    results.replaceChildren(Object.assign(document.createElement('li'), {
      className: 'command-empty',
      textContent: 'No commands match. Try motion, tokens, layout, export, spring, or focus.',
    }));
    return;
  }

  results.replaceChildren(...visible.map((command, index) => {
    const item = document.createElement('li');
    item.className = 'command-result';
    item.dataset.active = String(index === activeIndex);
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-pressed', String(index === activeIndex));
    item.innerHTML = `
      <span>
        <strong>${command.title}</strong>
        <small>${command.tag}${pinnedTitle === command.title ? ' · pinned' : ''}</small>
      </span>
      <kbd>${command.shortcut}</kbd>
    `;
    item.addEventListener('click', () => {
      setActiveNode(command, `${command.title} selected from the list.`);
    });
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        item.click();
      }
    });
    return item;
  }));
}

function renderNodeOverlay() {
  const visible = visibleNodes();
  const active = activeNode();
  const visibleTitles = new Set(visible.map((node) => node.title));

  [...nodeLayer.querySelectorAll('.gravity-node')].forEach((button) => {
    if (!visibleTitles.has(button.dataset.title)) {
      button.remove();
    }
  });

  const empty = nodeLayer.querySelector('.gravity-node-empty');
  if (!visible.length) {
    if (!empty) {
      const message = document.createElement('p');
      message.className = 'gravity-node-empty';
      message.textContent = 'Nothing in the field yet. Change the search to bring commands back.';
      nodeLayer.append(message);
    }
    return;
  }
  empty?.remove();

  visible.forEach((node) => {
    let button = [...nodeLayer.querySelectorAll('.gravity-node')]
      .find((candidate) => candidate.dataset.title === node.title);

    if (!button) {
      button = document.createElement('button');
      button.className = 'gravity-node';
      button.type = 'button';
      button.dataset.title = node.title;
      button.innerHTML = `
        <strong>${node.title}</strong>
        <span>${node.tag} · ${node.shortcut}</span>
      `;
      button.addEventListener('click', () => {
        setActiveNode(node, `${node.title} is now the gravity center.`);
      });
      button.addEventListener('pointerdown', (event) => {
        const point = pointFromEvent(event);
        dragNode = node;
        dragOffset = { x: node.x - point.x, y: node.y - point.y };
        button.setPointerCapture(event.pointerId);
        setActiveNode(node, `${node.title} grabbed. Drag the card anywhere in the field.`);
      });
      button.addEventListener('pointermove', (event) => {
        if (dragNode !== node) {
          return;
        }

        const point = pointFromEvent(event);
        node.x = clamp(point.x + dragOffset.x, 8, 92);
        node.y = clamp(point.y + dragOffset.y, 10, 90);
        renderNodeOverlay();
      });
      button.addEventListener('pointerup', () => {
        if (dragNode === node) {
          status.textContent = `${node.title} released.`;
        }
        dragNode = null;
      });
      button.addEventListener('pointercancel', () => {
        dragNode = null;
      });
      nodeLayer.append(button);
    }

    button.dataset.active = String(node === active);
    button.style.left = `${node.x}%`;
    button.style.top = `${node.y}%`;
  });
}

function drawGrid() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = '#0c0f17';
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';

  for (let x = 0; x < rect.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, rect.height);
    ctx.stroke();
  }

  for (let y = 0; y < rect.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(rect.width, y);
    ctx.stroke();
  }
}

function animateField() {
  drawGrid();
  if (!reduceMotion) {
    requestAnimationFrame(animateField);
  }
}

search.addEventListener('input', () => {
  activeIndex = 0;
  status.textContent = query()
    ? `Filtering commands by "${query()}".`
    : 'Showing all commands.';
  renderResults();
  renderNodeOverlay();
});

search.addEventListener('keydown', (event) => {
  const visible = visibleNodes();

  if (!visible.length) {
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    activeIndex = (activeIndex + 1) % visible.length;
    setActiveNode(visible[activeIndex], `${visible[activeIndex].title} is now active.`);
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex = (activeIndex - 1 + visible.length) % visible.length;
    setActiveNode(visible[activeIndex], `${visible[activeIndex].title} is now active.`);
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    setActiveNode(visible[activeIndex], `${visible[activeIndex].title} pinned.`);
  }
});

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    search.value = chip.dataset.query;
    activeIndex = 0;
    search.focus();
    status.textContent = `Filtering by ${chip.dataset.query}.`;
    renderResults();
    renderNodeOverlay();
  });
});

nodeLayer.addEventListener('click', (event) => {
  if (event.target.closest('.gravity-node')) {
    return;
  }

  const point = pointFromEvent(event);
  const nearest = nearestNode(point);
  if (nearest && nearest.distance < 12) {
    setActiveNode(nearest.node, `${nearest.node.title} selected.`);
    return;
  }

  moveActiveNodeTo(point);
});

window.addEventListener('resize', () => {
  drawGrid();
  renderNodeOverlay();
});

renderResults();
renderNodeOverlay();
animateField();
