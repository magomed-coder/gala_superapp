import { CatalogCategories } from "@/features/services/components/catalog-categories";
import { CatalogSearchLink } from "@/features/services/components/catalog-search-link";
import { AppFooter } from "@/shared/components/app-footer";
import { useAppTheme } from "@/shared/theme";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/** Главная показывает весь каталог; поиск остаётся доступен при прокрутке разделов. */
export default function HomeScreen() {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
      }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
      >
        {/* Поиск закреплён над каталогом и не требует возвращаться к началу списка. */}
        <View
          style={{
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.background.primary,
          }}
        >
          <CatalogSearchLink />
        </View>
        {/* Все разделы и подкатегории доступны прямо из основной вкладки. */}
        <View style={{ paddingHorizontal: theme.spacing.sm }}>
          <CatalogCategories />
        </View>
        {/* Общий с профилем знак бренда завершает каталог и прокручивается вместе с ним. */}
        <AppFooter style={{ minHeight: 64 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
