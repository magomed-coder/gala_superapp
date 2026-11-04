import { ProfilePage } from "@/features/profile/components/profile-page";
import { SettingsSection } from "@/shared/components/settings-section";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const examples = [
  {
    id: 1,
    title: "Ваша заявка принята",
    date: "26 января, 10:15",
    read: false,
    icon: "receipt-outline",
  },
  {
    id: 2,
    title: "Заказ №123 выполнен",
    date: "25 января, 18:40",
    read: true,
    icon: "checkmark-circle-outline",
  },
  {
    id: 3,
    title: "Новый промокод на скидку",
    date: "25 января, 12:00",
    read: true,
    icon: "pricetag-outline",
  },
] as const;

/** Показывает существующие примеры сообщений, явно отделяя их от реальных уведомлений. */
export default function NotificationsScreen() {
  const theme = useAppTheme();

  return (
    <ProfilePage>
      {/* Небольшой фиксированный набор примеров не требует виртуализации. */}
      <SettingsSection
        title="Примеры уведомлений"
        footer="Здесь показаны примеры. Личные уведомления пока не подключены."
      >
        {examples.map((item, index) => (
          <View
            key={item.id}
            accessibilityLabel={
              item.title +
              (item.read ? "" : ", не прочитано") +
              ", " +
              item.date
            }
            accessible
            style={{
              paddingVertical: theme.spacing.md,
              flexDirection: "row",
              gap: theme.spacing.sm,
              alignItems: "flex-start",
              borderBottomWidth: index < examples.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.border.subtle,
            }}
          >
            <Ionicons
              name={item.icon}
              size={theme.components.icon.sm}
              color={theme.colors.text.tertiary}
            />
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text
                style={{
                  fontFamily: item.read
                    ? theme.typography.fontFamily.regular
                    : theme.typography.fontFamily.medium,
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.lg,
                  lineHeight: theme.typography.lineHeight.lg,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.fontFamily.regular,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.md,
                  lineHeight: theme.typography.lineHeight.md,
                }}
              >
                {item.date}
              </Text>
            </View>
            {/* Индикатор занимает одинаковое место у прочитанных и новых сообщений. */}
            <View
              style={{
                width: theme.spacing.xs,
                height: theme.spacing.xs,
                marginTop: theme.spacing.xs,
                borderRadius: theme.radius.full,
                backgroundColor: theme.colors.brand.primary,
                opacity: item.read ? 0 : 1,
              }}
            />
          </View>
        ))}
      </SettingsSection>
    </ProfilePage>
  );
}
