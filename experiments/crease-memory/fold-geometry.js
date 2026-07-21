const SNAP_POINTS = [0.22, 0.5, 0.78];

export function clampFold(value) {
  return Math.min(0.86, Math.max(0.14, value));
}

export function nearestFoldSnap(value) {
  return SNAP_POINTS.reduce((nearest, point) =>
    Math.abs(point - value) < Math.abs(nearest - value) ? point : nearest
  );
}

export function getFoldGeometry(posterWidth, posterHeight, value) {
  const progress = clampFold(value);
  const flapWidth = Math.min(150, Math.max(54, posterWidth * 0.12));
  const topX = Math.max(1, posterWidth * progress - flapWidth * 0.42);
  const bottomX = Math.min(posterWidth - 1, posterWidth * progress + flapWidth * 0.58);

  return {
    progress,
    topX,
    bottomX,
    flapWidth,
    posterWidth,
    posterHeight,
  };
}
