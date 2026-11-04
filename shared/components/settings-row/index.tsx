import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type SettingsRowProps = {
  title: string;
  description?: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  trailing?: ReactNode;
  divider?: boolean;
  selected?: boolean;
};

/** Строка сведений или перехода; trailing заменяет стрелку контролом фиксированной ширины. */
export function SettingsRow({
  title,
  description,
  icon,
  onPress,
  trailing,
  divider,
  selected,
}: SettingsRowProps) {
  const theme = useAppTheme();
  const content = (
    <>
      {icon && (
        <Ionicons
          name={icon}
          size={theme.components.icon.sm}
          color={theme.colors.text.tertiary}
        />
      )}
      {/* Текст переносится, правая область не меняет ширину при выборе. */}
      <View style={{ flex: 1, gap: theme.spacing.xxs }}>
        <Text
          style={{
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
          }}
        >
          {title}
        </Text>
        {description && (
          <Text
            selectable={!onPress}
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.md,
              lineHeight: theme.typography.lineHeight.md,
            }}
          >
            {description}
          </Text>
        )}
      </View>
      {trailing ??
        (onPress && (
          <Ionicons
            name="chevron-forward"
            size={theme.components.icon.xs}
            color={theme.colors.text.tertiary}
          />
        ))}
    </>
  );
  const style = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    minHeight: theme.components.listItem.height,
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: divider ? 1 : 0,
    borderBottomColor: theme.colors.border.subtle,
  };

  return onPress ? (
    <Pressable
      accessibilityLabel={title}
      accessibilityHint={description}
      accessibilityRole={selected === undefined ? "button" : "radio"}
      aria-checked={selected}
      accessibilityState={
        selected === undefined ? undefined : { checked: selected }
      }
      onPress={onPress}
      style={({ pressed }) => [
        style,
        { opacity: pressed ? theme.opacity.pressed : 1 },
      ]}
    >
      {content}
    </Pressable>
  ) : (
    <View style={style}>{content}</View>
  );
}
