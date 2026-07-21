export function clampEnergy(value) {
  return Math.max(0, Math.min(1, value));
}

export function influenceAt(point, source) {
  const distance = Math.hypot(point.x - source.x, point.y - source.y);
  if (distance >= source.radius) return 0;
  const proximity = 1 - distance / source.radius;
  return clampEnergy(source.energy) * proximity * proximity * (3 - 2 * proximity);
}

export function sampleField(point, sources, time = 0) {
  return sources.reduce((total, source) => {
    const distance = Math.hypot(point.x - source.x, point.y - source.y);
    const ridge = Math.sin(distance * 0.075 - time * 0.0018 + source.phase);
    return total + ridge * influenceAt(point, source);
  }, 0);
}
