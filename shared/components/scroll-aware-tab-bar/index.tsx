import { useScrollChrome } from "@/shared/lib/navigation/scroll-chrome";
import { BottomTabBar, type BottomTabBarProps } from "expo-router/tabs";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

/** Сдвигает стандартный навбар только на указанной вкладке; остальные сохраняют обычную компоновку. */
export function ScrollAwareTabBar({
  collapseOnRoute,
  ...props
}: BottomTabBarProps & { collapseOnRoute: string }) {
  const { hiddenProgress, keepVisible } = useScrollChrome();
  const height = useSharedValue(0);
  const collapsible =
    props.state.routes[props.state.index].name === collapseOnRoute;
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          collapsible && !keepVisible ? hiddenProgress.get() * height.get() : 0,
      },
    ],
  }));

  return (
    // На главной панель вне потока: её движение не меняет высоту списка и позицию строк.
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
