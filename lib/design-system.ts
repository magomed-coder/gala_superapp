// lib/design-system.ts
// Полная дизайн-система с минимализмом

// ============================================================================
// ЦВЕТОВАЯ ПАЛИТРА (Professional Blue)
// ============================================================================
export const Colors = {
  // Основной цвет (Professional Blue)
  primary: "#162635",
  primaryLight: "#A6D5DF",
  primaryDark: "#0F1A24",

  // Акцентные цвета (Medium Blue)
  accent: "#70AAB6",
  accentLight: "#D4E9EE",

  // Нейтральные цвета
  white: "#FFFFFF",
  black: "#162635",

  // Серая шкала (Cool grays)
  gray: {
    50: "#F8FBFC",
    100: "#EFF4F7",
    200: "#E0EAEF",
    300: "#D0DFE8",
    400: "#A6C0D0",
    500: "#7A9AAD",
    600: "#5A7A91",
    700: "#3F5A72",
    800: "#2A3D50",
    900: "#162635",
  },

  // Функциональные цвета
  success: "#70AAB6",
  successLight: "#D4E9EE",

  warning: "#E8A83E",
  warningLight: "#FDF3E6",

  error: "#D95757",
  errorLight: "#FAF0F0",

  info: "#162635",
  infoLight: "#A6D5DF",

  // Transparency
  backdrop: "rgba(0, 0, 0, 0.5)",
  overlay: "rgba(0, 0, 0, 0.1)",
};

// ============================================================================
// ТИПОГРАФИКА (Premium Minimal)
// ============================================================================
export const Typography = {
  // Заголовки (Elegant, тонкие)
  h1: {
    fontSize: 36,
    fontWeight: "300" as const,
    lineHeight: 44,
    letterSpacing: -0.7,
  },
  h2: {
    fontSize: 32,
    fontWeight: "300" as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 28,
    fontWeight: "400" as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h4: {
    fontSize: 24,
    fontWeight: "500" as const,
    lineHeight: 32,
    letterSpacing: 0,
  },

  // Основной текст
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: "400" as const,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  // Подписи (细致)
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
  captionMedium: {
    fontSize: 12,
    fontWeight: "500" as const,
    lineHeight: 18,
    letterSpacing: 0.5,
  },

  // Кнопки
  button: {
    fontSize: 16,
    fontWeight: "500" as const,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "600" as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
};

// ============================================================================
// SPACING (Отступы)
// ============================================================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

// ============================================================================
// ТЕНИ
// ============================================================================
export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  xl: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 6,
  },
};

// ============================================================================
// COMMON STYLES
// ============================================================================
export const CommonStyles = {
  // Flex containers
  flexCenter: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  flexBetween: {
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  flexStart: {
    justifyContent: "flex-start" as const,
    alignItems: "flex-start" as const,
  },

  // Backgrounds
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  screenPadding: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  contentPadding: {
    paddingHorizontal: Spacing.lg,
  },

  // Dividers
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
  },
  dividerVertical: {
    width: 1,
    backgroundColor: Colors.gray[200],
  },

  // Input
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.gray[50],
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
};

// ============================================================================
// BUTTON STYLES
// ============================================================================
export const ButtonStyles = {
  primary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  primarySmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  secondary: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};

export const ButtonTextStyles = {
  primary: {
    color: Colors.white,
    ...Typography.button,
  },
  secondary: {
    color: Colors.gray[900],
    ...Typography.button,
  },
  outline: {
    color: Colors.primary,
    ...Typography.button,
  },
};

// ============================================================================
// ANIMATION / TRANSITIONS
// ============================================================================
export const Animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  CommonStyles,
  ButtonStyles,
  ButtonTextStyles,
  Animations,
};
