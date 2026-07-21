export function clampScan(value) {
  return Math.max(0.08, Math.min(0.92, value));
}

export function historyIndexForSlice(slice, sliceCount, historyLength) {
  if (sliceCount <= 1 || historyLength <= 1) return 0;
  return Math.round((slice / (sliceCount - 1)) * (historyLength - 1));
}

export function sliceShear(velocity, depth) {
  const bounded = Math.max(-28, Math.min(28, velocity * depth * 0.34));
  return Math.abs(bounded) < 0.01 ? 0 : bounded;
}
