import { useRegistrationDraftLifecycle } from "@/features/auth/hooks/use-registration-draft-lifecycle";
import { IconButton } from "@/shared/components/icon-button";
import { useAppTheme } from "@/shared/theme";
import { Stack, useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

/** Общая тематическая шапка форм с возвратом в профиль даже при открытии прямой ссылки. */
export default function AuthLayout() {
  const theme = useAppTheme();
  const router = useRouter();

  useRegistrationDraftLifecycle();

  /** Завершает ввод и открывает гостевой профиль по действию «Позже». */
  const skip = () => {
    router.dismissTo("/(tabs)/profile");
  };

  /** Возвращает к предыдущему экрану, а при пустой истории открывает гостевой профиль. */
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.background.primary },
        headerTintColor: theme.colors.text.primary,
        headerTitleStyle: { fontFamily: theme.typography.fontFamily.medium },
        contentStyle: { backgroundColor: theme.colors.background.primary },
        headerTitle: () => null,
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Продолжить без входа"
            onPress={skip}
            style={({ pressed }) => ({
              minWidth: 44,
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: theme.spacing.xs,
              opacity: pressed ? theme.opacity.pressed : 1,
            })}
          >
            <Text
              style={{
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.md,
                color: theme.colors.text.tertiary,
              }}
            >
              Позже
            </Text>
          </Pressable>
        ),
        headerLeft: () => (
          <IconButton
            icon="arrow-back"
            label="Назад"
            onPress={goBack}
            style={{ width: 48, height: 48 }}
          />
        ),
      }}
    >
      {/* Каждая бизнес-задача остаётся самостоятельной страницей. */}
      <Stack.Screen name="login" options={{ title: "Вход" }} />
      <Stack.Screen name="register" options={{ title: "Регистрация" }} />
      <Stack.Screen
        name="register-email"
        options={{ title: "Электронная почта" }}
      />
      <Stack.Screen
        name="register-password"
        options={{ title: "Создание пароля" }}
      />
      <Stack.Screen name="role-select" options={{ headerShown: false }} />
    </Stack>
  );
}
