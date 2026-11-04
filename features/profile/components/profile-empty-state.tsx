import { StatusBlock } from "@/shared/components/status-block";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";

/** Пустой раздел профиля с пояснением и доступным следующим действием. */
export function ProfileEmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  action?: ReactNode;
}) {
  const theme = useAppTheme();
  return (
    <StatusBlock
      title={title}
      description={description}
      action={action}
      icon={
        <Ionicons
          name={icon}
          size={theme.components.icon.xl}
          color={theme.colors.text.secondary}
        />
      }
      style={{
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto",
        marginHorizontal: 0,
        marginBottom: 0,
        borderWidth: 0,
        borderRadius: theme.radius.xxl,
        backgroundColor: theme.colors.background.elevated,
        paddingVertical: theme.spacing.xxl,
      }}
    />
  );
}
