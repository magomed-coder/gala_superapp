import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useAuthStore } from "@/contexts/auth.store";
import { FONTS } from "../constants";
import { useAppVersionStore } from "../contexts/version.store";
import { queryClient } from "../shared/api/queryClient";
import { sleep } from "../shared/helpers/sleep";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

// Минимальная длительность отображения сплаш скрина в миллисекундах
const MIN_SPLASH_DURATION = 5000;

export default function RootLayout() {
  const router = useRouter();
  const { initialize, isInitializing } = useAuthStore();
  const { checkForUpdate, needsForceUpdate } = useAppVersionStore();
  const splashStartTime = useRef(Date.now());
  const [splashMinDurationReached, setSplashMinDurationReached] =
    useState(false);

  const [fontsLoaded, error] = useFonts({
    [FONTS.RobotoRegular]: require("../assets/fonts/Roboto-Regular.ttf"),
    [FONTS.RobotoMedium]: require("../assets/fonts/Roboto-Medium.ttf"),
    [FONTS.RobotoBold]: require("../assets/fonts/Roboto-Bold.ttf"),

    [FONTS.UbuntuLight]: require("../assets/fonts/Ubuntu-Light.ttf"),
    [FONTS.UbuntuRegular]: require("../assets/fonts/Ubuntu-Regular.ttf"),
    [FONTS.UbuntuMedium]: require("../assets/fonts/Ubuntu-Medium.ttf"),
    [FONTS.UbuntuBold]: require("../assets/fonts/Ubuntu-Bold.ttf"),

    [FONTS.InterRegular]: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    [FONTS.InterSemiBold]: require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    [FONTS.InterBold]: require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    const initializeApp = async () => {
      // await Promise.all([checkForUpdate(), initialize()]);

      // Гарантируем минимум 5 секунд отображения сплаша
      const elapsedTime = Date.now() - splashStartTime.current;

      if (elapsedTime < MIN_SPLASH_DURATION) {
        await sleep(MIN_SPLASH_DURATION - elapsedTime);
      }

      // Разрешаем закрыть сплаш
      setSplashMinDurationReached(true);

      // Проверяем нужен ли force update
      if (needsForceUpdate()) {
        router.replace("/force-update");
      }
    };

    initializeApp();
  }, [checkForUpdate, initialize, needsForceUpdate, router]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
