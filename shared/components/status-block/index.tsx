import { Ionicons } from "@expo/vector-icons";
import { useMemo, type ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppTheme, type ThemeTokens } from "@/shared/theme";

export type StatusBlockVariant =
  | "loading"
  | "empty"
  | "error"
  | "info"
  | "success";

type StatusBlockProps = {
  title: string;
  description?: string;
  variant?: StatusBlockVariant;
  icon?: ReactNode;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

function getDefaultIcon(variant: StatusBlockVariant, color: string) {
  if (variant === "loading") {
    return <ActivityIndicator size="small" color={color} />;
  }

  if (variant === "error") {
    return <Ionicons name="alert-circle-outline" size={44} color={color} />;
  }

  if (variant === "success") {
    return <Ionicons name="checkmark-circle-outline" size={44} color={color} />;
  }

  if (variant === "info") {
    return (
      <Ionicons name="information-circle-outline" size={44} color={color} />
    );
  }

  return <Ionicons name="search-outline" size={44} color={color} />;
}

function resolveAccentColor(theme: ThemeTokens, variant: StatusBlockVariant) {
  if (variant === "error") {
    return theme.colors.status.error;
  }

  if (variant === "success") {
    return theme.colors.status.success;
  }

  if (variant === "info") {
    return theme.colors.status.info;
  }

  if (variant === "loading") {
    return theme.colors.brand.primary;
  }

  return theme.colors.text.tertiary;
}

export function StatusBlock({
  title,
  description,
  variant = "empty",
  icon,
  action,
  style,
  contentStyle,
}: StatusBlockProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const accentColor = resolveAccentColor(theme, variant);
  const resolvedIcon = icon ?? getDefaultIcon(variant, accentColor);

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.colors.border.default,
          backgroundColor: theme.colors.background.secondary,
        },
        style,
      ]}
    >
      <View style={[styles.content, contentStyle]}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${accentColor}1A` },
          ]}
        >
          {resolvedIcon}
        </View>

        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text.primary,
              fontFamily: theme.typography.fontFamily.medium,
            },
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.regular,
              },
            ]}
          >
            {description}
          </Text>
        ) : null}

        {action ? <View style={styles.actionContainer}>{action}</View> : null}
      </View>
    </View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing.lg,
      marginHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderStyle: "dashed",
    },
    content: {
      alignItems: "center",
      width: "100%",
      maxWidth: 320,
    },
    iconContainer: {
      width: 96,
      height: 96,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.typography.fontSize.bodyLg,
      lineHeight: theme.typography.lineHeight.bodyLg,
      textAlign: "center",
      marginBottom: theme.spacing.xs,
    },
    description: {
      fontSize: theme.typography.fontSize.body,
      lineHeight: theme.typography.lineHeight.body,
      textAlign: "center",
    },
    actionContainer: {
      marginTop: theme.spacing.md,
      width: "100%",
      alignItems: "center",
    },
  });
