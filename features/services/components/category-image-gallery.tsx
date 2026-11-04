import {
  categoryIllustrations,
  type CategoryIllustration,
} from "@/features/services/utils/category-illustrations";
import { useAppTheme } from "@/shared/theme";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Показывает иллюстрацию и название категории; ошибка файла остаётся в области картинки. */
function IllustrationTile({ item }: { item: CategoryIllustration }) {
  const theme = useAppTheme();
  const [failed, setFailed] = useState(false);

  return (
    <View style={{ flex: 1, gap: theme.spacing.xs }}>
      {/* Постоянная область изображения исключает сдвиги при загрузке и ошибке PNG. */}
      <View
        style={{
          height: 160,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.radius.lg,
          borderCurve: "continuous",
          padding: theme.spacing.xs,
        }}
      >
        {failed ? (
          <Text
            style={{
              color: theme.colors.text.secondary,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.md,
              lineHeight: theme.typography.lineHeight.md,
              textAlign: "center",
            }}
          >
            Не удалось показать изображение
          </Text>
        ) : (
          <Image
            source={item.image}
            contentFit="contain"
            accessibilityLabel={`Иллюстрация: ${item.name}`}
            onError={() => setFailed(true)}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </View>

      {/* Подпись переносится целиком и растёт вместе с системным размером шрифта. */}
      <Text
        selectable
        style={{
          color: theme.colors.text.primary,
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: theme.typography.fontSize.md,
          lineHeight: theme.typography.lineHeight.md,
        }}
      >
        {item.name}
      </Text>
    </View>
  );
}

/** Галерея действующих категорий; onClose возвращает пользователя к списку заказов. */
export function CategoryImageGallery({ onClose }: { onClose: () => void }) {
  const theme = useAppTheme();
  const { width, fontScale } = useWindowDimensions();
  const columns = fontScale > 1.4 || width < 340 ? 1 : width >= 720 ? 4 : 2;

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background.primary }}
    >
      {/* Галерея прокручивается целиком; виртуализация ограничивает число декодированных PNG. */}
      <FlatList
        key={columns}
        data={categoryIllustrations}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        initialNumToRender={8}
        windowSize={5}
        columnWrapperStyle={columns > 1 ? { gap: theme.spacing.sm } : undefined}
        contentContainerStyle={{
          padding: theme.spacing.md,
          gap: theme.spacing.lg,
        }}
        ListHeaderComponent={
          <View style={{ gap: theme.spacing.xs }}>
            {/* Возврат доступен независимо от загрузки изображений. */}
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => ({
                alignSelf: "flex-start",
                minHeight: 44,
                minWidth: 44,
                justifyContent: "center",
                opacity: pressed ? theme.opacity.pressed : 1,
              })}
            >
              <Text
                style={{
                  color: theme.colors.text.link,
                  fontFamily: theme.typography.fontFamily.medium,
                  fontSize: theme.typography.fontSize.lg,
                  lineHeight: theme.typography.lineHeight.lg,
                }}
              >
                К заказам
              </Text>
            </Pressable>

            {/* Заголовок относится к подборке; navigation header на этой вкладке скрыт. */}
            <Text
              accessibilityRole="header"
              style={{
                color: theme.colors.text.primary,
                fontFamily: theme.typography.fontFamily.bold,
                fontSize: theme.typography.fontSize.h3,
                lineHeight: theme.typography.lineHeight.h3,
              }}
            >
              Изображения категорий
            </Text>
            <Text
              style={{
                color: theme.colors.text.secondary,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.md,
                lineHeight: theme.typography.lineHeight.md,
              }}
            >
              {`${categoryIllustrations.length} категорий · Иллюстрации thiings.co`}
            </Text>
          </View>
        }
        renderItem={({ item }) => <IllustrationTile item={item} />}
      />
    </SafeAreaView>
  );
}
