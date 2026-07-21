import { angleForPosition, clampPosition, faceForPosition, stepAngle } from './lenticular-math.js';

const artifact = document.querySelector('#lenticularArtifact');
const ribs = document.querySelector('#lenticularRibs');
const readout = document.querySelector('#lenticularReadout');
const status = document.querySelector('#lenticularStatus');
const lockButton = document.querySelector('#lenticularLock');
const resetButton = document.querySelector('#lenticularReset');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const state = {
  position: 0.5,
  target: 0.5,
  angle: { value: 0, velocity: 0 },
  locked: false,
};

const ribCount = 26;
for (let index = 0; index < ribCount; index += 1) {
  const rib = document.createElement('span');
  rib.className = 'lenticular-rib';
  rib.style.setProperty('--index', index);
  rib.style.setProperty('--offset', `${index * -1}00%`);
  rib.innerHTML = '<i class="rib-face rib-near">NEAR</i><i class="rib-face rib-far">FAR</i>';
  ribs.append(rib);
}

function setTargetFromClientX(clientX) {
  if (state.locked) return;
  const bounds = artifact.getBoundingClientRect();
  state.target = clampPosition((clientX - bounds.left) / bounds.width);
}

function announce() {
  const angle = Math.round(angleForPosition(state.target));
  const face = faceForPosition(state.target);
  status.textContent = `${face === 'SHIFT' ? 'Viewing the transition' : `Viewing ${face.toLowerCase()}`} at ${Math.abs(angle)} degrees ${angle < 0 ? 'left' : angle > 0 ? 'right' : ''}.`;
}

function setLocked(locked) {
  state.locked = locked;
  lockButton.setAttribute('aria-pressed', String(locked));
  lockButton.textContent = locked ? 'Unlock angle' : 'Lock angle';
  artifact.dataset.locked = String(locked);
  status.textContent = locked ? 'Viewing angle locked.' : 'Viewing angle unlocked.';
}

function reset() {
  setLocked(false);
  state.target = 0.5;
  artifact.focus();
  announce();
}

function render() {
  const targetAngle = angleForPosition(state.target);
  if (reducedMotion.matches) {
    state.angle = { value: targetAngle, velocity: 0 };
  } else {
    state.angle = stepAngle(state.angle, targetAngle);
  }
  state.position = clampPosition(state.angle.value / 116 + 0.5);
  const face = faceForPosition(state.position);
  const shownAngle = Math.round(state.angle.value);
  artifact.style.setProperty('--view-angle', `${shownAngle}deg`);
  artifact.style.setProperty('--rib-turn', `${Math.round(shownAngle * 0.14)}deg`);
  artifact.style.setProperty('--view-position', state.position.toFixed(3));
  readout.textContent = `${face} · ${shownAngle > 0 ? '+' : ''}${shownAngle}°`;
  requestAnimationFrame(render);
}

artifact.addEventListener('pointermove', (event) => setTargetFromClientX(event.clientX));
artifact.addEventListener('pointerleave', announce);
artifact.addEventListener('click', () => setLocked(!state.locked));
artifact.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    setLocked(false);
    state.target = clampPosition(state.target + (event.key === 'ArrowRight' ? 0.08 : -0.08));
    announce();
  }
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    setLocked(!state.locked);
  }
  if (event.key === 'Home') reset();
});

lockButton.addEventListener('click', (event) => {
  event.stopPropagation();
  setLocked(!state.locked);
  artifact.focus();
});
resetButton.addEventListener('click', (event) => {
  event.stopPropagation();
  reset();
});

render();
