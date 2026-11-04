import { useAppTheme } from "@/shared/theme";
import { useHeaderHeight } from "expo-router/react-navigation";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Задаёт отступы дочерних страниц; заголовок и нижнюю safe area уже учитывает навигация. */
export function ProfilePage({
  children,
  form = false,
}: {
  children: ReactNode;
  form?: boolean;
}) {
  const theme = useAppTheme();
  const headerHeight = useHeaderHeight();

  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.grouped }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={form}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        {/* Формы прокручиваются над клавиатурой; обычные страницы используют те же направляющие. */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: theme.spacing.md,
            paddingBottom: theme.spacing.xxxl,
            gap: theme.spacing.lg,
          }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Внутренний отступ формы на общей поверхности раздела. */
export function ProfileFormFields({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  return (
    <View style={{ paddingVertical: theme.spacing.md, gap: theme.spacing.xs }}>
      {children}
    </View>
  );
}
