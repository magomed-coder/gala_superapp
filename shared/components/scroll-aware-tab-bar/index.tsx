import { useScrollChrome } from "@/shared/lib/navigation/scroll-chrome";
import { usePathname } from "expo-router";
import { BottomTabBar, type BottomTabBarProps } from "expo-router/tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

/** Сдвигает навбар только на заданных страницах; вложенные детали сохраняют обычную компоновку. */
export function ScrollAwareTabBar({
  collapseOnPaths,
  ...props
}: BottomTabBarProps & { collapseOnPaths: readonly string[] }) {
  const { hiddenProgress, keepVisible } = useScrollChrome();
  const height = useSharedValue(0);
  const pathname = usePathname();
  const collapsible = collapseOnPaths.includes(pathname);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          collapsible && !keepVisible ? hiddenProgress.get() * height.get() : 0,
      },
    ],
  }));

  return (
    // На страницах со скрытием панель вне потока: её движение не меняет высоту списка и позицию строк.
    <Animated.View
      testID="main-tab-bar"
      onLayout={(event) => height.set(event.nativeEvent.layout.height)}
      style={[
        collapsible && { position: "absolute", bottom: 0, left: 0, right: 0 },
        animatedStyle,
      ]}
    >
      <BottomTabBar {...props} />
    </Animated.View>
  );
}
