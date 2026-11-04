import { Stack } from "expo-router";
import { useAppTheme } from "@/shared/theme";

export const unstable_settings = { anchor: "index" };

/** Список открывается без хедера; детали сохраняют заголовок и кнопку возврата. */
export default function OrdersLayout() {
  const theme = useAppTheme();
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background.grouped },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.bold },
        contentStyle: { backgroundColor: theme.colors.background.grouped },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Заказы", headerShown: false }}
      />
      <Stack.Screen name="detail" options={{ title: "Детали заказа" }} />
    </Stack>
  );
}
