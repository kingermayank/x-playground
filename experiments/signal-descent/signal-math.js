export function clampBeam(value) {
  return Math.min(0.94, Math.max(0.06, value));
}

export function signalStrength(beam, point) {
  const distance = clampBeam(beam) - point;
  if (distance >= 0.88 - Number.EPSILON) return 1;
  return Math.min(1, Math.max(0, distance / 0.88));
}

export function scanShear(velocity, strength) {
  const direction = Math.sign(velocity);
  const magnitude = Math.min(22, Math.abs(velocity) * 0.075 * (1 - strength * 0.7));
  return direction * magnitude;
}
