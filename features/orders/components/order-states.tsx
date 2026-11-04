import { StatusBlock } from "@/shared/components/status-block";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

/** Постоянная строка обновления резервирует место под ошибку и индикатор без сдвига контента. */
export function OrderRefreshBar({
  description,
  busy,
  failed,
  onRefresh,
}: {
  description: string;
  busy: boolean;
  failed: boolean;
  onRefresh: () => void;
}) {
  const theme = useAppTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
      }}
    >
      {/* Две строки растут вместе с Dynamic Type, даже когда подпись занимает одну. */}
      <View
        style={{
          flex: 1,
          minHeight: theme.typography.lineHeight.md * 2 * fontScale,
          justifyContent: "center",
        }}
      >
        <Text
          accessibilityLiveRegion="polite"
          style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.md,
            lineHeight: theme.typography.lineHeight.md,
          }}
        >
          {failed ? "Не удалось обновить" : description}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          failed ? "Повторить обновление заказов" : "Обновить заказы"
        }
        accessibilityState={{ disabled: busy, busy }}
        aria-busy={busy}
        disabled={busy}
        onPress={onRefresh}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.radius.full,
          opacity: busy
            ? theme.opacity.disabled
            : pressed
              ? theme.opacity.pressed
              : 1,
        })}
      >
        {busy ? (
          <ActivityIndicator size="small" color={theme.colors.text.secondary} />
        ) : (
          <Ionicons
            name={failed ? "alert-circle-outline" : "refresh-outline"}
            size={theme.components.icon.sm}
            color={
              failed ? theme.colors.status.error : theme.colors.text.secondary
            }
          />
        )}
      </Pressable>
    </View>
  );
}

/** Действие восстановления списка или перехода в каталог; disabled сохраняет размеры. */
export function OrderAction({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const theme = useAppTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: theme.components.button.height,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.brand.primary,
        opacity: disabled
          ? theme.opacity.disabled
          : pressed
            ? theme.opacity.pressed
            : 1,
      })}
    >
      <Text
        style={{
          color: theme.colors.brand.onPrimary,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Пустой результат и ошибка используют общий StatusBlock без декоративной рамки. */
export function OrderState({
  title,
  description,
  action,
  error = false,
}: {
  title: string;
  description: string;
  action: ReactNode;
  error?: boolean;
}) {
  const theme = useAppTheme();
  return (
    <StatusBlock
      title={title}
      description={description}
      variant={error ? "error" : "empty"}
      icon={
        error ? undefined : (
          <Ionicons
            name="receipt-outline"
            size={theme.components.icon.xl}
            color={theme.colors.text.tertiary}
          />
        )
      }
      action={action}
      style={{
        marginHorizontal: 0,
        marginBottom: 0,
        borderWidth: 0,
        backgroundColor: theme.colors.background.grouped,
        paddingVertical: theme.spacing.xxxl,
      }}
    />
  );
}

/** Неподвижные скелетоны занимают место карточек, пока первая загрузка не завершена. */
export function OrdersSkeleton() {
  const theme = useAppTheme();
  return (
    <View
      testID="orders-loading"
      accessibilityLabel="Загружаем заказы"
      accessibilityState={{ busy: true }}
      style={{ gap: theme.spacing.sm }}
    >
      {[0, 1, 2].map((key) => (
        <View
          key={key}
          accessible={false}
          style={{
            padding: theme.spacing.md,
            gap: theme.spacing.md,
            borderRadius: theme.radius.xxl,
            backgroundColor: theme.colors.background.elevated,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: theme.spacing.sm,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: theme.components.avatar.lg,
                height: theme.components.avatar.lg,
                borderRadius: theme.radius.lg,
                backgroundColor: theme.colors.skeleton.base,
              }}
            />
            <View style={{ flex: 1, gap: theme.spacing.xs }}>
              <View
                style={{
                  width: "72%",
                  height: theme.typography.lineHeight.md,
                  borderRadius: theme.radius.xs,
                  backgroundColor: theme.colors.skeleton.base,
                }}
              />
              <View
                style={{
                  width: "40%",
                  height: theme.typography.lineHeight.sm,
                  borderRadius: theme.radius.xs,
                  backgroundColor: theme.colors.skeleton.base,
                }}
              />
            </View>
          </View>
          {["90%", "52%"].map((width) => (
            <View
              key={width}
              style={{
                width: width as `${number}%`,
                height: theme.typography.lineHeight.md,
                borderRadius: theme.radius.xs,
                backgroundColor: theme.colors.skeleton.base,
              }}
            />
          ))}
          {/* Высота строки суммы и разделителя совпадает с карточкой заказа. */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.subtle,
              paddingTop: theme.spacing.sm,
            }}
          >
            <View
              style={{
                width: "68%",
                height: theme.typography.lineHeight.titleSm,
                borderRadius: theme.radius.xs,
                backgroundColor: theme.colors.skeleton.base,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
