import { useAppTheme } from "@/shared/theme";
import { Text, type TextProps } from "react-native";

type AllinTextProps = Omit<TextProps, "children"> & { children: string };

/** Показывает название бренда обычным текстом, сохраняя тему, переносы и системное масштабирование. */
export function AllinText({
  children,
  style,
  allowFontScaling = true,
  accessibilityLabel,
  ...props
}: AllinTextProps) {
  const theme = useAppTheme();

  return (
    <Text
      {...props}
      allowFontScaling={allowFontScaling}
      accessibilityLabel={accessibilityLabel ?? children}
      style={[
        {
          fontSize: theme.typography.fontSize.lg,
          color: theme.colors.text.primary,
        },
        style,
      ]}
    >
      {/* Вся подпись остаётся текстом, поэтому логотип не разрывает строку и её базовую линию. */}
      {children}
    </Text>
  );
}
