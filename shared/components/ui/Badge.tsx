import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./Text";

interface BadgeProps {
  label: string;
  variant?: "primary" | "success" | "warning" | "danger";
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = "primary" }) => {
  return (
    <View style={[styles.badge, styles[variant]]}>
      <Text size="xs" weight="semibold" color="#FFFFFF">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  primary: {
    backgroundColor: "#FF6B6B",
  },
  success: {
    backgroundColor: "#4CAF50",
  },
  warning: {
    backgroundColor: "#FFA500",
  },
  danger: {
    backgroundColor: "#FF4444",
  },
});
