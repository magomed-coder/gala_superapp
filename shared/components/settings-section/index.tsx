import { useAppTheme } from "@/shared/theme";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

/** Группирует связанные настройки; подписи остаются вне общей округлой поверхности. */
export function SettingsSection({
  title,
  footer,
  children,
}: {
  title?: string;
  footer?: string;
  children: ReactNode;
}) {
  const theme = useAppTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {/* Название раздела не повторяет заголовок страницы. */}
      {title && (
        <Text
          accessibilityRole="header"
          style={{
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          }}
        >
          {title}
        </Text>
      )}
      <View
        style={{
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.radius.xxl,
          borderCurve: "continuous",
          overflow: "hidden",
          paddingHorizontal: theme.spacing.md,
        }}
      >
        {children}
      </View>
      {footer && (
        <Text
          style={{
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          }}
        >
          {footer}
        </Text>
      )}
    </View>
  );
}
