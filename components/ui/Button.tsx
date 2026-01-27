import { Text } from "@/components/ui/Text2";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

const BUTTON_HEIGHT = 51.5;

export type ButtonVariant = "primary" | "secondary" | "danger" | "link";

interface ThemedButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Иконка слева */
  iconLeft?: React.ReactNode;
  /** Иконка справа */
  iconRight?: React.ReactNode;
  /** Отступы для контейнера иконок */
  iconContainerStyle?: ViewStyle;
}

export const Button: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  iconLeft,
  iconRight,
  iconContainerStyle,
}) => {
  // Цвета для профессионального синего дизайна
  const backgroundColor =
    variant === "link"
      ? "transparent"
      : disabled
        ? "#D0DFE8"
        : variant === "primary"
          ? "#162635"
          : variant === "secondary"
            ? "#A6D5DF"
            : "#D95757";

  const textColor =
    variant === "link"
      ? "#162635" // navy цвет ссылки
      : variant === "secondary"
        ? "#1A1A1A"
        : "#FFFFFF";

  const underline = variant === "link";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, width: fullWidth ? "100%" : undefined },
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.content}>
          {iconLeft && (
            <View style={[styles.iconContainer, iconContainerStyle]}>
              {iconLeft}
            </View>
          )}

          <Text
            style={[
              styles.text,
              { color: textColor },
              underline && styles.linkText,
              textStyle,
            ]}
          >
            {title}
          </Text>

          {iconRight && (
            <View style={[styles.iconContainer, iconContainerStyle]}>
              {iconRight}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: BUTTON_HEIGHT,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginHorizontal: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    textDecorationLine: "underline",
    // fontWeight: "500",
  },
});
