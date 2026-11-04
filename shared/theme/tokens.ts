import type {
  ComponentTokens,
  ElevationTokens,
  MotionTokens,
  OpacityTokens,
  RadiusTokens,
  SpacingTokens,
  TypographyTokens,
  ZIndexTokens,
} from "@/shared/theme/types";

export const spacingTokens: SpacingTokens = {
  xxxs: 2,
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const radiusTokens: RadiusTokens = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const typographyTokens: TypographyTokens = {
  fontFamily: {
    thin: "Roboto-Regular",
    extraLight: "Roboto-Regular",
    light: "Roboto-Regular",
    regular: "Roboto-Regular",
    medium: "Roboto-Medium",
    bold: "Roboto-Bold",
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    titleSm: 18,
    title: 20,
    h3: 24,
    h2: 28,
    h1: 34,
    display: 42,

    caption: 12,
    body: 14,
    bodyLg: 16,
  },
  lineHeight: {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    titleSm: 24,
    title: 28,
    h3: 32,
    h2: 36,
    h1: 42,
    display: 52,

    caption: 16,
    body: 20,
    bodyLg: 24,
  },
};

export const elevationTokens: ElevationTokens = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
};

export const componentTokens: ComponentTokens = {
  button: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  input: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  search: {
    height: 48,
    borderRadius: 24,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
  tabBar: {
    height: 84,
    icon: 24,
  },
  fab: {
    size: 56,
  },
  chip: {
    height: 32,
    radius: 16,
  },
  listItem: {
    height: 56,
  },
  header: {
    height: 56,
  },
  bottomSheet: {
    radius: 24,
  },
  headerButton: {
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
};

export const motionTokens: MotionTokens = {
  fast: 150,
  normal: 250,
  slow: 350,
};

export const opacityTokens: OpacityTokens = {
  disabled: 0.4,
  pressed: 0.7,
  hover: 0.9,
};

export const zIndexTokens: ZIndexTokens = {
  header: 10,
  fab: 100,
  modal: 1000,
  toast: 1500,
  overlay: 999,
};
