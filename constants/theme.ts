export const colors = {
  primary: "#667eea",
  primaryDark: "#5a67d8",
  accent: "#64b5f6",
  secondary: "#9AA9C0",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#666666",
  border: "#E5E7EB",
  success: "#43cea2",
  warning: "#FFD600",
  error: "#FF4757",
  info: "#81C784",
  muted: "#F5F5F7",
  disabled: "#E0E0E0",
  shadow: "rgba(0,0,0,0.08)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
};

export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const opacity = {
  disabled: 0.5,
  pressed: 0.7,
  overlay: 0.6,
};

export const zIndices = {
  base: 1,
  header: 10,
  modal: 100,
  toast: 1000,
};

export const hitSlop = {
  top: 8,
  bottom: 8,
  left: 8,
  right: 8,
};

export const lineHeights = {
  xs: 16,
  sm: 20,
  base: 24,
  md: 28,
  lg: 32,
  xl: 36,
  "2xl": 40,
  "3xl": 48,
};

export const durations = {
  fast: 100,
  normal: 250,
  slow: 400,
  modal: 300,
};

export const breakpoints = {
  sm: 320,
  md: 375,
  lg: 425,
  xl: 768,
};

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  "2xl": 40,
};

export const transitions = {
  default: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
  fast: "all 0.1s cubic-bezier(0.4,0,0.2,1)",
  slow: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
};

export const touchables = {
  activeOpacity: 0.7,
  hitSlop,
};

export const fontFamilies = {
  regular: "System",
  medium: "System",
  semibold: "System",
  bold: "System",
  monospace: "monospace",
};

export const letterSpacings = {
  xs: 0,
  sm: 0.1,
  base: 0.2,
  md: 0.25,
  lg: 0.5,
  xl: 1,
};

export const textVariants = {
  heading: {
    fontSize: fontSizes["2xl"],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights["2xl"],
    color: colors.text,
    fontFamily: fontFamilies.bold,
  },
  subheading: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.xl,
    color: colors.text,
    fontFamily: fontFamilies.semibold,
  },
  body: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.base,
    color: colors.text,
    fontFamily: fontFamilies.regular,
  },
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.sm,
    color: colors.textSecondary,
    fontFamily: fontFamilies.regular,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.md,
    color: colors.primary,
    fontFamily: fontFamilies.semibold,
  },
};

export const theme = {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
  opacity,
  zIndices,
  hitSlop,
  lineHeights,
  durations,
  breakpoints,
  iconSizes,
  transitions,
  touchables,
  fontFamilies,
  letterSpacings,
  textVariants,
};
