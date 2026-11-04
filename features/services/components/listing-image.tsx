import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image, type ImageProps } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

/** Изображение заполняет заранее выделенную область; ошибка не меняет размеры карточки. */
export function ListingImage({
  source,
  label,
}: {
  source: ImageProps["source"];
  label: string;
}) {
  const theme = useAppTheme();
  const [failed, setFailed] = useState(false);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}
    >
      {/* Фон сохраняется до загрузки локального изображения. */}
      {!failed && (
        <Image
          source={source}
          accessibilityLabel={label}
          contentFit="contain"
          onError={() => setFailed(true)}
          style={StyleSheet.absoluteFill}
        />
      )}
      {failed && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing.sm,
            gap: theme.spacing.xs,
          }}
        >
          <Ionicons
            name="image-outline"
            size={theme.components.icon.xl}
            color={theme.colors.text.tertiary}
          />
          <Text
            style={{
              color: theme.colors.text.secondary,
              textAlign: "center",
              fontSize: theme.typography.fontSize.md,
            }}
          >
            Нет изображения
          </Text>
        </View>
      )}
    </View>
  );
}
