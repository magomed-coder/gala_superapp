import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { useProfileStore } from "@/features/profile/store/use-profile-store";
import { SettingsSection } from "@/shared/components/settings-section";
import { Button } from "@/shared/components/themed-button";
import { useAppTheme } from "@/shared/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const labels = { home: "Дом", work: "Работа", other: "Другой адрес" } as const;
const icons = {
  home: "home-outline",
  work: "briefcase-outline",
  other: "location-outline",
} as const;

/** Список адресов: выбор основного и удаление не изменяют размеры соседних элементов. */
export default function AddressesScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const addresses = useProfileStore((state) => state.addresses);
  const removeAddress = useProfileStore((state) => state.removeAddress);
  const setDefaultAddress = useProfileStore((state) => state.setDefaultAddress);

  return (
    <SafeAreaView edges={["left", "right"]} style={{ flex: 1 }}>
      {/* Виртуализированный список растёт без вложенного ScrollView. */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: theme.spacing.md,
          paddingBottom: theme.spacing.xxxl,
          gap: theme.spacing.md,
        }}
        ListHeaderComponent={
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.md,
              lineHeight: theme.typography.lineHeight.md,
            }}
          >
            Выберите основной адрес для доставки и выездных услуг.
          </Text>
        }
        ListEmptyComponent={
          <ProfileEmptyState
            icon="location-outline"
            title="Добавьте первый адрес"
            description="Дом, работа или другое удобное место — сохраните адрес, чтобы не вводить его заново."
          />
        }
        renderItem={({ item }) => (
          <SettingsSection>
            {/* Область отметки всегда присутствует; длинный адрес переносится целиком. */}
            <Pressable
              accessibilityRole="radio"
              aria-checked={item.isDefault}
              accessibilityState={{ checked: item.isDefault }}
              accessibilityLabel={
                labels[item.type] + ", " + item.city + ", " + item.street
              }
              onPress={() => setDefaultAddress(item.id)}
              style={({ pressed }) => ({
                flexDirection: "row",
                gap: theme.spacing.sm,
                alignItems: "center",
                paddingVertical: theme.spacing.md,
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Ionicons
                name={icons[item.type]}
                size={theme.components.icon.md}
                color={theme.colors.text.tertiary}
              />
              <View style={{ flex: 1, gap: theme.spacing.xxs }}>
                <Text
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.medium,
                    fontSize: theme.typography.fontSize.lg,
                    lineHeight: theme.typography.lineHeight.lg,
                  }}
                >
                  {labels[item.type]}
                </Text>
                <Text
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.md,
                    lineHeight: theme.typography.lineHeight.md,
                  }}
                >
                  {item.city}, {item.street}
                </Text>
              </View>
              <Ionicons
                name={item.isDefault ? "checkmark-circle" : "ellipse-outline"}
                size={theme.components.icon.md}
                color={
                  item.isDefault
                    ? theme.colors.brand.primary
                    : theme.colors.border.strong
                }
              />
            </Pressable>
            {/* Подпись основного адреса сохраняет место и при снятии выбора. */}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: theme.colors.border.subtle,
                flexDirection: "row",
                alignItems: "center",
                gap: theme.spacing.xs,
              }}
            >
              <View style={{ flex: 1, paddingVertical: theme.spacing.xs }}>
                <Text
                  style={{
                    opacity: item.isDefault ? 1 : 0,
                    color: theme.colors.text.secondary,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.md,
                    lineHeight: theme.typography.lineHeight.md,
                  }}
                  accessible={item.isDefault}
                  accessibilityElementsHidden={!item.isDefault}
                  importantForAccessibility={
                    item.isDefault ? "auto" : "no-hide-descendants"
                  }
                >
                  Основной адрес
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  "Удалить адрес: " + item.city + ", " + item.street
                }
                onPress={() => {
                  removeAddress(item.id);
                }}
                style={({ pressed }) => ({
                  minWidth: 44,
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? theme.opacity.pressed : 1,
                })}
              >
                <Ionicons
                  name="trash-outline"
                  size={theme.components.icon.sm}
                  color={theme.colors.status.error}
                />
              </Pressable>
            </View>
          </SettingsSection>
        )}
        ListFooterComponent={
          <View style={{ gap: theme.spacing.md }}>
            <Button
              label="Добавить адрес"
              onPress={() => router.push("/(tabs)/profile/add-address")}
              style={{ minHeight: theme.components.button.height }}
            />
            <Text
              style={{
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              Адреса доступны в текущем сеансе приложения.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
