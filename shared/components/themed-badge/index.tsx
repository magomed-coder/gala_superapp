import { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/shared/theme";

export type BadgeStatus = "online" | "offline" | "away" | "busy";

export type BadgeProps = {
  status?: BadgeStatus;
  count?: number;
  maxCount?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

function resolveBadgeColor(
  theme: ReturnType<typeof useAppTheme>,
  status?: BadgeStatus,
  color?: string,
) {
  if (color) {
    return color;
  }

  switch (status) {
    case "online":
      return theme.colors.status.success;
    case "away":
      return theme.colors.status.warning;
    case "busy":
      return theme.colors.status.error;
    case "offline":
      return theme.colors.text.tertiary;
    default:
      return theme.colors.brand.primary;
  }
}

function getCountLabel(count: number, maxCount: number) {
  if (count <= 0) {
    return null;
  }

  return count > maxCount ? `${maxCount}+` : String(count);
}

export function Badge({
  status,
  count,
  maxCount = 99,
  color,
  style,
  textStyle,
}: BadgeProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(), []);

  const content = count === undefined ? null : getCountLabel(count, maxCount);

  if (count !== undefined && count <= 0) {
    return null;
  }

  const badgeColor = resolveBadgeColor(theme, status, color);
  const isDot = content === null;

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.badge,
        isDot ? styles.dot : styles.withText,
        {
          backgroundColor: badgeColor,
          borderColor: theme.colors.background.secondary,
        },
        style,
      ]}
    >
      {!isDot ? (
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.brand.onPrimary,
              fontFamily: theme.typography.fontFamily.bold,
            },
            textStyle,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {content}
        </Text>
      ) : null}
    </View>
  );
}

const createStyles = () =>
  StyleSheet.create({
    badge: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1.5,
      overflow: "hidden",
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
    },
    withText: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      paddingHorizontal: 5,
    },
    text: {
      fontSize: 10,
      lineHeight: 12,
      textAlign: "center",
      includeFontPadding: false,
    },
  });
