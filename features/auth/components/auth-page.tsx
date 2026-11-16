import { AllinLogo } from "@/shared/components/allin-logo";
import { Button } from "@/shared/components/themed-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { useHeaderHeight } from "expo-router/react-navigation";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthPageProps = {
  children: ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  footer: string;
  linkLabel: string;
  href: Href;
  step?: 1 | 2 | 3;
  loading?: boolean;
  error?: string;
};

/** Экран по референсу: логотип, крупный заголовок, лёгкая форма и контрастное главное действие. */
export function AuthPage({
  children,
  title,
  description,
  actionLabel,
  onAction,
  footer,
  linkLabel,
  href,
  step,
  loading = false,
  error,
}: AuthPageProps) {
  const theme = useAppTheme();
  const headerHeight = useHeaderHeight();
  const bodyStyle = {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.md,
    color: theme.colors.text.secondary,
  };

  return (
    <SafeAreaView
      edges={["left", "right", "bottom"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={headerHeight}
      >
        {/* На маленьком экране и с клавиатурой вся форма, действие и ссылки остаются в прокрутке. */}
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.xl,
            paddingBottom: theme.spacing.lg,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 440,
              flexGrow: 1,
              gap: theme.spacing.xl,
            }}
          >
            {/* Наш логотип добавлен над заголовком и меняет цвет вместе с темой. */}
            <AllinLogo
              cropped
              width={112}
              style={{ tintColor: theme.colors.text.primary }}
            />

            {/* Stack сохраняет доступное название маршрута, визуальный заголовок находится в содержимом. */}
            <View style={{ gap: theme.spacing.xs }}>
              <Text
                accessibilityRole="header"
                style={{
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.h2,
                  lineHeight: theme.typography.lineHeight.h2,
                  color: theme.colors.text.primary,
                }}
              >
                {title}
              </Text>
              <Text style={bodyStyle}>{description}</Text>
            </View>

            {/* Резерв для двух полей выравнивает главное действие на всех шагах; крупный шрифт может увеличить блок. */}
            <View
              style={{
                minHeight:
                  theme.components.input.height * 2 +
                  theme.typography.lineHeight.sm * 2 +
                  theme.spacing.xs * 3,
                gap: theme.spacing.xs,
              }}
            >
              {children}
            </View>

            <View style={{ gap: theme.spacing.lg }}>
              {/* Три точки всегда занимают одинаковую область, активная отличается только цветом. */}
              {step !== undefined && (
                <View
                  accessible
                  accessibilityRole="progressbar"
                  accessibilityLabel="Регистрация"
                  accessibilityValue={{
                    min: 1,
                    max: 3,
                    now: step,
                    text: `Шаг ${step} из 3`,
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: theme.spacing.sm,
                    paddingVertical: theme.spacing.xs,
                  }}
                >
                  {[1, 2, 3].map((number) => (
                    <View
                      key={number}
                      style={{
                        width: theme.spacing.xs,
                        height: theme.spacing.xs,
                        borderRadius: theme.radius.full,
                        backgroundColor:
                          number === step
                            ? theme.colors.brand.primary
                            : theme.colors.border.default,
                      }}
                    />
                  ))}
                </View>
              )}

              {/* Серверная ошибка имеет зарезервированную область и не очищает поля формы. */}
              {error !== undefined && (
                <Text
                  accessibilityLiveRegion="polite"
                  style={{
                    ...bodyStyle,
                    minHeight: theme.typography.lineHeight.md * 3,
                    color: theme.colors.status.error,
                  }}
                >
                  {error}
                </Text>
              )}
              {/* Кнопка контрастная как в референсе; общая реализация сохраняет pressed/disabled/loading. */}
              <Button
                variant="contrast"
                label={actionLabel}
                onPress={onAction}
                loading={loading}
                style={{
                  minHeight: theme.components.button.height,
                  borderRadius: theme.radius.sm,
                }}
                textStyle={{ fontSize: theme.typography.fontSize.lg }}
              />

              {/* Альтернативный сценарий расположен слева и отделён от основного действия. */}
              <View
                style={{ alignItems: "flex-start", gap: theme.spacing.xxs }}
              >
                <Text style={bodyStyle}>{footer}</Text>
                <Link href={href} replace asChild>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel={linkLabel}
                    style={({ pressed }) => ({
                      minHeight: 44,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.spacing.xs,
                      paddingVertical: theme.spacing.xs,
                      opacity: pressed ? theme.opacity.pressed : 1,
                    })}
                  >
                    {/* Общая строка удерживает стрелку рядом с текстом и в web-версии Link. */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: theme.spacing.xs,
                      }}
                    >
                      <Text
                        style={{
                          ...bodyStyle,
                          flexShrink: 1,
                          fontFamily: theme.typography.fontFamily.medium,
                          color: theme.colors.brand.primary,
                        }}
                      >
                        {linkLabel}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={theme.components.icon.xs}
                        color={theme.colors.brand.primary}
                      />
                    </View>
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* Письмо с подтверждением не требуется для регистрации по выбранной настройке проекта. */}
            <Text
              style={{
                ...bodyStyle,
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.sm,
                color: theme.colors.text.tertiary,
                paddingTop: theme.spacing.xs,
              }}
            >
              Вход по почте и паролю · подтверждение почты не требуется.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
