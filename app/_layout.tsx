import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";

import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AllinSplashScreen } from "@/shared/components/allin-splash-screen";
import { FONTS } from "@/shared/constants";
import { useAppVersionStore } from "@/features/system/store/version.store";
import { queryClient } from "@/shared/api/query-client";
import { useAppTheme } from "@/shared/theme";

SplashScreen.preventAutoHideAsync().catch(console.warn);

export const unstable_settings = {
  anchor: "(tabs)",
};

const MIN_SPLASH_DURATION = 800;

export default function RootLayout() {
  const theme = useAppTheme();
  const router = useRouter();
  const { needsForceUpdate } = useAppVersionStore();
  const [logoReady, setLogoReady] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  const [fontsLoaded, error] = useFonts({
    [FONTS.RobotoRegular]: require("@/assets/fonts/Roboto-Regular.ttf"),
    [FONTS.RobotoMedium]: require("@/assets/fonts/Roboto-Medium.ttf"),
    [FONTS.RobotoBold]: require("@/assets/fonts/Roboto-Bold.ttf"),

    [FONTS.UbuntuLight]: require("@/assets/fonts/Ubuntu-Light.ttf"),
    [FONTS.UbuntuRegular]: require("@/assets/fonts/Ubuntu-Regular.ttf"),
    [FONTS.UbuntuMedium]: require("@/assets/fonts/Ubuntu-Medium.ttf"),
    [FONTS.UbuntuBold]: require("@/assets/fonts/Ubuntu-Bold.ttf"),

    // [FONTS.InterRegular]: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    // [FONTS.InterSemiBold]: require("../assets/fonts/Inter_18pt-SemiBold.ttf"),
    // [FONTS.InterBold]: require("../assets/fonts/Inter_18pt-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const handleSplashReady = useCallback(() => {
    // Hide the native splash only after the branded React screen has loaded.
    SplashScreen.hideAsync().catch(console.warn);
    setLogoReady(true);
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !logoReady) return;
    const timer = setTimeout(
      () => setSplashComplete(true),
      MIN_SPLASH_DURATION,
    );
    return () => clearTimeout(timer);
  }, [fontsLoaded, logoReady]);

  useEffect(() => {
    if (splashComplete && needsForceUpdate()) {
      router.replace("/force-update");
    }
  }, [splashComplete, needsForceUpdate, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {fontsLoaded && (
          <View
            style={{ flex: 1 }}
            accessibilityElementsHidden={!splashComplete}
            importantForAccessibility={
              splashComplete ? "auto" : "no-hide-descendants"
            }
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: theme.colors.background.primary,
                },
                headerStyle: {
                  backgroundColor: theme.colors.background.primary,
                },
                headerTintColor: theme.colors.text.primary,
                headerShadowVisible: false,
                headerTitleAlign: "center",
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen
                name="category/[categoryId]/index"
                options={{ headerShown: true, title: "Категория" }}
              />
              <Stack.Screen
                name="category/[categoryId]/[subcategoryId]"
                options={{ headerShown: true, title: "Предложения" }}
              />
              <Stack.Screen
                name="listing/[listingId]"
                options={{ headerShown: true, title: "Предложение" }}
              />
              <Stack.Screen
                name="search"
                options={{ headerShown: true, title: "Поиск" }}
              />
            </Stack>
          </View>
        )}
        {!splashComplete && <AllinSplashScreen onReady={handleSplashReady} />}
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
