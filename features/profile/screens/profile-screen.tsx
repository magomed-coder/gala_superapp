import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { ProfileMenuGroup } from "@/features/profile/components/profile-menu-group";
import { AllinText } from "@/shared/components/allin-text";
import { AppFooter } from "@/shared/components/app-footer";
import Switch from "@/shared/components/switch";
import { darkTheme, useAppTheme, useThemeMode } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Компактная карточка аккаунта и сгруппированные настройки по референсу. */
export default function ProfileScreen() {
  const theme = useAppTheme();
  const { setMode } = useThemeMode();
  const router = useRouter();
  const { width, fontScale } = useWindowDimensions();
  const compactBanner = width < 360 || fontScale > 1.2;
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const name = user?.name?.trim() || "Ваш профиль";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("ru");
  const bodyStyle = {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  };

  /** Завершает демонстрационную сессию после подтверждения пользователя. */
  const confirmLogout = () => {
    logout();
    setLogoutVisible(false);
    router.replace("/(auth)/login");
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}
          contentContainerStyle={{
            padding: theme.spacing.md,
            // Системную область снизу уже учитывает навбар.
            paddingBottom: theme.spacing.xxxl,
            gap: theme.spacing.lg,
          }}
        >
          {/* Карточка ведёт к редактированию аккаунта или ко входу для гостя. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              user ? "Редактировать профиль" : "Войти в аккаунт"
            }
            onPress={() =>
              router.push(user ? "/(tabs)/profile/edit" : "/(auth)/login")
            }
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: theme.spacing.sm,
              padding: theme.spacing.md,
              borderRadius: theme.radius.xxl,
              borderCurve: "continuous",
              backgroundColor: theme.colors.background.elevated,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <View
              style={{
                width: theme.components.avatar.lg,
                height: theme.components.avatar.lg,
                borderRadius: theme.radius.full,
                overflow: "hidden",
                backgroundColor: theme.colors.brand.light,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {user?.avatar && failedAvatar !== user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  onError={() => setFailedAvatar(user.avatar)}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                />
              ) : user ? (
                <Text
                  style={{
                    ...bodyStyle,
                    color: theme.colors.brand.primary,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  {initials}
                </Text>
              ) : (
                <Ionicons
                  name="person-outline"
                  size={theme.components.icon.md}
                  color={theme.colors.brand.primary}
                />
              )}
            </View>
            <View style={{ flex: 1, gap: theme.spacing.xxs }}>
              <Text
                style={{
                  ...bodyStyle,
                  fontFamily: theme.typography.fontFamily.medium,
                }}
              >
                {name}
              </Text>
              {user ? (
                <Text
                  style={{
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  {user.email || user.phone || "Личные данные"}
                </Text>
              ) : (
                <AllinText
                  style={{
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.md,
                    color: theme.colors.text.tertiary,
                  }}
                >
                  Войдите в аккаунт ALLIN
                </AllinText>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={theme.components.icon.xs}
              color={theme.colors.text.tertiary}
            />
          </Pressable>

          {/* Акцентный блок ведёт в существующее избранное. Его фон остаётся тёмным в обеих темах. */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Открыть избранное"
            onPress={() => router.navigate("/(tabs)/favorites")}
            style={({ pressed }) => ({
              borderRadius: theme.radius.xxl,
              borderCurve: "continuous",
              overflow: "hidden",
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <LinearGradient
              colors={[
                darkTheme.colors.background.elevated,
                darkTheme.colors.border.strong,
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: theme.spacing.md,
                gap: theme.spacing.sm,
                minHeight: 104,
              }}
            >
              <Ionicons
                name="sparkles"
                size={theme.components.icon.xl}
                color={theme.colors.brand.primary}
              />
              <View style={{ flex: 1, gap: theme.spacing.xxs }}>
                <Text
                  style={{
                    ...bodyStyle,
                    color: darkTheme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  Ваше избранное
                </Text>
                <Text
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    lineHeight: theme.typography.lineHeight.sm,
                    fontFamily: theme.typography.fontFamily.regular,
                    color: darkTheme.colors.text.secondary,
                  }}
                >
                  Услуги и предложения, которые вы сохранили
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: theme.spacing.xxs,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radius.full,
                  borderWidth: 1,
                  borderColor: darkTheme.colors.border.strong,
                  backgroundColor: darkTheme.colors.background.tertiary,
                }}
              >
                {!compactBanner && (
                  <Text
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      color: darkTheme.colors.text.primary,
                    }}
                  >
                    Открыть
                  </Text>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={theme.components.icon.xs}
                  color={darkTheme.colors.text.primary}
                />
              </View>
            </LinearGradient>
          </Pressable>

          {/* Основные настройки и переключатель общей темы приложения. */}
          <ProfileMenuGroup
            items={[
              {
                label: "Настройки профиля",
                icon: "settings-outline",
                route: "/(tabs)/profile/settings",
              },
              {
                label: "Мои заказы",
                icon: "receipt-outline",
                route: "/(tabs)/orders",
              },
              {
                label: "Способы оплаты",
                icon: "card-outline",
                route: "/(tabs)/profile/payments",
              },
              {
                label: "Мои адреса",
                icon: "location-outline",
                route: "/(tabs)/profile/addresses",
              },
            ]}
          >
            <View
              style={{
                minHeight: theme.components.listItem.height,
                paddingVertical: theme.spacing.xs,
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.sm,
              }}
            >
              <Ionicons
                name="moon-outline"
                size={theme.components.icon.sm}
                color={theme.colors.text.tertiary}
              />
              <Text style={{ ...bodyStyle, flex: 1 }}>Тёмная тема</Text>
              <View
                style={{
                  minWidth: 52,
                  minHeight: 44,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Switch
                  accessibilityLabel="Тёмная тема"
                  thumbColor={theme.colors.brand.onPrimary}
                  value={theme.mode === "dark"}
                  onValueChange={(enabled) =>
                    setMode(enabled ? "dark" : "light")
                  }
                  activeTrackColor={theme.colors.brand.primary}
                  inactiveTrackColor={theme.colors.border.strong}
                />
              </View>
            </View>
          </ProfileMenuGroup>
          {/* Защита аккаунта и уведомления сохраняют самостоятельные экраны. */}
          <ProfileMenuGroup
            items={[
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
          <ProfileMenuGroup
            items={[
              {
                label: "Помощь и поддержка",
                icon: "help-circle-outline",
                route: "/(tabs)/profile/support",
              },
              {
                label: "О приложении",
                icon: "information-circle-outline",
                route: "/(tabs)/profile/about",
              },
            ]}
          />

          {/* Выход доступен только при наличии текущего аккаунта. */}
          {user && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Выйти из аккаунта"
              onPress={() => setLogoutVisible(true)}
              style={({ pressed }) => ({
                minHeight: 48,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: theme.spacing.xs,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Ionicons
                name="log-out-outline"
                size={theme.components.icon.sm}
                color={theme.colors.status.error}
              />
              <Text style={{ ...bodyStyle, color: theme.colors.status.error }}>
                Выйти из аккаунта
              </Text>
            </Pressable>
          )}
          <AppFooter />
        </ScrollView>
      </SafeAreaView>

      {/* Подтверждение выхода поддерживает отмену и системную кнопку назад. */}
      <Modal
        transparent
        visible={logoutVisible}
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.background.overlay,
            padding: theme.spacing.lg,
          }}
        >
          <View
            accessibilityViewIsModal
            style={{
              width: "100%",
              maxWidth: 400,
              padding: theme.spacing.lg,
              gap: theme.spacing.md,
              borderRadius: theme.radius.xxl,
              backgroundColor: theme.colors.background.elevated,
            }}
          >
            <Text
              accessibilityRole="header"
              style={{
                ...bodyStyle,
                fontSize: theme.typography.fontSize.title,
                fontFamily: theme.typography.fontFamily.bold,
              }}
            >
              Выйти из аккаунта?
            </Text>
            <Text style={{ ...bodyStyle, color: theme.colors.text.secondary }}>
              Вы сможете снова войти в любой момент.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={confirmLogout}
              style={({ pressed }) => ({
                minHeight: 48,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.background.secondary,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text style={{ ...bodyStyle, color: theme.colors.status.error }}>
                Выйти
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setLogoutVisible(false)}
              style={({ pressed }) => ({
                minHeight: 48,
                justifyContent: "center",
                alignItems: "center",
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text style={bodyStyle}>Отмена</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
