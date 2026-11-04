// src/components/ui/BackButton.tsx
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  style?: ViewStyle | ViewStyle[];
  iconColor?: string;
  backgroundColor?: string;
  to?: Href; // куда перейти по желанию
  onFallbackRoute?: Href; // если нет истории назад
};

export const BackButton: React.FC<Props> = ({
  style,
  iconColor = "#111",
  backgroundColor = "rgba(255,255,255,0.95)",
  to, // если передан — идём туда
  onFallbackRoute = "/(tabs)", // корневые табы
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handlePress = useCallback(() => {
    if (to) {
      // если передан адрес, идём туда
      router.replace(to);
    } else if (router.canGoBack()) {
      // иначе если есть куда вернуться — идём назад
      router.back();
    } else {
      // если истории нет — идём на fallback
      router.replace(onFallbackRoute as Href);
    }
  }, [router, to, onFallbackRoute]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Назад"
      hitSlop={12}
      style={[
        styles.container,
        {
          top: insets.top + 8,
          backgroundColor,
        },
        style,
      ]}
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={iconColor}
        style={{ marginLeft: -2 }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,

    // универсальная тень для iOS и Android
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
