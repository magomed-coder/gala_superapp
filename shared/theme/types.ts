export type ThemeMode = "light" | "dark";

export type ColorTokens = {
  background: {
    primary: string;
    grouped: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    inverse: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverted: string;
    inverse: string;
    link: string;
  };
  border: {
    subtle: string;
    default: string;
    strong: string;
    focus: string;
  };
  brand: {
    primary: string;
    primaryMuted: string;
    pressed: string;
    light: string;
    muted: string;
    onPrimary: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  tabBar: {
    background: string;
    active: string;
    inactive: string;
    indicator: string;
    shadow: string;
  };
  splash: {
    backgroundStart: string;
    backgroundEnd: string;
    core: string;
    glow: string;
    particlePrimary: string;
    particleSecondary: string;
    particleAccent: string;
    textPrimary: string;
    textSecondary: string;
  };

  skeleton: {
    base: string;
    highlight: string;
  };

  divider: string;
  shadow: string;
};

export type SpacingTokens = {
  xxxs: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
};

export type RadiusTokens = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
};

export type TypographyTokens = {
  fontFamily: {
    thin: string;
    extraLight: string;
    light: string;
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    titleSm: number;
    h3: number;
    display: number;

    caption: number;
    body: number;
    bodyLg: number;
    title: number;
    h2: number;
    h1: number;
  };
  lineHeight: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    titleSm: number;
    h3: number;
    display: number;

    caption: number;
    body: number;
    bodyLg: number;
    title: number;
    h2: number;
    h1: number;
  };
};

export type ElevationTokens = {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type ComponentTokens = {
  button: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
  };
  input: {
    height: number;
    borderRadius: number;
    paddingHorizontal: number;
  };
  search: {
    height: number;
    borderRadius: number;
  };
  card: {
    borderRadius: number;
    padding: number;
    gap: number;
  };
  avatar: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  icon: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  tabBar: {
    height: number;
    icon: number;
  };
  fab: {
    size: number;
  };
  chip: {
    height: number;
    radius: number;
  };
  listItem: {
    height: number;
  };
  header: {
    height: number;
  };
  bottomSheet: {
    radius: number;
  };
  headerButton: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    borderRadius: number;
  };
};

export type MotionTokens = {
  fast: number;
  normal: number;
  slow: number;
};

export type OpacityTokens = {
  disabled: number;
  pressed: number;
  hover: number;
};

export type ZIndexTokens = {
  header: number;
  fab: number;
  modal: number;
  toast: number;
  overlay: number;
};

export type ThemeTokens = {
  mode: ThemeMode;
  colors: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  typography: TypographyTokens;
  elevation: ElevationTokens;
  components: ComponentTokens;
  motion: MotionTokens;
  opacity: OpacityTokens;
  zIndex: ZIndexTokens;
};
