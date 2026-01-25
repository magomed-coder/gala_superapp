// WaveSplashScreen.tsx
import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

const { width, height } = Dimensions.get("window");
const WAVE_HEIGHT = 100;

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export const WaveSplashScreen: React.FC<SplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Анимационные значения
  const waveOffset = useSharedValue(width);
  const contentOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.9);
  const waveOpacity = useSharedValue(0);
  const letter0 = useSharedValue(0);
  const letter1 = useSharedValue(0);
  const letter2 = useSharedValue(0);
  const letter3 = useSharedValue(0);
  const letter4 = useSharedValue(0);
  const letter5 = useSharedValue(0);
  const letter6 = useSharedValue(0);
  const letterSpacings = useMemo(
    () => [letter0, letter1, letter2, letter3, letter4, letter5, letter6],
    [letter0, letter1, letter2, letter3, letter4, letter5, letter6],
  );

  // Стили для каждой буквы
  const letterStyle0 = useAnimatedStyle(() => ({
    opacity: interpolate(letter0.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter0.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle1 = useAnimatedStyle(() => ({
    opacity: interpolate(letter1.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter1.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle2 = useAnimatedStyle(() => ({
    opacity: interpolate(letter2.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter2.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle3 = useAnimatedStyle(() => ({
    opacity: interpolate(letter3.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter3.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle4 = useAnimatedStyle(() => ({
    opacity: interpolate(letter4.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter4.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle5 = useAnimatedStyle(() => ({
    opacity: interpolate(letter5.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter5.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));
  const letterStyle6 = useAnimatedStyle(() => ({
    opacity: interpolate(letter6.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{ translateY: interpolate(letter6.value, [0, 1], [20, 0], Extrapolate.CLAMP) }],
  }));

  const letterStyles = [letterStyle0, letterStyle1, letterStyle2, letterStyle3, letterStyle4, letterStyle5, letterStyle6];

  // Производное значение для волны
  const waveAnimatedProps = useAnimatedProps(() => {
    const offset = waveOffset.value;
    return {
      d: `
        M0,${WAVE_HEIGHT / 2} 
        Q${width / 4},0 ${width / 2},${WAVE_HEIGHT / 2} 
        T${width},${WAVE_HEIGHT / 2} 
        L${width},${WAVE_HEIGHT} 
        L0,${WAVE_HEIGHT} 
        Z
        M${offset},${WAVE_HEIGHT / 2} 
        Q${offset + width / 4},0 ${offset + width / 2},${WAVE_HEIGHT / 2} 
        T${offset + width},${WAVE_HEIGHT / 2} 
        L${offset + width},${WAVE_HEIGHT} 
        L${offset},${WAVE_HEIGHT} 
        Z
      `,
    };
  });

  // Стиль для волны
  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
    transform: [
      { translateX: interpolate(waveOffset.value, [width, -width], [0, 0]) },
    ],
  }));

  // Стиль для контента
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ scale: contentScale.value }],
  }));

  useEffect(() => {
    const startAnimation = () => {
      // Волна входит
      waveOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });

      waveOffset.value = withTiming(0, {
        duration: 1200,
        easing: Easing.inOut(Easing.sin),
      });

      // Контент появляется
      contentOpacity.value = withDelay(
        400,
        withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        }),
      );

      contentScale.value = withDelay(
        400,
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 200 }),
        ),
      );

      // Анимация букв по очереди
      letterSpacings.forEach((letter, index) => {
        letter.value = withDelay(
          600 + index * 80,
          withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
          }),
        );
      });

      // Исчезновение волны
      waveOpacity.value = withDelay(
        1800,
        withTiming(0, {
          duration: 400,
          easing: Easing.in(Easing.cubic),
        }),
      );

      // Завершение
      if (onAnimationComplete) {
        setTimeout(() => {
          runOnJS(handleAnimationComplete)();
        }, 2200);
      }
    };

    const handleAnimationComplete = () => {
      onAnimationComplete?.();
    };

    startAnimation();
  }, [
    contentOpacity,
    contentScale,
    letterSpacings,
    onAnimationComplete,
    waveOffset,
    waveOpacity,
  ]);

  const letters = ["S", "I", "M", "P", "L", "E"];

  return (
    <Animated.View style={styles.container}>
      {/* Волна */}
      <Animated.View style={[styles.waveContainer, waveStyle]}>
        <Svg width={width * 2} height={WAVE_HEIGHT} style={styles.wave}>
          <AnimatedPath
            animatedProps={waveAnimatedProps}
            fill="rgba(37, 99, 235, 0.08)"
          />
        </Svg>
      </Animated.View>

      {/* Контент */}
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Логотип */}
        <Svg width="64" height="64" viewBox="0 0 64 64" style={styles.logo}>
          <Path
            d="M32 12 L44 32 L32 52 L20 32 Z"
            fill="none"
            stroke="#111827"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <Circle cx="32" cy="32" r="4" fill="#2563EB" />
        </Svg>

        {/* Анимированный текст */}
        <Animated.View style={styles.textContainer}>
          <Animated.View style={styles.wordContainer}>
            {letters.map((letter, index) => (
              <Animated.Text
                key={index}
                style={[styles.letter, letterStyles[index]]}
              >
                {letter}
              </Animated.Text>
            ))}
          </Animated.View>

          <Animated.Text style={[styles.tagline, { opacity: contentOpacity }]}>
            digital minimalism
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

// Компонент для анимированного пути
const AnimatedPath = Animated.createAnimatedComponent(Path);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 9999,
  },
  waveContainer: {
    position: "absolute",
    bottom: 0,
    width: "200%",
  },
  wave: {
    position: "absolute",
    bottom: 0,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  wordContainer: {
    flexDirection: "row",
    marginBottom: 12,
  },
  letter: {
    fontSize: 36,
    fontWeight: "300",
    color: "#111827",
    marginHorizontal: 2,
  },
  tagline: {
    fontSize: 12,
    fontWeight: "400",
    color: "#6B7280",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
});
