/** Вычисляет сдвиг панелей по направлению скролла; отскоки за краями не меняют направление. */
export function getScrollChromeProgress(
  offset: number,
  previousOffset: number,
  maxOffset: number,
  progress: number,
  distance: number,
) {
  "worklet";

  const current = Math.max(0, Math.min(offset, maxOffset));
  const previous = Math.max(0, Math.min(previousOffset, maxOffset));

  if (current === 0 || maxOffset <= 0 || distance <= 0) {
    return { offset: current, progress: 0 };
  }

  return {
    offset: current,
    progress: Math.max(
      0,
      Math.min(1, progress + (current - previous) / distance),
    ),
  };
}
