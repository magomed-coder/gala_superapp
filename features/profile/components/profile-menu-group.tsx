import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type MenuItem = {
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  route: Href;
};

/** Объединяет связанные пункты профиля; дополнительный контрол остаётся внутри общей группы. */
export function ProfileMenuGroup({
  items,
  children,
}: {
  items: MenuItem[];
  children?: ReactNode;
}) {
  const theme = useAppTheme();
  const router = useRouter();
  return (
    <View
      style={{
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: theme.spacing.md,
      }}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.label}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => router.push(item.route)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.sm,
            minHeight: theme.components.listItem.height,
            paddingVertical: theme.spacing.sm,
            borderBottomWidth: index < items.length - 1 || children ? 1 : 0,
            borderBottomColor: theme.colors.border.subtle,
            opacity: pressed ? theme.opacity.pressed : 1,
          })}
        >
          <Ionicons
            name={item.icon}
            size={theme.components.icon.sm}
            color={theme.colors.text.tertiary}
          />
          {/* Название переносится, а место под стрелку остаётся постоянным. */}
          <Text
            style={{
              flex: 1,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.lg,
              lineHeight: theme.typography.lineHeight.lg,
              color: theme.colors.text.primary,
            }}
          >
            {item.label}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={theme.components.icon.xs}
            color={theme.colors.text.tertiary}
          />
        </Pressable>
      ))}
      {children}
    </View>
  );
}
