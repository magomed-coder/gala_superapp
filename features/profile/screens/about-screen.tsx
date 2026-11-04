import { ProfilePage } from "@/features/profile/components/profile-page";
import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";
import { AllinLogo } from "@/shared/components/allin-logo";
import { AllinText } from "@/shared/components/allin-text";
import { SettingsSection } from "@/shared/components/settings-section";
import { SettingsRow } from "@/shared/components/settings-row";
import { useAppTheme } from "@/shared/theme";
import Constants from "expo-constants";
import { View } from "react-native";

/** Сведения о приложении с версией из конфигурации текущей сборки. */
export default function AboutScreen() {
  const theme = useAppTheme();
  return (
    <ProfilePage>
      {/* Отдельный знак бренда и краткое назначение приложения. */}
      <View
        style={{
          alignItems: "center",
          gap: theme.spacing.md,
          paddingVertical: theme.spacing.lg,
        }}
      >
        <AllinLogo
          width={112}
          style={{ tintColor: theme.colors.text.primary }}
        />
        <AllinText
          style={{
            textAlign: "center",
            color: theme.colors.text.secondary,
            fontFamily: theme.typography.fontFamily.regular,
            fontSize: theme.typography.fontSize.lg,
            lineHeight: theme.typography.lineHeight.lg,
          }}
        >
          ALLIN — услуги и предложения в одном приложении.
        </AllinText>
      </View>
      <SettingsSection title="Информация">
        <SettingsRow
          title="Версия приложения"
          description={Constants.expoConfig?.version || "Не указана"}
          icon="information-circle-outline"
          divider
        />
        <SettingsRow
          title="Разработчик"
          description="cupicom.ru"
          icon="code-slash-outline"
        />
      </SettingsSection>
      <ProfileMenuGroup
        items={[
          {
            label: "Помощь и поддержка",
            icon: "help-circle-outline",
            route: "/(tabs)/profile/support",
          },
        ]}
      />
    </ProfilePage>
  );
}
