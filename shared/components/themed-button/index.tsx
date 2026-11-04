import { useMemo, type ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { ThemeTokens, useAppTheme } from "@/shared/theme";

type ButtonVariant = "solid" | "outline" | "ghost";

type ButtonProps = {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

/** Подбирает цвета существующего варианта кнопки из активной темы. */
function resolveVariantColors(
  variant: ButtonVariant,
  colors: ReturnType<typeof useAppTheme>["colors"],
) {
  if (variant === "outline") {
    return {
      backgroundColor: colors.background.secondary,
      borderColor: colors.border.default,
      textColor: colors.text.primary,
    };
  }

  if (variant === "ghost") {
    return {
      backgroundColor: colors.background.elevated,
      borderColor: colors.border.subtle,
      textColor: colors.text.primary,
    };
  }

  return {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
    textColor: colors.brand.onPrimary,
  };
}

/** Кнопка действия; сохраняет размеры и доступную подпись во время загрузки. */
export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = "solid",
  leftIcon,
  rightIcon,
  style,
  textStyle,
  accessibilityLabel,
}: ButtonProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const variantColors = resolveVariantColors(variant, theme.colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      aria-busy={!!loading}
      accessibilityState={{
        disabled: !!(disabled || loading),
        busy: !!loading,
      }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantColors.backgroundColor,
          borderColor: variantColors.borderColor,
        },
        style,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {/* Контент сохраняет высоту при загрузке, индикатор расположен поверх него. */}
      <View style={[styles.content, loading && { opacity: 0 }]}>
        {leftIcon}
        {label ? (
          <Text
            style={[
              styles.text,
              {
                color: variantColors.textColor,
                fontFamily: theme.typography.fontFamily.medium,
                fontSize: theme.typography.fontSize.body,
              },
              textStyle,
            ]}
          >
            {label}
          </Text>
        ) : null}
        {rightIcon}
      </View>
      {loading && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={variantColors.textColor}
        />
      )}
    </Pressable>
  );
}

/** Стили кнопки допускают перенос подписи при увеличенном системном шрифте. */
const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    button: {
      minHeight: 44,
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 12,
      paddingVertical: theme.spacing.xs,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
    },
    text: {
      flexShrink: 1,
      textAlign: "center",
      fontFamily: theme.typography.fontFamily.medium,
    },
    pressed: {
      opacity: 0.72,
    },
    disabled: {
      opacity: 0.7,
    },
  });
