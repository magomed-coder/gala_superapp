import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useAppTheme } from "@/shared/theme";

type FavoriteButtonProps = {
  isFavorite: boolean;
  onPress: () => void;
  size?: number;
  activeColor?: string;
  inactiveColor?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function FavoriteButton({
  isFavorite,
  onPress,
  size = 24,
  activeColor,
  inactiveColor,
  disabled = false,
  style,
}: FavoriteButtonProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const resolvedActiveColor = activeColor ?? theme.colors.status.error;
  const resolvedInactiveColor = inactiveColor ?? theme.colors.text.tertiary;

  useEffect(() => {
    if (!isFavorite) {
      return;
    }

    scale.value = withSequence(
      withTiming(1.16, { duration: 90 }),
      withTiming(1, { duration: 110 }),
    );
  }, [isFavorite, scale]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? "Удалить из избранного" : "Добавить в избранное"
      }
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={size}
          color={isFavorite ? resolvedActiveColor : resolvedInactiveColor}
        />
      </Animated.View>
    </Pressable>
  );
}

const createStyles = () =>
  StyleSheet.create({
    button: {
      justifyContent: "center",
      alignItems: "center",
      padding: 4,
    },
    pressed: {
      opacity: 0.75,
    },
    disabled: {
      opacity: 0.45,
    },
  });
