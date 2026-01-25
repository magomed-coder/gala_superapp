import React from "react";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";

interface ButtonProps {
  label?: string;
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  style,
}) => {
  const buttonText = label || title || "Button";
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[styles.label, styles[`labelSize_${size}`]]}
        weight="semibold"
      >
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#FF6B6B",
  },
  secondary: {
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  danger: {
    backgroundColor: "#FF4444",
  },
  size_small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  size_medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  size_large: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: "#FFFFFF",
  } as TextStyle,
  labelSize_small: {
    fontSize: 12,
  },
  labelSize_medium: {
    fontSize: 14,
  },
  labelSize_large: {
    fontSize: 16,
  },
});
