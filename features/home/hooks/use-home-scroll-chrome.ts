import { getScrollChromeProgress } from "@/features/home/utils/scroll-chrome-progress";
import { useScrollChrome } from "@/shared/lib/navigation/scroll-chrome";
import { useFocusEffect, useIsFocused } from "expo-router";
import { useCallback } from "react";
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

/** Связывает панели с прокруткой главной на UI-потоке; при возврате на экран показывает обе. */
export function useHomeScrollChrome(headerHeight: number) {
  const { hiddenProgress, keepVisible } = useScrollChrome();
  const focused = useIsFocused();
  const previousOffset = useSharedValue(0);
  const previousViewportHeight = useSharedValue(-1);
  const direction = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      hiddenProgress.set(0);
      previousViewportHeight.set(-1);
      return () => hiddenProgress.set(0);
    }, [hiddenProgress, previousViewportHeight]),
  );

  const onScroll = useAnimatedScrollHandler({
    onBeginDrag: (event) => {
      direction.set(0);
      const maxOffset = Math.max(
        0,
        event.contentSize.height - event.layoutMeasurement.height,
      );
      previousOffset.set(
        Math.max(0, Math.min(event.contentOffset.y, maxOffset)),
      );
      previousViewportHeight.set(event.layoutMeasurement.height);
    },
    onScroll: (event) => {
      if (!focused || keepVisible) return;

      const maxOffset = Math.max(
        0,
        event.contentSize.height - event.layoutMeasurement.height,
      );
      const next = getScrollChromeProgress(
        event.contentOffset.y,
        previousOffset.get(),
        maxOffset,
        hiddenProgress.get(),
        headerHeight,
      );

      // Изменение размеров или восстановление позиции не считаем жестом пользователя.
      if (previousViewportHeight.get() === event.layoutMeasurement.height) {
        const delta = next.offset - previousOffset.get();
        if (delta !== 0) direction.set(Math.sign(delta));
        hiddenProgress.set(next.progress);
      }
      previousViewportHeight.set(event.layoutMeasurement.height);
      previousOffset.set(next.offset);
    },
    onEndDrag: () => {
      if (!focused || keepVisible || direction.get() === 0) return;
      hiddenProgress.set(
        withSpring(
          direction.get() > 0 && previousOffset.get() >= headerHeight ? 1 : 0,
          {
            duration: 400,
            dampingRatio: 1,
            overshootClamping: true,
          },
        ),
      );
    },
    onMomentumEnd: () => {
      if (!focused || keepVisible || direction.get() === 0) return;
      hiddenProgress.set(
        withSpring(
          direction.get() > 0 && previousOffset.get() >= headerHeight ? 1 : 0,
          {
            duration: 400,
            dampingRatio: 1,
            overshootClamping: true,
          },
        ),
      );
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: keepVisible ? 0 : -headerHeight * hiddenProgress.get() },
    ],
  }));

  return { onScroll, headerStyle };
}
