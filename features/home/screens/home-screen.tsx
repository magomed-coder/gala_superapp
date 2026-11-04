import { useScrollChromeController } from "@/shared/lib/navigation/use-scroll-chrome-controller";
import { CatalogCategories } from "@/features/services/components/catalog-categories";
import { CatalogSearchLink } from "@/features/services/components/catalog-search-link";
import { AppFooter } from "@/shared/components/app-footer";
import { useAppTheme } from "@/shared/theme";
import { useBottomTabBarHeight } from "expo-router/tabs";
import { useState } from "react";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/** Главная освобождает место для каталога при скролле вниз и возвращает панели при скролле вверх. */
export default function HomeScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [headerHeight, setHeaderHeight] = useState(
    theme.components.search.height + theme.spacing.sm * 2,
  );
  const { onScroll, headerStyle } = useScrollChromeController(headerHeight);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: theme.colors.background.primary,
      }}
    >
      {/* Отступы постоянны при скролле: скрытие панелей не сдвигает строки списка. */}
      {/* Отступ над логотипом задаёт последняя категория: spacing.lg, как в профиле. */}
      <CatalogCategories
        header={<View style={{ height: headerHeight }} />}
        footer={<AppFooter style={{ paddingBottom: theme.spacing.xs }} />}
        stickyHeader={false}
        onScroll={onScroll}
        // Под логотипом, как в заказах: spacing.xs + spacing.lg и место под навбар.
        contentContainerStyle={{
          paddingBottom: tabBarHeight + theme.spacing.lg,
        }}
      />
      {/* Область обрезает уходящий поиск ниже safe area; высота учитывает системный размер текста. */}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          overflow: "hidden",
        }}
      >
        <Animated.View
          testID="home-search-panel"
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
          style={[
            {
              padding: theme.spacing.sm,
              backgroundColor: theme.colors.background.primary,
            },
            headerStyle,
          ]}
        >
          <CatalogSearchLink />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
