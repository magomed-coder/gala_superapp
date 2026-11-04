import { useCallback, useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useAppTheme } from "@/shared/theme";

const CONTAINER_WIDTH = 44;
const PADDING = 2;
const THUMB_WIDTH = 24;
const TRANSLATE_X = CONTAINER_WIDTH - PADDING * 2 - THUMB_WIDTH;

type IOSSwitchProps = {
  accessibilityLabel?: string;
  onValueChange: (newValue: boolean) => void;
  value: boolean;
  disabled?: boolean;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  thumbColor?: string;
  style?: StyleProp<ViewStyle>;
  thumbContainerStyle?: StyleProp<ViewStyle>;
};

const Switch: React.FC<IOSSwitchProps> = ({
  accessibilityLabel,
  onValueChange,
  value,
  disabled = false,
  activeTrackColor,
  inactiveTrackColor,
  thumbColor,
  style,
  thumbContainerStyle,
}: IOSSwitchProps) => {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);
  const translateX = useSharedValue(value ? TRANSLATE_X : 0);

  const resolvedActiveTrackColor =
    activeTrackColor ?? theme.colors.brand.primary;
  const resolvedInactiveTrackColor =
    inactiveTrackColor ?? theme.colors.border.default;
  const resolvedThumbColor = thumbColor ?? theme.colors.brand.onPrimary;

  useEffect(() => {
    translateX.value = withSpring(value ? TRANSLATE_X : 0, {
      damping: 15,
      stiffness: 120,
      mass: 1,
    });
  }, [value, translateX]);

  const trackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        translateX.value,
        [0, TRANSLATE_X],
        [resolvedInactiveTrackColor, resolvedActiveTrackColor],
      ),
    };
  }, [resolvedActiveTrackColor, resolvedInactiveTrackColor, translateX]);

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = useCallback(() => {
    onValueChange(!value);
  }, [onValueChange, value]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      aria-checked={value}
      aria-disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.pressable,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Animated.View style={[styles.container, trackStyle]}>
        <Animated.View
          style={[
            styles.thumb,
            { backgroundColor: resolvedThumbColor },
            animatedThumbStyle,
            styles.shadow,
            disabled && styles.thumbDisabled,
            thumbContainerStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

const createStyles = () =>
  StyleSheet.create({
    pressable: {
      alignSelf: "flex-start",
    },
    pressed: {
      opacity: 0.82,
    },
    container: {
      width: CONTAINER_WIDTH,
      height: 28,
      padding: PADDING,
      borderRadius: 14,
      justifyContent: "center",
      overflow: "hidden",
    },
    thumb: {
      width: THUMB_WIDTH,
      height: THUMB_WIDTH,
      borderRadius: 12,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.18,
      shadowRadius: 2.5,
      elevation: 3,
    },
    thumbDisabled: {
      opacity: 0.72,
    },
  });

export default Switch;
