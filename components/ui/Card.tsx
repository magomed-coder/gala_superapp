// components/ui/Card.tsx
import { BorderRadius, Colors, Shadows, Spacing } from "@/lib/design-system";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "default" | "elevated";
  pressable?: boolean;
  onPress?: () => void;
}

export default function Card({
  children,
  style,
  variant = "default",
  pressable = false,
  onPress,
}: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: variant === "elevated" ? 0 : 1,
    borderColor: Colors.gray[200],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...(variant === "elevated" && Shadows.md),
  };

  const content = <View style={[cardStyle, style]}>{children}</View>;

  if (pressable && onPress) {
    return (
      <View
        style={[
          styles.container,
          {
            borderRadius: BorderRadius.lg,
            overflow: "hidden",
          },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
});
