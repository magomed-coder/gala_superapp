import { useAppTheme } from "@/shared/theme";
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  type TextProps,
} from "react-native";

const BRAND_MARK = require("@/assets/brand/allin-wordmark-cropped.png");
const BRAND_ASPECT_RATIO = 1532 / 428;

type AllinTextProps = Omit<TextProps, "children"> & { children: string };

/** Заменяет название бренда в подписи знаком высотой с её шрифт, сохраняя переносы и доступное название. */
export function AllinText({
  children,
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier,
  accessibilityLabel,
  ...props
}: AllinTextProps) {
  const theme = useAppTheme();
  const { fontScale } = useWindowDimensions();
  const textStyle = StyleSheet.flatten(style);
  const fontSize = textStyle?.fontSize ?? theme.typography.fontSize.lg;
  const scale = allowFontScaling
    ? maxFontSizeMultiplier && maxFontSizeMultiplier > 0
      ? Math.min(fontScale, maxFontSizeMultiplier)
      : fontScale
    : 1;
  const height = fontSize * scale;
  const color = textStyle?.color ?? theme.colors.text.primary;

  return (
    <Text
      {...props}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      accessibilityLabel={accessibilityLabel ?? children}
      style={[{ fontSize, color }, style]}
    >
      {/* Размер изображения известен заранее: его загрузка не сдвигает строку. */}
      {children
        .split(/(\bALLIN\b)/gi)
        .map((part, index) =>
          /^ALLIN$/i.test(part) ? (
            <Image
              key={index}
              source={BRAND_MARK}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no"
              resizeMode="contain"
              tintColor={color}
              style={{ width: height * BRAND_ASPECT_RATIO, height }}
            />
          ) : (
            part
          ),
        )}
    </Text>
  );
}
