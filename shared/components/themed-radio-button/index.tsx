import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/shared/theme";

const DURATION = 200;
const CONFIG = { damping: 14, mass: 1, stiffness: 190 };

interface RadioButtonProps {
  disable?: boolean;
  pressed?: boolean;
  onPressHandle?: () => void;
  style?: StyleProp<ViewStyle>;
  activeColor?: string;
  inactiveColor?: string;
}

export const RadioButton = memo(
  ({
    disable,
    pressed = false,
    onPressHandle = () => {},
    style,
    activeColor,
    inactiveColor,
  }: RadioButtonProps) => {
    const theme = useAppTheme();
    const styles = useMemo(() => createStyles(), []);
    const radioButtonScale = useSharedValue(0);
    const radioButtonOpacity = useSharedValue(0);
    const [isChecked, setIsChecked] = useState(pressed);

    const resolvedActiveColor = activeColor ?? theme.colors.brand.primary;
    const resolvedInactiveColor =
      inactiveColor ?? theme.colors.background.secondary;

    useEffect(() => {
      setIsChecked(pressed);
    }, [pressed]);

    const onPressCheckBox = useCallback(() => {
      onPressHandle();
    }, [onPressHandle]);

    const animatedCheckBoxStyle = useAnimatedStyle(() => ({
      opacity: radioButtonOpacity.value,
      transform: [{ scale: radioButtonScale.value }],
    }));

    useEffect(() => {
      radioButtonOpacity.value = withTiming(isChecked ? 1 : 0, {
        duration: DURATION,
      });
      radioButtonScale.value = isChecked
        ? withDelay(0, withSpring(1, CONFIG))
        : withDelay(0, withTiming(0, { duration: 120 }));
    }, [isChecked, radioButtonOpacity, radioButtonScale]);

    return (
      <Pressable
        disabled={disable}
        onPress={onPressCheckBox}
        hitSlop={8}
        accessibilityRole="radio"
        accessibilityState={{ checked: isChecked, disabled: disable }}
        style={({ pressed: isPressed }) => [
          styles.mainWrapper,
          {
            borderColor: disable
              ? theme.colors.border.subtle
              : isChecked
                ? resolvedActiveColor
                : theme.colors.border.default,
            backgroundColor: disable
              ? theme.colors.background.secondary
              : isChecked
                ? resolvedActiveColor
                : resolvedInactiveColor,
            borderRadius: theme.radius.full,
          },
          disable && styles.disabledView,
          isPressed && !disable && styles.pressedView,
          style,
        ]}
      >
        <Animated.View
          style={[
            styles.radioCheckedWrapper,
            {
              backgroundColor: theme.colors.brand.onPrimary,
            },
            disable && styles.disableCheckedWrapper,
            animatedCheckBoxStyle,
          ]}
        >
          <View
            style={[
              styles.radioChecked,
              {
                backgroundColor: isChecked
                  ? resolvedActiveColor
                  : theme.colors.background.secondary,
              },
            ]}
          />
        </Animated.View>
      </Pressable>
    );
  },
);

const createStyles = () =>
  StyleSheet.create({
    mainWrapper: {
      width: 24,
      height: 24,
      borderWidth: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    disabledView: {
      opacity: 0.55,
    },
    pressedView: {
      opacity: 0.82,
    },
    radioCheckedWrapper: {
      width: 16,
      height: 16,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
    },
    disableCheckedWrapper: {
      opacity: 0.65,
    },
    radioChecked: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
  });
