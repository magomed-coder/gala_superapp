import { Input, type InputProps } from "@/shared/components/themed-input";
import { useAppTheme } from "@/shared/theme";
import { useId, useState } from "react";
import { Text, View } from "react-native";

type AuthFieldProps = InputProps & {
  label: string;
  message: string;
  invalid?: boolean;
  password?: boolean;
};

/** Лёгкое поле с нижней линией по референсу; ошибки и кнопка пароля не меняют его размеры. */
export function AuthField({
  label,
  message,
  invalid = false,
  password = false,
  ...props
}: AuthFieldProps) {
  const theme = useAppTheme();
  const messageId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ gap: theme.spacing.xxs }}>
      {/* Кнопка пароля имеет постоянную область нажатия, рамка меняет только цвет. */}
      <Input
        {...props}
        accessibilityLabel={label}
        accessibilityHint={invalid ? message : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? messageId : undefined}
        secureTextEntry={password && !visible}
        rightIcon={
          password ? (visible ? "eye-off-outline" : "eye-outline") : undefined
        }
        rightIconAccessibilityLabel={
          visible ? "Скрыть пароль" : "Показать пароль"
        }
        onRightIconPress={
          password ? () => setVisible((value) => !value) : undefined
        }
        containerStyle={{ marginBottom: 0 }}
        inputContainerStyle={{
          minHeight: theme.components.input.height,
          paddingHorizontal: theme.spacing.xs,
          backgroundColor: theme.colors.background.primary,
          borderRadius: 0,
          borderWidth: 0,
          borderBottomWidth: 1,
          ...(invalid && { borderColor: theme.colors.status.error }),
        }}
        inputStyle={{
          fontSize: theme.typography.fontSize.lg,
          paddingHorizontal: 0,
          paddingVertical: theme.spacing.sm,
        }}
      />

      {/* Тот же текст остаётся в потоке при успехе: ошибки не двигают соседние поля и кнопку. */}
      <Text
        nativeID={messageId}
        selectable
        accessibilityLiveRegion="polite"
        accessibilityElementsHidden={!invalid}
        importantForAccessibility={invalid ? "auto" : "no-hide-descendants"}
        aria-hidden={!invalid}
        style={{
          fontFamily: theme.typography.fontFamily.regular,
          fontSize: theme.typography.fontSize.sm,
          lineHeight: theme.typography.lineHeight.sm,
          color: theme.colors.status.error,
          opacity: invalid ? 1 : 0,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
