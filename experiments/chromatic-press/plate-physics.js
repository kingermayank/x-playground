export function clampOffset(value, limit = 40) {
  return Math.max(-limit, Math.min(limit, value));
}

export function plateTargets(offset) {
  return {
    cyan: { x: offset.x * 0.9, y: offset.y * 0.62 },
    magenta: { x: offset.x * -0.58, y: offset.y * -0.82 },
    yellow: { x: offset.x * 0.22, y: offset.y * -0.35 },
    black: { x: 0, y: 0 },
  };
}

export function stepPlate(plate, target, options = {}) {
  const stiffness = options.stiffness ?? 0.1;
  const damping = options.damping ?? 0.74;
  const vx = (plate.vx + (target.x - plate.x) * stiffness) * damping;
  const vy = (plate.vy + (target.y - plate.y) * stiffness) * damping;

  return {
    x: plate.x + vx,
    y: plate.y + vy,
    vx,
    vy,
  };
}
