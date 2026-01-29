import { FONTS } from "@/constants";
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
} from "react-native";

/**
 * Формат варианта шрифта: "r500.16" или "u700.18"
 * где:
 * - `r` — Roboto
 * - `u` — Ubuntu
 * - `500/700` — font weight
 * - `16` — font size
 */
export type ThemedTextProps = TextProps & {
  /**
   * Формат варианта шрифта: "r500.16" или "u700.18"
   */
  variant?: string;
  /**
   * Альтернативный тип для совместимости: h1, h2, p1, p2
   */
  type?: "h1" | "h2" | "p1" | "p2";
  color?: string;
  style?: StyleProp<TextStyle>;
};

type FontFamilyCode = "r" | "u";
type FontWeight = 300 | 400 | 500 | 700;

export function Text({
  children,
  variant = "u500.16",
  type,
  color = "#000",
  style,
  ...rest
}: ThemedTextProps) {
  const styleToApply = type ? getTypeStyle(type) : parseVariant(variant);
  return (
    <RNText style={[{ color }, styleToApply, style]} {...rest}>
      {children}
    </RNText>
  );
}
// type,
// fontFamily = "Ubuntu",
// weight = "regular",
// size = "base",
// color = "#000",

// style, const fontSize = {
//   xs: 12,
//   sm: 14,
//   base: 16,
//   lg: 18,
//   xl: 20,
//   "2xl": 24,
//   "3xl": 30,
// }[size];

// const fontFamily = {
//   regular: "Inter-Regular",
//   semibold: "Inter-SemiBold",
//   bold: "Inter-Bold",
// }[weight];

const typeStyles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  p1: {
    fontSize: 16,
    fontWeight: "normal",
    lineHeight: 24,
  },
  p2: {
    fontSize: 14,
    fontWeight: "normal",
    lineHeight: 20,
  },
});

function getTypeStyle(type?: "h1" | "h2" | "p1" | "p2") {
  switch (type) {
    case "h1":
      return typeStyles.h1;
    case "h2":
      return typeStyles.h2;
    case "p1":
      return typeStyles.p1;
    case "p2":
      return typeStyles.p2;
    default:
      return undefined;
  }
}

const FONT_MAP: Record<FontFamilyCode, Partial<Record<FontWeight, string>>> = {
  r: {
    400: FONTS.RobotoRegular,
    500: FONTS.RobotoMedium,
    700: FONTS.RobotoBold,
  },
  u: {
    300: FONTS.UbuntuLight,
    400: FONTS.UbuntuRegular,
    500: FONTS.UbuntuMedium,
    700: FONTS.UbuntuBold,
  },
};

function parseVariant(variant?: string): TextStyle | undefined {
  if (!variant) return undefined;
  // Поддержка r400.12 или r400.12.12 (последнее — lineHeight)
  const match = variant.match(/^([a-z])([3475]00)\.(\d{1,2})(?:\.(\d{1,3}))?$/);
  if (!match) return undefined;
  const [, familyCode, weightStr, sizeStr, lineHeightStr] = match;
  const weight = parseInt(weightStr, 10) as FontWeight;
  const fontSize = parseInt(sizeStr, 10);
  const fontFamily = FONT_MAP[familyCode as FontFamilyCode]?.[weight];
  if (!fontFamily) {
    if (__DEV__) console.warn(`Unsupported font variant: ${variant}`);
    return undefined;
  }
  // Если явно указан lineHeight (например, r400.12.12), используем его, иначе считаем автоматически
  const lineHeight = lineHeightStr
    ? parseInt(lineHeightStr, 10)
    : Math.round(fontSize * 1.2);
  return {
    fontSize,
    lineHeight,
    fontFamily,
  };
}
