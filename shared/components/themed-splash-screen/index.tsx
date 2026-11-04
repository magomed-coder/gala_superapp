// src/components/SplashScreen.tsx
import { StyleSheet, View } from "react-native";
import type { ThemeTokens } from "@/shared/theme";
import { useThemedStyles } from "@/shared/theme";

export const SPLASH_DURATION_MS = 5000;

// SplashScreen.js
import { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const CORE_PULSE_DURATION_MS = 1000;
const GLOW_PULSE_DURATION_MS = 800;
const PARTICLE_APPEAR_DURATION_MS = 600;
const PARTICLE_2_DELAY_MS = 200;
const PARTICLE_3_DELAY_MS = 400;
const PARTICLE_1_ROTATION_DURATION_MS = 4000;
const PARTICLE_2_ROTATION_DURATION_MS = 5000;
const PARTICLE_3_ROTATION_DURATION_MS = 3500;
const EXIT_ELEMENT_DURATION_MS = 400;
const LOGO_REVEAL_DURATION_MS = 500;
const AFTER_LOGO_DELAY_MS = 1000;

type SplashScreenProps = {
  onFinish?: () => void;
  canFinish?: boolean;
};

export default function SplashScreen({
  onFinish,
  canFinish = false,
}: SplashScreenProps) {
  const { theme, styles: s } = useThemedStyles(createStyles);
  const finalStartedRef = useRef(false);
  const finalTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Центральное ядро
  const coreScale = useSharedValue(1);
  const coreOpacity = useSharedValue(1);
  const glowOpacity = useSharedValue(0.5);

  // Частицы
  const particle1Rotate = useSharedValue(0);
  const particle2Rotate = useSharedValue(0);
  const particle3Rotate = useSharedValue(0);
  const particle1Scale = useSharedValue(0);
  const particle2Scale = useSharedValue(0);
  const particle3Scale = useSharedValue(0);

  // Финальный логотип
  const logoOpacity = useSharedValue(0);
  const logoSacle = useSharedValue(0.5);

  // Анимация фона (плавное изменение цвета)
  const bgColor = useSharedValue(0);

  useEffect(() => {
    // Бесконечная смена фона между тёмно-синим и фиолетовым
    bgColor.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: SPLASH_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: SPLASH_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    // Пульсация ядра
    coreScale.value = withRepeat(
      withSequence(
        withTiming(1.3, {
          duration: CORE_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: CORE_PULSE_DURATION_MS,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: GLOW_PULSE_DURATION_MS }),
        withTiming(0.3, { duration: GLOW_PULSE_DURATION_MS }),
      ),
      -1,
      true,
    );

    // Появление частиц по очереди
    particle1Scale.value = withTiming(1, {
      duration: PARTICLE_APPEAR_DURATION_MS,
    });

    // Вращение частиц
    particle1Rotate.value = withRepeat(
      withTiming(360, {
        duration: PARTICLE_1_ROTATION_DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    particle2Rotate.value = withRepeat(
      withTiming(-360, {
        duration: PARTICLE_2_ROTATION_DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    particle3Rotate.value = withRepeat(
      withTiming(360, {
        duration: PARTICLE_3_ROTATION_DURATION_MS,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    const particle2Timeout = setTimeout(() => {
      particle2Scale.value = withTiming(1, {
        duration: PARTICLE_APPEAR_DURATION_MS,
      });
    }, PARTICLE_2_DELAY_MS);
    const particle3Timeout = setTimeout(() => {
      particle3Scale.value = withTiming(1, {
        duration: PARTICLE_APPEAR_DURATION_MS,
      });
    }, PARTICLE_3_DELAY_MS);

    return () => {
      clearTimeout(particle2Timeout);
      clearTimeout(particle3Timeout);
    };
  }, []);

  useEffect(() => {
    if (!canFinish || finalStartedRef.current) {
      return;
    }

    finalStartedRef.current = true;

    cancelAnimation(coreScale);
    cancelAnimation(glowOpacity);
    cancelAnimation(particle1Rotate);
    cancelAnimation(particle2Rotate);
    cancelAnimation(particle3Rotate);
    cancelAnimation(bgColor);

    coreScale.value = withTiming(0, {
      duration: EXIT_ELEMENT_DURATION_MS,
    });
    coreOpacity.value = withTiming(0, {
      duration: EXIT_ELEMENT_DURATION_MS,
    });
    particle1Scale.value = withTiming(0, {
      duration: EXIT_ELEMENT_DURATION_MS,
    });
    particle2Scale.value = withTiming(0, {
      duration: EXIT_ELEMENT_DURATION_MS,
    });
    particle3Scale.value = withTiming(0, {
      duration: EXIT_ELEMENT_DURATION_MS,
    });

    logoOpacity.value = withTiming(1, {
      duration: LOGO_REVEAL_DURATION_MS,
    });
    logoSacle.value = withTiming(1, {
      duration: LOGO_REVEAL_DURATION_MS,
      easing: Easing.bounce,
    });

    finalTimeoutRef.current = setTimeout(() => {
      onFinish?.();
    }, AFTER_LOGO_DELAY_MS);

    return () => {
      if (finalTimeoutRef.current) {
        clearTimeout(finalTimeoutRef.current);
      }
    };
  }, [canFinish, onFinish]);

  // Анимированный фон
  const bgAnimatedStyle = useAnimatedStyle(() => {
    const color =
      bgColor.value === 0
        ? theme.colors.splash.backgroundStart
        : theme.colors.splash.backgroundEnd;
    return { backgroundColor: color };
  });

  // Остальные анимированные стили
  const coreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: coreScale.value }],
    opacity: coreOpacity.value,
  }));
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));
  const particle1Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${particle1Rotate.value}deg` },
      { scale: particle1Scale.value },
    ],
  }));
  const particle2Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${particle2Rotate.value}deg` },
      { scale: particle2Scale.value },
    ],
  }));
  const particle3Style = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${particle3Rotate.value}deg` },
      { scale: particle3Scale.value },
    ],
  }));
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoSacle.value }],
  }));

  return (
    <Animated.View style={[s.container, bgAnimatedStyle]}>
      {/* Центральное ядро со свечением */}
      <Animated.View
        style={[
          s.glowRing,
          { backgroundColor: theme.colors.splash.glow },
          glowAnimatedStyle,
        ]}
      />
      <Animated.View
        style={[
          s.core,
          { backgroundColor: theme.colors.splash.core },
          coreAnimatedStyle,
        ]}
      />

      {/* Орбиты с частицами */}
      <Animated.View style={[s.orbit, particle1Style]}>
        <View
          style={[
            s.particle,
            { backgroundColor: theme.colors.splash.particlePrimary },
          ]}
        />
      </Animated.View>
      <Animated.View style={[s.orbit2, particle2Style]}>
        <View
          style={[
            s.particle,
            { backgroundColor: theme.colors.splash.particleSecondary },
          ]}
        />
      </Animated.View>
      <Animated.View style={[s.orbit3, particle3Style]}>
        <View
          style={[
            s.particle,
            { backgroundColor: theme.colors.splash.particleAccent },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
}

const createStyles = (theme: ThemeTokens) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    core: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.splash.core,
      position: "absolute",
      shadowColor: theme.colors.splash.glow,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 15,
    },
    glowRing: {
      width: 110,
      height: 110,
      borderRadius: 55,
      position: "absolute",
      backgroundColor: theme.colors.splash.glow,
      shadowColor: theme.colors.splash.glow,
      shadowOpacity: 0.6,
      shadowRadius: 25,
    },
    orbit: {
      position: "absolute",
      width: 180,
      height: 180,
      borderRadius: 90,
      alignItems: "center",
      justifyContent: "flex-start",
      top: height / 2 - 90,
      left: width / 2 - 90,
    },
    orbit2: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      alignItems: "center",
      justifyContent: "flex-start",
      top: height / 2 - 110,
      left: width / 2 - 110,
    },
    orbit3: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 130,
      alignItems: "center",
      justifyContent: "flex-start",
      top: height / 2 - 130,
      left: width / 2 - 130,
    },
    particle: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.splash.particlePrimary,
      marginTop: -8,
      marginLeft: -8,
    },
    logoContainer: {
      position: "absolute",
      alignItems: "center",
    },
    logoText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.splash.textPrimary,
      letterSpacing: 4,
      textShadowColor: theme.colors.background.overlay,
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 8,
    },
    subText: {
      fontSize: 14,
      color: theme.colors.splash.textSecondary,
      marginTop: 12,
      letterSpacing: 1,
    },
  });
