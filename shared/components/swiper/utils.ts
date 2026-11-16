/** Приводит внешний индекс к существующей странице; пустой набор и нечисловые значения дают ноль. */
export function clampSwiperIndex(index: number, count: number): number {
  return Math.max(
    0,
    Math.min(
      Number.isFinite(index) ? Math.trunc(index) : 0,
      Math.max(0, count - 1),
    ),
  );
}

/** Сохраняет точку под пальцами при pinch и ограничивает сдвиг границами увеличенного viewport. */
export function getPinchTranslation(
  start: number,
  focal: number,
  size: number,
  scale: number,
): number {
  "worklet";

  const limit = (size * (scale - 1)) / 2;
  const translation = (start - size / 2) * (1 - scale) + focal - start;
  return Math.min(limit, Math.max(-limit, translation));
}
