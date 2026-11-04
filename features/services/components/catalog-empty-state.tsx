import { useAppTheme } from "@/shared/theme";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

/** Предлагает понятный выход при устаревшей или ошибочной ссылке. */
export function CatalogEmptyState({ title }: { title: string }) {
  const theme = useAppTheme();
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background.primary,
      }}
    >
      <Text
        style={{
          color: theme.colors.text.primary,
          fontSize: theme.typography.fontSize.title,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.replace("/(tabs)/services")}
        style={({ pressed }) => ({
          minHeight: 48,
          padding: theme.spacing.md,
          opacity: pressed ? theme.opacity.pressed : 1,
        })}
      >
        <Text
          style={{
            color: theme.colors.text.link,
            fontSize: theme.typography.fontSize.lg,
          }}
        >
          Открыть все категории
        </Text>
      </Pressable>
    </View>
  );
}
