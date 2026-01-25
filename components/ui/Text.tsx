import { FONTS } from "@/constants";
import {
  Text as RNText,
  StyleProp,
  StyleSheet,
  TextProps,
  TextStyle,
} from "react-native";

export type ThemedTextProps = TextProps & {
  /**
   * Формат варианта шрифта: "r500.16" или "u700.18"
   * где:
   * - `r` — Roboto
   * - `u` — Ubuntu
   * - `500/700` — font weight
   * - `16` — font size
   */
  variant?: string;
  style?: StyleProp<TextStyle>;
};

// Коды семейств и веса
type FontFamilyCode = "r" | "u";
type FontWeight = 300 | 400 | 500 | 700;

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

function parseVariant(variant: string): TextStyle | undefined {
  const match = variant.match(/^([a-z])(\d{3})\.(\d{1,2})$/);
  if (!match) return undefined;

  const [, familyCode, weightStr, sizeStr] = match;
  const weight = parseInt(weightStr, 10) as FontWeight;
  const fontSize = parseInt(sizeStr, 10);
  const fontFamily = FONT_MAP[familyCode as FontFamilyCode]?.[weight];

  if (!fontFamily) {
    __DEV__ && console.warn(`Unsupported font variant: ${variant}`);
    return undefined;
  }

  return {
    fontSize,
    lineHeight: Math.round(fontSize * 1.5),
    fontFamily,
  };
}

export function Text({
  children,
  variant = "u500.18",
  style,
  ...rest
}: ThemedTextProps) {
  const variantStyle = parseVariant(variant);

  return (
    <RNText style={[styles.default, variantStyle, style]} {...rest}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  default: {
    color: "#000",
  },
});
