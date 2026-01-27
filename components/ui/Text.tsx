import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  weight?: "regular" | "semibold" | "bold";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  color?: string;
}

export const Text = ({
  weight = "regular",
  size = "base",
  color = "#000",
  style,
  children,
  ...props
}: CustomTextProps) => {
  const fontFamily = {
    regular: "Inter-Regular",
    semibold: "Inter-SemiBold",
    bold: "Inter-Bold",
  }[weight];

  const fontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  }[size];

  return (
    <RNText
      {...props}
      style={[
        {
          fontFamily,
          fontSize,
          color,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
};
