import { ProfilePage } from "@/features/profile/components/profile-page";
import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";
import { SettingsRow } from "@/shared/components/settings-row";
import { SettingsSection } from "@/shared/components/settings-section";

/** Помогает найти нужный раздел; не предлагает вымышленные контакты поддержки. */
export default function SupportScreen() {
  return (
    <ProfilePage>
      {/* Частые задачи доступны через действующие маршруты. */}
      <SettingsSection title="С чем нужна помощь?">
        <SettingsRow
          icon="receipt-outline"
          title="Где посмотреть заказ?"
          description="Откройте «Заказы» в нижнем меню. Нажмите на заказ, чтобы посмотреть его детали."
          divider
        />
        <SettingsRow
          icon="location-outline"
          title="Как изменить основной адрес?"
          description="В разделе «Мои адреса» выберите нужный адрес. Отметка покажет, какой адрес используется по умолчанию."
          divider
        />
        <SettingsRow
          icon="moon-outline"
          title="Как изменить тему?"
          description="В настройках выберите светлую, тёмную тему или оформление устройства."
        />
      </SettingsSection>
      <ProfileMenuGroup
        items={[
          {
            label: "Мои заказы",
            icon: "receipt-outline",
            route: "/(tabs)/orders",
          },
          {
            label: "Мои адреса",
            icon: "location-outline",
            route: "/(tabs)/profile/addresses",
          },
          {
            label: "Настройки",
            icon: "settings-outline",
            route: "/(tabs)/profile/settings",
          },
        ]}
      />
      {/* Контакты появятся после подключения поддержки. */}
      <SettingsSection title="Связаться с нами">
        <SettingsRow
          icon="chatbubbles-outline"
          title="Поддержка пока недоступна"
          description="Чат и контакты службы поддержки появятся здесь, когда будут доступны."
        />
      </SettingsSection>
    </ProfilePage>
  );
}
