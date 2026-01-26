// components/ui/Badge.tsx
import { BorderRadius, Colors, Spacing, Typography } from "@/lib/design-system";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "small" | "medium";
  style?: ViewStyle;
}

export function Badge({
  label,
  variant = "default",
  size = "medium",
  style,
}: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case "success":
        return {
          backgroundColor: Colors.successLight,
          color: Colors.success,
        };
      case "warning":
        return {
          backgroundColor: Colors.warningLight,
          color: Colors.warning,
        };
      case "error":
        return {
          backgroundColor: Colors.errorLight,
          color: Colors.error,
        };
      case "info":
        return {
          backgroundColor: Colors.infoLight,
          color: Colors.info,
        };
      default:
        return {
          backgroundColor: Colors.gray[100],
          color: Colors.gray[700],
        };
    }
  };

  const variantStyle = getVariantStyle();
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: variantStyle.backgroundColor,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.md,
          paddingVertical: isSmall ? Spacing.xs : Spacing.sm,
        },
        style,
      ]}
    >
      <Text
        style={[
          isSmall ? Typography.caption : Typography.captionMedium,
          {
            color: variantStyle.color,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
});
