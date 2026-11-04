import { Stack } from "expo-router";
import { useAppTheme } from "@/shared/theme";

export const unstable_settings = { anchor: "index" };

/** Единая шапка вложенных страниц; корневой профиль остаётся без заголовка. */
export default function ProfileLayout() {
  const theme = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background.grouped },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: theme.colors.background.grouped },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Профиль", headerShown: false }}
      />
      <Stack.Screen name="edit" options={{ title: "Личные данные" }} />
      <Stack.Screen name="addresses" options={{ title: "Мои адреса" }} />
      <Stack.Screen name="add-address" options={{ title: "Новый адрес" }} />
      <Stack.Screen name="settings" options={{ title: "Настройки" }} />
      <Stack.Screen name="payments" options={{ title: "Способы оплаты" }} />
      <Stack.Screen name="security" options={{ title: "Безопасность" }} />
      <Stack.Screen name="notifications" options={{ title: "Уведомления" }} />
      <Stack.Screen name="support" options={{ title: "Помощь и поддержка" }} />
      <Stack.Screen name="about" options={{ title: "О приложении" }} />
      <Stack.Screen name="orders" options={{ headerShown: false }} />
    </Stack>
  );
}
