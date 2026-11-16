import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { queryClient } from "@/shared/api/query-client";
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from "@/shared/api/supabase/supabase";
import { Button } from "@/shared/components/themed-button";
import { useAppTheme } from "@/shared/theme";
import { useEffect, type ReactNode } from "react";
import {
  ActivityIndicator,
  AppState,
  Platform,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Восстанавливает сессию до показа экранов и передаёт смену владельца независимому локальному профилю. */
export function AppSession({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const initializing = useAuthStore((state) => state.isInitializing);
  const failed = useAuthStore((state) => state.initializationError);

  useEffect(() => {
    let ownerId = useAuthStore.getState().user?.id ?? null;
    useProfileStore.getState().setOwner(ownerId);
    const unsubscribe = useAuthStore.subscribe((state) => {
      const nextOwner = state.user?.id ?? null;
      if (nextOwner === ownerId) return;
      ownerId = nextOwner;
      queryClient.clear();
      useProfileStore.getState().setOwner(nextOwner);
    });
    void useAuthStore.getState().initialize();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || initializing || failed) return;
    const supabase = getSupabaseClient();
    /** Обновляет токен только пока приложение активно, освобождая фоновые ресурсы. */
    const updateRefresh = (state: string | null | undefined) => {
      if (state === "active") void supabase.auth.startAutoRefresh();
      else void supabase.auth.stopAutoRefresh();
    };
    updateRefresh(AppState.currentState);
    const listener = AppState.addEventListener("change", updateRefresh);
    return () => {
      listener.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, [initializing, failed]);

  if (initializing || failed) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
      >
        {/* До восстановления сессии приватные экраны и гостевые перенаправления не появляются. */}
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: theme.spacing.lg,
            gap: theme.spacing.md,
          }}
        >
          <Text
            accessibilityLiveRegion="polite"
            style={{
              color: theme.colors.text.secondary,
              fontSize: theme.typography.fontSize.lg,
            }}
          >
            {failed
              ? isSupabaseConfigured()
                ? "Не удалось восстановить вход. Проверьте подключение и повторите."
                : "В этой сборке не настроено подключение к сервису. Перезапустите приложение после настройки подключения."
              : "Восстанавливаем вход…"}
          </Text>
          {failed && isSupabaseConfigured() ? (
            <Button
              label="Повторить"
              onPress={() => void useAuthStore.getState().initialize()}
            />
          ) : !failed ? (
            <ActivityIndicator color={theme.colors.text.secondary} />
          ) : null}
        </View>
      </SafeAreaView>
    );
  }
  return children;
}
