import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { ProfilePage } from "@/features/profile/components/profile-page";
import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";
import { SettingsRow } from "@/shared/components/settings-row";
import { SettingsSection } from "@/shared/components/settings-section";

/** Объясняет доступные сведения аккаунта и ограничения функций защиты. */
export default function SecurityScreen() {
  const user = useAuthStore((state) => state.user);
  return (
    <ProfilePage>
      {/* Текущая сессия не выдаётся за подтверждённую серверную защиту. */}
      <SettingsSection title="Ваш аккаунт">
        <SettingsRow
          icon="person-circle-outline"
          title={user?.name || "Вы не вошли в аккаунт"}
          description={
            user?.email || "Войдите, чтобы просматривать личные данные."
          }
        />
      </SettingsSection>
      <SettingsSection
        title="Защита входа"
        footer="Эти функции пока недоступны в текущей версии приложения."
      >
        <SettingsRow
          icon="key-outline"
          title="Смена пароля"
          description="Пока недоступна"
          divider
        />
        <SettingsRow
          icon="shield-checkmark-outline"
          title="Двухфакторная аутентификация"
          description="Пока недоступна"
        />
      </SettingsSection>
      {/* Помощь доступна даже без авторизации. */}
      <ProfileMenuGroup
        items={[
          {
            label: "Помощь с аккаунтом",
            icon: "help-circle-outline",
            route: "/(tabs)/profile/support",
          },
        ]}
      />
    </ProfilePage>
  );
}
