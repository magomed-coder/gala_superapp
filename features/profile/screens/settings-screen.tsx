import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";
import { ProfilePage } from "@/features/profile/components/profile-page";
import { SettingsSection } from "@/shared/components/settings-section";
import { SettingsRow } from "@/shared/components/settings-row";
import { useAppTheme, useThemeMode } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

/** Настройки аккаунта и общий сохранённый выбор темы приложения. */
export default function SettingsScreen() {
  const theme = useAppTheme();
  const { mode, setMode } = useThemeMode();
  return (
    <ProfilePage>
      {/* Переходы используют существующие страницы аккаунта. */}
      <ProfileMenuGroup
        items={[
          {
            label: "Личные данные",
            icon: "person-outline",
            route: "/(tabs)/profile/edit",
          },
          {
            label: "Безопасность",
            icon: "shield-checkmark-outline",
            route: "/(tabs)/profile/security",
          },
          {
            label: "Уведомления",
            icon: "notifications-outline",
            route: "/(tabs)/profile/notifications",
          },
        ]}
      />
      {/* Отметка имеет постоянную ширину: выбор не сдвигает подписи. */}
      <SettingsSection
        title="Оформление"
        footer="Выбранная тема применяется ко всему приложению."
      >
        {(
          [
            {
              value: "system",
              title: "Как на устройстве",
              icon: "phone-portrait-outline",
            },
            { value: "light", title: "Светлая", icon: "sunny-outline" },
            { value: "dark", title: "Тёмная", icon: "moon-outline" },
          ] as const
        ).map((item, index) => (
          <SettingsRow
            key={item.value}
            title={item.title}
            icon={item.icon}
            selected={mode === item.value}
            onPress={() => setMode(item.value)}
            divider={index < 2}
            trailing={
              <View
                style={{
                  width: theme.components.icon.md,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={theme.components.icon.sm}
                  color={theme.colors.brand.primary}
                  style={{ opacity: mode === item.value ? 1 : 0 }}
                />
              </View>
            }
          />
        ))}
      </SettingsSection>
    </ProfilePage>
  );
}
