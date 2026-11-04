import { CatalogCategories } from "@/features/services/components/catalog-categories";
import { CatalogSearchLink } from "@/features/services/components/catalog-search-link";
import { AppFooter } from "@/shared/components/app-footer";
import { useAppTheme } from "@/shared/theme";
import { View } from "react-native";
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
      {/* Один виртуализированный список: поиск закреплён, разделы содержат до пяти плиток. */}
      <CatalogCategories
        header={
          <View
            style={{
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.background.primary,
            }}
          >
            <CatalogSearchLink />
          </View>
        }
        footer={<AppFooter style={{ minHeight: 64 }} />}
      />
    </SafeAreaView>
  );
}
