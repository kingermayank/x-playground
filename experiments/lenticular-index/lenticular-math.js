export function clampPosition(value) {
  return Math.min(1, Math.max(0, value));
}

export function angleForPosition(position) {
  return (clampPosition(position) - 0.5) * 116;
}

export function faceForPosition(position) {
  const value = clampPosition(position);
  if (value < 0.4) return 'NEAR';
  if (value > 0.6) return 'FAR';
  return 'SHIFT';
}

export function stepAngle(state, target, stiffness = 0.16, damping = 0.7) {
  const velocity = (state.velocity + (target - state.value) * stiffness) * damping;
  return { value: state.value + velocity, velocity };
}
